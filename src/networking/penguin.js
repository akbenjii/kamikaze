'use strict';

const Connection = require('./Connection');
const PacketHandler = require('../handlers/packet');
let penguins = {};

module.exports = class Penguin extends PacketHandler {
    constructor(username, password, host, login_port, world_port) {
        super();
        this.host = host;
        this.username = username;
        this.password = password;
        this.login_port = login_port;
        this.world_port = world_port;

        this.id = null;
        this.rndK = null;
        this.room = -1;
        this.coins = -1;
        this.magic = 'Y(02.>\'H}t":E1';
        this.buffer = '';
        this.connected = false;
        this.delimiter = '\0';
        this.login_key = null;
        this.internal_room_id = -1;

        this.socket = new Connection(host, login_port).init();
        this._start_listener();
    }

    async login() {
        try {
            await this.send_verChk();
            await this.send_rndK();

            const pword = Crypto.CDATA('login', this.password, this.rndK, this.magic);
            const login_request = `<msg t="sys"><body action="login" r="0"><login z="w1"><nick><![CDATA[${this.username}]]></nick><pword><![CDATA[${pword}]]></pword></login></body></msg>`;

            this._send(login_request);

            const packet = await this._receive_packet();
            this.socket.destroy();

            logger.info(`[${this.username}] has logged in.`);
            if (packet[4].includes('|')) return logger.error('To-be added.');

            this.id = packet[4];
            this.login_key = packet[5];

            await this.join_server();
        } catch (e) {
            return logger.error(`[${this.username}] ${e}`);
        }
    }

    join_server() {
        return new Promise(async (resolve) => {
            this.socket = new Connection(this.host, this.world_port).init();
            this._start_listener();

            await this.send_verChk();
            await this.send_rndK();

            const pword = (Crypto.CDATA('world', this.login_key + this.rndK) + this.login_key);
            const world_request = `<msg t="sys"><body action="login" r="0"><login z="w1"><nick><![CDATA[${this.username}]]></nick><pword><![CDATA[${pword}]]></pword></login></body></msg>`;

            this._send(world_request);

            let packet = await this._receive_packet();
            if (packet[2] !== 'l') await this._receive_packet();

            this._emit('s', 'j#js', this.id, this.login_key, 'en');
            penguins[this.id] = this.socket;

            this.connected = true;
            resolve(logger.info(`${this.username} has joined a server.`));

            this._heartbeat()
            await this._packet_handler();
        })
    }

    send_verChk() {
        let response;
        return new Promise(async (resolve, reject) => {
            const verChk_request = "<msg t='sys'><body action='verChk' r='0'><ver v='153' /></body></msg>";

            logger.info('Sending verChk request...');
            this._send(verChk_request);

            response = await this._receive();

            if (response.includes('cross-domain-policy')) response = await this._receive();
            if (response.includes('apiOK')) logger.info(`[${this.username}] Received apiOK!`) && resolve();
            else if (response.includes('apiKO')) return reject('Received apiKO!');
            else return reject('Received invalid verChk response!');
        });
    }

    send_rndK() {
        let response;
        return new Promise(async (resolve, reject) => {
            const rndK_request = '<msg t="sys"><body action="rndK" r="-1"></body></msg>';

            logger.info('Sending rndK request...');
            this._send(rndK_request);

            response = await this._receive();
            if (!response.includes('rndK')) return reject('Received invalid rndK response.');

            this.rndK = /<k>(?:<!\[CDATA\[)?(.*?)(?:]]>)?<\/k>/g.exec(response)[1];
            logger.info(`[${this.username}] Received rndK response: ${this.rndK}`);
            resolve();
        });
    }

    _start_listener() {
        this.socket.on('data', response => this.buffer += response);
    }

    _heartbeat() {
        this._emit('s', 'u#h');
        setInterval(() => {
            this._emit('s', 'u#h');
        }, 60000)
    }

    _receive() {
        return new Promise(async (resolve) => {
            await this.waitFor(_ => this.buffer.includes('\0'));

            const message = this.buffer.slice(0, this.buffer.indexOf(this.delimiter));
            this.buffer = this.buffer.replace(message + this.delimiter, "");

            logger.incoming(message);
            resolve(message);
        })
    }

    _send(request) {
        logger.outgoing(request);
        request = `${request}${this.delimiter}`;

        return this.socket.write(request);
    }

    async waitFor(conditionFunction) {
        const poll = resolve => {
            if (conditionFunction()) resolve();
            else setTimeout(_ => poll(resolve), 400);
        }
        return new Promise(poll);
    }
}

Array.prototype.insert = function (index, item) {
    this.splice(index, 0, item);
};