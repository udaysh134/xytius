const Discord = require("discord.js");
const config = require("../../Data/config.json");

const moment = require("moment");
const afk_DB = require("../../Schemas/afk_DB");


module.exports = async (client, message) => {
    if(message.author.bot) return;

    /*
    ----------------------------------------------------------------------------------------------------
    Start
    ----------------------------------------------------------------------------------------------------
    */
    const marker = `${config.marker}`;


    /*
    ----------------------------------------------------------------------------------------------------
    Execution
    ----------------------------------------------------------------------------------------------------
    */
    await afk_DB.findOne({
        GuildID: `${message.guild.id}`,
        UserID: `${message.author.id}`,
    }).then((foundData) => {
        if(foundData) {
            const afk_Embed = new Discord.EmbedBuilder();
            afk_Embed.setTitle(`🙁${config.tls}AFK Reset`);
            afk_Embed.setDescription(`\`\`\`${message.author.tag} your afk has been reset again. You activated your afk on ${moment(foundData.Time).format('Do MMM YYYY')}, at ${moment(foundData.Time).format('h:mm a')}.\`\`\``);
            afk_Embed.setColor(`ffa500`);
            afk_Embed.addFields({
                name: `${marker}Reason you gave :`,
                value: `${foundData.Reason}`,
                inline: false
            });

            message.channel.send({ embeds: [afk_Embed] });

            return afk_DB.deleteOne({
                GuildID: `${message.guild.id}`,
                UserID: `${message.author.id}`,
            });
        }
    });



    if(message.mentions.members.size) {
        message.mentions.members.forEach((memb) => {
            afk_DB.findOne({
                GuildID: `${message.guild.id}`,
                UserID: `${memb.id}`,
            }).then(async (foundData) => {
                if(foundData) {
                    const afkInform_Embed = new Discord.EmbedBuilder();
                    afkInform_Embed.setTitle(`✋${config.tls}AFK`);
                    afkInform_Embed.setDescription(`\`\`\`Oh oh, hold on please!! The member you just mentioned ( ${memb.user.tag} ), went AFK on ${moment(foundData.Time).format('Do MMM YYYY')}, at ${moment(foundData.Time).format('h:mm a')}.\`\`\``);
                    afkInform_Embed.setColor(`ffa500`);
                    afkInform_Embed.addFields({
                        name: `${marker}Reason they gave :`,
                        value: `${foundData.Reason}`,
                        inline: false
                    });

                    return message.reply({ content: `${message.author}`, embeds: [afkInform_Embed] });
                }
            });
        });
    }
};