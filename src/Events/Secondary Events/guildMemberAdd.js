const Event = require("../../Structures/Event.js");
const Discord = require("discord.js");
const config = require("../../Data/config.json");
const aubdycad = require("../../Data/aubdycad.json");

const moment = require("moment");
const ms = require("ms");
const fs = require("fs");

const antiJoin_DB = require("../../Schemas/antiJoin_DB.js");
const FUNC_getBadges = require("../../Systems/External Functions/FUNC_getBadges.js");


module.exports = new Event("guildMemberAdd", async (client, member) => {
    /*
    ----------------------------------------------------------------------------------------------------
    Start
    ----------------------------------------------------------------------------------------------------
    */
    const marker = config.marker;
    const invitesArr = [];

    let logChannel;
    let isMemberKicked = ``;

    const DefenseLogs_Chnl = member.guild.channels.cache.get(`${aubdycad.DefenseLogs_C_ID}`);
    const MemberLogs_Chnl = member.guild.channels.cache.get(`${aubdycad.MemberLogs_C_ID}`);

    const TestServer_AntiJoin_Chnl = member.guild.channels.cache.get(`994230548027420722`);
    const XytiusServer_AntiJoin_Chnl = member.guild.channels.cache.get(`968582856869814302`);


    /*
    ----------------------------------------------------------------------------------------------------
    Embeds
    ----------------------------------------------------------------------------------------------------
    */
    const notice_Embed = new Discord.EmbedBuilder();
    notice_Embed.setTitle(`📄${config.tls}Notice from : ${member.guild.name}`);
    notice_Embed.setDescription(`This is to inform you that, you cannot join this server for now. If you're not well aware of it, this message is **not** officially from Discord.\n\nThe server itself is not allowing any user to enter in it. Please do not try to enter in, again and again in a spammy way or you might get a Ban from the server. Try again later after sometime!!`);
    notice_Embed.setColor(`ccd7dd`);
    notice_Embed.setFooter({ text: client.user.username, iconURL: client.user.avatarURL({ dynamic: true }) });
    notice_Embed.setTimestamp();

    const memberLogging_Embed = new Discord.EmbedBuilder();
    memberLogging_Embed.setColor(`77b255`);
    memberLogging_Embed.setThumbnail(member.user.avatarURL({ dynamic: true }));


    /*
    ----------------------------------------------------------------------------------------------------
    Functions
    ----------------------------------------------------------------------------------------------------
    */
    function riskFactor(length) {
        let riskMarker = `⭐`;
        let result = ``;

        for (let i = 0; i < length; i++) {
            result += `${riskMarker} `;
        }

        return result;
    }

    
    function getRisk() {
        const timeGap = Date.now() - member.user.createdAt;

        if (timeGap <= ms("1 hr")) return `🌟 🌟 🌟 🌟 🌟`;
        if (timeGap <= ms("24 hrs") && timeGap >= ms("1 hr")) return riskFactor(5);
        if (timeGap <= ms("7 days") && timeGap >= ms("24 hrs")) return riskFactor(4);
        if (timeGap <= ms("30 days") && timeGap >= ms("7 days")) return riskFactor(3);
        if (timeGap <= ms("180 days") && timeGap >= ms("30 days")) return riskFactor(2);
        if (timeGap <= ms("1 year") && timeGap >= ms("180 days")) return riskFactor(1);
        if (timeGap >= ms("1 year")) return `No Stars`;
    }


    const getInviteCounts = async (theServer) => {
        return await new Promise((resolve) => {
            theServer.invites.fetch().then((fetchedInvites) => {
                const inviteCounter = {}

                fetchedInvites.forEach((invites) => {
                    const theUser = `${invites.inviter.username}#${invites.inviter.discriminator}`;
                    inviteCounter[theUser] = {
                        "id": `${invites.inviter.id}`,
                        "invitesCount": (inviteCounter[theUser[`invitesCount`]] || 0) + invites.uses
                    };
                });

                resolve(inviteCounter);
            });
        });
    }


    /*
    ----------------------------------------------------------------------------------------------------
    Execution
    ----------------------------------------------------------------------------------------------------
    */
    // ANTI_JOIN_CHECK ================================================== >>>>>
    await antiJoin_DB.findOne({ GuildID: member.guild.id }).then((foundData) => {
        if(foundData) {
            isMemberKicked = ` ( Kicked : AJ )`;

            if(member.guild.id === `${config.Aubdycad_ID}`) logChannel = DefenseLogs_Chnl;
            if(member.guild.id === `${config.TestServer_ID}`) logChannel = TestServer_AntiJoin_Chnl;
            if(member.guild.id === `${config.XytiusServer_ID}`) logChannel = XytiusServer_AntiJoin_Chnl;

            member.kick(`Anti-join function was turned "ON" by, ${foundData.UserName}.`);
            member.send({ embeds: [notice_Embed] }).then(() => {
                const defenseLogMsg_Embed = new Discord.EmbedBuilder();
                defenseLogMsg_Embed.setTitle(`⚔️${config.tls}Anti-Join`);
                defenseLogMsg_Embed.setDescription(`${marker}**User :** ${member}, ${member.user.tag}\n${marker}**User id :** ${member.user.id}\n${marker}**Action :** Kicked\n${marker}**Is informed :** Yes\n${marker}**Anti-Join by :** <@${foundData.UserID}>, ${foundData.UserName}\n${marker}**Anti-Join from :** <#${foundData.ChannelID}> channel\n${marker}**Anti-Join on :** ${moment(foundData.Time).format('ddd, Do MMM YYYY, h:mm:ss a')}`);
                defenseLogMsg_Embed.setColor(`99aab4`);
                defenseLogMsg_Embed.setThumbnail(member.user.avatarURL({ dynamic: true }));

                return logChannel.send({ embeds: [defenseLogMsg_Embed] });
            }).catch(() => {
                const defenseLogMsg_Embed = new Discord.EmbedBuilder();
                defenseLogMsg_Embed.setTitle(`⚔️${config.tls}Anti-Join`);
                defenseLogMsg_Embed.setDescription(`${marker}**User :** ${member}, ${member.user.tag}\n${marker}**User id :** ${member.user.id}\n${marker}**Action :** Kicked\n${marker}**Is informed :** No\n${marker}**Anti-Join by :** <@${foundData.UserID}>, ${foundData.UserName}\n${marker}**Anti-Join from :** <#${foundData.ChannelID}> channel\n${marker}**Anti-Join on :** ${moment(foundData.Time).format('ddd, Do MMM YYYY, h:mm:ss a')}`);
                defenseLogMsg_Embed.setColor(`99aab4`);
                defenseLogMsg_Embed.setThumbnail(member.user.avatarURL({ dynamic: true }));

                return logChannel.send({ embeds: [defenseLogMsg_Embed] });
            });
        }
    });
    



    // MEMBER_LOGGING ================================================== >>>>>
    if(member.guild.id !== `${config.Aubdycad_ID}`) return;

    // Getting_Invite ================================================== >>>>>
    try {
        const jsonString = fs.readFileSync("./src/Data/Others/invites.json", "utf-8");
        const parsedData = JSON.parse(jsonString);
        invitesArr.push(parsedData);
    } catch (err) {
        console.log(`Error while reading data!!`, err);
    }


    const allInvites = invitesArr[0];
    const invitesBefore = allInvites[`${member.guild.name} - ${member.guild.id}`];
    const invitesAfter = await getInviteCounts(member.guild);


    for(const inviter in invitesAfter) {
        if(invitesBefore[inviter].invitesCount === invitesAfter[inviter].invitesCount -1) {
            const inviterUser = client.users.cache.get(`${invitesAfter[inviter].id}`);
            const inviterCount = invitesAfter[inviter].invitesCount;

            memberLogging_Embed.setFooter({ text: `Invited by : ${inviterUser.tag}  •  ${inviterCount.toLocaleString()}`, iconURL: inviterUser.avatarURL({ dynamic: true }) });

            allInvites[`${member.guild.name} - ${member.guild.id}`] = invitesAfter;

            fs.writeFile("./src/Data/Others/invites.json", JSON.stringify(allInvites, null, 4), err => {
                if(err) {
                    console.log(`Error while writing data!!`, err);
                }
            });
        }
    }


    // Final_Execution ================================================== >>>>>
    const memberRisk = getRisk();
    const memberCount = (member.guild.memberCount).toLocaleString();
    const memberBadges = (await FUNC_getBadges(member.user, `emoji`)).join("");
    const accountType = member.user.bot === true ? `Bot` : `User`;
    const memberJoiningDate = `${moment(member.joinedAt).format('D-MM-YY, h:mm:ss a')}`;
    const memberCreationDate = `${moment(member.user.createdAt).format('D-MM-YY, h:mm:ss a')}\nAbout ${moment(member.user.createdAt).startOf('seconds').fromNow()}.`;

    memberLogging_Embed.setTitle(`📗${config.tls}New Member!!${isMemberKicked}`);
    memberLogging_Embed.setDescription(`${marker}**Risk factor :**  ${memberRisk}\n${marker}**Member no :** ${memberCount}\n${marker}**Member :** ${member.user}, ${member.user.tag}\n${marker}**Member id :** ${member.user.id}\n${marker}**Badges :** ${memberBadges}\n${marker}**Account type :** ${accountType}\n${marker}**Joined Server on :** ${memberJoiningDate}\n${marker}**Joined Discord on :** ${memberCreationDate}`);
    
    MemberLogs_Chnl.send({ embeds: [memberLogging_Embed] });
});