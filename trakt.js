import { clientID, accesstoken, tAuth, alevPass, traktClientID, traktID, oneriList } from './secrets.js';
import commands from './db.js';
import tmi from 'tmi.js';
import axios from 'axios';


client.on('message', (channel, tags, message, self) => {
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
};

    // let movieResult = `Emre Bey'in son izledigi film ${year} yapimi, ${director} tarafindan yonetilen, ${actor1}, ${actor2} gibi oyuncularin basrol oynadigi ${title}.`;

    // client.say(channel, movieResult);
