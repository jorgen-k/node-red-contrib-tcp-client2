'use strict';

module.exports = function (RED) {
    const net = require('net');
    const LogHelper  = require('./loghelper');

    class TcpServerNode {
        constructor(config) {
            RED.nodes.createNode(this, config);0
            this.logger = new LogHelper(this, config.debug);
            // Configuration
            this.port = parseInt(config.port, 10) || 12345; // Default port if not specified
            this.clients = new Map(); // To keep track of connected clients

            // Create TCP server
            this.server = net.createServer(socket => {
                const clientId = `${socket.remoteAddress}:${socket.remotePort}`;
                this.log(`Client connected: ${clientId}`);

                // Store socket in clients Map
                this.clients.set(clientId, socket);

                // Handle incoming data from client
                socket.on('data', data => {
                    // Emit data to Node-RED flow
                    this.send({ payload: data.toString(), topic: clientId });
                });

                // Handle client disconnect
                socket.on('close', () => {
                    this.log(`Client disconnected: ${clientId}`);
                    this.clients.delete(clientId); // Remove client from tracking
                });

                // Handle socket errors
                socket.on('error', err => {
                    this.error(`Error from client ${clientId}: ${err.message}`);
                });
            });

            // Start listening on configured port
            this.server.listen(this.port, () => {
                this.log(`TCP Server listening on port ${this.port}`);
            });

            // Handle errors on the server
            this.server.on('error', err => {
                this.error(`Server error: ${err.message}`);
            });

            // Cleanup on node close (delete or redeploy)
            this.on('close', () => {
                this.server.close(); // Stop accepting new connections
                this.clients.forEach(socket => {
                    socket.end(); // Close existing connections
                });
            });
        }

        // Simplified log method for demonstration
        log(message) {
            this.warn(message); // Using 'warn' for visibility in Node-RED's debug sidebar
        }
    }

    RED.nodes.registerType("tcp-server", TcpServerNode);
};
