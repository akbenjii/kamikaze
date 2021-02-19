const fs = require('fs');
const readline = require('readline');
const stream = require('stream');

const input = fs.createReadStream(`${__dirname}/../../accounts.txt`);

exports.accounts = () => {
    const output = new stream.PassThrough({objectMode: true});
    const rl = readline.createInterface({input});
    rl.on("line", line => {
        output.write(line);
    });
    rl.on("close", () => {
        output.push(null);
    });
    return output;
}