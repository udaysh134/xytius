const Discord = require("discord.js");
const Client = require("./Client.js");

/**
 * @param {Discord.Message | Discord.Interaction} message 
 * @param {string[]} args 
 * @param {Client} client 
 */
function RunFunction(message, args, client) {}


class Command{
    /**
     * @typedef {{name: string, description: string, aliases: [], permission: Discord.PermissionsString, allowedChannels: [], allowedServers: [], cooldown: string, usage: string, usageDesc: string, usageExample: [], forTesting: boolean, HUCat: [], run: RunFunction}} CommandOptions
     * @param {CommandOptions} options 
     */
    constructor(options) {
        this.name = options.name;
        this.description = options.description;
        this.aliases = options.aliases;
        this.permission = options.permission;
        this.allowedChannels = options.allowedChannels;
        this.allowedServers = options.allowedServers;
        this.cooldown = options.cooldown;
        this.usage = options.usage;
        this.usageDesc = options.usageDesc;
        this.usageExample = options.usageExample;
        this.forTesting = options.forTesting;
        this.HUCat = options.HUCat;
        this.run = options.run;
    }
}

module.exports = Command;