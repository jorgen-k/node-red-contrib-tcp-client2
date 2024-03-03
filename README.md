# node-red-contrib-tcp-client2
# Node Red Dynamic TCP communication

![GitHub package.json version](https://img.shields.io/github/package-json/v/jorgen-k/node-red-contrib-tcp-client2?label=package)
![npm](https://img.shields.io/npm/v/node-red-contrib-tcp-client2)
![npm](https://img.shields.io/npm/dm/node-red-contrib-tcp-client2)

This package provides a TCP client and a TCP server node for Node-RED, enabling connections to and from designated hosts. It serves as a replacement for the deprecated node-red-contrib-tcp-client by Tiago Costa.

## Description
The TCP client and TCP server nodes allows seamless integration of TCP connections within Node-RED flows. It provides flexibility in establishing dynamic connections and transmitting data over TCP protocols. In contrast to the built in tcp nodes, these nodes can be configured via the msg object, flow or global context data, or even via enviroment variables. 

## Features
- Establish dynamic TCP connections with designated hosts.
- Dynamically manage connections using provided arguments. 
- Receive data from hosts and ports with ease.


## Usage Guide for TCP Client

This guide provides instructions on how to use the TCP Client within Node-RED to establish TCP connections, send data, and manage data streams effectively.

### Configuration

To configure the TCP Client node in your Node-RED flow:

1. **Drag the TCP Client node** onto your flow canvas from the palette.
2. **Double-click** the node to open its configuration settings.
3. **Set the Connection Parameters**:
    - **Action**: connect, close or write.
    - **Host**: The hostname or IP address of the TCP server.
    - **Port**: The port number on which the TCP server is listening.
Note that these parameters can be set as string values, or from the msg object, flow or global contexts and even environment. Hence "Dynamic"
4. **Data Handling Options**:
    - **Output**: Stream or single message of the data you're sending/receiving (String, Buffer (binary) or Base64 (encoded binary)).
    - **Delimiter**: (For String and Base64 data types) Specify the delimiter for splitting incoming data streams. Commonly, `\r\n`.
5. **Retry Logic**: 
    - **Max Retries**: The maximum number of reconnection attempts after a connection loss.
    - **Retry Delay**: Time in milliseconds before attempting a reconnection.
    - **Indefinite Retries**: Enable this option for the node to continuously attempt to reconnect until successful.
6. **Advanced Settings**:
    - **Socket Timeout**: Time in milliseconds after which an idle connection will be closed.
    - **Stream Mode**: Enable this to process data as a continuous stream; otherwise, data will be treated as single, discrete messages.

### Sending Data

To send data through the TCP Client node:

1. **Prepare the Payload**: Ensure your message payload matches the expected data type. Node objects will be translated to string for conveinience.
2. **Inject Data**: Use an inject node or any other node that can trigger sending data, and connect it to the TCP Client node. Be sure to sest the correct *action*.
3. **Format Data** (if necessary): Use a function node before the TCP Client node to format the data according to your protocol (e.g., appending `\r\n` for text data).

### Receiving Data

The TCP Client node will emit messages as it receives data:

- **For Stream Mode**: Data will be split according to the specified delimiter and each piece will be emitted as a separate message.
- **For Single Message Mode**: Each data event triggers a message emission without splitting.

### Handling Connections and Retries

The TCP Client node automatically manages connections and retries based on the configured parameters. Monitor the node status indicators for connection status:

- **Green Dot**: Connection established.
- **Yellow Dot**: Attempting to connect or reconnect.
- **Red Dot**: Disconnected or connection failed.

### Error Handling

Errors, such as connection failures or data send/receive issues, are logged in the Node-RED debug sidebar. Implement error handling flows by connecting a Catch node to the TCP Client node to manage exceptions gracefully.

### Closing Connections

To programmatically close a connection, send a message with a payload containing the action `close` to the TCP Client node.

### Summary

The TCP Client node offers a flexible and powerful way to integrate TCP networking into your Node-RED flows. By properly configuring and managing the node, you can achieve reliable data communication with TCP servers.


## Usage - TCP Server


## Examples
For additional examples and usage scenarios, refer to the [EXAMPLES.md](https://github.com/jorgen-k/node-red-contrib-tcp-client2/blob/master/EXAMPLES.md) file.

## Installation:
You can install this package either by using `npm install node-red-contrib-tcp-client --save` in ~./node-red or through the Palette Manager in Node-RED.

Upon successful installation, you should find the new TCP client node under the network category.

[Node-RED Contrib TCP Client Package](https://flows.nodered.org/node/node-red-contrib-tcp-client2)

## Dependencies:
- Node.js
- Node-RED

## Contributing
Contributions to this project are welcome! Please refer to the [CONTRIBUTING.md](https://raw.githubusercontent.com/jorgen-k/node-red-contrib-tcp-client2/master/CONTRIBUTING.md) file for guidelines.

## License
This project is licensed under the [MIT License](https://raw.githubusercontent.com/jorgen-k/node-red-contrib-tcp-client2/master/LICENSE).

## Credits
- Author: Jörgen Karlsson inspired by Tiago Costa
- Maintainer: jorgen-k
- Contributors: jorgen-k

## Changelog
Refer to the [CHANGELOG.md](https://github.com/jorgen-k/node-red-contrib-tcp-client2/blob/master/CHANGELOG.md) file for details on changes, updates, and bug fixes.

## Support
For any issues or questions related to using the TCP client node, please visit the project's [GitHub Issues](https://github.com/jorgen-k/node-red-contrib-tcp-client2/issues) page.

## Testing
Testing procedures and frameworks used for this project are documented in the [TESTING.md](https://github.com/jorgen-k/node-red-contrib-tcp-client2/blob/master/TESTING.md) file.

## Security
For best practices on securing Node-RED flows and using the TCP client node securely, please refer to the [SECURITY.md](https://github.com/jorgen-k/node-red-contrib-tcp-client2/blob/master/SECURITY.md) file.

## Feedback
We welcome your feedback, suggestions, and bug reports! Please feel free to open an issue on the project's [GitHub Issues](https://github.com/jorgen-k/node-red-contrib-tcp-client2/issues) page.
