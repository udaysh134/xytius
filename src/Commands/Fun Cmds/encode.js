const Command = require("../../Structures/Command.js");
const Discord = require("discord.js");
const config = require("../../Data/config.json");
const aubdycad = require("../../Data/aubdycad.json");
const emojis = require("../../Data/emojis.json");
const pictures = require("../../Data/pictures.json");
const keys = require("../../Data/keys.json");


module.exports = new Command({
    name: "encode",
    description: "Encode any readable text into binary numbers.",
    aliases: [],
    permission: "SendMessages",
    allowedChannels: [`${aubdycad.BotCommands1_C_ID}`, `${aubdycad.BotCommands2_C_ID}`],
    allowedServers: [`${config.TestServer_ID}`, `${config.Aubdycad_ID}`, `${config.XytiusServer_ID}`],
    cooldown: "",
    usage: `${config.prefix}encode <text>`,
    usageDesc: `Converse of "decode", you can use this command to encode any text into binary numbers which aren't generally interpreted by anyone. And yes, you can do that with your own or any other language.\n\nOne thing to keep in mind is that, one single letter is 6 numbers in binary, so there's a limit in the size of the sentence you provide. And that too, is only because of Discord's character limit. Basically don't try to encode long sentences.`,
    usageExample: [`${config.prefix}encode Hello!!`, `${config.prefix}encode Today, I saw Xytius in my dream.`],
    forTesting: false,
    HUCat: [`gen`, `fun`],

    async run(message, args, client) {
        const cmndName = `Encode`;
        const cmndEmoji = [];
        const cmndColour = [];
        const cmndError = `${config.err_emoji}${config.tls}Encode : Command Error!!`;
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
        noTextError_Embed.setDescription(`You just forgot to provide me the text, to convert into binary numbers. Please provide your word(s) or a sentence.`);
        noTextError_Embed.setFooter({ text: message.author.username, iconURL: message.author.avatarURL({ dynamic: true }) });
        noTextError_Embed.setTimestamp(message.createdTimestamp);
        
        // Possible_Error_1
        if(!text) return message.reply({ embeds: [noTextError_Embed] });


        const maxLengthAchieved_Embed = new Discord.EmbedBuilder();
        maxLengthAchieved_Embed.setTitle(`${cmndError}`);
        maxLengthAchieved_Embed.setColor(`${config.err_hex}`);
        maxLengthAchieved_Embed.setDescription(`Sorry, you cannot exceed 250 characters at once for this command. The result is too long in accordance with Discord's message limit.`);
        maxLengthAchieved_Embed.setFooter({ text: message.author.username, iconURL: message.author.avatarURL({ dynamic: true }) });
        maxLengthAchieved_Embed.setTimestamp(message.createdTimestamp);
        
        // Possible_Error_2
        if(text.length > 250) return message.reply({ embeds: [maxLengthAchieved_Embed] });


        /*
        ----------------------------------------------------------------------------------------------------
        Functions
        ----------------------------------------------------------------------------------------------------
        */
        async function stringToBinary(str) {
            let contentArr = str.split("");
            let response = ``;

            contentArr.forEach((elem) => {
                response += `${elem.charCodeAt().toString(2)} `;
            });

            return response;
        }


        /*
        ----------------------------------------------------------------------------------------------------
        Execution
        ----------------------------------------------------------------------------------------------------
        */
        const result = await stringToBinary(text);

        return message.reply(`\`\`\`js\n${result}\n\`\`\``);
    }
});