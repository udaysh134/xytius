const Command = require("../../Structures/Command.js");
const Discord = require("discord.js");
const config = require("../../Data/config.json");
const aubdycad = require("../../Data/aubdycad.json");
const emojis = require("../../Data/emojis.json");
const pictures = require("../../Data/pictures.json");
const keys = require("../../Data/keys.json");

const fetch = require("node-fetch");


module.exports = new Command({
    name: "wtd",
    description: "The command gives you ideas to do something and kill time.",
    aliases: [],
    permission: "SendMessages",
    allowedChannels: [`${aubdycad.BotCommands1_C_ID}`, `${aubdycad.BotCommands2_C_ID}`],
    allowedServers: [`${config.TestServer_ID}`, `${config.Aubdycad_ID}`, `${config.XytiusServer_ID}`],
    cooldown: "",
    usage: `${config.prefix}wtd`,
    usageDesc: `Use this command if you wanna do something but you don't know WHAT TO DO. That's what this command is for, "What to do?". The command gives you ideas for some activities you can indulge yourself in, to kill time if you're bored. This also tells you what type of activity that'll be.`,
    usageExample: [`${config.prefix}wtd`],
    forTesting: false,
    HUCat: [`gen`, `fun`],

    async run(message, args, client) {
        const cmndName = `What to do?`;
        const cmndEmoji = [`🤔`];
        const cmndColour = [`ffffff`];
        const cmndError = `${config.err_emoji}${config.tls}WTD : Command Error!!`;
        const cmndMarker = `${config.marker}`;

        /*
        ----------------------------------------------------------------------------------------------------
        Start
        ----------------------------------------------------------------------------------------------------
        */
        const link = keys.wtd.link;
        const result = await fetch(link).then((res) => res.json());

        const activity = (result.activity).toLowerCase();
        const type = (result.type).split("");
        const type_1 = `${type[0].toUpperCase()}`;
        const type_2 = `${type.slice(1).join("")}`;
        const activityType = `${type_1}${type_2}`;


        /*
        ----------------------------------------------------------------------------------------------------
        Execution
        ----------------------------------------------------------------------------------------------------
        */
        const finalResult_Embed = new Discord.EmbedBuilder();
        finalResult_Embed.setTitle(`${cmndEmoji[0]}${config.tls}${cmndName}`);
        finalResult_Embed.setDescription(`You can ${activity}.`);
        finalResult_Embed.setColor(`${cmndColour[0]}`);
        finalResult_Embed.setFooter({ text: `${message.author.username} | Type : ${activityType}`, iconURL: message.author.avatarURL({ dynamic: true }) });

        if(!result.link) {
            return message.reply({ embeds: [finalResult_Embed] });
        } else {
            const wtd_Buttons = new Discord.ActionRowBuilder().addComponents(
                new Discord.ButtonBuilder()
                .setLabel(`Click for more info`)
                .setStyle(Discord.ButtonStyle.Link)
                .setURL(`${result.link}`)
            );

            return message.reply({ embeds: [finalResult_Embed], components: [wtd_Buttons] });
        }
    }
});