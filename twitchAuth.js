import { clientID, accesstoken, tAuth, alevPass, redir, scopes } from './secrets.js';
import axios from 'axios';

const clid = clientID;

axios.post(`https://id.twitch.tv/oauth2/authorize?client_id=${clid}&redirect_uri=${redir}&response_type=code&scope=${scopes}`)
    .then(response => {
        console.log(response);
    })
    .catch(e => {
        console.log(e);
    });