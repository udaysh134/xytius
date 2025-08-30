const Command = require("../../Structures/Command.js");
const Discord = require("discord.js");
const config = require("../../Data/config.json");
const aubdycad = require("../../Data/aubdycad.json");
const emojis = require("../../Data/emojis.json");
const pictures = require("../../Data/pictures.json");
const keys = require("../../Data/keys.json");

const ms = require("ms");


module.exports = new Command({
    name: "timeout",
    description: "A command to toggle timeout of a member in the server.",
    aliases: ["tmo"],
    permission: "SendMessages",
    allowedChannels: [`${aubdycad.ModCmds_C_ID}`],
    allowedServers: [`${config.TestServer_ID}`, `${config.Aubdycad_ID}`, `${config.XytiusServer_ID}`],
    cooldown: "",
    usage: `${config.prefix}timeout <add> <member_mention / member_id> | <time_period> | <reason>  ::  ${config.prefix}timeout <remove> <member_mention / member_id> | <reason>`,
    usageDesc: `Use this command to add/remove timeout from a member. Adding a timeout requires a time period value (for how long timeout to work) while using the command, with the reason after it. Removing doesn't require any time, but does require a valid reason. Both of these can work either with mention or with the id of the user, for whom the command is used. Query for time in command, in numbers is considered as value in milli-seconds. To provide values in "seconds", "minutes" or "hours", either use these words or simply use their short forms like "10s", "5m" or "2h" respectively.\n\n**NOTE :** Time doesn't pile up on previous timeout if it exists. A new timeout as a new time period will be applied if the command is used for the user who's already having a timeout.`,
    usageExample: [`${config.prefix}timeout add @RandomGuy#0001 | 10 minutes | Spamming tons of emojis for no reason.`, `${config.prefix}timeout remove 886291251119419432 | User has realised his mistake.`, `${config.prefix}timeout add @RandomGuy#0001 | 2h | Misbehaving with new comers.`],
    forTesting: false,
    HUCat: [`mod`],

    async run(message, args, client) {
        const cmndName = `Timeout`;
        const cmndEmoji = [`🔕`, `👍`];
        const cmndColour = [`000000`, `ffffff`, `00bf00`];
        const cmndError = `${config.err_emoji}${config.tls}Timeout : Command Error!!`;
        const cmndMarker = `${config.marker}`;

        /*
        ----------------------------------------------------------------------------------------------------
        Start
        ----------------------------------------------------------------------------------------------------
        */
        const Admin_Perm = message.member.permissions.has("ADMINISTRATOR");

        const Moderator_Role = message.member.roles.cache.get(`${aubdycad.Moderator_R_ID}`);

        const option = args[1].toLowerCase();
        const target = message.mentions.users.first();
        const alphabet = isNaN(args[2]);

        const PublicModLogs_Chnl = message.guild.channels.cache.get(`${aubdycad.PublicModLogs_C_ID}`);


        /*
        ----------------------------------------------------------------------------------------------------
        Embeds
        ----------------------------------------------------------------------------------------------------
        */
        const done_Embed = new Discord.MessageEmbed();
        done_Embed.setTitle(`${cmndEmoji[1]}${config.tls}Done`);
        done_Embed.setColor(`${cmndColour[2]}`);


        /*
        ----------------------------------------------------------------------------------------------------
        Error Handling
        ----------------------------------------------------------------------------------------------------
        */
        if(message.guild.id === `${config.Aubdycad_ID}`) {
            const notEligible_Embed = new Discord.MessageEmbed();
            notEligible_Embed.setTitle(`${cmndError}`);
            notEligible_Embed.setColor(`${config.err_hex}`);
            notEligible_Embed.setDescription(`Sorry, you cannot use this command as you're not eligible for this. Only **Admins** and **Moderators** can use this command.`);
            notEligible_Embed.setFooter({ text: message.author.username, iconURL: message.author.avatarURL({ dynamic: true }) });
            notEligible_Embed.setTimestamp(message.createdTimestamp);
            
            // Possible_Error_1
            if(
                !Admin_Perm &&
                !Moderator_Role
            ) return message.reply({ embeds: [notEligible_Embed] });
        } else {
            const notEligible_Embed = new Discord.MessageEmbed();
            notEligible_Embed.setTitle(`${cmndError}`);
            notEligible_Embed.setColor(`${config.err_hex}`);
            notEligible_Embed.setDescription(`Sorry, you cannot use this command as you're not eligible for this. Only **Admins** can use this command.`);
            notEligible_Embed.setFooter({ text: message.author.username, iconURL: message.author.avatarURL({ dynamic: true }) });
            notEligible_Embed.setTimestamp(message.createdTimestamp);
            
            // Possible_Error_1
            if(!Admin_Perm) return message.reply({ embeds: [notEligible_Embed] });
        }


        const noOptionChosen_Embed = new Discord.MessageEmbed();
        noOptionChosen_Embed.setTitle(`${cmndError}`);
        noOptionChosen_Embed.setColor(`${config.err_hex}`);
        noOptionChosen_Embed.setDescription(`You just forgot to choose an option for this command, I cannot proceed without it. Use "\`${config.prefix}usage\`" command for this command to get more details on it.`);
        noOptionChosen_Embed.setFooter({ text: message.author.username, iconURL: message.author.avatarURL({ dynamic: true }) });
        noOptionChosen_Embed.setTimestamp(message.createdTimestamp);
        
        // Possible_Error_2
        if(!option) return message.reply({ embeds: [noOptionChosen_Embed] });


        /*
        ----------------------------------------------------------------------------------------------------
        Functions
        ----------------------------------------------------------------------------------------------------
        */
        function msToTime(duration) {
            let totalSeconds = (duration / 1000);
            
            let days = Math.floor(totalSeconds / 86400);
            totalSeconds %= 86400;
            let hours = Math.floor(totalSeconds / 3600);
            totalSeconds %= 3600;
            let minutes = Math.floor(totalSeconds / 60);
            let seconds = Math.floor(totalSeconds % 60);
        
            let daysText = (days === 1 || days === 0 || days === -1) ? `d` : `d`;
            let hoursText = (hours === 1 || hours === 0 || hours === -1) ? `h` : `h`;
            let minutesText = (minutes === 1 || minutes === 0 || minutes === -1) ? `m` : `m`;
            let secondsText = (seconds === 1 || seconds === 0 || seconds === -1) ? `s` : `s`;
            
            return `${days}${daysText} ${hours}${hoursText} ${minutes}${minutesText} ${seconds}${secondsText}`;
        }


        async function timeoutProcess(chnl) {
            const invalidOption_Embed = new Discord.MessageEmbed();
            invalidOption_Embed.setTitle(`${cmndError}`);
            invalidOption_Embed.setColor(`${config.err_hex}`);
            invalidOption_Embed.setDescription(`The option you gave is invalid as that option doesn't exist. Choose a valid option to proceed further. Use "\`${config.prefix}usage\`" command for this command to get more details on it.`);
            invalidOption_Embed.setFooter({ text: message.author.username, iconURL: message.author.avatarURL({ dynamic: true }) });
            invalidOption_Embed.setTimestamp(message.createdTimestamp);

            // Possible_Error_5
            if (option !== `add` && option !== `remove`) return message.reply({ embeds: [invalidOption_Embed] });


            let catchedUser;
            let userSelectionMethod;

            const notValidMember_Embed = new Discord.MessageEmbed();
            notValidMember_Embed.setTitle(`${cmndError}`);
            notValidMember_Embed.setColor(`${config.err_hex}`);
            notValidMember_Embed.setDescription(`The user you selected is invalid. Please either mention a user from this server or provide a valid id of a user of this server.`);
            notValidMember_Embed.setFooter({ text: message.author.username, iconURL: message.author.avatarURL({ dynamic: true }) });
            notValidMember_Embed.setTimestamp(message.createdTimestamp);


            if (!args[2]) {
                const noUserSelected_Embed = new Discord.MessageEmbed();
                noUserSelected_Embed.setTitle(`${cmndError}`);
                noUserSelected_Embed.setColor(`${config.err_hex}`);
                noUserSelected_Embed.setDescription(`You just forgot to mention a member to proceed with time out function. Please either provide me their id or their mention to proceed further.`);
                noUserSelected_Embed.setFooter({ text: message.author.username, iconURL: message.author.avatarURL({ dynamic: true }) });
                noUserSelected_Embed.setTimestamp(message.createdTimestamp);

                // Possible_Error_6
                return message.reply({ embeds: [noUserSelected_Embed] });
            } else if (target && args[2].startsWith("<@")) {
                const firstSect = args[2].slice(2);
                const secSect = firstSect.split("");
                secSect.splice(-1);

                catchedUser = message.guild.members.cache.get(`${secSect.join("")}`);
                userSelectionMethod = `By Mention`;

                // Possible_Error_7
                if (catchedUser === null || catchedUser === undefined) return message.reply({ embeds: [notValidMember_Embed] });
            } else if (!alphabet) {
                catchedUser = message.guild.members.cache.get(`${args[2]}`);
                userSelectionMethod = `By Id`;

                // Possible_Error_8
                if (catchedUser === null || catchedUser === undefined) return message.reply({ embeds: [notValidMember_Embed] });
            } else {
                // Possible_Error_9
                return message.reply({ embeds: [notValidMember_Embed] });
            }



            const calledMember = catchedUser;
            const callingMethod = userSelectionMethod;

            const msgContent = `${message.content}`;
            
            const breaker = "|";
            const splitted = msgContent.split(` ${breaker} `);
            const a_time = splitted[1];
            const a_reason = splitted[2];
            const r_reason = splitted[1];
            


            // Execution ================================================== >>>>>
            if(option === `add`) {
                const notManageableUser_Embed = new Discord.MessageEmbed();
                notManageableUser_Embed.setTitle(`${cmndError}`);
                notManageableUser_Embed.setColor(`${config.err_hex}`);
                notManageableUser_Embed.setDescription(`The user you're trying to use timeout on, is above you and hence I can't proceed further. I guess, even you can get timeout after them seeing this message.\nJust saying... 🙄 👉 👈`);
                notManageableUser_Embed.setFooter({ text: message.author.username, iconURL: message.author.avatarURL({ dynamic: true }) });
                notManageableUser_Embed.setTimestamp(message.createdTimestamp);

                // Possible_Error_10
                if (!calledMember.manageable || calledMember.id === client.user.id) return message.reply({ embeds: [notManageableUser_Embed] });


                const notYourself_Embed = new Discord.MessageEmbed();
                notYourself_Embed.setTitle(`${cmndError}`);
                notYourself_Embed.setColor(`${config.err_hex}`);
                notYourself_Embed.setDescription(`Are you alright dude? You wanna use timeout functions on yourself? Sorry, I can't do this for you. You can ask your Admin for that, if you really wanna go further.`);
                notYourself_Embed.setFooter({ text: message.author.username, iconURL: message.author.avatarURL({ dynamic: true }) });
                notYourself_Embed.setTimestamp(message.createdTimestamp);

                // Possible_Error_11
                if (calledMember.id === message.author.id) return message.reply({ embeds: [notYourself_Embed] });


                const timeNotProvided_Embed = new Discord.MessageEmbed();
                timeNotProvided_Embed.setTitle(`${cmndError}`);
                timeNotProvided_Embed.setColor(`${config.err_hex}`);
                timeNotProvided_Embed.setDescription(`You just forgot to mention me the time period for how long this timeout will last. Please provide me a valid value. Use "\`${config.prefix}usage\`" command for this command to get more details on it.`);
                timeNotProvided_Embed.setFooter({ text: message.author.username, iconURL: message.author.avatarURL({ dynamic: true }) });
                timeNotProvided_Embed.setTimestamp(message.createdTimestamp);
                
                // Possible_Error_12
                if(!a_time) return message.reply({ embeds: [timeNotProvided_Embed] });


                const processedTime = ms(`${a_time}`);


                const invalidProcessedTime_Embed = new Discord.MessageEmbed();
                invalidProcessedTime_Embed.setTitle(`${cmndError}`);
                invalidProcessedTime_Embed.setColor(`${config.err_hex}`);
                invalidProcessedTime_Embed.setDescription(`The value for time, you gave me is invalid. Please provide a valid value for how long you wanna add timeout on this member. Use "\`${config.prefix}usage\`" command for this command to get more details on it.`);
                invalidProcessedTime_Embed.setFooter({ text: message.author.username, iconURL: message.author.avatarURL({ dynamic: true }) });
                invalidProcessedTime_Embed.setTimestamp(message.createdTimestamp);
                
                // Possible_Error_13
                if(!processedTime) return message.reply({ embeds: [invalidProcessedTime_Embed] });


                const timeOutOfLimit_Embed = new Discord.MessageEmbed();
                timeOutOfLimit_Embed.setTitle(`${cmndError}`);
                timeOutOfLimit_Embed.setColor(`${config.err_hex}`);
                timeOutOfLimit_Embed.setDescription(`The time period you choosed for timeout, is out of the limit. Please choose a valid value for time, from between 5 seconds to 29 days.`);
                timeOutOfLimit_Embed.setFooter({ text: message.author.username, iconURL: message.author.avatarURL({ dynamic: true }) });
                timeOutOfLimit_Embed.setTimestamp(message.createdTimestamp);
                
                // Possible_Error_14
                if(processedTime >= ms(`29d`) || processedTime <= 5000) return message.reply({ embeds: [timeOutOfLimit_Embed] });


                const noReasonGiven_Embed = new Discord.MessageEmbed();
                noReasonGiven_Embed.setTitle(`${cmndError}`);
                noReasonGiven_Embed.setColor(`${config.err_hex}`);
                noReasonGiven_Embed.setDescription(`You just forgot to provide me a reason. Please provide me a valid reason for why you're adding a timeout on this member.`);
                noReasonGiven_Embed.setFooter({ text: message.author.username, iconURL: message.author.avatarURL({ dynamic: true }) });
                noReasonGiven_Embed.setTimestamp(message.createdTimestamp);
                
                // Possible_Error_15
                if(!a_reason) return message.reply({ embeds: [noReasonGiven_Embed] });



                // Secondary_Execution ================================================== >>>>>
                const m_ = cmndMarker;
                const formattedTime = msToTime(processedTime);

                const timeoutAdded_Embed = new Discord.MessageEmbed();
                timeoutAdded_Embed.setTitle(`${cmndEmoji[0]}${config.tls}${cmndName} (Added)`);
                timeoutAdded_Embed.setDescription(`${m_}**User :** ${calledMember}, ${calledMember.user.tag}\n${m_}**User id :** ${calledMember.user.id}\n${m_}**Action by :** ${message.author}, ${message.author.tag}\n${m_}**Method :** ${callingMethod}\n${m_}**From:** ${message.channel} channel\n${m_}**For time period :** ${formattedTime}\n${m_}**Reason :** ${a_reason}`);
                timeoutAdded_Embed.setColor(`${cmndColour[0]}`);
                timeoutAdded_Embed.setThumbnail(calledMember.user.avatarURL({ dynamic: true }));
                timeoutAdded_Embed.setFooter({ text: client.user.username, iconURL: client.user.avatarURL({ dynamic: true }) });
                timeoutAdded_Embed.setTimestamp(message.createdTimestamp);



                // Final_Execution ================================================== >>>>>
                message.delete().catch();
                message.channel.send({ embeds: [done_Embed] }).then((msg) => {
                    setTimeout(() => {
                        msg.delete();
                    }, 1000 * 3);
                });

                calledMember.timeout(processedTime, a_reason);

                chnl.send({ content: `${calledMember}`, embeds: [timeoutAdded_Embed] });
            } else if(option === `remove`) {
                const notManageableUser_Embed = new Discord.MessageEmbed();
                notManageableUser_Embed.setTitle(`${cmndError}`);
                notManageableUser_Embed.setColor(`${config.err_hex}`);
                notManageableUser_Embed.setDescription(`The user you're trying to use timeout on, is above you and hence I can't proceed further. I guess, even you can get timeout after them seeing this message.\nJust saying... 🙄 👉 👈`);
                notManageableUser_Embed.setFooter({ text: message.author.username, iconURL: message.author.avatarURL({ dynamic: true }) });
                notManageableUser_Embed.setTimestamp(message.createdTimestamp);

                // Possible_Error_10
                if (!calledMember.manageable || calledMember.id === client.user.id) return message.reply({ embeds: [notManageableUser_Embed] });


                const notYourself_Embed = new Discord.MessageEmbed();
                notYourself_Embed.setTitle(`${cmndError}`);
                notYourself_Embed.setColor(`${config.err_hex}`);
                notYourself_Embed.setDescription(`Are you alright dude? You wanna use timeout functions on yourself? Sorry, I can't do this for you. You can ask your Admin for that, if you really wanna go further.`);
                notYourself_Embed.setFooter({ text: message.author.username, iconURL: message.author.avatarURL({ dynamic: true }) });
                notYourself_Embed.setTimestamp(message.createdTimestamp);

                // Possible_Error_11
                if (calledMember.id === message.author.id) return message.reply({ embeds: [notYourself_Embed] });


                const noReasonGiven_Embed = new Discord.MessageEmbed();
                noReasonGiven_Embed.setTitle(`${cmndError}`);
                noReasonGiven_Embed.setColor(`${config.err_hex}`);
                noReasonGiven_Embed.setDescription(`You just forgot to provide me a reason. Please provide me a valid reason for why you're removing the timeout from this member.`);
                noReasonGiven_Embed.setFooter({ text: message.author.username, iconURL: message.author.avatarURL({ dynamic: true }) });
                noReasonGiven_Embed.setTimestamp(message.createdTimestamp);
                
                // Possible_Error_12
                if(!r_reason) return message.reply({ embeds: [noReasonGiven_Embed] });



                // Secondary_Execution ================================================== >>>>>
                const m_ = cmndMarker;

                const timeoutRemoved_Embed = new Discord.MessageEmbed();
                timeoutRemoved_Embed.setTitle(`${cmndEmoji[0]}${config.tls}${cmndName} (Removed)`);
                timeoutRemoved_Embed.setDescription(`${m_}**User :** ${calledMember}, ${calledMember.user.tag}\n${m_}**User id :** ${calledMember.user.id}\n${m_}**Action by :** ${message.author}, ${message.author.tag}\n${m_}**Method :** ${callingMethod}\n${m_}**From:** ${message.channel} channel\n${m_}**Reason :** ${r_reason}`);
                timeoutRemoved_Embed.setColor(`${cmndColour[1]}`);
                timeoutRemoved_Embed.setThumbnail(calledMember.user.avatarURL({ dynamic: true }));
                timeoutRemoved_Embed.setFooter({ text: client.user.username, iconURL: client.user.avatarURL({ dynamic: true }) });
                timeoutRemoved_Embed.setTimestamp(message.createdTimestamp);



                // Final_Execution ================================================== >>>>>
                message.delete().catch();
                message.channel.send({ embeds: [done_Embed] }).then((msg) => {
                    setTimeout(() => {
                        msg.delete();
                    }, 1000 * 3);
                });

                calledMember.timeout(null, r_reason);

                chnl.send({ content: `${calledMember}`, embeds: [timeoutRemoved_Embed] });
            }
        }


        /*
        ----------------------------------------------------------------------------------------------------
        Execution
        ----------------------------------------------------------------------------------------------------
        */
        if (message.guild.id === `${config.Aubdycad_ID}`) {
            const noChannel_Embed = new Discord.MessageEmbed();
            noChannel_Embed.setTitle(`${cmndError}`);
            noChannel_Embed.setColor(`${config.err_hex}`);
            noChannel_Embed.setDescription(`I cannot find the specified channel to work with. And hence, I cannot proceed further with this command.`);
            noChannel_Embed.setFooter({ text: message.author.username, iconURL: message.author.avatarURL({ dynamic: true }) });
            noChannel_Embed.setTimestamp(message.createdTimestamp);

            // Possible_Error_3
            if (PublicModLogs_Chnl === undefined || PublicModLogs_Chnl === null) return message.reply({ embeds: [noChannel_Embed] });


            const botChnlPerms = PublicModLogs_Chnl.permissionsFor(client.user, true).toArray();
            const neededBotChnlPerms = [`VIEW_CHANNEL`, `SEND_MESSAGES`, `USE_EXTERNAL_EMOJIS`];


            const notHavingPerms_Embed = new Discord.MessageEmbed();
            notHavingPerms_Embed.setTitle(`${cmndError}`);
            notHavingPerms_Embed.setColor(`${config.err_hex}`);
            notHavingPerms_Embed.setDescription(`I cannot proceed further as I'm lacking necessary permissions. I need **${neededBotChnlPerms.join(", ")}** permissions for ${PublicModLogs_Chnl} channel to proceed to the next step.`);
            notHavingPerms_Embed.setFooter({ text: message.author.username, iconURL: message.author.avatarURL({ dynamic: true }) });
            notHavingPerms_Embed.setTimestamp(message.createdTimestamp);

            // Possible_Error_4
            if (!(
                botChnlPerms.includes(`${neededBotChnlPerms[0]}`)
                && botChnlPerms.includes(`${neededBotChnlPerms[1]}`)
                && botChnlPerms.includes(`${neededBotChnlPerms[2]}`)
            )) return message.reply({ embeds: [notHavingPerms_Embed] });



            // Final_Execution ================================================== >>>>>
            return await timeoutProcess(PublicModLogs_Chnl);
        } else {
            // Final_Execution ================================================== >>>>>
            return await timeoutProcess(message.channel);
        }
    }
});