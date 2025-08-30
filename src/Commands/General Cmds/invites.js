const Command = require("../../Structures/Command.js");
const Discord = require("discord.js");
const config = require("../../Data/config.json");
const aubdycad = require("../../Data/aubdycad.json");
const emojis = require("../../Data/emojis.json");
const pictures = require("../../Data/pictures.json");
const keys = require("../../Data/keys.json");


module.exports = new Command({
    name: "invites",
    description: "Fetch how many users, a user (or yourself) has invited in a server.",
    aliases: [],
    permission: "SendMessages",
    allowedChannels: [`${aubdycad.BotCommands1_C_ID}`, `${aubdycad.BotCommands2_C_ID}`],
    allowedServers: [`${config.TestServer_ID}`, `${config.Aubdycad_ID}`, `${config.XytiusServer_ID}`],
    cooldown: "",
    usage: `${config.prefix}invites [user_mention / leaderboard]`,
    usageDesc: `This command gives two different options from two different ways. One is to fetch invites of any member of the Server. Second, is to fetch top 10 inviters of the Server, the command is used in.\n\nTo fetch how many users a member has invited in the Server, either mention (or tag) the member or provide their "User ID" as second query in the command input. If not provided any query, you'll get to see your own invites in that Server. To see the "Top 10 inviters" leaderboard of the Server you're in, simply use "\`leaderboard\`" / "\`lb\`" as the second query in the command input. You'll get to see a list of members with most number of invites (in front of their names) in that Server in descending order. This number shows how many users have joined this server, using your invitation link and hence increasing your invites.`,
    usageExample: [`${config.prefix}invites`, `${config.prefix}invites @RandomGuy#0001`, `${config.prefix}invites 886291251119419432`, `${config.prefix}invites leaderboard`],
    forTesting: false,
    HUCat: [`gen`, `general`],

    async run(message, args, client) {
        const cmndName = `Invites`;
        const cmndEmoji = [`📩`];
        const cmndColour = [`e91e62`];
        const cmndError = `${config.err_emoji}${config.tls}Invites : Command Error!!`;
        const cmndMarker = `${config.marker}`;

        /*
        ----------------------------------------------------------------------------------------------------
        Start                                                                   
        ----------------------------------------------------------------------------------------------------
        */
        const invitesCheck = [];
        const invites = await message.guild.invites.fetch();
        const target = message.mentions.users.first();
        const alphabet = isNaN(args[1]);


        /*
        ----------------------------------------------------------------------------------------------------
        Embeds                                                                   
        ----------------------------------------------------------------------------------------------------
        */
        const noBots_Embed = new Discord.EmbedBuilder();
        noBots_Embed.setTitle(`${cmndError}`);
        noBots_Embed.setColor(`${config.err_hex}`);
        noBots_Embed.setDescription(`I guess you don't know this, but bots cannot create an invite link by themselves. So, next time try not to use this command for a bot.`);
        noBots_Embed.setFooter({ text: message.author.username, iconURL: message.author.avatarURL({ dynamic: true }) });
        noBots_Embed.setTimestamp(message.createdTimestamp);


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

            // result += ` >>`;
            return result;
        }

        
        function notCreatedLink_Emb(emb, starter, suggestion) {
            emb.setTitle(`${cmndError}`);
            emb.setColor(`${config.err_hex}`);
            emb.setDescription(`${starter} yet created any invite link or it is expired now. ${suggestion}.`);
            emb.setFooter({ text: message.author.username, iconURL: message.author.avatarURL({ dynamic: true }) });
            emb.setTimestamp(message.createdTimestamp);
        }


        function invitesSend_Emb(emb, starter, uses) {
            emb.setTitle(`${cmndEmoji[0]}${config.tls}${cmndName}`);
            emb.setColor(`${cmndColour[0]}`);
            emb.setDescription(`${starter} invited a total of **${uses}** users in this server, from current unexpired invitation link.`);
            emb.setFooter({ text: message.author.username, iconURL: message.author.avatarURL({ dynamic: true }) });
            emb.setTimestamp(message.createdTimestamp);
        }


        /*
        ----------------------------------------------------------------------------------------------------
        Execution                                                                   
        ----------------------------------------------------------------------------------------------------
        */
        if(!args[1]) {
            const selfInvites = invites.find(inv => inv.inviter.id === message.author.id);


            const noInviteLink_Embed = new Discord.EmbedBuilder();
            notCreatedLink_Emb(noInviteLink_Embed, `You haven't`, `Create a new invite link and invite others`);

            // Possible_Error_1
            if (selfInvites === undefined) return message.reply({ embeds: [noInviteLink_Embed] });



            // Execution ================================================== >>>>>
            const selfInvites_Embed = new Discord.EmbedBuilder();
            invitesSend_Emb(selfInvites_Embed, `Hey ${message.author} (${message.author.tag}), you've`, selfInvites.uses);

            return message.reply({ embeds: [selfInvites_Embed] });
        } else if(target && args[1].startsWith("<@")) {
            // Possible_Error_1
            if (target.bot === true) return message.reply({ embeds: [noBots_Embed] });


            const targetInvites = invites.find(inv => inv.inviter.id === target.id);


            const noInviteLink_Embed = new Discord.EmbedBuilder();
            notCreatedLink_Emb(noInviteLink_Embed, `The member hasn't`, `Ask the member to create a new invite link and invite others`);

            // Possible_Error_2
            if (targetInvites === undefined) return message.reply({ embeds: [noInviteLink_Embed] });



            // Execution ================================================== >>>>>
            const targetInvites_Embed = new Discord.EmbedBuilder();
            targetInvites_Embed.setThumbnail(target.avatarURL({ dynamic: true }));
            invitesSend_Emb(targetInvites_Embed, `The member, ${target} (${target.tag}) has`, targetInvites.uses);

            return message.reply({ embeds: [targetInvites_Embed] });
        } else if(!alphabet) {
            const memberId = args[1];
            const fetchedMember = await message.guild.members.fetch(`${memberId}`).catch(() => { return `None` });


            const notValidId_Embed = new Discord.EmbedBuilder();
            notValidId_Embed.setTitle(`${cmndError}`);
            notValidId_Embed.setColor(`${config.err_hex}`);
            notValidId_Embed.setDescription(`The query you provided me is invalid as, I cannot recognize any member from this server, with your given id.`);
            notValidId_Embed.setFooter({ text: message.author.username, iconURL: message.author.avatarURL({ dynamic: true }) });
            notValidId_Embed.setTimestamp(message.createdTimestamp);

            // Possible_Error_1
            if (fetchedMember === `None`) return message.reply({ embeds: [notValidId_Embed] });


            // Possible_Error_2
            if (fetchedMember.user.bot === true) return message.reply({ embeds: [noBots_Embed] });


            const memberInvites = invites.find(inv => inv.inviter.id === fetchedMember.id);


            const noInviteLink_Embed = new Discord.EmbedBuilder();
            notCreatedLink_Emb(noInviteLink_Embed, `The member hasn't`, `Ask the member to create a new invite link and invite others`);

            // Possible_Error_3
            if (memberInvites === undefined) return message.reply({ embeds: [noInviteLink_Embed] });



            // Execution ================================================== >>>>>
            const memberInvites_Embed = new Discord.EmbedBuilder();
            memberInvites_Embed.setThumbnail(fetchedMember.user.avatarURL({ dynamic: true }));
            invitesSend_Emb(memberInvites_Embed, `The member, ${fetchedMember.user} (${fetchedMember.user.tag}) has`, memberInvites.uses);

            return message.reply({ embeds: [memberInvites_Embed] });
        } else if(args[1] === `lb` || args[1] === `leaderboard`) {
            invites.map((inv) => invitesCheck.push(inv));

            const invLbNone_Embed = new Discord.EmbedBuilder();
            invLbNone_Embed.setTitle(`${cmndEmoji[0]}${config.tls}${cmndName} Leaderboard`);
            invLbNone_Embed.setColor(`${cmndColour[0]}`);
            invLbNone_Embed.setDescription(`All empty...\n\`\`\`Either no one in this server has created any invite link, or everyone's invite links has been expired now. There's nothing to display in ${message.guild.name}'s Invites Leaderboard. Why not you, be the first to get into the Invites Leaderboard by inviting others?\`\`\``);
            invLbNone_Embed.setThumbnail(message.guild.iconURL({ dynamic: true }));
            invLbNone_Embed.setFooter({ text: message.author.username, iconURL: message.author.avatarURL({ dynamic: true }) });
            invLbNone_Embed.setTimestamp(message.createdTimestamp);

            if (invitesCheck.length === 0) return message.reply({ embeds: [invLbNone_Embed] });



            // First Execution ================================================== >>>>>
            const invitesObject = {};
            const sortedResult = [];

            invites.map((inv) => {
                invitesObject[inv.inviter.tag] = inv.uses;
            });

            const sortedInvites = Object.keys(invitesObject).sort((a, b) => invitesObject[b] - invitesObject[a]);

            sortedInvites.forEach((key) => {
                const res = `${key} • ${invitesObject[key]}`;
                sortedResult.push(res);
            });



            // Main Execution ================================================== >>>>>
            let text = ``;
            const serial = [`🥇`, `🥈`, `🥉`, `4`, `5`, `6`, `7`, `8`, `9`, `10`];
            const seperator = `${createLine(40)}`;

            for(let i = 0; i < sortedResult.length && i < 10; i++) {
                text += `**${serial[i]}**. ${sortedResult[i]}\n`;
            }

            const invLb_Embed = new Discord.EmbedBuilder();
            invLb_Embed.setTitle(`${cmndEmoji[0]}${config.tls}${cmndName} Leaderboard`);
            invLb_Embed.setColor(`${cmndColour[0]}`);
            invLb_Embed.setDescription(`Top inviters of **${message.guild.name}**\n${seperator}\n${text}`);
            invLb_Embed.setThumbnail(message.guild.iconURL({ dynamic: true }));
            invLb_Embed.setFooter({ text: message.author.username, iconURL: message.author.avatarURL({ dynamic: true }) });
            invLb_Embed.setTimestamp(message.createdTimestamp);

            return message.reply({ embeds: [invLb_Embed] });
        } else {
            const invalidInput_Embed = new Discord.EmbedBuilder();
            invalidInput_Embed.setTitle(`${cmndError}`);
            invalidInput_Embed.setColor(`${config.err_hex}`);
            invalidInput_Embed.setDescription(`That is an invalid input!! Please provide me a valid input to proceed further. Use "\`${config.prefix}usage\`" command for this command to get more details on it.`);
            invalidInput_Embed.setFooter({ text: message.author.username, iconURL: message.author.avatarURL({ dynamic: true }) });
            invalidInput_Embed.setTimestamp(message.createdTimestamp);

            // Possible_Error_1
            return message.reply({ embeds: [invalidInput_Embed] });
        }
    } 
});