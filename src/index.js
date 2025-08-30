const Client = require("./Structures/Client.js");
const config = require("./Data/config.json");
const client = new Client();

process.on('unhandledRejection', (err) => { console.log(err) });
client.start(config.token);