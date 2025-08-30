const Command = require("../../Structures/Command.js");
const Discord = require("discord.js");
const config = require("../../Data/config.json");
const aubdycad = require("../../Data/aubdycad.json");
const emojis = require("../../Data/emojis.json");
const pictures = require("../../Data/pictures.json");
const keys = require("../../Data/keys.json");

const FUNC_callNinjaAPI = require("../../Systems/External Functions/FUNC_callNinjaAPI.js");


module.exports = new Command({
    name: "jokes",
    description: "Gives you funny jokes.",
    aliases: ["joke"],
    permission: "SendMessages",
    allowedChannels: [`${aubdycad.BotCommands1_C_ID}`, `${aubdycad.BotCommands2_C_ID}`],
    allowedServers: [`${config.TestServer_ID}`, `${config.Aubdycad_ID}`, `${config.XytiusServer_ID}`],
    cooldown: "",
    usage: `${config.prefix}jokes`,
    usageDesc: `A simple command which provides you two funny jokes at a time. You may get to see error sometimes (but rarely), not to worry about it, just use the command once again.`,
    usageExample: [`${config.prefix}jokes`],
    forTesting: false,
    HUCat: [`gen`, `fun`],

    async run(message, args, client) {
        const cmndName = `Jokes`;
        const cmndEmoji = [`😄`];
        const cmndColour = [`ffcc4d`];
        const cmndError = `${config.err_emoji}${config.tls}Jokes : Command Error`;
        const cmndMarker = `👉  `;

        /*
        ----------------------------------------------------------------------------------------------------
        Start
        ----------------------------------------------------------------------------------------------------
        */
        const limit = 2;
        const link = `${keys.api_ninjas.links.jokes}${limit}`;

        const res = await FUNC_callNinjaAPI(`${link}`, cmndError, message);


        /*
        ----------------------------------------------------------------------------------------------------
        Execution
        ----------------------------------------------------------------------------------------------------
        */
        let text = ``;

        res.forEach((elem) => {
            let theJoke = (elem.joke).endsWith(".") ? `${elem.joke}` : `${elem.joke}.`;
            text += `${cmndMarker}${theJoke}\n\n`;
        });


        const unknownError_Embed = new Discord.EmbedBuilder();
        unknownError_Embed.setTitle(`${cmndError}`);
        unknownError_Embed.setColor(`${config.err_hex}`);
        unknownError_Embed.setDescription(`An unknown error just occured while getting jokes for you. Can you please try the command once again?`);
        unknownError_Embed.setFooter({ text: message.author.username, iconURL: message.author.avatarURL({ dynamic: true }) });
        unknownError_Embed.setTimestamp(message.createdTimestamp);
        
        // Possible_Error_1
        if(text.length > 5800) return message.reply({ embeds: [unknownError_Embed] });

        

        // Final_Execution ================================================== >>>>>
        const jokes_Embed = new Discord.EmbedBuilder();
        jokes_Embed.setTitle(`${cmndEmoji[0]}${config.tls}${cmndName}`);
        jokes_Embed.setDescription(`${text}`);
        jokes_Embed.setColor(`${cmndColour[0]}`);
        jokes_Embed.setFooter({ text: message.author.username, iconURL: message.author.avatarURL({ dynamic: true }) });
        jokes_Embed.setTimestamp(message.createdTimestamp);

        return message.reply({ embeds: [jokes_Embed] });
    }
});