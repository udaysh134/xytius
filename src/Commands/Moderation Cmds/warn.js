const Command = require("../../Structures/Command.js");
const Discord = require("discord.js");
const config = require("../../Data/config.json");
const aubdycad = require("../../Data/aubdycad.json");
const emojis = require("../../Data/emojis.json");
const pictures = require("../../Data/pictures.json");
const keys = require("../../Data/keys.json");


module.exports = new Command({
    name: "warn",
    description: "Warn any misbehaving member before taking harsh actions, using this command.",
    aliases: [],
    permission: "SendMessages",
    allowedChannels: [`${aubdycad.ModCmds_C_ID}`],
    allowedServers: [`${config.Aubdycad_ID}`],
    cooldown: "",
    usage: `${config.prefix}warn <user_mention / user_id> | <warning_description>`,
    usageDesc: `An another easy command!! Just use it, as you do like with other moderation commands like, mentioning the member to warn (can also use their ID) and giving the actual warning. You don't have to put reason for a warning, like other mod commands.\n\nUnlike a normal warn command from other bots, this command works differently. You've to specify your warning statement, like for 'what you're warning the user' and 'what will be the consequences, if not payed attention'.\n\n**NOTE :** No any "number of warns" are going to add up to the user's account. This will be just a warning to the user, for whatever wrong they did.`,
    usageExample: [`${config.prefix}warn @RandomGuy#0001 | You're already previously told, not to post any vicious content, anywhere in the Server. This is your second time you're warned. If you're not able to adhere rules of this server, we can make a step easy for you, by KICKING you out or BANNING you from the server. It's a request and a warning, to not to do again what you did. Thank you!!`, `${config.prefix}warn 886291251119419432 | You're warned for spamming misleading content in the server. If caught anytime, anywhere doing this again, you'll be directly kicked out of the server without any warning. So, better mind it!!`],
    forTesting: false,
    HUCat: [`mod`],

    async run(message, args, client) {
        const cmndName = `Warn`;
        const cmndEmoji = [`⚠`, `👍`, `🔸 `];
        const cmndColour = [`ffcc4d`, `00bf00`];
        const cmndError = `${config.err_emoji}${config.tls}Warn : Command Error!!`;
        const cmndMarker = `${config.marker}`;

        /*
        ----------------------------------------------------------------------------------------------------
        Start
        ----------------------------------------------------------------------------------------------------
        */
        const Admin_Perm = message.member.permissions.has("ADMINISTRATOR");

        const Moderator_Role = message.member.roles.cache.get(`${aubdycad.Moderator_R_ID}`);


        const target = message.mentions.users.first();
        const alphabet = isNaN(args[1]);

        const msgContent = `${message.content}`;
        const breaker = "|";
        const splitted = msgContent.split(` ${breaker} `);
        const reason = splitted[1];


        const PublicModLogs_Chnl = message.guild.channels.cache.get(`${aubdycad.PublicModLogs_C_ID}`);


        /*
        ----------------------------------------------------------------------------------------------------
        Embeds
        ----------------------------------------------------------------------------------------------------
        */
        const done_Embed = new Discord.MessageEmbed();
        done_Embed.setTitle(`${cmndEmoji[1]}${config.tls}Done`);
        done_Embed.setColor(`${cmndColour[1]}`);

        const notValidMember_Embed = new Discord.MessageEmbed();
        notValidMember_Embed.setTitle(`${cmndError}`);
        notValidMember_Embed.setColor(`${config.err_hex}`);
        notValidMember_Embed.setDescription(`The user you selected is invalid. Please either mention a user or provide a valid id of a user of this server.`);
        notValidMember_Embed.setFooter({ text: message.author.username, iconURL: message.author.avatarURL({ dynamic: true }) });
        notValidMember_Embed.setTimestamp(message.createdTimestamp);


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


        const noMemberMention_Embed = new Discord.MessageEmbed();
        noMemberMention_Embed.setTitle(`${cmndError}`);
        noMemberMention_Embed.setColor(`${config.err_hex}`);
        noMemberMention_Embed.setDescription(`You just forgot to mention me the member you wanna warn. Please provide me either an id or a mention of the user you wanna warn.`);
        noMemberMention_Embed.setFooter({ text: message.author.username, iconURL: message.author.avatarURL({ dynamic: true }) });
        noMemberMention_Embed.setTimestamp(message.createdTimestamp);
        
        // Possible_Error_2
        if(!args[1]) return message.reply({ embeds: [noMemberMention_Embed] });


        /*
        ----------------------------------------------------------------------------------------------------
        Functions
        ----------------------------------------------------------------------------------------------------
        */
        function createLine(length) {
            let result = ``;

            for (let i = 0; i < length; i++) {
                result += `-`;
            }

            result += ` >>`
            return result;
        }


        async function warnProcess(memb, methd, reasn, chnl) {
            const m_ = cmndMarker;

            const warnMessageLog_Embed = new Discord.MessageEmbed();
            warnMessageLog_Embed.setTitle(`${cmndEmoji[0]}${config.tls}Member Warned!!`);
            warnMessageLog_Embed.setDescription(`${m_}**User :** ${memb}, ${memb.user.tag}\n${m_}**User id :** ${memb.user.id}\n${m_}**Action by :** ${message.author}, ${message.author.tag}\n${m_}**From :** ${message.channel} channel\n${m_}**Method :** ${methd}`);
            warnMessageLog_Embed.addFields({
                name: `${cmndEmoji[2]}WARNING  ${createLine(25)}`,
                value: `${reasn}`,
                inline: false
            });
            warnMessageLog_Embed.setColor(`${cmndColour[0]}`);
            warnMessageLog_Embed.setThumbnail(memb.user.avatarURL({ dynamic: true }));
            warnMessageLog_Embed.setFooter({ text: client.user.username, iconURL: client.user.avatarURL({ dynamic: true }) });
            warnMessageLog_Embed.setTimestamp(message.createdTimestamp);



            // Execution ================================================== >>>>>
            message.delete().catch();
            message.channel.send({ embeds: [done_Embed] }).then(msg => {
                setTimeout(() => {
                    msg.delete();
                }, 1000 * 3);
            });

            return chnl.send({ content: `${memb}, pay attention please!!`, embeds: [warnMessageLog_Embed] });
        }


        /*
        ----------------------------------------------------------------------------------------------------
        Execution
        ----------------------------------------------------------------------------------------------------
        */
        let catchedUser;
        let userSelectionMethod;


        if (target && args[1].startsWith("<@")) {
            const firstSect = args[1].slice(2);
            const secSect = firstSect.split("");
            secSect.splice(-1);

            catchedUser = message.guild.members.cache.get(`${secSect.join("")}`);
            userSelectionMethod = `By Mention`;

            // Possible_Error_3
            if (catchedUser === null || catchedUser === undefined) return message.reply({ embeds: [notValidMember_Embed] });
        } else if (!alphabet) {
            catchedUser = message.guild.members.cache.get(`${args[1]}`);
            userSelectionMethod = `By Id`;

            // Possible_Error_4
            if (catchedUser === null || catchedUser === undefined) return message.reply({ embeds: [notValidMember_Embed] });
        } else {
            // Possible_Error_5
            return message.reply({ embeds: [notValidMember_Embed] });
        }


        const notManageableUser_Embed = new Discord.MessageEmbed();
        notManageableUser_Embed.setTitle(`${cmndError}`);
        notManageableUser_Embed.setColor(`${config.err_hex}`);
        notManageableUser_Embed.setDescription(`The user you're trying to warn, is above you and hence I can't proceed further. I guess, even you can get warned after them seeing this message.\nJust saying... 🙄 👉 👈`);
        notManageableUser_Embed.setFooter({ text: message.author.username, iconURL: message.author.avatarURL({ dynamic: true }) });
        notManageableUser_Embed.setTimestamp(message.createdTimestamp);

        // Possible_Error_6
        if (!catchedUser.manageable || catchedUser.id === client.user.id) return message.reply({ embeds: [notManageableUser_Embed] });


        const notYourself_Embed = new Discord.MessageEmbed();
        notYourself_Embed.setTitle(`${cmndError}`);
        notYourself_Embed.setColor(`${config.err_hex}`);
        notYourself_Embed.setDescription(`Are you alright dude? You wanna warn yourself? Sorry, I can't do this for you. You can ask your Admin for that, if you really wanna go further.`);
        notYourself_Embed.setFooter({ text: message.author.username, iconURL: message.author.avatarURL({ dynamic: true }) });
        notYourself_Embed.setTimestamp(message.createdTimestamp);

        // Possible_Error_7
        if (catchedUser.user.id === message.author.id) return message.reply({ embeds: [notYourself_Embed] });


        const noReasonGiven_Embed = new Discord.MessageEmbed();
        noReasonGiven_Embed.setTitle(`${cmndError}`);
        noReasonGiven_Embed.setColor(`${config.err_hex}`);
        noReasonGiven_Embed.setDescription(`You just forgot to provide me a reason. Please provide me a valid reason, why and for what reason you're warning this user.`);
        noReasonGiven_Embed.setFooter({ text: message.author.username, iconURL: message.author.avatarURL({ dynamic: true }) });
        noReasonGiven_Embed.setTimestamp(message.createdTimestamp);

        // Possible_Error_8
        if (!reason) return message.reply({ embeds: [noReasonGiven_Embed] });



        // Execution ================================================== >>>>>
        if (message.guild.id === `${config.Aubdycad_ID}`) {
            const noChannel_Embed = new Discord.MessageEmbed();
            noChannel_Embed.setTitle(`${cmndError}`);
            noChannel_Embed.setColor(`${config.err_hex}`);
            noChannel_Embed.setDescription(`I cannot find the specified channel to work with. And hence, I cannot proceed further with this command.`);
            noChannel_Embed.setFooter({ text: message.author.username, iconURL: message.author.avatarURL({ dynamic: true }) });
            noChannel_Embed.setTimestamp(message.createdTimestamp);

            // Possible_Error_9
            if (PublicModLogs_Chnl === undefined || PublicModLogs_Chnl === null) return message.reply({ embeds: [noChannel_Embed] });


            const botChnlPerms = PublicModLogs_Chnl.permissionsFor(client.user, true).toArray();
            const neededBotChnlPerms = [`VIEW_CHANNEL`, `SEND_MESSAGES`, `USE_EXTERNAL_EMOJIS`];


            const notHavingPerms_Embed = new Discord.MessageEmbed();
            notHavingPerms_Embed.setTitle(`${cmndError}`);
            notHavingPerms_Embed.setColor(`${config.err_hex}`);
            notHavingPerms_Embed.setDescription(`I cannot proceed further as I'm lacking necessary permissions. I need **${neededBotChnlPerms.join(", ")}** permissions for ${PublicModLogs_Chnl} channel to proceed to the next step.`);
            notHavingPerms_Embed.setFooter({ text: message.author.username, iconURL: message.author.avatarURL({ dynamic: true }) });
            notHavingPerms_Embed.setTimestamp(message.createdTimestamp);

            // Possible_Error_10
            if (!(
                botChnlPerms.includes(`${neededBotChnlPerms[0]}`)
                && botChnlPerms.includes(`${neededBotChnlPerms[1]}`)
                && botChnlPerms.includes(`${neededBotChnlPerms[2]}`)
            )) return message.reply({ embeds: [notHavingPerms_Embed] });



            // Final_Execution ================================================== >>>>>
            return await warnProcess(catchedUser, userSelectionMethod, reason, PublicModLogs_Chnl);
        } else {
            // Final_Execution ================================================== >>>>>
            return await warnProcess(catchedUser, userSelectionMethod, reason, message.channel);
        }
    }
});