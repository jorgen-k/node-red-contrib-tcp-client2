# node-red-contrib-tcp-client

![GitHub package.json version](https://img.shields.io/github/package-json/v/jorgen-k/node-red-contrib-tcp-client2?label=package)
![npm](https://img.shields.io/npm/v/node-red-contrib-tcp-client2)
![npm](https://img.shields.io/npm/dm/node-red-contrib-tcp-client2)

This node is a **TCP client** that listens for connections on specific port or connects to a specified host.

Unlike the default node-red tcp-in node, this one allows you to create dynamic TCP connections passed as arguments.

Allows stopping the connection by passing a "close" argument:

![node configuration](https://raw.githubusercontent.com/tiagordc/node-red-contrib-tcp-client/master/flow.png)

This project was developed specifically for XML over TCP with some parsing options but other formats should still be supported.

To report an issue use the project [GitHub](https://github.com/jorgen-k/node-red-contrib-tcp-client2/issues) page

## Configuration:

![node configuration](https://raw.githubusercontent.com/jorgen-k/node-red-contrib-tcp-client/master/edit.png)

## To install: 

Install [node-red](https://nodered.org/).

Install [this package](https://www.npmjs.com/package/node-red-contrib-tcp-client2) with "npm install node-red-contrib-tcp-client --save" in ~./node-red or via the Palette Manager in node-red.

If everything was successfull you should see the new tcp client node under the network category.

https://flows.nodered.org/node/node-red-contrib-tcp-client2
