'use strict';

module.exports = function (RED) {
    const net = require('net');

    class TcpClient {
        constructor(config) {
            RED.nodes.createNode(this, config);
            var node = this;

            node.host = config.host || 'localhost';
            node.port = config.port || 80;
            node.datatype = config.datatype || 'utf8'; // Example: 'utf8', 'buffer'
            node.socketTimeout = RED.settings.socketTimeout || 120000;
            node.retries = 0;
            node.MAX_RETRIES = 5;
            node.RETRY_DELAY = 3000;
            node.connection = null;

            node.on('input', (msg, send, done) => {
                let action = RED.util.evaluateNodeProperty(config.action, config.actionType, this, msg) || this.action;
                let host = RED.util.evaluateNodeProperty(config.host, config.hostType, this, msg) || this.host;
                let port = RED.util.evaluateNodeProperty(config.port, config.portType, this, msg) * 1 || this.port;

                switch (action) {
                    case 'connect':
                    case 'listen': // legacy
                        this.connect(host, port, msg, done);
                        break;
                    case 'write':
                        this.write(msg.payload, done);
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
                // nothing to do
            });
        }
        connect(host, port, msg, done) {
            if (this.connection !== null) {
                this.warn(`Connection already exists`);
                done(); // todo CLOSE!
                return;
            }
            this.status({ fill: "yellow", shape: "dot", text: `Connecting to ${host}:${port}` });
            let socket = net.createConnection({ host, port }, () => {
                this.log(`Connected to ${host}:${port}`);
                this.connection = { socket, buffer: '', retries: 0 };
                this.status({ fill: "green", shape: "dot", text: `Connected to ${host}:${port}` });
                done();
            });

            socket.on('data', (data) => {
                let msg = { payload: data };
                if (this.datatype === 'utf8') {
                    msg.payload = data.toString('utf8');
                }
                this.send(msg);
            });

            socket.on('close', () => {
                this.log(`Connection to ${host}:${port} closed`);
                this.connection = null;
                //this.status({ fill: "red", shape: "ring", text: "disconnected" });
            });

            socket.on('error', (err) => {
                this.error(`Error on connection to ${host}:${port}: ${err.message}`);
                this.connection = null;
                this.retryConnection(host, port, done);
            });
        }
        write(data, done) {
            if (!this.connection || !this.connection.socket) {
                this.warn(`No connection available. Attempting to send data failed.`);
            } else {
                this.connection.socket.write(data, this.datatype, done);
            }
            done();
        }
        close(done) {
            if (this.connection && this.connection.socket) {
                this.connection.socket.end(() => {
                    this.log(`Connection closed.`);
                    this.status({ fill: "blue", shape: "ring", text: "closed" });
                });
            }
            done();
        }
        retryConnection(host, port, done) {
            if (this.retries < this.MAX_RETRIES) {
                setTimeout(() => {
                    this.retries++;
                    this.log(`Retry ${this.retries}/${this.MAX_RETRIES} for ${host}:${port}`);
                    this.connect(host, port, {}, done);
                }, this.RETRY_DELAY);
            } else {
                this.error(`Maximum retries reached for ${host}:${port}. Giving up.`);
                this.status({ fill: "red", shape: "ring", text: `Maximum retries reached for ${host}:${port}.` });
                this.retries = 0; // Reset retries for future attempts
                done();
            }
        }
        log(data) {
            // todo check log level
            this.warn(data);
        }
    }
    RED.nodes.registerType("tcp-client", TcpClient);
};
