const Command = require("../../Structures/Command.js");
const Discord = require("discord.js");
const config = require("../../Data/config.json");
const aubdycad = require("../../Data/aubdycad.json");
const emojis = require("../../Data/emojis.json");
const pictures = require("../../Data/pictures.json");
const keys = require("../../Data/keys.json");


module.exports = new Command({
    name: "vpanel",
    description: "Verification panel for Aubdycad.",
    aliases: [],
    permission: "Administrator",
    allowedChannels: [],
    allowedServers: [`${config.Aubdycad_ID}`],
    cooldown: "",
    usage: `${config.prefix}vpanel`,
    usageDesc: `Verification panel for Aubdycad.`,
    usageExample: [`${config.prefix}vpanel`],
    forTesting: false,
    HUCat: [`admin`],

    async run(message, args, client) {
        const cmndName = `Verification`;
        const cmndEmoji = [`🔒`];
        const cmndColour = [`ffac33`];
        const cmndError = `${config.err_emoji}${config.tls}V-Panel : Command Error!!`;
        const cmndMarker = `${config.marker}`;

        /*
        ----------------------------------------------------------------------------------------------------
        Start
        ----------------------------------------------------------------------------------------------------
        */
        const Verification_Chnl = message.guild.channels.cache.get(`${aubdycad.Verification_C_ID}`);
        const image = pictures.panels.verification;


        /*
        ----------------------------------------------------------------------------------------------------
        Embeds
        ----------------------------------------------------------------------------------------------------
        */
        const verificationPanel_Embed = new Discord.EmbedBuilder();
        verificationPanel_Embed.setTitle(`${cmndEmoji[0]}${config.tls}${cmndName}`);
        verificationPanel_Embed.setDescription(`Kindly choose any one "Mode of Verification" from the dropdown menu below. Verification is must for everyone to get membership of this server. Apologies, if this is annoying for you but this is it, just for the security of the Server. The process hardly takes a minute.`);
        verificationPanel_Embed.setColor(`${cmndColour[0]}`);
        verificationPanel_Embed.setImage(image);
        verificationPanel_Embed.setFooter({ text: `Thanks for your patience! Welcome to the server!`, iconURL: client.user.displayAvatarURL({ dynamic: true }) });

        const verification_Buttons = new Discord.ActionRowBuilder().addComponents(
            new Discord.SelectMenuBuilder()
            .setCustomId(`vpanel_dropdown`)
            .setPlaceholder("Choose a mode of Verification")
            .addOptions([
                {
                    label: "Captcha",
                    value: "vpanel_captcha",
                    description: "Verification by a Captcha Code.",
                    emoji: "🧩"
                }, {
                    label: "Maths",
                    value: "vpanel_maths",
                    description: "Verification by a basic Maths question.",
                    emoji: "🔢"
                }
            ])
        );


        /*
        ----------------------------------------------------------------------------------------------------
        Error Handling
        ----------------------------------------------------------------------------------------------------
        */
        const notValidChannel_Embed = new Discord.EmbedBuilder();
        notValidChannel_Embed.setTitle(`${cmndError}`);
        notValidChannel_Embed.setColor(`${config.err_hex}`);
        notValidChannel_Embed.setDescription(`Sorry, you cannot deploy this panel in this channel. Please use this command in ${Verification_Chnl} channel only.`);
        notValidChannel_Embed.setFooter({ text: message.author.username, iconURL: message.author.displayAvatarURL({ dynamic: true }) });
        notValidChannel_Embed.setTimestamp(message.createdTimestamp);
        
        // Possible_Error_1
        if(message.channel.id !== `${aubdycad.Verification_C_ID}`) return message.reply({ embeds: [notValidChannel_Embed] });


        /*
        ----------------------------------------------------------------------------------------------------
        Execution
        ----------------------------------------------------------------------------------------------------
        */
        message.delete().catch();
        return message.channel.send({ embeds: [verificationPanel_Embed], components: [verification_Buttons] });
    }
});