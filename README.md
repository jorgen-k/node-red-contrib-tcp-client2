# node-red-contrib-tcp-client

![GitHub package.json version](https://img.shields.io/github/package-json/v/jorgen-k/node-red-contrib-tcp-client2?label=package)
![npm](https://img.shields.io/npm/v/node-red-contrib-tcp-client2)
![npm](https://img.shields.io/npm/dm/node-red-contrib-tcp-client2)

This package provides a TCP client node for Node-RED, enabling connections to designated hosts. It serves as a replacement for the deprecated node-red-contrib-tcp-client by Tiago Costa.

## Description
The TCP client node allows seamless integration of TCP connections within Node-RED flows. It provides flexibility in establishing dynamic connections and transmitting data over TCP protocols.

## Features
- Establish TCP connections with designated hosts.
- Dynamically manage connections using provided arguments.
- Transmit data over TCP ports with ease.

## Usage
Example usage scenarios:
1. Monitoring data from remote sensors over TCP/IP.
2. Integrating with external systems via TCP communication.
3. Building custom TCP-based protocols within Node-RED flows.

## Configuration:
![Node Configuration](https://raw.githubusercontent.com/jorgen-k/node-red-contrib-tcp-client2/master/edit.png)

## Example:
![Example](https://raw.githubusercontent.com/jorgen-k/node-red-contrib-tcp-client2/master/flow.png)

```
[
    {
        "id": "b1713ea4ac56132b",
        "type": "inject",
        "z": "897b44d6900f95e7",
        "name": "listen",
        "props": [
            {
                "p": "payload"
            }
        ],
        "repeat": "",
        "crontab": "",
        "once": false,
        "onceDelay": 0.1,
        "topic": "",
        "payload": "listen",
        "payloadType": "str",
        "x": 150,
        "y": 80,
        "wires": [
            [
                "9705250fb9d11910"
            ]
        ]
    },
    {
        "id": "694564a033bcee5a",
        "type": "inject",
        "z": "897b44d6900f95e7",
        "name": "close",
        "props": [
            {
                "p": "payload"
            }
        ],
        "repeat": "",
        "crontab": "",
        "once": false,
        "onceDelay": 0.1,
        "topic": "",
        "payload": "close",
        "payloadType": "str",
        "x": 150,
        "y": 120,
        "wires": [
            [
                "9705250fb9d11910"
            ]
        ]
    },
    {
        "id": "9705250fb9d11910",
        "type": "tcp-client",
        "z": "897b44d6900f95e7",
        "action": "payload",
        "actionType": "msg",
        "host": "192.168.100.252",
        "hostType": "str",
        "port": "1457",
        "portType": "str",
        "datamode": "stream",
        "datatype": "utf8",
        "newline": "\\r\\n",
        "write": "",
        "writeType": "str",
        "topic": "",
        "name": "",
        "debug": "none",
        "x": 320,
        "y": 100,
        "wires": [
            [
                "fed86f572c937081",
                "81f70c331808dbf7"
            ]
        ]
    },
    {
        "id": "257ab3e23e9e7440",
        "type": "inject",
        "z": "897b44d6900f95e7",
        "name": "write",
        "props": [
            {
                "p": "payload"
            }
        ],
        "repeat": "",
        "crontab": "",
        "once": false,
        "onceDelay": 0.1,
        "topic": "",
        "payload": "write",
        "payloadType": "str",
        "x": 150,
        "y": 160,
        "wires": [
            [
                "9705250fb9d11910"
            ]
        ]
    }
]
```

## Installation:
You can install this package either by using `npm install node-red-contrib-tcp-client --save` in ~./node-red or through the Palette Manager in Node-RED.

Upon successful installation, you should find the new TCP client node under the network category.

[Node-RED Contrib TCP Client Package](https://flows.nodered.org/node/node-red-contrib-tcp-client2)

## Dependencies:
- Node.js
- Node-RED

## Contributing
Contributions to this project are welcome! Please refer to the [CONTRIBUTING.md](CONTRIBUTING.md) file for guidelines.

## License
This project is licensed under the [MIT License](LICENSE).

## Credits
- Author: Jörgen Karlsson inspired by Tiago Costa
- Maintainer: jorgen-k
- Contributors: jorgen-k

## Changelog
Refer to the [CHANGELOG.md](CHANGELOG.md) file for details on changes, updates, and bug fixes.

## Support
For any issues or questions related to using the TCP client node, please visit the project's [GitHub Issues](https://github.com/jorgen-k/node-red-contrib-tcp-client2/issues) page.

## Examples
For additional examples and usage scenarios, refer to the [EXAMPLES.md](EXAMPLES.md) file.

## Testing
Testing procedures and frameworks used for this project are documented in the [TESTING.md](TESTING.md) file.

## Security
For best practices on securing Node-RED flows and using the TCP client node securely, please refer to the [SECURITY.md](SECURITY.md) file.

## Feedback
We welcome your feedback, suggestions, and bug reports! Please feel free to open an issue on the project's [GitHub Issues](https://github.com/jorgen-k/node-red-contrib-tcp-client2/issues) page.
