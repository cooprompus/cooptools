const Rcon = require('modern-rcon');
const { TwitchHook } = require('streamhook');

const twitchChannel = ''
const clientId = ''
const password = ''

const minecraftPlayer = ''

const minecraftServer = 'localhost'
const minecraftRconPort = 8888
const rconPassword = ''

let sendCommand = (command) => {
	const rcon = new Rcon(minecraftServer, minecraftRconPort, rconPassword, 5000);
	return rcon.connect().then(() => {
		return rcon.send(command);
	}).then(res => {
		console.log(res);
	}).then(() => {
		return rcon.disconnect();
	}).catch( err => {
		console.log(err);
	});
}

let killPlayer = (player) => {
	console.log(`killing player: ${player}`)
	sendCommand(`/scoreboard players tag @e[type=ocelot] add tokill {CustomName:"${player}"}`)
		.then(() => sendCommand('/kill @e[type=ocelot,tag=tokill]'))
}

let spawnPlayer = (player) => {
	console.log(`spawning player: ${player}`)
	sendCommand( `/summon ocelot -181 63 -107 {Owner: minecraftPlayer, CustomName:"${player}", CustomNameVisible:true, Glowing:1, Leashed:1,Age:-25000}`)
}

let hook = new TwitchHook({
	"channel" : twitchChannel
});
hook.on('chat', event=>{    // listen to one event
	console.log("chat event!");
	console.log(event);
});
hook.on('follow', event=>{
	console.log("follow event!");
	console.log(event);
});

hook.on('join', event=>{
	console.log("join event!");
	spawnPlayer(event.user.username);
});
hook.on('leave', event=>{
	console.log("leave event!");
	killPlayer(event.user.username);
});

hook.init(_=>{              // provide auth configs through function, useful for injection from file
	return {
		"client_id" : clientId,
		"password"  : password
	}
});
