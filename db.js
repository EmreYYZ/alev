import { clientID, accesstoken, tAuth, alevPass, traktClientID } from './secrets.js';
import tmi from 'tmi.js';
import axios from 'axios';


let commands = [
    [`discord`, `Discord sunucumuzun linki: https://discord.gg/DfjmSTD`],
    [`portfolio`, `Emre Bey'in portfoliosuna bu linkten ulasabilirsiniz: https://emre.la`],
    [`instagram`, `Emre Bey'in Instagram sayfasi: https://instagram.com/emre.la`],
    [`twitter`, `Emre Bey'in Twitter hesabini paylasayim. Yalniz hesap Ingilizce, bilginize: https://twitter.com/EmreYYZ`],
    [`jahrein`, `Tanidigimiz sisko insanlarin ismini mi sayiyoruz?`],
    ['uptime', `Henuz Twitch API'a baglanma kabiliyetim olmadigi icin isteginizi gerceklestiremiyorum.`],
];

let komutList = [
    `oneri`, `discord`, `portfolio`, `instagram`, `twitter`, `jahrein`, `uptime`
]
// client.on('message', (channel, tags, message, self) => {
//     let newCmd = message.toLowerCase();
//     newCmd === `!film`
// };

// function lastWatchedMovie() {



//     return movieResult;
// }


export { commands, komutList };