const Command = require("../../Structures/Command.js");
const Discord = require("discord.js");
const config = require("../../Data/config.json");
const aubdycad = require("../../Data/aubdycad.json");
const emojis = require("../../Data/emojis.json");
const pictures = require("../../Data/pictures.json");
const keys = require("../../Data/keys.json");


module.exports = new Command({
    name: "decode",
    description: "Decode binary number(s) into readable text.",
    aliases: [],
    permission: "SendMessages",
    allowedChannels: [`${aubdycad.BotCommands1_C_ID}`, `${aubdycad.BotCommands2_C_ID}`],
    allowedServers: [`${config.TestServer_ID}`, `${config.Aubdycad_ID}`, `${config.XytiusServer_ID}`],
    cooldown: "",
    usage: `${config.prefix}decode <binary_numbers>`,
    usageDesc: `The command is converse of "encode" command, which was used to encode any text into binary numbers. This is used to decode binary numbers into readable texts. If you don't know what to decode, first go try encode command, you'll get the answer.`,
    usageExample: [`${config.prefix}decode 1001000 1101001`, `${config.prefix}decode 1001000 1100101 1101100 1101100 1101111 100001`],
    forTesting: false,
    HUCat: [`gen`, `fun`],

    async run(message, args, client) {
        const cmndName = `Decode`;
        const cmndEmoji = [];
        const cmndColour = [];
        const cmndError = `${config.err_emoji}${config.tls}Decode : Command Error!!`;
        const cmndMarker = `${config.marker}`;

        /*
        ----------------------------------------------------------------------------------------------------
        Start
        ----------------------------------------------------------------------------------------------------
        */
        const numbers = args.slice(1).join(" ");


        /*
        ----------------------------------------------------------------------------------------------------
        Error Handling
        ----------------------------------------------------------------------------------------------------
        */
        const noNumberError_Embed = new Discord.EmbedBuilder();
        noNumberError_Embed.setTitle(`${cmndError}`);
        noNumberError_Embed.setColor(`${config.err_hex}`);
        noNumberError_Embed.setDescription(`You just forgot to provide me the numbers, to convert into readable text. Please provide your binary numbers (looks something like \`1011101\`).`);
        noNumberError_Embed.setFooter({ text: message.author.username, iconURL: message.author.avatarURL({ dynamic: true }) });
        noNumberError_Embed.setTimestamp(message.createdTimestamp);
        
        // Possible_Error_1
        if(!numbers) return message.reply({ embeds: [noNumberError_Embed] });


        /*
        ----------------------------------------------------------------------------------------------------
        Functions
        ----------------------------------------------------------------------------------------------------
        */
        async function binaryToString(nums) {
            let binArr = nums.split(" ");
            let response = ``;

            for (let i = 0; i < binArr.length; i++) {
                let codes = parseInt(binArr[i], 2);
                response += `${String.fromCharCode(codes)}`;
            }

            return response;
        }


        /*
        ----------------------------------------------------------------------------------------------------
        Execution
        ----------------------------------------------------------------------------------------------------
        */
        const result = await binaryToString(numbers);

        return message.reply(`\`\`\`js\n${result}\n\`\`\``);
    }
});