
import { clientID, accesstoken, alevPass } from './secrets.js';
import commands from './db.js';
// const clientId = clientID;
// const accessToken = accesstoken;

import tmi from 'tmi.js';

const tmiOptions = {
    options: {
        debug: true,
    },
    connection: {
        cluster: 'aws',
        reconnect: true,
    },
    identity: {
        username: 'sekreteralev',
        password: alevPass,
    },
    channels: ['emreca'],
}

const client = new tmi.client(tmiOptions);

client.connect();

client.on('connected', (address, port) => {
    client.action('emreca', 'Baglanti kuruldu... 🔥... Alevleniyor... 🚬... Merhaba chat!');
});

client.on('message', (channel, tags, message, self) => {
    // Ignore echoed messages.
    if (self) return;
    let allCommands = '';
    let newCmd = message.toLowerCase();
    let newCmdTR = message.toLocaleLowerCase('tr')
    let nakedCmd = newCmd.substring(1);

    for (let i = 0; i < commands.length; i++) {
        if (nakedCmd === commands[i][0]) {

            client.say(channel, commands[i][1])

        } else if (nakedCmd === `commands`) {

            for (let j = 0; j < commands.length; j++) {
                allCommands += ` !${commands[j][0]}`;
            }
            break;
        }
    }
    client.say(channel, allCommands)

    if (newCmdTR.includes('sen abdülhamid' || 'sen abdülhamit' || 'sen abdulhamıd' || 'sen abdulhamıt' || 'sen abdulhamid' || 'sen abdulhamit') === true) {
        client.say(channel, 'Hayir savunmadim efendim.')
    }
});