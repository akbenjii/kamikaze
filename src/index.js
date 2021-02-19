const Penguin = require('./networking/penguin');
const {host, login_port, world_port} = require('../config');

global.Crypto = require('./utils/crypto');
global.errors = require('./enums/errors.json');
global.logger = require('./utils/logger');

const {accounts} = require('./utils/get_accounts');

(async () => {
    for await (let account of accounts()) {
        if (account.length === 0) continue;

        account = account.split(':');
        const username = account[0];
        const password = account[1];

        if (username === undefined || password === undefined) continue;

        let penguin = new Penguin(username, password, host, login_port, world_port);
        await penguin.login();

        /**
         *
         * To-Add
         *
         * - Packet handler
         * - ai, ac, jr, follow, etc..
         *
         */
    }
})();