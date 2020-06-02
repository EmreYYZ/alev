"use strict";

const WebSocket = require('ws');

const main = require('../../main');

const kraken = require('../config/authorize/kraken');
const helix = require('../config/authorize/helix');
const dbActions = require('./db-actions');
const settings = require('../config/settings');
const environment = require('../utilities/environment');

const recentIds = [];
let pingpongLog = '';

function onControlPanelTwitchPubSub() {

	const HEARTBEAT_INTERVAL = 1000 * 60 * 4;//ms between PING's
	const MAX_BACKOFF_THRESHOLD_INTERVAL = 1000 * 60 * 2;
	const BACKOFF_THRESHOLD_INTERVAL = 1000 * 3; //ms to wait before reconnect

	const MAX_PONG_WAIT_INTERVAL = 1000 * 10;

	let ws;
	let reconnectInterval = BACKOFF_THRESHOLD_INTERVAL;

	let pongWaitTimeout = null;

	// Source: https://www.thepolyglotdeveloper.com/2015/03/create-a-random-nonce-string-using-javascript/
	function nonce(length) {
		let text = "";
		const possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
		for (let i = 0; i < length; i++) {
			text += possible.charAt(Math.floor(Math.random() * possible.length));
		}
		return text;
	}

	function heartbeat() {
		if (ws.readyState !== WebSocket.OPEN) {
			environment.log({ resultText: `heartbeat: ws.readyState === ${ws.readyState}` }, out => console.log(out));
			return;
		}

		const message = { type: 'PING' };
		pingpongLog = 'SENT: ' + JSON.stringify(message);
		ws.send(JSON.stringify(message));

		pongWaitTimeout = setTimeout(reconnect, MAX_PONG_WAIT_INTERVAL);
	}

	function listen(topic) {
		if (ws.readyState !== WebSocket.OPEN) {
			environment.log({ resultText: `listen: ws.readyState === ${ws.readyState}` }, out => console.log(out));
			return;
		}
		const message = {
			type: 'LISTEN',
			nonce: nonce(15),
			data: {
				topics: [topic],
				auth_token: helix.getAuthenticated().access_token
			}
		};
		environment.log({ resultText: 'SENT: ' + JSON.stringify(message) }, out => console.log(out));
		ws.send(JSON.stringify(message));
	}

	async function redemedBitcals(username, amount) {
		const keyedBitcalInfo = (await dbActions.loadBitcals(username)) || 0;
		await dbActions.updateBitcals(username, {
			amount: keyedBitcalInfo.content.amount + amount
		});
	}

	function connect() {
		let heartbeatHandle;

		ws = new WebSocket('wss://pubsub-edge.twitch.tv');

		ws.onopen = (event) => {
			environment.log({ resultText: 'INFO: Socket Opened', event }, out => console.log(out));
			heartbeat();
			heartbeatHandle = setInterval(heartbeat, HEARTBEAT_INTERVAL);

			reconnectInterval = BACKOFF_THRESHOLD_INTERVAL;

			listen('channel-points-channel-v1.' + kraken.getUserId());
		};

		ws.onerror = (error) => {
			environment.log({ resultText: 'ERR:  ' + JSON.stringify(error) }, out => console.log(out));
		};

		ws.onmessage = async (event) => {
			const value = JSON.parse(event.data);
			switch (value.type) {
				case 'MESSAGE':
					const message = JSON.parse(value.data.message);
					const id = message.data.redemption.id;
					if (recentIds.includes(id)) break;
					recentIds.push(id);
					const cname = '!bugged';
					const reward = message.data.redemption.reward;
					const user = message.data.redemption.user;
					if (reward.title.substr(0, cname.length) === cname) {
						const splits = reward.title.split(' ');
						const bugged = splits[splits.length - 1];
						const cost = +bugged || reward.cost;
						const amount = Math.floor(cost / 2);
						const botAmount = Math.floor(amount / 2);

						const ownerName = settings.broadcast.social.username.twitch;
						const botName = settings.broadcast.bots.active;

						await redemedBitcals(ownerName, botAmount);
						await redemedBitcals(botName, botAmount);
						await redemedBitcals(user.login, amount);
					}
					environment.log(message, out => console.log(out));
					break;
				case 'PONG':
					environment.log({ resultText: pingpongLog + ' RECV: ' + JSON.stringify(value) }, out => console.log(out));
					clearPongWaitTimeout();
					break;
				case 'RECONNECT':
					reconnect();
					break;
				case 'RESPONSE':
					environment.log(value, out => console.log(out));
					break;
				default:
					environment.log({ resultText: `Unknown state: ${value.type}`, value }, out => console.log(out));
					break;
			}
		};

		ws.onclose = () => {
			environment.log({ resultText: 'INFO: Socket Closed' }, out => console.log(out));
			clearInterval(heartbeatHandle);
			reconnect();
		};

	}

	function reconnect() {
		clearPongWaitTimeout();
		environment.log({ resultText: 'INFO: Reconnecting...' }, out => console.log(out));
		reconnectInterval = floorJitterInterval(reconnectInterval * 2);
		if (reconnectInterval > MAX_BACKOFF_THRESHOLD_INTERVAL) {
			reconnectInterval = floorJitterInterval(MAX_BACKOFF_THRESHOLD_INTERVAL);
		}
		setTimeout(connect, reconnectInterval);
	}

	function floorJitterInterval(interval) {
		return Math.floor(interval + Math.random() * 1000);
	}

	function clearPongWaitTimeout() {
		if (pongWaitTimeout !== null) {
			clearTimeout(pongWaitTimeout);
			pongWaitTimeout = null;
		}
	}

	connect();
}

exports.init = async () => {

	main.events.off('control-panel-ready', onControlPanelTwitchPubSub);
	main.events.on('control-panel-ready', onControlPanelTwitchPubSub);

	return Promise.resolve({ success: true, resultText: `${require('path').basename(__filename).replace('.js', '.')}init()` });
}