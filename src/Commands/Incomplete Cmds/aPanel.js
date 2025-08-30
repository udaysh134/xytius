const Command = require("../../Structures/Command.js");
const Discord = require("discord.js");
const config = require("../../Data/config.json");
const aubdycad = require("../../Data/aubdycad.json");
const emojis = require("../../Data/emojis.json");
const pictures = require("../../Data/pictures.json");
const keys = require("../../Data/keys.json");


module.exports = new Command({
    name: "apanel",
    description: "Application panel for Aubdycad.",
    aliases: [],
    permission: "Administrator",
    allowedChannels: [],
    allowedServers: [`${config.Aubdycad_ID}`],
    cooldown: "",
    usage: `${config.prefix}apanel`,
    usageDesc: `Application panel for Aubdycad.`,
    usageExample: [`${config.prefix}apanel`],
    forTesting: false,
    HUCat: [`admin`],

    async run(message, args, client) {
        const cmndName = `Application`;
        const cmndEmoji = [`📋`];
        const cmndColour = [`c1694f`];
        const cmndError = `${config.err_emoji}${config.tls}A-Panel : Command Error!!`;
        const cmndMarker = `${config.marker}`;

        /*
        ----------------------------------------------------------------------------------------------------
        Start
        ----------------------------------------------------------------------------------------------------
        */
        const Applications_Chnl = message.guild.channels.cache.get(`${aubdycad.Applications_C_ID}`);
        const image = pictures.panels.application;


        /*
        ----------------------------------------------------------------------------------------------------
        Embeds
        ----------------------------------------------------------------------------------------------------
        */
        const applicationPanel_Embed = new Discord.EmbedBuilder();
        applicationPanel_Embed.setTitle(`${cmndEmoji[0]}${config.tls}${cmndName}`);
        applicationPanel_Embed.setDescription(`To apply for Moderator, click on the button given below. Click on "❔" button for more info.`);
        applicationPanel_Embed.setColor(`${cmndColour[0]}`);
        applicationPanel_Embed.setImage(image);
        applicationPanel_Embed.setFooter({ text: client.user.username, iconURL: client.user.avatarURL({ dynamic: true }) });

        const application_Buttons = new Discord.ActionRowBuilder().addComponents(
            new Discord.ButtonBuilder()
            .setCustomId(`apanel_apply`)
            .setLabel(`Apply for Moderator`)
            .setStyle(Discord.ButtonStyle.Secondary),
        
            new Discord.ButtonBuilder()
            .setCustomId(`apanel_info`)
            .setEmoji(`❔`)
            .setStyle(Discord.ButtonStyle.Primary),

            new Discord.ButtonBuilder()
            .setCustomId(`apanel_toggle`)
            .setEmoji(`🗃`)
            .setStyle(Discord.ButtonStyle.Danger)
        );


        /*
        ----------------------------------------------------------------------------------------------------
        Error Handling
        ----------------------------------------------------------------------------------------------------
        */
        const notValidChannel_Embed = new Discord.EmbedBuilder();
        notValidChannel_Embed.setTitle(`${cmndError}`);
        notValidChannel_Embed.setColor(`${config.err_hex}`);
        notValidChannel_Embed.setDescription(`Sorry, you cannot deploy this panel in this channel. Please use this command in ${Applications_Chnl} channel only.`);
        notValidChannel_Embed.setFooter({ text: message.author.username, iconURL: message.author.avatarURL({ dynamic: true }) });
        notValidChannel_Embed.setTimestamp(message.createdTimestamp);
        
        // Possible_Error_1
        if(message.channel.id !== `${aubdycad.Applications_C_ID}`) return message.reply({ embeds: [notValidChannel_Embed] });


        /*
        ----------------------------------------------------------------------------------------------------
        Execution
        ----------------------------------------------------------------------------------------------------
        */
        message.delete().catch();
        return message.channel.send({ embeds: [applicationPanel_Embed], components: [application_Buttons] });
    }
});