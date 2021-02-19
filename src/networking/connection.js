const {Socket} = require('net');

module.exports = class Connection {
    constructor(host, port) {
        this.host = host;
        this.port = port;

        this.socket = new Socket();
    }

    init() {
        this.socket.connect({
            host: this.host,
            port: this.port
        }, () => {
            this.socket.setDefaultEncoding('utf8');
            this.socket.setEncoding('utf8');
        });

        this.socket.on('error', function (err) {
            return logger.error(`${err.toString().replace('Error: ', "")}`);
        });

        logger.debug(`Created connection to ${this.host}:${this.port}`);
        return this.socket;
    }
}