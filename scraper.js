const request = require('request');
const fs = require('fs');

request.get('https://krunker.io', (err, res, body) => {
    var str = body.match(/function\((?:\w+(?:,|)){3}\)\{\w+\.exports=\w+\(\d+\)\("(.*?)"\)\}/)[1];

    var buffer = Buffer.from(str, 'base64').toString('binary');
    var bytes = Buffer.from(buffer);

    var version = bytes.toString().match(/completion(.*?)(\w{5})/s)[2];

    request.get('https://krunker.io/pkg/krunker.' + version + '.vries', {
        encoding: null
    }, (err, res, buf) => {
        var str = '';

        for (var i = 0; i < buf.byteLength; i++) {
            var byte = buf.readUInt8(i) ^ 0x69;
            str += String.fromCharCode(byte);
        }

        fs.writeFileSync('game.js', str);

        console.log('[KRUNKER] => Version: %s | Saved to game.js', version);
    });
});
