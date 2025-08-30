const Command = require("../../Structures/Command.js");
const Discord = require("discord.js");
const config = require("../../Data/config.json");
const aubdycad = require("../../Data/aubdycad.json");
const emojis = require("../../Data/emojis.json");
const pictures = require("../../Data/pictures.json");
const keys = require("../../Data/keys.json");

const advCal = require("advanced-calculator");


module.exports = new Command({
    name: "calculate",
    description: "An advanced command for doing a hanfull of calculations, even all at once.",
    aliases: ["calc"],
    permission: "SendMessages",
    allowedChannels: [`${aubdycad.BotCommands1_C_ID}`, `${aubdycad.BotCommands2_C_ID}`],
    allowedServers: [`${config.TestServer_ID}`, `${config.Aubdycad_ID}`, `${config.XytiusServer_ID}`],
    cooldown: "",
    usage: `${config.prefix}calculate <question>`,
    usageDesc: `This "calculate" command works similar to as your phone's "Calculator" app. To calculate anything, just write it down in series or in chunks (as you prefer), it will accept your way of giving questions (it just needs to be valid). Giving spaces in between queries is optional.\n\n**NOTE :** For now, the command can accept some specific operators (nothing more than that) in its calculations. Given below is the list of operators you can include in your questions :-\`\`\`\n• sin\n• cos\n• tan\n• ln\n• log\n• sqrt\n• +\n• -\n• *\n• /\n• %\n• ^\n• max\n• min\n• (\n• )\`\`\``,
    usageExample: [`${config.prefix}calculate 789+536+146-46*1516/563`, `${config.prefix}calculate sqrt(16)`, `${config.prefix}calculate tan45`],
    forTesting: false,
    HUCat: [`gen`, `functional`],

    async run(message, args, client) {
        const cmndName = `Calculation`;
        const cmndEmoji = [`🧮`];
        const cmndColour = [`1abc9c`];
        const cmndError = `${config.err_emoji}${config.tls}Calculate : Command Error!!`;
        const cmndMarker = `${config.marker}`;

        /*
        ----------------------------------------------------------------------------------------------------
        Start                                                                   
        ----------------------------------------------------------------------------------------------------
        */
        let operators = [
            `sin`,
            `cos`,
            `tan`,
            `ln`,
            `log`,
            `sqrt`,
            `+`,
            `-`,
            `*`,
            `/`,
            `%`,
            `^`,
            `max`,
            `min`,
            `(`,
            `)`
        ];

        let msgCont = message.content;

        const question = args.slice(1).join(" ");


        /*
        ----------------------------------------------------------------------------------------------------
        Error Handling                                                                   
        ----------------------------------------------------------------------------------------------------
        */
        const noArgs_Embed = new Discord.EmbedBuilder();
        noArgs_Embed.setTitle(`${cmndError}`);
        noArgs_Embed.setColor(`${config.err_hex}`);
        noArgs_Embed.setDescription(`You didn't specified what calculations to do. Use "\`${config.prefix}usage\`" command for this command to get more details on it.`);
        noArgs_Embed.setFooter({ text: message.author.username, iconURL: message.author.avatarURL({ dynamic: true }) });
        noArgs_Embed.setTimestamp(message.createdTimestamp);

        // Possible_Error_1
        if(!args[1]) return message.reply({ embeds: [noArgs_Embed] });


        /*
        ----------------------------------------------------------------------------------------------------
        Functions                                                                   
        ----------------------------------------------------------------------------------------------------
        */
        function mathQuestionEmbed(embed, answer) {
            embed.setTitle(`${cmndEmoji[0]}${config.tls}${cmndName}`);
            embed.setColor(`${cmndColour[0]}`);
            embed.addFields({
                name: `${cmndMarker}Question :`,
                value: `\`\`\`${question}\`\`\``,
                inline: false
            }, {
                name: `${cmndMarker}Result :`,
                value: `\`\`\`${answer.toLocaleString()}\`\`\``,
                inline: false
            });
            embed.setFooter({ text: message.author.username, iconURL: message.author.avatarURL({ dynamic: true }) });
            embed.setTimestamp(message.createdTimestamp);
        }


        /*
        ----------------------------------------------------------------------------------------------------
        Execution                                                                   
        ----------------------------------------------------------------------------------------------------
        */
        const noOtherOperators_Embed = new Discord.EmbedBuilder();
        noOtherOperators_Embed.setTitle(`${cmndError}`);
        noOtherOperators_Embed.setColor(`${config.err_hex}`);
        noOtherOperators_Embed.setDescription(`You used an/some invalid symbol as an operator for your calculation. Please use only specified symbols for calculations, given below :\n\`\`\`${operators.join("\n")}\`\`\``);
        noOtherOperators_Embed.setFooter({ text: message.author.username, iconURL: message.author.avatarURL({ dynamic: true }) });
        noOtherOperators_Embed.setTimestamp(message.createdTimestamp);

        // Possible_Error_2
        if (msgCont.includes("÷") || msgCont.includes("π") || msgCont.includes("√") || msgCont.includes("×")) return message.reply({ embeds: [noOtherOperators_Embed] });


        const result = advCal.evaluate(question) ?? `Error`;


        const invalidInput_Embed = new Discord.EmbedBuilder();
        invalidInput_Embed.setTitle(`${cmndError}`);
        invalidInput_Embed.setColor(`${config.err_hex}`);
        invalidInput_Embed.setDescription(`The query you provided me for calculation, is invalid. Please check and use valid calculation methods for correct result. Use "\`${config.prefix}usage\`" command for this command to get more details on it.`);
        invalidInput_Embed.setFooter({ text: message.author.username, iconURL: message.author.avatarURL({ dynamic: true }) });
        invalidInput_Embed.setTimestamp(message.createdTimestamp);

        // Possible_Error_3
        if (result === `Invalid input`) return message.reply({ embeds: [invalidInput_Embed] });



        // Execution ================================================== >>>>>
        const calculation_Embed = new Discord.EmbedBuilder();
        mathQuestionEmbed(calculation_Embed, result);

        return message.reply({ embeds: [calculation_Embed] });
    }
});