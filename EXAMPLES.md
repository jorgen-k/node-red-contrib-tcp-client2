# Example
## Configuration:
![Node Configuration](https://raw.githubusercontent.com/jorgen-k/node-red-contrib-tcp-client2/master/edit.png)


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