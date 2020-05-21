import { clientID, accesstoken, tAuth, alevPass, traktClientID, traktID, oneriList, channelID, krakenAuth } from './secret/secrets.js';
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

client.on('message', (channel, user, message, self) => {
    // Ignore echoed messages.
    if (self) return;
    let allCommands = '';
    let newCmd = message.toLowerCase();
    let newCmdTR = message.toLocaleLowerCase('tr');
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

                client.say(channel, `Emre Bey ${movie.year} yilinda gosterime giren ${movie.title} adli yapimi izlemenizi oneriyor.`);
            })
            .catch(function (error) {
                console.log(error);
            });
    }

    if (nakedCmd === "film") {

        axios.get(`https://api.trakt.tv/users/${traktID}/history/movies`, {
            headers: {
                "Content-type": "application/json",
                "trakt-api-key": traktClientID,
                "trakt-api-version": 2,
            }
        })
            .then(function (response) {
                let list = response.data;
                let movie = list[0].movie;

                client.say(channel, `Emre Bey en son ${movie.title} (${movie.year}) adli yapimi izledi.`);
            })
            .catch(function (error) {
                console.log(error);
            });
    }

    if (nakedCmd === "dizi") {

        axios.get(`https://api.trakt.tv/users/${traktID}/history/episodes`, {
            headers: {
                "Content-type": "application/json",
                "trakt-api-key": traktClientID,
                "trakt-api-version": 2,
            }
        })
            .then(function (response) {
                let list = response.data;
                let episode = list[0].episode;
                let tvShow = list[0].show;

                client.say(channel, `Emre Bey en son ${tvShow.title} dizisinin ${episode.season}. sezon ${episode.number}. bolumu olan "${episode.title}" bolumunu izledi.`);
            })
            .catch(function (error) {
                console.log(error);
            });
    }

    // if (user.mod === true && nakedCmd === 'baslik') {
    //     // User is a mod.
    //     console.log(message);
    //     let newTitle = message.substring(7);
    //     console.log(newTitle);
    //     client.say(channel, `Istenen title: ${message} veya ${newTitle}`);
    // }

});

client.on('chat', (channel, user, message, self) => {
    // Ignore echoed messages.
    if (self) return;


    let cmdCmd = message.substring(0, 7);

    if ((user.mod || user['user-type'] === 'mod') && cmdCmd === '!baslik') {
        // User is a mod.
        let newTitle = message.substring(8);

        client.say(channel, `Moderator bey, emriniz gerceklestiriliyor. Yayin basligini "${newTitle}" olarak degistiriyorum.`);

        axios.put(`https://api.twitch.tv/kraken/channels/${channelID}`, { "channel": { "status": newTitle } }, {
            headers: {
                "Accept": "application/vnd.twitchtv.v5+json",
                "Client-ID": clientID,
                "Authorization": krakenAuth,
            }
        })
            .then(response => {
                console.log(response);
            })
            .catch(e => {
                console.log(e);
            });
    }
});

client.on('chat', (channel, user, message, self) => {
    // Ignore echoed messages.
    if (self) return;


    let cmdCmd = message.substring(0, 5);

    if ((user.mod || user['user-type'] === 'mod') && cmdCmd === '!oyun') {
        // User is a mod.
        let newGame = message.substring(6);

        client.say(channel, `Moderator bey, emriniz gerceklestiriliyor. Yayin turunu "${newGame}" olarak degistiriyorum.`);

        axios.put(`https://api.twitch.tv/kraken/channels/${channelID}`, { "channel": { "game": newGame } }, {
            headers: {
                "Accept": "application/vnd.twitchtv.v5+json",
                "Client-ID": clientID,
                "Authorization": krakenAuth,
            }
        })
            .then(response => {
                console.log(response);
            })
            .catch(e => {
                console.log(e);
            });
    }
});