const Command = require("../../Structures/Command.js");
const Discord = require("discord.js");
const config = require("../../Data/config.json");
const aubdycad = require("../../Data/aubdycad.json");
const emojis = require("../../Data/emojis.json");
const pictures = require("../../Data/pictures.json");
const keys = require("../../Data/keys.json");

const FUNC_callNinjaAPI = require("../../Systems/External Functions/FUNC_callNinjaAPI.js");


module.exports = new Command({
    name: "facts",
    description: "Gives you some real facts.",
    aliases: ["fact"],
    permission: "SendMessages",
    allowedChannels: [`${aubdycad.BotCommands1_C_ID}`, `${aubdycad.BotCommands2_C_ID}`],
    allowedServers: [`${config.TestServer_ID}`, `${config.Aubdycad_ID}`, `${config.XytiusServer_ID}`],
    cooldown: "",
    usage: `${config.prefix}facts`,
    usageDesc: `As name says, the command gives you some real facts (to be specific, 5 facts at a time). As the output is not set to be 'one fact at one usage', its recommended not to use the command excessively (or just for fun) or you can get a long hold from using this command.`,
    usageExample: [`${config.prefix}facts`],
    forTesting: false,
    HUCat: [`gen`, `functional`],

    async run(message, args, client) {
        const cmndName = `Facts`;
        const cmndEmoji = [`☑`];
        const cmndColour = [`226699`];
        const cmndError = `${config.err_emoji}${config.tls}Facts : Command Error`;
        const cmndMarker = `🔹 `;

        /*
        ----------------------------------------------------------------------------------------------------
        Start
        ----------------------------------------------------------------------------------------------------
        */
        const limit = 5;
        const link = `${keys.api_ninjas.links.facts}${limit}`;

        const res = await FUNC_callNinjaAPI(`${link}`, cmndError, message);


        /*
        ----------------------------------------------------------------------------------------------------
        Execution
        ----------------------------------------------------------------------------------------------------
        */
        let text = ``;

        res.forEach((elem) => {
            let theFact = (elem.fact).endsWith(".") ? `${elem.fact}` : `${elem.fact}.`;
            text += `${cmndMarker}${theFact}\n\n`;
        });

        

        // Final_Execution ================================================== >>>>>
        const facts_Embed = new Discord.EmbedBuilder();
        facts_Embed.setTitle(`${cmndEmoji[0]}${config.tls}${cmndName}`);
        facts_Embed.setDescription(`${text}`);
        facts_Embed.setColor(`${cmndColour[0]}`);
        facts_Embed.setFooter({ text: message.author.username, iconURL: message.author.avatarURL({ dynamic: true }) });
        facts_Embed.setTimestamp(message.createdTimestamp);

        return message.reply({ embeds: [facts_Embed] });
    }
});