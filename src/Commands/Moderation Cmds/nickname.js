const Command = require("../../Structures/Command.js");
const Discord = require("discord.js");
const config = require("../../Data/config.json");
const aubdycad = require("../../Data/aubdycad.json");
const emojis = require("../../Data/emojis.json");
const pictures = require("../../Data/pictures.json");
const keys = require("../../Data/keys.json");

const ms = require("ms");
const nick_T_DB = require("../../Schemas/nick_T_DB.js");
const nick_N_DB = require("../../Schemas/nick_N_DB.js");


module.exports = new Command({
    name: "nickname",
    description: "Set, reset or request a new nickname with this command.",
    aliases: ["nick"],
    permission: "SendMessages",
    allowedChannels: [`${aubdycad.ModCmds_C_ID}`, `${aubdycad.BotCommands1_C_ID}`, `${aubdycad.BotCommands2_C_ID}`],
    allowedServers: [`${config.TestServer_ID}`, `${config.Aubdycad_ID}`, `${config.XytiusServer_ID}`],
    cooldown: "",
    usage: `${config.prefix}nickname <name>  ::  ${config.prefix}nickname <set> <member_mention / member_id> | <nickname> | <reason>  ::  ${config.prefix}nickname <reset> <member_mention / member_id> | <reason>`,
    usageDesc: `Do not confuse with the command's description. The command (generally) is for everyone who wants to request a new nickname change for this server. And for that, you only need to use the command with the name you want (as your new nickname). The request will be then processed. For any normal user, the command's use ends up here for them.\n\nOther than this, anyone who is eligible for, can also toggle anyone's nickname (need special permission for that) using this same command, like setting up a new nickname or resetting user's name to default. This can be done by giving special queries like "set" & "reset", specifying the user, and providing a valid reason.`,
    usageExample: [`${config.prefix}nickname GumpyTooth`, `${config.prefix}nickname Poggy`, `${config.prefix}nickname set @RandomGuy#0001 | SussyBaka | Lost a bet from a Moderator.`, `${config.prefix}nickname reset 886291251119419432 | Won a bet from a Moderator.`],
    forTesting: false,
    HUCat: [`gen`, `general`],

    async run(message, args, client) {
        const cmndName = `Nickname`;
        const cmndEmoji = [`📛`, `👍`, `🏷`];
        const cmndColour = [`9400d3`, `00bf00`, `fdcb58`];
        const cmndError = `${config.err_emoji}${config.tls}Nickname : Command Error!!`;
        const cmndMarker = `${config.marker}`;

        /*
        ----------------------------------------------------------------------------------------------------
        Start
        ----------------------------------------------------------------------------------------------------
        */
        const target = message.mentions.users.first();
        const alphabet = isNaN(args[2]);
        const chosenNick = args.slice(1).join(" ");

        const Admin_Perm = message.member.permissions.has("ADMINISTRATOR");

        const ServerBooster_Role = message.member.roles.cache.get(`${aubdycad.ServerBooster_R_ID}`);
        const Lvl20_Role = message.member.roles.cache.get(`${aubdycad.Lvl20_R_ID}`);

        const PublicModLogs_Chnl = message.guild.channels.cache.get(`${aubdycad.PublicModLogs_C_ID}`);
        const Nicknames_Chnl = message.guild.channels.cache.get(`${aubdycad.Nicknames_C_ID}`);


        /*
        ----------------------------------------------------------------------------------------------------
        Error Handling
        ----------------------------------------------------------------------------------------------------
        */
        const noArgument_Embed = new Discord.MessageEmbed();
        noArgument_Embed.setTitle(`${cmndError}`);
        noArgument_Embed.setColor(`${config.err_hex}`);
        noArgument_Embed.setDescription(`You didn't provided me any name you want to request or any option to proceed with this command. Please either provide a name for the request or any options for this command.`);
        noArgument_Embed.setFooter({ text: message.author.username, iconURL: message.author.avatarURL({ dynamic: true }) });
        noArgument_Embed.setTimestamp(message.createdTimestamp);
        
        // Possible_Error_1
        if(!args[1]) return message.reply({ embeds: [noArgument_Embed] });


        /*
        ----------------------------------------------------------------------------------------------------
        Functions
        ----------------------------------------------------------------------------------------------------
        */
        function logMessage(option, memb, changedName, method, reason, logChannel) {
            const m_ = cmndMarker;

            const logMessage_Embed = new Discord.MessageEmbed();
            logMessage_Embed.setTitle(`${cmndEmoji[0]}${config.tls}${cmndName} Toggled (${option})`);
            logMessage_Embed.setDescription(`${m_}**User :** ${memb}, ${memb.user.tag}\n${m_}**User id :** ${memb.user.id}\n${m_}**Toggled to :** ${changedName}\n${m_}**Action by :** ${message.author}, ${message.author.tag}\n${m_}**Method :** ${method}\n${m_}**From :** ${message.channel} channel\n${m_}**Reason :** ${reason}`);
            logMessage_Embed.setColor(`${cmndColour[0]}`);
            logMessage_Embed.setThumbnail(memb.user.avatarURL({ dynamic: true }));
            logMessage_Embed.setFooter({ text: client.user.username, iconURL: client.user.avatarURL({ dynamic: true }) });
            logMessage_Embed.setTimestamp(message.createdTimestamp);


            if(message.guild.id === `${config.Aubdycad_ID}`) {
                return logChannel.send({ content: `${memb}`, embeds: [logMessage_Embed] });
            } else {
                return message.channel.send({ content: `${memb}`, embeds: [logMessage_Embed] });
            }
        };


        function msToTime(duration) {
            let totalSeconds = (duration / 1000);
            
            let days = Math.floor(totalSeconds / 86400);
            totalSeconds %= 86400;
            let hours = Math.floor(totalSeconds / 3600);
            totalSeconds %= 3600;
            let minutes = Math.floor(totalSeconds / 60);
            let seconds = Math.floor(totalSeconds % 60);
        
            let daysText = (days === 1 || days === 0 || days === -1) ? `day` : `days`;
            let hoursText = (hours === 1 || hours === 0 || hours === -1) ? `hour` : `hours`;
            let minutesText = (minutes === 1 || minutes === 0 || minutes === -1) ? `minute` : `minutes`;
            let secondsText = (seconds === 1 || seconds === 0 || seconds === -1) ? `second` : `seconds`;
            
            return `${days} ${daysText}, ${hours} ${hoursText}, ${minutes} ${minutesText}, ${seconds} ${secondsText}`;
        }


        async function requestNickname(expiryTime) {
            nick_T_DB.findOne({ MemberID: message.author.id }).then((foundData) => {
                if (foundData) {
                    const remainingTime = msToTime(foundData.Time - Date.now());

                    const cooldownError_Embed = new Discord.MessageEmbed();
                    cooldownError_Embed.setTitle(`${cmndError}`);
                    cooldownError_Embed.setColor(`${config.err_hex}`);
                    cooldownError_Embed.setDescription(`Hold on!! You've already used this command once within your time limit. You can only use this command to request a new nickname when your cooldown period is over.`);
                    cooldownError_Embed.addFields({
                        name: `${cmndMarker}Time left untill next usage :`,
                        value: `\`\`\`${remainingTime}\`\`\``,
                        inline: false
                    });
                    cooldownError_Embed.setFooter({ text: message.author.username, iconURL: message.author.avatarURL({ dynamic: true }) });
                    cooldownError_Embed.setTimestamp(message.createdTimestamp);

                    // Possible_Error_9
                    return message.reply({ embeds: [cooldownError_Embed] });
                } else {
                    nick_T_DB.create({
                        GuildID: message.guild.id,
                        MemberID: message.author.id,
                        MessageID: message.id,
                        Time: expiryTime
                    }).then(() => {
                        const m_ = cmndMarker;
                        const currentNick = message.member.nickname === null ? `*None*` : `${message.member.nickname}`;

                        const nameRequest_Embed = new Discord.MessageEmbed();
                        nameRequest_Embed.setTitle(`${cmndEmoji[2]}${config.tls}New Request`);
                        nameRequest_Embed.setDescription(`${m_}**Requested nickname :** ${chosenNick}\n${m_}**Current nickname :** ${currentNick}\n${m_}**User :** ${message.author}, ${message.author.tag}\n${m_}**User id :** ${message.author.id}\n${m_}**Status :** Pending 🟡`);
                        nameRequest_Embed.setColor(`${cmndColour[2]}`);
                        nameRequest_Embed.setThumbnail(message.author.avatarURL({ dynamic: true }));

                        const nameRequest_Buttons = new Discord.MessageActionRow().addComponents(
                            new Discord.MessageButton()
                                .setCustomId(`nick_accept`)
                                .setLabel(`Accept`)
                                .setStyle("SUCCESS"),

                            new Discord.MessageButton()
                                .setCustomId(`nick_reject`)
                                .setLabel(`Reject`)
                                .setStyle("DANGER")
                        );


                        Nicknames_Chnl.send({ embeds: [nameRequest_Embed], components: [nameRequest_Buttons] }).then((requestsentMsg) => {
                            const requestSubmitted_Embed = new Discord.MessageEmbed();
                            requestSubmitted_Embed.setTitle(`${cmndEmoji[0]}${config.tls}${cmndName} Request Submitted`);
                            requestSubmitted_Embed.setDescription(`Your request for changing your nickname to "**${chosenNick}**", is posted in ${Nicknames_Chnl} channel. You can track it's status there. Your nickname will be instantly changed once it's accepted by a staff member. Be patient, thank you!!`);
                            requestSubmitted_Embed.setColor(`${cmndColour[0]}`);
                            requestSubmitted_Embed.setFooter({ text: message.author.username, iconURL: message.author.avatarURL({ dynamic: true }) });
                            requestSubmitted_Embed.setTimestamp(message.createdTimestamp);

                            message.reply({ embeds: [requestSubmitted_Embed] });


                            return nick_N_DB.create({
                                GuildID: message.guild.id,
                                MemberID: message.author.id,
                                MessageID: requestsentMsg.id,
                                ChosenName: chosenNick,
                            });
                        });
                    });
                }
            });
        }


        /*
        ----------------------------------------------------------------------------------------------------
        Execution
        ----------------------------------------------------------------------------------------------------
        */
        if(args[1] === `set` || args[1] === `reset`) {
            // Error_Handling ================================================== >>>>>
            const notvalidPerm_Embed = new Discord.MessageEmbed();
            notvalidPerm_Embed.setTitle(`${cmndError}`);
            notvalidPerm_Embed.setColor(`${config.err_hex}`);
            notvalidPerm_Embed.setDescription(`Sorry, you cannot use this sub-command as you're not eligible for it. Only Admins of this server can do that.`);
            notvalidPerm_Embed.setFooter({ text: message.author.username, iconURL: message.author.avatarURL({ dynamic: true }) });
            notvalidPerm_Embed.setTimestamp(message.createdTimestamp);
            
            // Possible_Error_2
            if(!Admin_Perm) return message.reply({ embeds: [notvalidPerm_Embed] });

            
            const noMemberSelected_Embed = new Discord.MessageEmbed();
            noMemberSelected_Embed.setTitle(`${cmndError}`);
            noMemberSelected_Embed.setColor(`${config.err_hex}`);
            noMemberSelected_Embed.setDescription(`You didn't mentioned whose nickname you wanna change. Please mention a member or provide a member's id, to change nickname for them.`);
            noMemberSelected_Embed.setFooter({ text: message.author.username, iconURL: message.author.avatarURL({ dynamic: true }) });
            noMemberSelected_Embed.setTimestamp(message.createdTimestamp);
            
            // Possible_Error_3
            if(!args[2]) return message.reply({ embeds: [noMemberSelected_Embed] });



            let chosenMember;
            let userSelectionMethod;

            const invalidID_Embed = new Discord.MessageEmbed();
            invalidID_Embed.setTitle(`${cmndError}`);
            invalidID_Embed.setColor(`${config.err_hex}`);
            invalidID_Embed.setDescription(`The member's query you just provided me is wrong. Please provide me a valid ID / mention of the member who is in this server.`);
            invalidID_Embed.setFooter({ text: message.author.username, iconURL: message.author.avatarURL({ dynamic: true }) });
            invalidID_Embed.setTimestamp(message.createdTimestamp);

            if(target && args[2].startsWith("<@")) {
                const firstSect = args[2].slice(2);
                const secSect = firstSect.split("");
                secSect.splice(-1);
                chosenMember = message.guild.members.cache.get(`${secSect.join("")}`);
                userSelectionMethod = `By Mention`;

                // Possible_Error_4
                if (chosenMember === null || chosenMember === undefined) return message.reply({ embeds: [invalidID_Embed] });
            } else if(!alphabet) {
                chosenMember = message.guild.members.cache.get(`${args[2]}`);
                userSelectionMethod = `By Id`;

                // Possible_Error_4
                if (chosenMember === null || chosenMember === undefined) return message.reply({ embeds: [invalidID_Embed] });
            }


            const notManageableUser_Embed = new Discord.MessageEmbed();
            notManageableUser_Embed.setTitle(`${cmndError}`);
            notManageableUser_Embed.setColor(`${config.err_hex}`);
            notManageableUser_Embed.setDescription(`The user's nickname you're trying to change is above you, and hence I can't change nickname of that user.`);
            notManageableUser_Embed.setFooter({ text: message.author.username, iconURL: message.author.avatarURL({ dynamic: true }) });
            notManageableUser_Embed.setTimestamp(message.createdTimestamp);

            // Possible_Error_5
            if(!chosenMember.manageable) return message.reply({ embeds: [notManageableUser_Embed] });



            const msgContent = `${message.content}`;
            const breaker = "|";
            const splitted = msgContent.split(` ${breaker} `);
            const set_nickName = splitted[1];
            const set_reason = splitted[2];
            const reset_reason = splitted[1];


            if(args[1] === `set`) {
                const noNicknameGiven_Embed = new Discord.MessageEmbed();
                noNicknameGiven_Embed.setTitle(`${cmndError}`);
                noNicknameGiven_Embed.setColor(`${config.err_hex}`);
                noNicknameGiven_Embed.setDescription(`You just forgot to provide me a nickname you want to set for that user. Please provide me a name to set for them.`);
                noNicknameGiven_Embed.setFooter({ text: message.author.username, iconURL: message.author.avatarURL({ dynamic: true }) });
                noNicknameGiven_Embed.setTimestamp(message.createdTimestamp);

                // Possible_Error_6
                if (!set_nickName) return message.reply({ embeds: [noNicknameGiven_Embed] });


                const invalidNickname_Embed = new Discord.MessageEmbed();
                invalidNickname_Embed.setTitle(`${cmndError}`);
                invalidNickname_Embed.setColor(`${config.err_hex}`);
                invalidNickname_Embed.setDescription(`The nickname you chose, is invalid. A nickname cannot be of leass than 2 or greater than 32 characters. Please choose something else.`);
                invalidNickname_Embed.setFooter({ text: message.author.username, iconURL: message.author.avatarURL({ dynamic: true }) });
                invalidNickname_Embed.setTimestamp(message.createdTimestamp);

                // Possible_Error_7
                if(set_nickName.length >= 32) return message.reply({ embeds: [invalidNickname_Embed] });

                // Possible_Error_8
                if(set_nickName.length <= 2) return message.reply({ embeds: [invalidNickname_Embed] });


                const noReasonGiven_Embed = new Discord.MessageEmbed();
                noReasonGiven_Embed.setTitle(`${cmndError}`);
                noReasonGiven_Embed.setColor(`${config.err_hex}`);
                noReasonGiven_Embed.setDescription(`You just forgot to provide me the reason why you're changing their nickname. Please provide me a valid reason for why you're doing this.`);
                noReasonGiven_Embed.setFooter({ text: message.author.username, iconURL: message.author.avatarURL({ dynamic: true }) });
                noReasonGiven_Embed.setTimestamp(message.createdTimestamp);

                // Possible_Error_9
                if (!set_reason) return message.reply({ embeds: [noReasonGiven_Embed] });
            } else if(args[1] === `reset`) {
                const noReasonGiven_Embed = new Discord.MessageEmbed();
                noReasonGiven_Embed.setTitle(`${cmndError}`);
                noReasonGiven_Embed.setColor(`${config.err_hex}`);
                noReasonGiven_Embed.setDescription(`You just forgot to provide me the reason why you're changing their nickname. Please provide me a valid reason for why you're doing this.`);
                noReasonGiven_Embed.setFooter({ text: message.author.username, iconURL: message.author.avatarURL({ dynamic: true }) });
                noReasonGiven_Embed.setTimestamp(message.createdTimestamp);

                // Possible_Error_6
                if (!reset_reason) return message.reply({ embeds: [noReasonGiven_Embed] });
            }


            if(message.guild.id === `${config.Aubdycad_ID}`) {
                const specifiedChannelNotExist_Embed = new Discord.MessageEmbed();
                specifiedChannelNotExist_Embed.setTitle(`${cmndError}`);
                specifiedChannelNotExist_Embed.setColor(`${config.err_hex}`);
                specifiedChannelNotExist_Embed.setDescription(`Sorry, I cannot proceed further, as I cannot find the specified channel for logging. Please make sure that it is available in the server before trying the command.`);
                specifiedChannelNotExist_Embed.setFooter({ text: message.author.username, iconURL: message.author.avatarURL({ dynamic: true }) });
                specifiedChannelNotExist_Embed.setTimestamp(message.createdTimestamp);
                
                // Possible_Error_10
                if(PublicModLogs_Chnl === undefined || PublicModLogs_Chnl === null) return message.reply({ embeds: [specifiedChannelNotExist_Embed] });


                const botChnlPerms = PublicModLogs_Chnl.permissionsFor(client.user, true).toArray();
                const neededBotChnlPerms = [`VIEW_CHANNEL`, `SEND_MESSAGES`, `USE_EXTERNAL_EMOJIS`];


                const specifiedPermsNotExist_Embed = new Discord.MessageEmbed();
                specifiedPermsNotExist_Embed.setTitle(`${cmndError}`);
                specifiedPermsNotExist_Embed.setColor(`${config.err_hex}`);
                specifiedPermsNotExist_Embed.setDescription(`I cannot proceed further as I'm lacking necessary permissions. I need **${neededBotChnlPerms.join(", ")}** permissions for ${PublicModLogs_Chnl} channel to proceed to the next step.`);
                specifiedPermsNotExist_Embed.setFooter({ text: message.author.username, iconURL: message.author.avatarURL({ dynamic: true }) });
                specifiedPermsNotExist_Embed.setTimestamp(message.createdTimestamp);
                
                // Possible_Error_11
                if(!(
                    botChnlPerms.includes(`${neededBotChnlPerms[0]}`)
                    && botChnlPerms.includes(`${neededBotChnlPerms[1]}`)
                    && botChnlPerms.includes(`${neededBotChnlPerms[2]}`)
                )) return message.reply({ embeds: [specifiedPermsNotExist_Embed] });
            }



            // Execution ================================================== >>>>>
            const done_Embed = new Discord.MessageEmbed();
            done_Embed.setTitle(`${cmndEmoji[1]}${config.tls}Done`);
            done_Embed.setColor(`${cmndColour[1]}`);


            if(args[1] === `set`) {
                chosenMember.setNickname(`${set_nickName}`, `${set_reason}`);

                message.delete().catch();
                message.channel.send({ embeds: [done_Embed] }).then((msg) => {
                    setTimeout(() => {
                        msg.delete();
                    }, 1000 * 3);
                });

                return logMessage(`Set`, chosenMember, set_nickName, userSelectionMethod, set_reason, PublicModLogs_Chnl);
            } else if(args[1] === `reset`) {
                chosenMember.setNickname(null, `${reset_reason}`);

                message.delete().catch();
                message.channel.send({ embeds: [done_Embed] }).then((msg) => {
                    setTimeout(() => {
                        msg.delete();
                    }, 1000 * 3);
                });

                return logMessage(`Reset`, chosenMember, `*default*`, userSelectionMethod, reset_reason, PublicModLogs_Chnl);
            }
        } else {
            // Error_Handling ================================================== >>>>>
            const notInOtherServers_Embed = new Discord.MessageEmbed();
            notInOtherServers_Embed.setTitle(`${cmndError}`);
            notInOtherServers_Embed.setColor(`${config.err_hex}`);
            notInOtherServers_Embed.setDescription(`Sorry, you cannot use this command here in this server, as the command is limited to only a specified server.`);
            notInOtherServers_Embed.setFooter({ text: message.author.username, iconURL: message.author.avatarURL({ dynamic: true }) });
            notInOtherServers_Embed.setTimestamp(message.createdTimestamp);
            
            // Possible_Error_2
            if(message.guild.id !== `${config.Aubdycad_ID}`) return message.reply({ embeds: [notInOtherServers_Embed] });


            const notEligible_Embed = new Discord.MessageEmbed();
            notEligible_Embed.setTitle(`${cmndError}`);
            notEligible_Embed.setColor(`${config.err_hex}`);
            notEligible_Embed.setDescription(`Sorry, you cannot use this command as you're not eligible for this. You can only use this command if you're an **ADMIN**, or a **SERVER BOOSTER**, or if you're **ON** or **ABOVE LEVEL-20** in this server.`);
            notEligible_Embed.setFooter({ text: message.author.username, iconURL: message.author.avatarURL({ dynamic: true }) });
            notEligible_Embed.setTimestamp(message.createdTimestamp);
            
            // Possible_Error_3
            if(
                !Admin_Perm &&
                !ServerBooster_Role &&
                !Lvl20_Role
            ) return message.reply({ embeds: [notEligible_Embed] });


            const notAdmins_Embed = new Discord.MessageEmbed();
            notAdmins_Embed.setTitle(`${cmndError}`);
            notAdmins_Embed.setColor(`${config.err_hex}`);
            notAdmins_Embed.setDescription(`Stop teasing me 😑!! I know you can change your nickname by yourself and you definately don't need to request for a nickname.`);
            notAdmins_Embed.setFooter({ text: message.author.username, iconURL: message.author.avatarURL({ dynamic: true }) });
            notAdmins_Embed.setTimestamp(message.createdTimestamp);
            
            // Possible_Error_4
            if(Admin_Perm) return message.reply({ embeds: [notAdmins_Embed] });


            const invalidChosenName_Embed = new Discord.MessageEmbed();
            invalidChosenName_Embed.setTitle(`${cmndError}`);
            invalidChosenName_Embed.setColor(`${config.err_hex}`);
            invalidChosenName_Embed.setDescription(`The nickname you chose, is invalid. A nickname cannot be of leass than 2 or greater than 32 characters. Please choose something else.`);
            invalidChosenName_Embed.setFooter({ text: message.author.username, iconURL: message.author.avatarURL({ dynamic: true }) });
            invalidChosenName_Embed.setTimestamp(message.createdTimestamp);
            
            // Possible_Error_5
            if(chosenNick.length >= 32) return message.reply({ embeds: [invalidChosenName_Embed] });

            // Possible_Error_6
            if(chosenNick.length <= 2) return message.reply({ embeds: [invalidChosenName_Embed] });


            const specifiedChannelNotExist_Embed = new Discord.MessageEmbed();
            specifiedChannelNotExist_Embed.setTitle(`${cmndError}`);
            specifiedChannelNotExist_Embed.setColor(`${config.err_hex}`);
            specifiedChannelNotExist_Embed.setDescription(`Error with **CHANNEL**!! There was a problem in making connection with your request. The error is informed to the Admin and it'll be hopefully resolved soon, but if it doesn't, then you can also report this issue individually. Please be patient and try again later.`);
            specifiedChannelNotExist_Embed.setFooter({ text: message.author.username, iconURL: message.author.avatarURL({ dynamic: true }) });
            specifiedChannelNotExist_Embed.setTimestamp(message.createdTimestamp);

            // Possible_Error_7
            if (Nicknames_Chnl === undefined || Nicknames_Chnl === null) return message.reply({ content: `<@${message.guild.ownerId}>`, embeds: [specifiedChannelNotExist_Embed] });


            const botChnlPerms = Nicknames_Chnl.permissionsFor(client.user, true).toArray();
            const neededBotChnlPerms = [`VIEW_CHANNEL`, `SEND_MESSAGES`, `USE_EXTERNAL_EMOJIS`];


            const specifiedPermsNotExist_Embed = new Discord.MessageEmbed();
            specifiedPermsNotExist_Embed.setTitle(`${cmndError}`);
            specifiedPermsNotExist_Embed.setColor(`${config.err_hex}`);
            specifiedPermsNotExist_Embed.setDescription(`Error with **PERMISSIONS**!! There was a problem in making connection with your request. The error is informed to the Admin and it'll be hopefully resolved soon, but if it doesn't, then you can also report this issue individually. Please be patient and try again later.`);
            specifiedPermsNotExist_Embed.setFooter({ text: message.author.username, iconURL: message.author.avatarURL({ dynamic: true }) });
            specifiedPermsNotExist_Embed.setTimestamp(message.createdTimestamp);

            // Possible_Error_8
            if (!(
                botChnlPerms.includes(`${neededBotChnlPerms[0]}`)
                && botChnlPerms.includes(`${neededBotChnlPerms[1]}`)
                && botChnlPerms.includes(`${neededBotChnlPerms[2]}`)
            )) return message.reply({ content: `<@${message.guild.ownerId}>`, embeds: [specifiedPermsNotExist_Embed] });



            // Execution ================================================== >>>>>
            const SB_Cooldown = ms("6 hrs");
            const SB_ExpireTime = Date.now() + SB_Cooldown;

            const NSB_Cooldown = ms("48 hrs");
            const NSB_ExpireTime = Date.now() + NSB_Cooldown;


            if (ServerBooster_Role) {
                return await requestNickname(SB_ExpireTime);
            } else {
                return await requestNickname(NSB_ExpireTime);
            }
        }
    }
});