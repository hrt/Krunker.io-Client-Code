const beautify = require('js-beautify').js;
const request = require('request');
const fs = require('fs');

console.log('[KRUNKER] - Fetching Version...');

request.get('https://krunker.io/social.html', (err, res, body) => {
    var version = body.match(/\w+\.exports="(\w+)/)[1];

    // Discord - Lemons#0001

    console.log('[KRUNKER] - Got Version (%s)', version);

    request.get('https://krunker.io/pkg/krunker.' + version + '.vries', {
        encoding: null
    }, (err, res, buf) => {
        var str = '';
        
        console.log('[KRUNKER] - Decoding Bytes...');
        var xor_key = buf.readUInt8(0) ^ '!'.charCodeAt(0);
        console.log('[KRUNKER] - Calculated XOR key (%s)...', xor_key);
        for (var i = 0; i < buf.byteLength; i++) {
            var byte = buf.readUInt8(i) ^ xor_key;
            str += String.fromCharCode(byte);
        }

        fs.writeFile('game.js', str, (err) => {
            if (err) throw err;
            console.log('[KRUNKER] - Saved original to game.js');
        });
    });
});
