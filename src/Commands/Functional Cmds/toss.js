const Command = require("../../Structures/Command.js");
const Discord = require("discord.js");
const config = require("../../Data/config.json");
const aubdycad = require("../../Data/aubdycad.json");
const emojis = require("../../Data/emojis.json");
const pictures = require("../../Data/pictures.json");
const keys = require("../../Data/keys.json");


module.exports = new Command({
    name: "toss",
    description: "Flip a coin virtually and get Head or Tail randomly.",
    aliases: [`flip`],
    permission: "SendMessages",
    allowedChannels: [`${aubdycad.BotCommands1_C_ID}`, `${aubdycad.BotCommands2_C_ID}`],
    allowedServers: [`${config.TestServer_ID}`, `${config.Aubdycad_ID}`, `${config.XytiusServer_ID}`],
    cooldown: "",
    usage: `${config.prefix}toss`,
    usageDesc: `Use this command in absence of a coin, to throw a toss between Head or Tail. It gives you a random face with the chance of 50% each. The command does not uses any currency of any country.`,
    usageExample: [`${config.prefix}toss`],
    forTesting: false,
    HUCat: [`gen`, `functional`],

    async run(message, args, client) {
        const cmndName = `Toss`;
        const cmndEmoji = [`📀`];
        const cmndColour = [`ffd983`];
        const cmndError = `${config.err_emoji}${config.tls}Toss : Command Error!!`;
        const cmndMarker = `${config.marker}`;

        /*
        ----------------------------------------------------------------------------------------------------
        Start
        ----------------------------------------------------------------------------------------------------
        */
        const rand = Math.round(Math.random() * (2 - 1) + 1);
        const randImage = rand === 1 ? pictures.toss.head : pictures.toss.tail;


        /*
        ----------------------------------------------------------------------------------------------------
        Functions
        ----------------------------------------------------------------------------------------------------
        */
        function tossResult(val) {            
            const tossResult_Embed = new Discord.EmbedBuilder();
            tossResult_Embed.setTitle(`${cmndEmoji[0]}${config.tls}${cmndName}`);
            tossResult_Embed.setDescription(`The coin was flipped, and the result is\na : **${val.toUpperCase()}**`);
            tossResult_Embed.setThumbnail(randImage);
            tossResult_Embed.setColor(`${cmndColour[0]}`);
            tossResult_Embed.setFooter({ text: message.author.username, iconURL: message.author.avatarURL({ dynamic: true }) });
            tossResult_Embed.setTimestamp(message.createdTimestamp);

            return message.reply({ embeds: [tossResult_Embed] });
        }


        /*
        ----------------------------------------------------------------------------------------------------
        Execution
        ----------------------------------------------------------------------------------------------------
        */
        if(rand === 1) {
            return tossResult("head");
        } else {
            return tossResult("tail")
        }
    }
});