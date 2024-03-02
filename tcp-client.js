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
            this.maxRetries = parseInt(config.maxRetries, 10) || 5;
            this.retryDelay = parseInt(config.retryDelay, 10) || 3000; // Fixed typo from 'retryDaley' to 'retryDelay'
            
            if (config.indefiniteRetries) {
                this.maxRetries = Number.MAX_SAFE_INTEGER; // Use MAX_SAFE_INTEGER for practical "indefinite" value
            }
            this.logger.debug("Max retries " + this.maxRetries + ", delay " + this.retryDelay + "ms");
            this.connection = null;
            this.done = null;
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
                this.close(done);
            });
        }

        doDone(){
            if (this.done && typeof this.done === 'function') {
                this.done(); // Call 'done' to complete the node operation
                this.done = null;
            }
        }

        connect(host, port, msg, done) {
            this.done = done;
            if (this.connection !== null) {
                this.logger.warning(`Connection already exists`);
                this.doDone(); // todo close!?
                return;
            }
            this.connection = { buffer: '', host: host, port: port }
            this._doConnect(this.connection, msg);
        } 

        _doConnect(connection, msg) {
            this.status({ fill: "yellow", shape: "dot", text: `Connecting to ${connection.host}:${connection.port}` });
            connection.socket = net.createConnection(connection.port, connection.host , () => {
                this.logger.info(`Connected to ${connection.host}:${connection.port}`);
                this.status({ fill: "green", shape: "dot", text: `Connected to ${connection.host}:${connection.port}` });
                this.doDone();
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
                this.logger.info(`Socket closed`);
                if (this.connection) {
                    this.logger.debug(`Retrying connection to ${this.connection.host}:${this.connection.port}`);
                    this._retryConnection(this.connection);
                } else {
                    this.logger.error("Connection lost");
                }
        });

            connection.socket.on('error', (err) => {
                if (this.connection) {
                    this.logger.info(`Error connecting to ${this.connection.host}:${this.connection.port}: ${err.message}`);
                    this.logger.debug(`Retrying connection to ${this.connection.host}:${this.connection.port}`);
                    this._retryConnection(this.connection);
                } else {
                    this.logger.info("Socket error: " + err.message);
                    // connection gone, probably due to close so we bail out
                    this.status({ fill: "blue", shape: "ring", text: "closed" });
                }
            });
        }

        write(data, done) {
            this.done = done;
            if (!this.connection || !this.connection.socket) {
                this.logger.warning(`No connection available. Attempting to send data failed.`);
            } else {
                this.logger.debug("Writing " + data);
                this.connection.socket.write(data, this.datatype, done);
            }
            this.doDone();
        }

        close(done) {
            this.done = done;
            if (this.connection && this.connection.socket) {
                this.connection.socket.end(() => {
                    this.logger.info(`Connection closed.`);
                });
            }
            this.connection = null;
            this.retries = 0; 
            this.status({ fill: "blue", shape: "ring", text: "closed" });
            this.doDone();
        }

        _retryConnection(connection) {
            if (connection) {
                if (this.retries < this.maxRetries) {
                    setTimeout(() => {
                        this.retries++;
                        this.logger.debug(`Retry ${this.retries}/${this.maxRetries} for ${connection.host}:${connection.port}`);
                        this._doConnect(connection);
                    }, this.retryDelay);
                } else {
                    this.logger.error(`Maximum retries reached for ${connection.host}:${connection.port}. Giving up.`);
                    this.status({ fill: "red", shape: "ring", text: `Maximum retries reached for ${connection.host}:${connection.port}.` });
                    this.close(this.done);
                }
            }
        }

    }
    RED.nodes.registerType("tcp-client", TcpClient);
};
