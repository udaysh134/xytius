const Event = require("../../Structures/Event.js");
const Discord = require("discord.js");
const config = require("../../Data/config.json");
const aubdycad = require("../../Data/aubdycad.json");

const moment = require("moment");


module.exports = new Event("guildMemberRemove", (client, member) => {
    if(member.guild.id !== `${config.Aubdycad_ID}`) return;

    /*
    ----------------------------------------------------------------------------------------------------
    Start
    ----------------------------------------------------------------------------------------------------
    */
    const marker = config.marker;

    const Aubdycad_Server = client.guilds.cache.get(`${config.Aubdycad_ID}`);

    const MemberLogs_Chnl = member.guild.channels.cache.get(`${aubdycad.MemberLogs_C_ID}`);
    const JoinedAndLeft_Chnl = member.guild.channels.cache.get(`${aubdycad.JoinedAndLeft_C_ID}`);
    
    const accountType = member.user.bot === true ? `Bot` : `User`;
    const joiningDate = `${moment(member.joinedAt).format('D-MM-YY, h:mm:ss a')}\nAbout ${moment(member.joinedAt).startOf('seconds').fromNow()}.`;
    const memberCount = (Aubdycad_Server.memberCount).toLocaleString();


    /*
    ----------------------------------------------------------------------------------------------------
    Embeds
    ----------------------------------------------------------------------------------------------------
    */
    const memberLogging_Embed = new Discord.EmbedBuilder();
    memberLogging_Embed.setTitle(`📕${config.tls}Member Left!!`);
    memberLogging_Embed.setDescription(`${marker}**Current members :** ${memberCount}\n${marker}**Member :** ${member.user}, ${member.user.tag}\n${marker}**Member id :** ${member.user.id}\n${marker}**Account type :** ${accountType}\n${marker}**Joined Server on :** ${joiningDate}`);
    memberLogging_Embed.setColor(`de2e43`);
    memberLogging_Embed.setThumbnail(member.user.avatarURL({ dynamic: true }));

    const joinedAndLeftLogging_Embed = new Discord.EmbedBuilder();
    joinedAndLeftLogging_Embed.setTitle(`🖐️${config.tls}Cya ${member.user.tag}!!`);
    joinedAndLeftLogging_Embed.setDescription(`An Aubdycadian, ${member.user}, just left the server. They joined the server about ${moment(member.joinedAt).startOf('seconds').fromNow()}, on ${moment(member.joinedAt).format('ddd, DD MMM YYYY')}, at ${moment(member.joinedAt).format('h:mm a')}`);
    joinedAndLeftLogging_Embed.setColor(`2f3136`);
    joinedAndLeftLogging_Embed.setThumbnail(member.user.avatarURL({ dynamic: true }));
    joinedAndLeftLogging_Embed.setFooter({ text: `${client.user.username} | Current Members : ${memberCount}`, iconURL: client.user.avatarURL({ dynamic: true }) });


    /*
    ----------------------------------------------------------------------------------------------------
    Execution
    ----------------------------------------------------------------------------------------------------
    */
    MemberLogs_Chnl.send({ embeds: [memberLogging_Embed] });
    JoinedAndLeft_Chnl.send({ embeds: [joinedAndLeftLogging_Embed] });
});