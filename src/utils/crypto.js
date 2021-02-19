const md5 = require('md5');

exports.CDATA = (type, password, rndK, magic) => {
    switch (type) {
        case 'login':
            password = md5(password).toUpperCase();
            password = md5(swappedMD5(password) + rndK + magic);
            password = swappedMD5(password)
            return password;
        case 'world':
            password = md5(password);
            password = swappedMD5(password)
            return password;
    }
};

function swappedMD5(password) {
    return password.substr(16, 16) + password.substr(0, 16);
}