import { clientID, accesstoken, tAuth, alevPass, traktClientID, traktID, oneriList } from './secrets.js';
import { commands, komutList } from './db.js';
import tmi from 'tmi.js';
import axios from 'axios';

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

        } else if (nakedCmd === `komutlar`) {

            for (let j = 0; j < komutList.length; j++) {
                allCommands += ` !${komutList[j]}`;
            }
            break;
        }
    }
    client.say(channel, allCommands)

    if (newCmdTR.includes('sen abdülhamid' || 'sen abdülhamit' || 'sen abdulhamıd' || 'sen abdulhamıt' || 'sen abdulhamid' || 'sen abdulhamit') === true) {
        client.say(channel, 'Hayir savunmadim efendim.')
    }

    if (nakedCmd === "oneri") {

        axios.get(`https://api.trakt.tv/users/${traktID}/lists/${oneriList}/items/movies`, {
            headers: {
                "Content-type": "application/json",
                "trakt-api-key": traktClientID,
                "trakt-api-version": 2,
            }
        })
            .then(function (response) {
                let list = response.data;
                let movieNo = Math.floor(Math.random() * list.length);
                let movie = list[movieNo].movie;

                client.say(channel, `Emre Bey ${movie.year} tarihli ${movie.title} adli yapimi oneriyor.`);

                console.log(`Emre Bey ${movie.year} tarihli ${movie.title} adli yapimi oneriyor.`);
            })
            .catch(function (error) {
                console.log(error);
            });
    }

});