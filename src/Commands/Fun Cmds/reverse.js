const Command = require("../../Structures/Command.js");
const Discord = require("discord.js");
const config = require("../../Data/config.json");
const aubdycad = require("../../Data/aubdycad.json");
const emojis = require("../../Data/emojis.json");
const pictures = require("../../Data/pictures.json");
const keys = require("../../Data/keys.json");


module.exports = new Command({
    name: "reverse",
    description: "Reverses any given text or sentence oppositely.",
    aliases: [],
    permission: "SendMessages",
    allowedChannels: [`${aubdycad.BotCommands1_C_ID}`, `${aubdycad.BotCommands2_C_ID}`],
    allowedServers: [`${config.TestServer_ID}`, `${config.Aubdycad_ID}`, `${config.XytiusServer_ID}`],
    cooldown: "",
    usage: `${config.prefix}reverse <text>`,
    usageDesc: `Provide a text (a word or a sentence) to this command and get result in reverse. Basically, the arrangement of the letters will be from opposite side and is quite hard sometimes to read and understand. This could be actually useful somewhere but, is mostly used for fun.`,
    usageExample: [`${config.prefix}reverse hello`, `${config.prefix}reverse that kitten is so cute.`, `${config.prefix}reverse supmuw laer eht mi`],
    forTesting: false,
    HUCat: [`gen`, `fun`],

    async run(message, args, client) {
        const cmndName = `Reverse`;
        const cmndEmoji = [];
        const cmndColour = [];
        const cmndError = `${config.err_emoji}${config.tls}Reverse : Command Error!!`;
        const cmndMarker = `${config.marker}`;

        /*
        ----------------------------------------------------------------------------------------------------
        Start
        ----------------------------------------------------------------------------------------------------
        */
        const text = args.slice(1).join(" ");


        /*
        ----------------------------------------------------------------------------------------------------
        Error Handling
        ----------------------------------------------------------------------------------------------------
        */
        const noTextError_Embed = new Discord.EmbedBuilder();
        noTextError_Embed.setTitle(`${cmndError}`);
        noTextError_Embed.setColor(`${config.err_hex}`);
        noTextError_Embed.setDescription(`You just forgot to mention the text. Please provide me a word / sentence, so that I can reverse it for you.`);
        noTextError_Embed.setFooter({ text: message.author.username, iconURL: message.author.avatarURL({ dynamic: true }) });
        noTextError_Embed.setTimestamp(message.createdTimestamp);
        
        // Possible_Error_1
        if(!text) return message.reply({ embeds: [noTextError_Embed] });


        /*
        ----------------------------------------------------------------------------------------------------
        Execution
        ----------------------------------------------------------------------------------------------------
        */
        const reversedText = text.split('').reverse().join('');
        return message.reply(`\`\`\`\n${reversedText}\n\`\`\``);
    }
});