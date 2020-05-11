const beautify = require('js-beautify').js;
const request = require('request');
const fs = require('fs');

console.log('[KRUNKER] - Fetching Version...');

request.get('https://krunker.io/social.html', (err, res, body) => {
    var version = body.match(/(?<=\w+.exports=")[^"]+/)[0];

    // Discord - Lemons#0001

    console.log('[KRUNKER] - Got Version (%s)', version);

    request.get('https://krunker.io/pkg/krunker.' + version + '.vries', {
        encoding: null
    }, (err, res, buf) => {
        var str = '';
        
        console.log('[KRUNKER] - Decoding Bytes...');
        
        for (var i = 0; i < buf.byteLength; i++) {
            var byte = buf.readUInt8(i) ^ 0x69;
            str += String.fromCharCode(byte);
        }

        console.log('[KRUNKER] - Formatting Code...');

        var code = beautify(str, {
            indent_size: 4,
            space_in_empty_paren: true
        });

        fs.writeFile('game.js', str, (err) => {
            if (err) throw err;
            console.log('[KRUNKER] - Saved original to game.js');
        });

        fs.writeFile('game_beautify.js', code, (err) => {
            if (err) throw err;
            console.log('[KRUNKER] - Saved beautified to game_beautify.js');
        });
    });
});
