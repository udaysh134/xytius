const Discord = require("discord.js");
const config = require("../../Data/config.json");
const aubdycad = require("../../Data/aubdycad.json");

const moment = require("moment");


module.exports = (client, message) => {
    /*
    ----------------------------------------------------------------------------------------------------
    Start
    ----------------------------------------------------------------------------------------------------
    */
    const Aubdycad_Server = client.guilds.cache.get(`${config.Aubdycad_ID}`);
    const DMLogs_Chnl = Aubdycad_Server.channels.cache.get(`${aubdycad.DMLogs_C_ID}`);

    const evntEmoji = `📲`;
    const evntColour = `55acee`;
    const marker = `${config.marker}`;


    /*
    ----------------------------------------------------------------------------------------------------
    Execution
    ----------------------------------------------------------------------------------------------------
    */
    if(message.channel.type === Discord.ChannelType.DM) {
        const dmRecieved_Embed = new Discord.EmbedBuilder();
        dmRecieved_Embed.setTitle(`${evntEmoji}${config.tls}DM Recieved`);
        dmRecieved_Embed.setDescription(`${marker}**Sender :** ${message.author}, ${message.author.tag}\n${marker}**Sender's id :** ${message.author.id}\n${marker}**Time :** ${moment(message.createdTimestamp).format('ddd, Do MMM YYYY')} at ${moment(message.createdTimestamp).format('h:mm:ss a')}\n${marker}**Content :** ${message.content}`);
        dmRecieved_Embed.setColor(`${evntColour}`);
        dmRecieved_Embed.setThumbnail(message.author.avatarURL({ dynamic: true }));
        dmRecieved_Embed.setFooter({ text: message.author.username, iconURL: message.author.avatarURL({ dynamic: true }) });
        dmRecieved_Embed.setTimestamp(message.createdTimestamp);

        DMLogs_Chnl.send({ embeds: [dmRecieved_Embed] });
    }
};