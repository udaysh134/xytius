const Command = require("../../Structures/Command.js");
const Discord = require("discord.js");
const config = require("../../Data/config.json");
const aubdycad = require("../../Data/aubdycad.json");
const emojis = require("../../Data/emojis.json");
const pictures = require("../../Data/pictures.json");
const keys = require("../../Data/keys.json");

const moment = require("moment");


module.exports = new Command({
    name: "kick",
    description: "A command to directly kick a member from the server.",
    aliases: [],
    permission: "SendMessages",
    allowedChannels: [`${aubdycad.ModCmds_C_ID}`],
    allowedServers: [`${config.TestServer_ID}`, `${config.Aubdycad_ID}`, `${config.XytiusServer_ID}`],
    cooldown: "",
    usage: `${config.prefix}kick <member_mention / member_id> | <reason>`,
    usageDesc: `A very simple command for eligible users, to use on members to kick them for any violation. Just either mention or provide the id of that member, with a reason (mandatorily) to kick them.`,
    usageExample: [`${config.prefix}kick @RandomGuy#0001 | Sending memes in #general channel.`, `${config.prefix}kick 886291251119419432 | New comer and teasing everyone for no reason.`],
    forTesting: false,
    HUCat: [`admin`],

    async run(message, args, client) {
        const cmndName = `Kick`;
        const cmndEmoji = [`👟`, `👍`];
        const cmndColour = [`dd2e44`, `00bf00`];
        const cmndError = `${config.err_emoji}${config.tls}Kick : Command Error!!`;
        const cmndMarker = `${config.marker}`;

        /*
        ----------------------------------------------------------------------------------------------------
        Start
        ----------------------------------------------------------------------------------------------------
        */
        const target = message.mentions.users.first();
        const alphabet = isNaN(args[1]);

        const seperator = "|";
        const allArguments = args.join(' ');
        const splittedArg = allArguments.split(` ${seperator} `);
        const reason = splittedArg[1];

        const Admin_Perm = message.member.permissions.has("ADMINISTRATOR");

        const Aubdycad_Srvr = client.guilds.cache.get(`${config.Aubdycad_ID}`);
        const PublicModLogs_Chnl = Aubdycad_Srvr.channels.cache.get(`${aubdycad.PublicModLogs_C_ID}`);


        /*
        ----------------------------------------------------------------------------------------------------
        Embeds
        ----------------------------------------------------------------------------------------------------
        */
        const done_Embed = new Discord.MessageEmbed();
        done_Embed.setTitle(`${cmndEmoji[1]}${config.tls}Done`);
        done_Embed.setColor(`${cmndColour[1]}`);


        /*
        ----------------------------------------------------------------------------------------------------
        Error Handling                                                                   
        ----------------------------------------------------------------------------------------------------
        */
        if(message.guild.id === `${config.Aubdycad_ID}`) {
            const notEligible_Embed = new Discord.MessageEmbed();
            notEligible_Embed.setTitle(`${cmndError}`);
            notEligible_Embed.setColor(`${config.err_hex}`);
            notEligible_Embed.setDescription(`Sorry, you cannot use this command as you're not eligible for this. Only **Admins** of this server can do that.`);
            notEligible_Embed.setFooter({ text: message.author.username, iconURL: message.author.avatarURL({ dynamic: true }) });
            notEligible_Embed.setTimestamp(message.createdTimestamp);
            
            // Possible_Error_1
            if(!Admin_Perm) return message.reply({ embeds: [notEligible_Embed] });
        } else {
            const notEligible_Embed = new Discord.MessageEmbed();
            notEligible_Embed.setTitle(`${cmndError}`);
            notEligible_Embed.setColor(`${config.err_hex}`);
            notEligible_Embed.setDescription(`Sorry, you cannot use this command as you're not eligible for this. Only **Admins** of this server can do that.`);
            notEligible_Embed.setFooter({ text: message.author.username, iconURL: message.author.avatarURL({ dynamic: true }) });
            notEligible_Embed.setTimestamp(message.createdTimestamp);
            
            // Possible_Error_1
            if(!Admin_Perm) return message.reply({ embeds: [notEligible_Embed] });
        }


        const noOptions_Embed = new Discord.MessageEmbed();
        noOptions_Embed.setTitle(`${cmndError}`);
        noOptions_Embed.setColor(`${config.err_hex}`);
        noOptions_Embed.setDescription(`You just forgot to provide me a query for a member to kick from this server. Please provide me either mention or id of the member with a reason. Use "\`${config.prefix}usage\`" command for this command to get more details on it.`);
        noOptions_Embed.setFooter({ text: message.author.username, iconURL: message.author.avatarURL({ dynamic: true }) });
        noOptions_Embed.setTimestamp(message.createdTimestamp);

        // Possible_Error_2
        if (!args[1]) return message.reply({ embeds: [noOptions_Embed] });


        /*
        ----------------------------------------------------------------------------------------------------
        Functions       
        ----------------------------------------------------------------------------------------------------
        */
        function errorHandle() {
            const invalidID_Embed = new Discord.MessageEmbed();
            invalidID_Embed.setTitle(`${cmndError}`);
            invalidID_Embed.setColor(`${config.err_hex}`);
            invalidID_Embed.setDescription(`The query you just provided me is wrong. Please provide me a valid ID/mention of the member who is in this server, to kick from this server.`);
            invalidID_Embed.setFooter({ text: message.author.username, iconURL: message.author.avatarURL({ dynamic: true }) });
            invalidID_Embed.setTimestamp(message.createdTimestamp);

            return message.reply({ embeds: [invalidID_Embed] });
        }


        async function kickAMember(memb, method) {
            // Error_Handling ================================================== >>>>>
            const notYourself_Embed = new Discord.MessageEmbed();
            notYourself_Embed.setTitle(`${cmndError}`);
            notYourself_Embed.setColor(`${config.err_hex}`);
            notYourself_Embed.setDescription(`Are you alright dude? You wanna kick yourself? Sorry, I can't do this for you. You can ask your Admin for that, if you really wanna kick yourself.`);
            notYourself_Embed.setFooter({ text: message.author.username, iconURL: message.author.avatarURL({ dynamic: true }) });
            notYourself_Embed.setTimestamp(message.createdTimestamp);

            // Possible_Error_4
            if (memb.id === message.author.id) return message.reply({ embeds: [notYourself_Embed] });


            const notManageable_Embed = new Discord.MessageEmbed();
            notManageable_Embed.setTitle(`${cmndError}`);
            notManageable_Embed.setColor(`${config.err_hex}`);
            notManageable_Embed.setDescription(`The user you're trying to kick is above you, and hence I can't kick that user. I guess, even you can get kicked after them seeing this message.\nJust saying... 🙄 👉 👈`);
            notManageable_Embed.setFooter({ text: message.author.username, iconURL: message.author.avatarURL({ dynamic: true }) });
            notManageable_Embed.setTimestamp(message.createdTimestamp);

            // Possible_Error_5
            if (!memb.manageable || memb.id === client.user.id) return message.reply({ embeds: [notManageable_Embed] });


            const noReasonProvided_Embed = new Discord.MessageEmbed();
            noReasonProvided_Embed.setTitle(`${cmndError}`);
            noReasonProvided_Embed.setColor(`${config.err_hex}`);
            noReasonProvided_Embed.setDescription(`I cannot proceed further as you just forgot to provide me the reason for this kick. PLease specify a valid reason to kick that user from this server. Use "\`${config.prefix}usage\`" command for this command to get more details on it.`);
            noReasonProvided_Embed.setFooter({ text: message.author.username, iconURL: message.author.avatarURL({ dynamic: true }) });
            noReasonProvided_Embed.setTimestamp(message.createdTimestamp);

            // Possible_Error_6
            if (!reason) return message.reply({ embeds: [noReasonProvided_Embed] });



            if(message.guild.id === `${config.Aubdycad_ID}`) {
                const noChannel_Embed = new Discord.MessageEmbed();
                noChannel_Embed.setTitle(`${cmndError}`);
                noChannel_Embed.setColor(`${config.err_hex}`);
                noChannel_Embed.setDescription(`I cannot find the specified channel to work with. And hence, I cannot proceed further with this command.`);
                noChannel_Embed.setFooter({ text: message.author.username, iconURL: message.author.avatarURL({ dynamic: true }) });
                noChannel_Embed.setTimestamp(message.createdTimestamp);

                // Possible_Error_7
                if (PublicModLogs_Chnl === undefined || PublicModLogs_Chnl === null) return message.reply({ embeds: [noChannel_Embed] });


                const botChnlPerms = PublicModLogs_Chnl.permissionsFor(client.user, true).toArray();
                const neededBotChnlPerms = [`VIEW_CHANNEL`, `SEND_MESSAGES`, `USE_EXTERNAL_EMOJIS`];

                const notHavingPerms_Embed = new Discord.MessageEmbed();
                notHavingPerms_Embed.setTitle(`${cmndError}`);
                notHavingPerms_Embed.setColor(`${config.err_hex}`);
                notHavingPerms_Embed.setDescription(`I cannot proceed further as I'm lacking necessary permissions. I need **${neededBotChnlPerms.join(", ")}** permissions for ${PublicModLogs_Chnl} channel to proceed to the next step.`);
                notHavingPerms_Embed.setFooter({ text: message.author.username, iconURL: message.author.avatarURL({ dynamic: true }) });
                notHavingPerms_Embed.setTimestamp(message.createdTimestamp);

                // Possible_Error_8
                if (!(
                    botChnlPerms.includes(`${neededBotChnlPerms[0]}`)
                    && botChnlPerms.includes(`${neededBotChnlPerms[1]}`)
                    && botChnlPerms.includes(`${neededBotChnlPerms[2]}`)
                )) return message.reply({ embeds: [notHavingPerms_Embed] });
            }


            
            // Embeds ================================================== >>>>>
            const m_ = cmndMarker;

            const modLogMessage_Embed = new Discord.MessageEmbed();
            modLogMessage_Embed.setTitle(`${cmndEmoji[0]}${config.tls}Member Kicked!!`);
            modLogMessage_Embed.setColor(`${cmndColour[0]}`);
            modLogMessage_Embed.setThumbnail(memb.user.avatarURL({ dynamic: true }));
            modLogMessage_Embed.setFooter({ text: client.user.username, iconURL: client.user.avatarURL({ dynamic: true }) });
            modLogMessage_Embed.setTimestamp(message.createdTimestamp);

            const userInformingNotice_Embed = new Discord.MessageEmbed();
            userInformingNotice_Embed.setTitle(`${cmndEmoji[0]}${config.tls}Kick Notice!!`);
            userInformingNotice_Embed.setDescription(`This is to inform you that, you've been Kicked from **"${message.guild.name}"** server.\n\n${m_}**Reason :** ${reason}`);
            userInformingNotice_Embed.setColor(`${cmndColour[0]}`);
            userInformingNotice_Embed.setFooter({ text: client.user.username, iconURL: client.user.avatarURL({ dynamic: true }) });
            userInformingNotice_Embed.setTimestamp(message.createdTimestamp);



            // Execution ================================================== >>>>>
            memb.kick(reason);

            message.delete().catch();
            message.channel.send({ embeds: [done_Embed] }).then((msg) => {
                setTimeout(() => {
                    msg.delete();
                }, 1000 * 3);
            });


            const isInformed = [`Yes`];

            await memb.user.send({ embeds: [userInformingNotice_Embed] }).catch(() => { isInformed.push(`No`) });

            modLogMessage_Embed.setDescription(`${m_}**User :** ${memb.user}, ${memb.user.tag}\n${m_}**User id :** ${memb.user.id}\n${m_}**Method :** ${method}\n${m_}**Joined on :** ${moment(memb.joinedAt).format('ddd, Do MMM YYYY, h:mm a')}\n${m_}**Action by :** ${message.author}, ${message.author.tag}\n${m_}**From :** ${message.channel} channel\n${m_}**Is informed :** ${isInformed[isInformed.length - 1]}\n${m_}**Reason for Kick :** ${reason}`);
            
            if(message.guild.id === `${config.Aubdycad_ID}`) {
                return PublicModLogs_Chnl.send({ embeds: [modLogMessage_Embed] });
            } else {
                return message.channel.send({ embeds: [modLogMessage_Embed] });
            }
        }


        /*
        ----------------------------------------------------------------------------------------------------
        Execution
        ----------------------------------------------------------------------------------------------------
        */
        if (target && args[1].startsWith("<@")) {
            const firstSect = args[1].slice(2);
            const secSect = firstSect.split("");
            secSect.splice(-1);
            const member = message.guild.members.cache.get(`${secSect.join("")}`);

            // Possible_Error_3
            if (member === null || member === undefined) return errorHandle();

            return await kickAMember(member, `By Mention`);
        } else if (!alphabet) {
            const member = message.guild.members.cache.get(`${args[1]}`);

            // Possible_Error_3
            if (member === null || member === undefined) return errorHandle();

            return await kickAMember(member, `By Id`);
        } else {
            const noValidOption_Embed = new Discord.MessageEmbed();
            noValidOption_Embed.setTitle(`${cmndError}`);
            noValidOption_Embed.setColor(`${config.err_hex}`);
            noValidOption_Embed.setDescription(`The query you just gave me is invalid, as I cannot identify it. Use "\`${config.prefix}usage\`" command for this command to get more details on it.`);
            noValidOption_Embed.setFooter({ text: message.author.username, iconURL: message.author.avatarURL({ dynamic: true }) });
            noValidOption_Embed.setTimestamp(message.createdTimestamp);
            
            // Possible_Error_3
            return message.reply({ embeds: [noValidOption_Embed] });
        }
    }
});