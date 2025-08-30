const Command = require("../../Structures/Command.js");
const Discord = require("discord.js");
const config = require("../../Data/config.json");
const aubdycad = require("../../Data/aubdycad.json");
const emojis = require("../../Data/emojis.json");
const pictures = require("../../Data/pictures.json");
const keys = require("../../Data/keys.json");


module.exports = new Command({
    name: "unban",
    description: "A command to unban a banned user from the server.",
    aliases: [],
    permission: "SendMessages",
    allowedChannels: [`${aubdycad.ModCmds_C_ID}`],
    allowedServers: [`${config.TestServer_ID}`, `${config.Aubdycad_ID}`, `${config.XytiusServer_ID}`],
    cooldown: "",
    usage: `${config.prefix}unban <user_id> | <reason>`,
    usageDesc: `A very simple command to unban any banned user from the server. Just get an id of the banned user you want to unban and use it as the second query before giving a valid reason for unban. Only eligible users can use this command.`,
    usageExample: [`${config.prefix}unban 886291251119419432 | Forgiving every banned user from our server.`],
    forTesting: false,
    HUCat: [`admin`],

    async run(message, args, client) {
        const cmndName = `Unban`;
        const cmndEmoji = [`🎗`, `👍`];
        const cmndColour = [`00bf60`, `00bf00`];
        const cmndError = `${config.err_emoji}${config.tls}Unban : Command Error!!`;
        const cmndMarker = `${config.marker}`;

        /*
        ----------------------------------------------------------------------------------------------------
        Start
        ----------------------------------------------------------------------------------------------------
        */
        const Admin_Perm = message.member.permissions.has("ADMINISTRATOR");

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


        /*
        ----------------------------------------------------------------------------------------------------
        Error Handling
        ----------------------------------------------------------------------------------------------------
        */
        if(message.guild.id === `${config.Aubdycad_ID}`) {
            const notEligible_Embed = new Discord.MessageEmbed();
            notEligible_Embed.setTitle(`${cmndError}`);
            notEligible_Embed.setColor(`${config.err_hex}`);
            notEligible_Embed.setDescription(`Sorry, you cannot use this command as you're not eligible for this. Only **Admins** can use this command.`);
            notEligible_Embed.setFooter({ text: message.author.username, iconURL: message.author.avatarURL({ dynamic: true }) });
            notEligible_Embed.setTimestamp(message.createdTimestamp);
            
            // Possible_Error_1
            if(!Admin_Perm) return message.reply({ embeds: [notEligible_Embed] });
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


        const noIdProvided_Embed = new Discord.MessageEmbed();
        noIdProvided_Embed.setTitle(`${cmndError}`);
        noIdProvided_Embed.setColor(`${config.err_hex}`);
        noIdProvided_Embed.setDescription(`You just forgot to mention me an id. Please provide me a valid id of the user you wanna unban from this server.`);
        noIdProvided_Embed.setFooter({ text: message.author.username, iconURL: message.author.avatarURL({ dynamic: true }) });
        noIdProvided_Embed.setTimestamp(message.createdTimestamp);
        
        // Possible_Error_2
        if(!args[1]) return message.reply({ embeds: [noIdProvided_Embed] });


        /*
        ----------------------------------------------------------------------------------------------------
        Functions
        ----------------------------------------------------------------------------------------------------
        */
        async function unbanProcess(reasn, chnl) {
            let banReason;

            await message.guild.bans.fetch().then((fetchedBans) => {
                const bannedUser = fetchedBans.get(`${args[1]}`);

                banReason = bannedUser?.reason === null ? `*None*` : `${bannedUser?.reason}`;
            });



            message.guild.members.unban(args[1], reasn).then((unbannedUser) => {
                const m_ = cmndMarker;

                const mainUnban_Embed = new Discord.MessageEmbed();
                mainUnban_Embed.setTitle(`${cmndEmoji[0]}${config.tls}User Unbanned!!`);
                mainUnban_Embed.setDescription(`${m_}**User :** ${unbannedUser}, ${unbannedUser.tag}\n${m_}**User id :** ${unbannedUser.id}\n${m_}**Action by :** ${message.author}, ${message.author.tag}\n${m_}**From :** ${message.channel} channel\n${m_}**Reason for Ban :** ${banReason}\n${m_}**Reason for Unban :** ${reasn}`);
                mainUnban_Embed.setColor(`${cmndColour[0]}`);
                mainUnban_Embed.setThumbnail(unbannedUser.avatarURL({ dynamic: true }));
                mainUnban_Embed.setFooter({ text: client.user.username, iconURL: client.user.avatarURL({ dynamic: true }) });
                mainUnban_Embed.setTimestamp(message.createdTimestamp);



                // Final_Execution ================================================== >>>>>
                message.delete().catch();
                message.channel.send({ embeds: [done_Embed] }).then(msg => {
                    setTimeout(() => {
                        msg.delete();
                    }, 1000 * 3);
                });

                return chnl.send({ embeds: [mainUnban_Embed] });
            }).catch(() => {
                const notValidMember_Embed = new Discord.MessageEmbed();
                notValidMember_Embed.setTitle(`${cmndError}`);
                notValidMember_Embed.setColor(`${config.err_hex}`);
                notValidMember_Embed.setDescription(`The id you gave to unban is invalid. Please mention me a valid id of the user you wanna unban from this server. Remember that the user should be banned from this server prerequisitely.`);
                notValidMember_Embed.setFooter({ text: message.author.username, iconURL: message.author.avatarURL({ dynamic: true }) });
                notValidMember_Embed.setTimestamp(message.createdTimestamp);

                // Possible_Error_6
                return message.reply({ embeds: [notValidMember_Embed] });
            });
        }


        /*
        ----------------------------------------------------------------------------------------------------
        Execution
        ----------------------------------------------------------------------------------------------------
        */
        const noReasonGiven_Embed = new Discord.MessageEmbed();
        noReasonGiven_Embed.setTitle(`${cmndError}`);
        noReasonGiven_Embed.setColor(`${config.err_hex}`);
        noReasonGiven_Embed.setDescription(`You just forgot to provide me a reason. Please provide me a valid reason for why you're unbanning this user from this server.`);
        noReasonGiven_Embed.setFooter({ text: message.author.username, iconURL: message.author.avatarURL({ dynamic: true }) });
        noReasonGiven_Embed.setTimestamp(message.createdTimestamp);

        // Possible_Error_3
        if (!reason) return message.reply({ embeds: [noReasonGiven_Embed] });



        // Execution ================================================== >>>>>
        if (message.guild.id === `${config.Aubdycad_ID}`) {
            const noChannel_Embed = new Discord.MessageEmbed();
            noChannel_Embed.setTitle(`${cmndError}`);
            noChannel_Embed.setColor(`${config.err_hex}`);
            noChannel_Embed.setDescription(`I cannot find the specified channel to work with. And hence, I cannot proceed further with this command.`);
            noChannel_Embed.setFooter({ text: message.author.username, iconURL: message.author.avatarURL({ dynamic: true }) });
            noChannel_Embed.setTimestamp(message.createdTimestamp);

            // Possible_Error_4
            if (PublicModLogs_Chnl === undefined || PublicModLogs_Chnl === null) return message.reply({ embeds: [noChannel_Embed] });


            const botChnlPerms = PublicModLogs_Chnl.permissionsFor(client.user, true).toArray();
            const neededBotChnlPerms = [`VIEW_CHANNEL`, `SEND_MESSAGES`, `USE_EXTERNAL_EMOJIS`];


            const notHavingPerms_Embed = new Discord.MessageEmbed();
            notHavingPerms_Embed.setTitle(`${cmndError}`);
            notHavingPerms_Embed.setColor(`${config.err_hex}`);
            notHavingPerms_Embed.setDescription(`I cannot proceed further as I'm lacking necessary permissions. I need **${neededBotChnlPerms.join(", ")}** permissions for ${PublicModLogs_Chnl} channel to proceed to the next step.`);
            notHavingPerms_Embed.setFooter({ text: message.author.username, iconURL: message.author.avatarURL({ dynamic: true }) });
            notHavingPerms_Embed.setTimestamp(message.createdTimestamp);

            // Possible_Error_5
            if (!(
                botChnlPerms.includes(`${neededBotChnlPerms[0]}`)
                && botChnlPerms.includes(`${neededBotChnlPerms[1]}`)
                && botChnlPerms.includes(`${neededBotChnlPerms[2]}`)
            )) return message.reply({ embeds: [notHavingPerms_Embed] });



            // Final_Execution ================================================== >>>>>
            return await unbanProcess(reason, PublicModLogs_Chnl);
        } else {
            // Final_Execution ================================================== >>>>>
            return await unbanProcess(reason, message.channel);
        }
    }
});