const Command = require("../../Structures/Command.js");
const Discord = require("discord.js");
const config = require("../../Data/config.json");
const aubdycad = require("../../Data/aubdycad.json");
const emojis = require("../../Data/emojis.json");
const pictures = require("../../Data/pictures.json");
const keys = require("../../Data/keys.json");

const FUNC_callNinjaAPI = require("../../Systems/External Functions/FUNC_callNinjaAPI.js");


module.exports = new Command({
    name: "antonyms",
    description: "Gets you some antonyms for a valid word, if available.",
    aliases: ["antonym"],
    permission: "SendMessages",
    allowedChannels: [`${aubdycad.BotCommands1_C_ID}`, `${aubdycad.BotCommands2_C_ID}`],
    allowedServers: [`${config.TestServer_ID}`, `${config.Aubdycad_ID}`, `${config.XytiusServer_ID}`],
    cooldown: "",
    usage: `${config.prefix}antonyms <word>`,
    usageDesc: `Use the command to get some antonyms (opposite words) of any given word. Make sure to recheck the spelling of the word you've given (if it shows no results). This could be a reason for the failed result because it is sensitive about spellings. If the word is invalid or if it doesn't even have any opposite word for it, it'll simply give you an error or nothing as a result respectively.`,
    usageExample: [`${config.prefix}antonyms disagree`, `${config.prefix}antonyms slow`, `${config.prefix}antonyms shy`],
    forTesting: false,
    HUCat: [`gen`, `functional`],

    async run(message, args, client) {
        const cmndName = `Antonyms`;
        const cmndEmoji = [`🇦`];
        const cmndColour = [`3b88c3`];
        const cmndError = `${config.err_emoji}${config.tls}Antonyms : Command Error`;
        const cmndMarker = `${config.marker}`;

        /*
        ----------------------------------------------------------------------------------------------------
        Error Handling
        ----------------------------------------------------------------------------------------------------
        */
        const noWordGiven_Embed = new Discord.EmbedBuilder();
        noWordGiven_Embed.setTitle(`${cmndError}`);
        noWordGiven_Embed.setColor(`${config.err_hex}`);
        noWordGiven_Embed.setDescription(`You just forgot to provide me the word you want antonyms for. Please provide me a valid word to get its antonyms.`);
        noWordGiven_Embed.setFooter({ text: message.author.username, iconURL: message.author.avatarURL({ dynamic: true }) });
        noWordGiven_Embed.setTimestamp(message.createdTimestamp);
        
        // Possible_Error_1
        if(!args[1]) return message.reply({ embeds: [noWordGiven_Embed] });


        /*
        ----------------------------------------------------------------------------------------------------
        Functions
        ----------------------------------------------------------------------------------------------------
        */
        function standardiseCase(value) {
            const splitted = value.split('');
            const firstVal = splitted[0].toUpperCase();
            const otherVal = splitted.slice(1).join('');

            let resultValue = `${firstVal}${otherVal.toLowerCase().replace(/_/g, " ")}`;
            return resultValue;
        }


        /*
        ----------------------------------------------------------------------------------------------------
        Execution
        ----------------------------------------------------------------------------------------------------
        */
        const chosenWord = `${args[1].toLowerCase()}`;

        const link = `${keys.api_ninjas.links.thesaurus}${chosenWord}`;
        const res = await FUNC_callNinjaAPI(`${link}`, cmndError, message);



        // Final_Execution ================================================== >>>>>
        const word = `${standardiseCase(`${res.word}`)}`;
        const text = (res.antonyms).length  === 0 ? `No antonyms available for this word!` : `${standardiseCase((res.antonyms).join(", "))}`;

        
        const antonyms_Embed = new Discord.EmbedBuilder();
        antonyms_Embed.setTitle(`${cmndEmoji[0]}${config.tls}${cmndName}`);
        antonyms_Embed.setDescription(`${cmndMarker}**${word} :**\n\`\`\`${text}\`\`\``);
        antonyms_Embed.setColor(`${cmndColour[0]}`);
        antonyms_Embed.setFooter({ text: message.author.username, iconURL: message.author.avatarURL({ dynamic: true }) });
        antonyms_Embed.setTimestamp(message.createdTimestamp);

        return message.reply({ embeds: [antonyms_Embed] });
    }
});