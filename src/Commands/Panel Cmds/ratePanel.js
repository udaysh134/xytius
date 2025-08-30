const Command = require("../../Structures/Command.js");
const Discord = require("discord.js");
const config = require("../../Data/config.json");
const aubdycad = require("../../Data/aubdycad.json");
const emojis = require("../../Data/emojis.json");
const pictures = require("../../Data/pictures.json");
const keys = require("../../Data/keys.json");


module.exports = new Command({
    name: "ratepanel",
    description: "Rating panel for Aubdycad.",
    aliases: [],
    permission: "Administrator",
    allowedChannels: [],
    allowedServers: [`${config.Aubdycad_ID}`],
    cooldown: "",
    usage: `${config.prefix}ratepanel`,
    usageDesc: `Rating panel for Aubdycad.`,
    usageExample: [`${config.prefix}ratepanel`],
    forTesting: false,
    HUCat: [`admin`],

    async run(message, args, client) {
        const cmndName = `Rate Us`;
        const cmndEmoji = [`⭐`];
        const cmndColour = [`fcaa32`];
        const cmndError = `${config.err_emoji}${config.tls}Rate-Panel : Command Error!!`;
        const cmndMarker = `${config.marker}`;

        /*
        ----------------------------------------------------------------------------------------------------
        Start
        ----------------------------------------------------------------------------------------------------
        */
        const RateUs_Chnl = message.guild.channels.cache.get(`${aubdycad.RateUs_C_ID}`);
        const image = pictures.panels.rating;

        const star = `⭐`;


        /*
        ----------------------------------------------------------------------------------------------------
        Embeds
        ----------------------------------------------------------------------------------------------------
        */
        const ratePanel_Embed = new Discord.EmbedBuilder();
        ratePanel_Embed.setTitle(`${cmndEmoji[0]}${config.tls}${cmndName}`);
        ratePanel_Embed.setDescription(`From the dropdown menu given below, you can choose to rate us and our overall service you got from this server, **Aubdycad** from this private bot, **Xytius**, from this server's **Admin(s)** or **Moderator(s)** and from this community, to whatever ratings you want.\n\nWe're genuinely sorry, if anything from this server was not right for you. But please, don't rate us keeping one or few bad things in your mind (if happened with you). Rate honestly, for the overall experience you recieved from us and from this server.\n\n**NOTE :** You can only rate once in a week, so take your time and give us the rating we actually deserve, according to you!!`);
        ratePanel_Embed.setColor(`${cmndColour[0]}`);
        ratePanel_Embed.setImage(image);
        ratePanel_Embed.setFooter({ text: client.user.tag, iconURL: client.user.avatarURL({ dynamic: true }) });

        const ratings_Buttons = new Discord.MessageActionRow().addComponents(
            new Discord.MessageSelectMenu()
            .setCustomId(`ratings_dropdown`)
            .setPlaceholder("Choose a rating out of 10...")
            .addOptions([
                {
                    label: `1 ${star}`,
                    value: "1_rating",
                }, {
                    label: `2 ${star}`,
                    value: "2_rating",
                }, {
                    label: `3 ${star}`,
                    value: "3_rating",
                }, {
                    label: `4 ${star}`,
                    value: "4_rating",
                }, {
                    label: `5 ${star}`,
                    value: "5_rating",
                }, {
                    label: `6 ${star}`,
                    value: "6_rating",
                }, {
                    label: `7 ${star}`,
                    value: "7_rating",
                }, {
                    label: `8 ${star}`,
                    value: "8_rating",
                }, {
                    label: `9 ${star}`,
                    value: "9_rating",
                }, {
                    label: `10 ${star}`,
                    value: "10_rating",
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
        notValidChannel_Embed.setDescription(`Sorry, you cannot deploy this panel in this channel. Please use this command in ${RateUs_Chnl} channel only.`);
        notValidChannel_Embed.setFooter({ text: message.author.username, iconURL: message.author.avatarURL({ dynamic: true }) });
        notValidChannel_Embed.setTimestamp(message.createdTimestamp);
        
        // Possible_Error_1
        if(message.channel.id !== `${aubdycad.RateUs_C_ID}`) return message.reply({ embeds: [notValidChannel_Embed] });


        /*
        ----------------------------------------------------------------------------------------------------
        Execution
        ----------------------------------------------------------------------------------------------------
        */
        message.delete().catch();
        return message.channel.send({ embeds: [ratePanel_Embed], components: [ratings_Buttons] });
    }
});