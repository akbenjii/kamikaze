'use strict'

// creds to relrelb
module.exports = class PacketHandler {
    async _packet_handler() {
        while(this.connected) {
            try {
                let packet = await this._receive_packet();

                let packet_type = packet[2];
                switch(packet_type) {
                    case 'h': this._h(packet); break;
                    case 'e': this._e(packet); break;
                    case 'lp': this._lp(packet); break;
                    case 'ap': this._ap(packet); break;
                    case 'rp': this._rp(packet); break;
                    case 'jr': this._jr(packet); break;
                    case 'jp': this._jp(packet); break;
                    case 'jg': this._jg(packet); break;
                    case 'br': this._br(packet); break;
                    case 'ba': this._ba(packet); break;
                    case 'rb': this._rb(packet); break;
                    case 'bon': this._bon(packet); break;
                    case 'bof': this._bof(packet); break;
                    case 'upc': this._upc(packet); break;
                    case 'uph': this._uph(packet); break;
                    case 'upf': this._upf(packet); break;
                    case 'upn': this._upn(packet); break;
                    case 'upb': this._upb(packet); break;
                    case 'upa': this._upa(packet); break;
                    case 'upe': this._upe(packet); break;
                    case 'upl': this._upl(packet); break;
                    case 'upp': this._upp(packet); break;
                    case 'sp': this._sp(packet); break;
                    case 'sa': this._sa(packet); break;
                    case 'sf': this._sf(packet); break;
                    case 'sb': this._sb(packet); break;
                    case 'sm': this._sm(packet); break;
                    case 'ss': this._ss(packet); break;
                    case 'sj': this._sj(packet); break;
                    case 'se': this._se(packet); break;
                    case 'ms': this._ms(packet); break;
                    case 'ai': this._ai(packet); break;
                    case 'zo': this._zo(packet); break;
                    default:
                        logger.warn(`Packet (${packet_type}) isn\'t handled.`);
                }
            } catch(e) {
                logger.error(e);
            }
        }
    }

    _h(packet) {
        logger.info(`${this.username} received heartbeat response.`)
    }

    _e(packet) {
        return logger.error(errors[packet[4]]);
    }

    _lp(packet) {
        this.coins = packet[5];
    }

    _ap(packet) {

    }

    _rp(packet) {
        this.penguin_id = packet[4];
    }

    _jr(packet) {
        this.internal_room_id = packet[3];
        this.room = packet[4];
    }

    _jp(packet) {
        this.internal_room_id = packet[3];
    }

    _jg(packet) {
        this.internal_room_id = packet[3];
        this.room = packet[4];
    }

    _br(packet) {
        let penguin_id = packet[4];
        let penguin_name = packet[5];
    }

    _ba(packet) {
        let penguin_id = packet[4];
        let penguin_name = packet[5];
    }

    _rb(packet) {
        let penguin_id = packet[4];
    }

    _bon(packet) {
        if(!packet[4]) return;
        let penguin_id = packet[4];
    }

    _bof(packet) {
        if(!packet[4]) return;
        let penguin_id = packet[4];
    }

    _upc(packet) {
        let penguin_id = packet[4];
        let color = packet[5];
    }

    _uph(packet) {
        let penguin_id = packet[4];
        let head = packet[5];
    }

    _upf(packet) {
        let penguin_id = packet[4];
        let face = packet[5];
    }

    _upn(packet) {
        let penguin_id = packet[4];
        let neck = packet[5];
    }

    _upb(packet) {
        let penguin_id = packet[4];
        let body = packet[5];
    }

    _upa(packet) {
        let penguin_id = packet[4];
        let hand = packet[5];
    }

    _upe(packet) {
        let penguin_id = packet[4];
        let feet = packet[5];
    }

    _upl(packet) {
        let penguin_id = packet[4];
        let pin = packet[5];
    }

    _upp(packet) {
        let penguin_id = packet[4];
        let background = packet[5];
    }

    _sp(packet) {
        let penguin_id = packet[4];
        let x = packet[5];
        let y = packet[5];
    }

    _sa(packet) {
        let penguin_id = packet[4];
    }

    _sf(packet) {
        let penguin_id = packet[4];
        let frame = packet[5];
    }

    _sb(packet) {
        let penguin_id = packet[4];
        let x = packet[5];
        let y = packet[5];
    }

    _sm(packet) {
        let penguin_id = packet[4];
        let message = packet[5];
    }

    _ss(packet) {
        let penguin_id = packet[4];
        let message = packet[5];
    }

    _sj(packet) {
        let penguin_id = packet[4];
        let joke_id = packet[5];
    }

    _se(packet) {
        let penguin_id = packet[4];
        let emote_id = packet[5];
        // follow stuff after
    }

    _ms(packet) {
        this.coins = packet[4];
    }

    _ai(packet) {
        let item_id = packet[4];
        this.coins = packet[5];
    }

    _zo(packet) {
        this.coins = packet[4];
    }

    _emit(...args) {
        args.insert(2, this.internal_room_id);
        const packet = `%xt%${args.join('%')}%`;

        this._send(packet);
    }

    _receive_packet() {
        let data;
        return new Promise(async (resolve, reject) => {
            data = await this._receive();

            while (!data.startsWith('%')) data = await this._receive();

            const packet = data.split('%');
            if (packet[2] === 'e') return reject(errors[packet[4]]);
            resolve(packet);
        })
    }
}