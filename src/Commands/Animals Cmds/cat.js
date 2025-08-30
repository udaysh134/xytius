const Command = require("../../Structures/Command.js");
const Discord = require("discord.js");
const config = require("../../Data/config.json");
const aubdycad = require("../../Data/aubdycad.json");
const emojis = require("../../Data/emojis.json");
const pictures = require("../../Data/pictures.json");
const keys = require("../../Data/keys.json");

const FUNC_fetchReddit = require("../../Systems/External Functions/FUNC_fetchReddit.js");


module.exports = new Command({
    name: "cat",
    description: "Get a random cat's image.",
    aliases: [`kitten`],
    permission: "SendMessages",
    allowedChannels: [`${aubdycad.BotCommands1_C_ID}`, `${aubdycad.BotCommands2_C_ID}`],
    allowedServers: [`${config.TestServer_ID}`, `${config.Aubdycad_ID}`, `${config.XytiusServer_ID}`],
    cooldown: "",
    usage: `${config.prefix}cat`,
    usageDesc: `A very simple command for cat lovers. Just use, and get a random image of any cat, with no limits.`,
    usageExample: [`${config.prefix}cat`],
    forTesting: false,
    HUCat: [`gen`, `animal`],

    async run(message, args, client) {
        const cmndName = `Cat`;
        const cmndEmoji = [`🐱`];
        const cmndColour = [`ffffff`];
        const cmndError = `${config.err_emoji}${config.tls}Cat : Command Error!!`;
        const cmndMarker = `${config.marker}`;

        /*
        ----------------------------------------------------------------------------------------------------
        Start
        ----------------------------------------------------------------------------------------------------
        */
        const pages = [
            "cat",
            "cats",
            "catpics",
            "kittens",
            "Kitten",
            "blackcats",
            "ragdolls",
            "CalicoKittys",
            "Siamesecats",
            "sphynx"
        ];
        const randomPage = pages[Math.floor(Math.random() * pages.length)];
        const result = await FUNC_fetchReddit(randomPage, true, `hot`);


        /*
        ----------------------------------------------------------------------------------------------------
        Execution
        ----------------------------------------------------------------------------------------------------
        */
        const result_Embed = new Discord.EmbedBuilder();
        result_Embed.setTitle(`${cmndEmoji[0]}${config.tls}${cmndName}`);
        result_Embed.setColor(`${cmndColour[0]}`);
        result_Embed.setImage(result.Image);
        result_Embed.setFooter({ text: message.author.username, iconURL: message.author.avatarURL({ dynamic: true }) });
        result_Embed.setTimestamp(message.createdTimestamp);

        return message.reply({ embeds: [result_Embed] });
    }
});