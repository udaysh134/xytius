const Command = require("../../Structures/Command.js");
const Discord = require("discord.js");
const config = require("../../Data/config.json");
const aubdycad = require("../../Data/aubdycad.json");
const emojis = require("../../Data/emojis.json");
const pictures = require("../../Data/pictures.json");
const keys = require("../../Data/keys.json");


module.exports = new Command({
    name: "tpanel",
    description: "Ticket panel for Aubdycad.",
    aliases: [],
    permission: "Administrator",
    allowedChannels: [],
    allowedServers: [`${config.Aubdycad_ID}`],
    cooldown: "",
    usage: `${config.prefix}tpanel`,
    usageDesc: `Ticket panel for Aubdycad.`,
    usageExample: [`${config.prefix}tpanel`],
    forTesting: false,
    HUCat: [`admin`],

    async run(message, args, client) {
        const cmndName = `Ticket`;
        const cmndEmoji = [`🎟`];
        const cmndColour = [`ea596e`];
        const cmndError = `${config.err_emoji}${config.tls}T-Panel : Command Error!!`;
        const cmndMarker = `${config.marker}`;

        /*
        ----------------------------------------------------------------------------------------------------
        Start
        ----------------------------------------------------------------------------------------------------
        */
        const Ticket_Chnl = message.guild.channels.cache.get(`${aubdycad.Ticket_C_ID}`);
        const image = pictures.panels.ticket;


        /*
        ----------------------------------------------------------------------------------------------------
        Embeds
        ----------------------------------------------------------------------------------------------------
        */
        const ticketPanel_Embed = new Discord.EmbedBuilder();
        ticketPanel_Embed.setTitle(`${cmndEmoji[0]}${config.tls}${cmndName}`);
        ticketPanel_Embed.setDescription(`To privately contact staff of this server for any kind of support or so, create a ticket by simply clicking on the button given below. Your ticket is yours only and nobody can see it, except you and the staff of this server.`);
        ticketPanel_Embed.setColor(`${cmndColour[0]}`);
        ticketPanel_Embed.setImage(image);
        ticketPanel_Embed.setFooter({ text: `Avoid creating ticket unnecessarily for no reason.`, iconURL: client.user.avatarURL({ dynamic: true }) });

        const ticket_Buttons = new Discord.ActionRowBuilder().addComponents(
            new Discord.ButtonBuilder()
            .setCustomId(`tpanel_createTicket`)
            .setLabel(`Create a ticket`)
            .setStyle(Discord.ButtonStyle.Secondary),
        
            new Discord.ButtonBuilder()
            .setCustomId(`tpanel_report`)
            .setLabel(`Report an issue`)
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
        notValidChannel_Embed.setDescription(`Sorry, you cannot deploy this panel in this channel. Please use this command in ${Ticket_Chnl} channel only.`);
        notValidChannel_Embed.setFooter({ text: message.author.username, iconURL: message.author.avatarURL({ dynamic: true }) });
        notValidChannel_Embed.setTimestamp(message.createdTimestamp);
        
        // Possible_Error_1
        if(message.channel.id !== `${aubdycad.Ticket_C_ID}`) return message.reply({ embeds: [notValidChannel_Embed] });


        /*
        ----------------------------------------------------------------------------------------------------
        Execution
        ----------------------------------------------------------------------------------------------------
        */
        message.delete().catch();
        return message.channel.send({ embeds: [ticketPanel_Embed], components: [ticket_Buttons] });
    }
});