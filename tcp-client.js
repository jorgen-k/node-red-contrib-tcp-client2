'use strict';


module.exports = function (RED) {
    const net = require('net');
    const LogHelper  = require('./loghelper');

    class TcpClient {
        constructor(config) {
            RED.nodes.createNode(this, config);
            this.logger = new LogHelper(this, config.debug);
            this.datatype = config.datatype || 'utf8'; // Example: 'utf8', 'buffer'
            this.socketTimeout = RED.settings.socketTimeout || 120000;
            this.retries = 0;
            this.MAX_RETRIES = 5;
            this.RETRY_DELAY = 3000;
            this.connection = null;
            this.logger.info("Init");

            this.on('input', (msg, send, done) => {
                let action = RED.util.evaluateNodeProperty(config.action, config.actionType, this, msg);
                this.logger.debug("action: " + action);

                switch (action) {
                    case 'connect':
                    case 'listen': // legacy
                        let host = RED.util.evaluateNodeProperty(config.host, config.hostType, this, msg);
                        let port = RED.util.evaluateNodeProperty(config.port, config.portType, this, msg);
                        this.connect(host, port, msg, done);
                        break;
                    case 'write':
                        let data = RED.util.evaluateNodeProperty(config.write, config.writeType, this, msg);
                        this.write(data, done);
                        break;
                    case 'close':
                        this.close(done);
                        break;
                    default:
                        this.logger.warning(`Unrecognized action: ${action}`);
                        done();
                }
            });

            this.on('close', (done) => {
                this.connection = null;
            });
        }

        connect(host, port, msg, done) {
            if (this.connection !== null) {
                this.logger.warning(`Connection already exists`);
                done(); // todo close!?
                return;
            }
            this.connection = { buffer: '', retries: 0, host: host, port: port }
            this.doConnect(this.connection, msg, done);
        } 

        doConnect(connection, msg, done) {
            this.status({ fill: "yellow", shape: "dot", text: `Connecting to ${this.connection.host}:${this.connection.port}` });
            connection.socket = net.createConnection(connection.port, connection.host , () => {
                this.logger.info(`Connected to ${connection.host}:${connection.port}`);
                this.status({ fill: "green", shape: "dot", text: `Connected to ${connection.host}:${connection.port}` });
                done();
            });

            connection.socket.on('data', (data) => {
                let msg = { payload: data };
                if (this.datatype === 'utf8') {
                    msg.payload = data.toString('utf8');
                    this.logger.debug("Received utf-8 data: " + msg.payload);
                } else {
                    this.logger.debug("Received data: " + msg.payload);
                }
                this.send(msg);
            });

            connection.socket.on('close', () => {
                this.logger.info(`Connection closed`);
                this.connection = null;
            });

            connection.socket.on('error', (err) => {
                this.logger.info(`Error on connection to ${this.connection.host}:${this.connection.port}: ${err.message}`);
                this.connection = null;
                this.retryConnection(this.connection, done);
            });
        }

        write(data, done) {
            if (!this.connection || !this.connection.socket) {
                this.logger.warning(`No connection available. Attempting to send data failed.`);
            } else {
                this.logger.debug("Writing " + data);
                this.connection.socket.write(data, this.datatype, done);
            }
            done();
        }

        close(done) {
            if (this.connection && this.connection.socket) {
                this.connection.socket.end(() => {
                    this.logger.info(`Connection closed.`);
                });
            }
            this.connection = null;
            this.status({ fill: "blue", shape: "ring", text: "closed" });
            done();
        }
        retryConnection(connection, done) {
            if (connection) {
                if (this.retries < this.MAX_RETRIES) {
                    setTimeout(() => {
                        connection.retries++;
                        this.logger.debug(`Retry ${connection.retries}/${this.MAX_RETRIES} for ${connection.host}:${connection.port}`);
                        this.doConnect({}, done);
                    }, this.RETRY_DELAY);
                } else {
                    this.logger.error(`Maximum retries reached for ${connection.host}:${connection.port}. Giving up.`);
                    this.status({ fill: "red", shape: "ring", text: `Maximum retries reached for ${connection.host}:${connection.port}.` });
                    this.retries = 0; // Reset retries for future attempts
                    done();
                }
            }
        }

    }
    RED.nodes.registerType("tcp-client", TcpClient);
};
