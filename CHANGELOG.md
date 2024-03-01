# Change Log

All notable changes to this project will be documented in this file. This project adheres to [Semantic Versioning](http://semver.org/).

## [Unreleased]
### Added
- TCP server node
- Node status
- Timeout and retries
- Improved logging

### Changed
- Improved documentation
- Improved fault handling
- Major refactoring - simplification and modernization 
- To connect the "connect" keyword shall be used. "listen" still supported but deprecated.
- Removed connection pool (did not work anyway so backwards compatible). Now one node supports one connection at a time.
If more than one connection is needed, use one node per connection.

### Fixed
- "Action" was not changed correctly

## [1.0.0] - 2024-02-28
### Added
- Initial release of the TCP client node.
- Ability to establish TCP connections with designated hosts.
- Support for dynamic management of connections using provided arguments.
- Feature to transmit data over TCP ports.

### Changed
- Replaced deprecated node-red-contrib-tcp-client by Tiago Costa.
- Removed support for xml translation due to separation of concern. (This 
should be a separate node)
- Removed support for the client to be a server. This might be implemented in a separate server node in the future. Also due to separation of concerns.

### Fixed
- Refactoring and simplification of code inspired from node-red-contrib-tcp-client, fixing closing issues and more.

