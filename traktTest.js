import { clientID, accesstoken, tAuth, alevPass, traktClientID, traktID, oneriList } from './secrets.js';
import tmi from 'tmi.js';
import axios from 'axios';


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

        console.log(`Emre Bey en son ${tvShow.title} dizisinin ${episode.season}. sezon ${episode.number}. bolumu olan "${episode.title}" bolumunu izledi.`);
    })
    .catch(function (error) {
        console.log(error);
    });