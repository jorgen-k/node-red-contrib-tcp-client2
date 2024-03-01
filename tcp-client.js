'use strict';

module.exports = function (RED) {
    const net = require('net');

    class TcpClient {
        constructor(config) {
            RED.nodes.createNode(this, config);
            var node = this;
            node.datatype = config.datatype || 'utf8'; // Example: 'utf8', 'buffer'
            node.socketTimeout = RED.settings.socketTimeout || 120000;
            node.retries = 0;
            node.MAX_RETRIES = 5;
            node.RETRY_DELAY = 3000;
            node.connection = null;

            node.on('input', (msg, send, done) => {
                let action = RED.util.evaluateNodeProperty(config.action, config.actionType, this, msg);
                node.warn("action:" +config.action);

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
                        this.warn(`Unrecognized action: ${action}`);
                        done();
                }
            });

            this.on('close', (done) => {
                this.connection = null;
            });
        }

        connect(host, port, msg, done) {
            if (this.connection !== null) {
                this.warn(`Connection already exists`);
                done(); // todo close!?
                return;
            }
            this.connection = { buffer: '', retries: 0, host: host, port: port }
            this.doConnect(this.connection, msg, done);
        } 

        doConnect(connection, msg, done) {
            this.status({ fill: "yellow", shape: "dot", text: `Connecting to ${this.connection.host}:${this.connection.port}` });
            connection.socket = net.createConnection(connection.port, connection.host , () => {
                this.log(`Connected to ${connection.host}:${connection.port}`);
                this.status({ fill: "green", shape: "dot", text: `Connected to ${connection.host}:${connection.port}` });
                done();
            });

            connection.socket.on('data', (data) => {
                let msg = { payload: data };
                if (this.datatype === 'utf8') {
                    msg.payload = data.toString('utf8');
                    this.log("Received utf-8 data: " + msg.payload);
                } else {
                    this.log("Received data: " + msg.payload);
                }
                this.send(msg);
            });

            connection.socket.on('close', () => {
                this.log(`Connection closed`);
                this.connection = null;
            });

            connection.socket.on('error', (err) => {
                this.error(`Error on connection to ${this.connection.host}:${this.connection.port}: ${err.message}`);
                this.connection = null;
                this.retryConnection(this.connection, done);
            });
        }

        write(data, done) {
            if (!this.connection || !this.connection.socket) {
                this.warn(`No connection available. Attempting to send data failed.`);
            } else {
                this.log("writeing " + data);
                this.connection.socket.write(data, this.datatype, done);
            }
            done();
        }

        close(done) {
            if (this.connection && this.connection.socket) {
                this.connection.socket.end(() => {
                    this.log(`Connection closed.`);
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
                        this.log(`Retry ${connection.retries}/${this.MAX_RETRIES} for ${connection.host}:${connection.port}`);
                        this.doConnect({}, done);
                    }, this.RETRY_DELAY);
                } else {
                    this.error(`Maximum retries reached for ${connection.host}:${connection.port}. Giving up.`);
                    this.status({ fill: "red", shape: "ring", text: `Maximum retries reached for ${connection.host}:${connection.port}.` });
                    this.retries = 0; // Reset retries for future attempts
                    done();
                }
            }
        }
        log(data) {
            // todo check log level
            this.warn(data);
        }
    }
    RED.nodes.registerType("tcp-client", TcpClient);
};
