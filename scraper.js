const beautify = require('js-beautify').js;
const request = require('request');
const fs = require('fs');

console.log('[KRUNKER] - Fetching Version...');

request.get('https://matchmaker.krunker.io/game-list?hostname=krunker.io', {
    json: true
}, (err, res, body) => {
    var game = body.games[0];

    var gameId = game[0];
    var serverRegion = game[1];
    var currentPlayers = game[2];
    var maxPlayers = game[3];
    var gameInfo = game[4];

    var version = gameInfo.v;
    var customServer = gameInfo.cs;
    var gameType = gameInfo.i;

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

        str = beautify(str, {
            indent_size: 4,
            space_in_empty_paren: true
        });

        fs.writeFile('game.js', str, (err) => {
            if (err) throw err;
            console.log('[KRUNKER] - Saved to game.js');
        });
    });
});
