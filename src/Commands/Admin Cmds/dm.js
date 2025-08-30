const Command = require("../../Structures/Command.js");
const Discord = require("discord.js");
const config = require("../../Data/config.json");
const aubdycad = require("../../Data/aubdycad.json");
const emojis = require("../../Data/emojis.json");
const pictures = require("../../Data/pictures.json");
const keys = require("../../Data/keys.json");

const moment = require("moment");


module.exports = new Command({
    name: "dm",
    description: "Make the bot send a DM message to anyone.",
    aliases: [],
    permission: "Administrator",
    allowedChannels: [],
    allowedServers: [`${config.TestServer_ID}`, `${config.Aubdycad_ID}`, `${config.XytiusServer_ID}`],
    cooldown: "",
    usage: `${config.prefix}dm <user_id> <message>`,
    usageDesc: `Send a DM to any user, just by using this command. If the user has not allowed DMs, for anyone from their settings, the bot will simply fail sending message but will also inform about that. Other than that, you can send a DM with the help of bot to anyone just from their Discord id.`,
    usageExample : [`${config.prefix}dm 886291251119419432 Hello, how're you?`],
    forTesting: false,
    HUCat: [`admin`],

    async run(message, args, client) {
        const cmndName = `DM`;
        const cmndEmoji = [`📳`, `✅`, `💢`];
        const cmndColour = [`f4900c`, `77b255`, `be1931`];
        const cmndError = `${config.err_emoji}${config.tls}DM : Command Error!!`;
        const cmndMarker = `${config.marker}`;

        /*
        ----------------------------------------------------------------------------------------------------
        Start                                                                   
        ----------------------------------------------------------------------------------------------------
        */
        const targetId = args[1];
        const fetchedUser = await client.users.fetch(`${targetId}`).catch(() => { return `None` });
        const description = args.slice(2).join(" ");
        

        /*
        ----------------------------------------------------------------------------------------------------
        Error Handling                                                                   
        ----------------------------------------------------------------------------------------------------
        */
        const noArgs_Embed = new Discord.EmbedBuilder();
        noArgs_Embed.setTitle(`${cmndError}`);
        noArgs_Embed.setColor(`${config.err_hex}`);
        noArgs_Embed.setDescription(`You just forgot to provide me the id of the user and the content to send.`);

        // Possible_Error_1
        if(!targetId) return message.delete().catch() && message.channel.send({ embeds: [noArgs_Embed] });


        const invalidId_Embed = new Discord.EmbedBuilder();
        invalidId_Embed.setTitle(`${cmndError}`);
        invalidId_Embed.setColor(`${config.err_hex}`);
        invalidId_Embed.setDescription(`The query you provided me is invalid. Please provide me a valid id of the user, you wanna message to.`);

        // Possible_Error_2
        if(fetchedUser === `None`) return message.delete().catch() && message.channel.send({ embeds: [invalidId_Embed] });


        const noDescription_Embed = new Discord.EmbedBuilder();
        noDescription_Embed.setTitle(`${cmndError}`);
        noDescription_Embed.setColor(`${config.err_hex}`);
        noDescription_Embed.setDescription(`You just forgot to provide me the description/content you wanna send as the message to the user.`);

        // Possible_Error_3
        if(!description) return message.delete().catch() && message.channel.send({ embeds: [noDescription_Embed] });


        /*
        ----------------------------------------------------------------------------------------------------
        Execution                                                                   
        ----------------------------------------------------------------------------------------------------
        */
        if(message.guild.id === `${config.Aubdycad_ID}`) {
            const DMLogs_Chnl = message.guild.channels.cache.get(`${aubdycad.DMLogs_C_ID}`);


            const noChannel_Embed = new Discord.EmbedBuilder();
            noChannel_Embed.setTitle(`${cmndError}`);
            noChannel_Embed.setColor(`${config.err_hex}`);
            noChannel_Embed.setDescription(`I cannot find the specified channel to send the log message in. Please check the issue and try again.`);

            // Possible_Error_4
            if(DMLogs_Chnl === undefined) return message.channel.send({ embeds: [noChannel_Embed] });


            const botChnlPerms = DMLogs_Chnl.permissionsFor(client.user, true).toArray();
            const neededBotChnlPerms = [`ViewChannel`, `SendMessages`, `UseExternalEmojis`];

            
            const notHavingPerms_Embed = new Discord.EmbedBuilder();
            notHavingPerms_Embed.setTitle(`${cmndError}`);
            notHavingPerms_Embed.setColor(`${config.err_hex}`);
            notHavingPerms_Embed.setDescription(`I cannot proceed further as I'm lacking necessary permissions. I need **${neededBotChnlPerms.join(", ")}** permissions for ${DMLogs_Chnl} channel to proceed to the next step.`);

            // Possible_Error_5
            if(!(
                botChnlPerms.includes(`${neededBotChnlPerms[0]}`)
                && botChnlPerms.includes(`${neededBotChnlPerms[1]}`)
                && botChnlPerms.includes(`${neededBotChnlPerms[2]}`)
            )) return message.delete().catch() && message.channel.send({ embeds: [notHavingPerms_Embed] });



            // Embeds ================================================== >>>>>
            const sentMessage_Embed = new Discord.EmbedBuilder();
            sentMessage_Embed.setColor(`ffffff`);
            sentMessage_Embed.setDescription(`${description}`);

            const failure_Embed = new Discord.EmbedBuilder();
            failure_Embed.setTitle(`${cmndEmoji[2]}${config.tls}${cmndName} Failed`);
            failure_Embed.setDescription(`${cmndMarker}**User :** ${fetchedUser}, ${fetchedUser.tag}\n${cmndMarker}**User id :** ${fetchedUser.id}\n${cmndMarker}**Author :** ${message.author}, ${message.author.tag}\n${cmndMarker}**Author id :** ${message.author.id}\n${cmndMarker}**Time :** ${moment(message.createdTimestamp).format('ddd, Do MMM YYYY')} at ${moment(message.createdTimestamp).format('h:mm:ss a')}\n${cmndMarker}**Content :** ${description}`);
            failure_Embed.setColor(`${cmndColour[2]}`);
            failure_Embed.setThumbnail(fetchedUser.avatarURL({ dynamic: true }));
            failure_Embed.setFooter({ text: message.author.username, iconURL: message.author.avatarURL({ dynamic: true }) });
            failure_Embed.setTimestamp(message.createdTimestamp);

            const notDone_Embed = new Discord.EmbedBuilder();
            notDone_Embed.setTitle(`${cmndError}`);
            notDone_Embed.setColor(`${config.err_hex}`);
            notDone_Embed.setDescription(`Cannot send message to this user. This user's DMs are closed.`);


            const success_Embed = new Discord.EmbedBuilder();
            success_Embed.setTitle(`${cmndEmoji[0]}${config.tls}${cmndName} Sent`);
            success_Embed.setDescription(`${cmndMarker}**Sender :** ${message.author}, ${message.author.tag}\n${cmndMarker}**Sender's id :** ${message.author.id}\n${cmndMarker}**Reciever :** ${fetchedUser}, ${fetchedUser.tag}\n${cmndMarker}**Reciever's id :** ${fetchedUser.id}\n${cmndMarker}**From :** ${message.channel} channel\n${cmndMarker}**Time :** ${moment(message.createdTimestamp).format('ddd, Do MMM YYYY')} at ${moment(message.createdTimestamp).format('h:mm:ss a')}\n${cmndMarker}**Content :** ${description}`);
            success_Embed.setColor(`${cmndColour[0]}`);
            success_Embed.setThumbnail(fetchedUser.avatarURL({ dynamic: true }));
            success_Embed.setFooter({ text: message.author.username, iconURL: message.author.avatarURL({ dynamic: true }) });
            success_Embed.setTimestamp(message.createdTimestamp);

            const done_Embed = new Discord.EmbedBuilder();
            done_Embed.setTitle(`${cmndEmoji[1]}${config.tls}Done`);
            done_Embed.setDescription(`Message sent!!`);
            done_Embed.setColor(`${cmndColour[1]}`);



            // Final_Execution ================================================== >>>>>
            message.delete().catch();

            fetchedUser.send({ embeds: [sentMessage_Embed] }).then(() => {
                DMLogs_Chnl.send({ embeds: [success_Embed] });
            
                return message.channel.send({ embeds: [done_Embed] }).then((doneMsg) => {
                    setTimeout(() => {
                        doneMsg.delete();
                    }, 1000 * 5);
                });
            }).catch(() => {
                DMLogs_Chnl.send({ embeds: [failure_Embed] });
                return message.channel.send({ embeds: [notDone_Embed] });
            });
        } else {
            // Embeds ================================================== >>>>>
            const sentMessage_Embed = new Discord.EmbedBuilder();
            sentMessage_Embed.setColor(`ffffff`);
            sentMessage_Embed.setDescription(`${description}`);

            const failure_Embed = new Discord.EmbedBuilder();
            failure_Embed.setTitle(`${cmndEmoji[2]}${config.tls}${cmndName} Failed`);
            failure_Embed.setDescription(`${cmndMarker}**User :** ${fetchedUser}, ${fetchedUser.tag}\n${cmndMarker}**User id :** ${fetchedUser.id}\n${cmndMarker}**Author :** ${message.author}, ${message.author.tag}\n${cmndMarker}**Author id :** ${message.author.id}\n${cmndMarker}**Time :** ${moment(message.createdTimestamp).format('ddd, Do MMM YYYY')} at ${moment(message.createdTimestamp).format('h:mm:ss a')}\n${cmndMarker}**Content :** ${description}`);
            failure_Embed.setColor(`${cmndColour[2]}`);
            failure_Embed.setThumbnail(fetchedUser.avatarURL({ dynamic: true }));
            failure_Embed.setFooter({ text: message.author.username, iconURL: message.author.avatarURL({ dynamic: true }) });
            failure_Embed.setTimestamp(message.createdTimestamp);

            const notDone_Embed = new Discord.EmbedBuilder();
            notDone_Embed.setTitle(`${cmndError}`);
            notDone_Embed.setColor(`${config.err_hex}`);
            notDone_Embed.setDescription(`Cannot send message to this user. This user's DMs are closed.`);


            const success_Embed = new Discord.EmbedBuilder();
            success_Embed.setTitle(`${cmndEmoji[0]}${config.tls}${cmndName} Sent`);
            success_Embed.setDescription(`${cmndMarker}**Sender :** ${message.author}, ${message.author.tag}\n${cmndMarker}**Sender's id :** ${message.author.id}\n${cmndMarker}**Reciever :** ${fetchedUser}, ${fetchedUser.tag}\n${cmndMarker}**Reciever's id :** ${fetchedUser.id}\n${cmndMarker}**From :** ${message.channel} channel\n${cmndMarker}**Time :** ${moment(message.createdTimestamp).format('ddd, Do MMM YYYY')} at ${moment(message.createdTimestamp).format('h:mm:ss a')}\n${cmndMarker}**Content :** ${description}`);
            success_Embed.setColor(`${cmndColour[0]}`);
            success_Embed.setThumbnail(fetchedUser.avatarURL({ dynamic: true }));
            success_Embed.setFooter({ text: message.author.username, iconURL: message.author.avatarURL({ dynamic: true }) });
            success_Embed.setTimestamp(message.createdTimestamp);

            const done_Embed = new Discord.EmbedBuilder();
            done_Embed.setTitle(`${cmndEmoji[1]}${config.tls}Done`);
            done_Embed.setDescription(`Message sent!!`);
            done_Embed.setColor(`${cmndColour[1]}`);



            // Final_Execution ================================================== >>>>>
            message.delete().catch();

            fetchedUser.send({ embeds: [sentMessage_Embed] }).then(() => {
                message.channel.send({ embeds: [success_Embed] });

                return message.channel.send({ embeds: [done_Embed] }).then((doneMsg) => {
                    setTimeout(() => {
                        doneMsg.delete();
                    }, 1000 * 5);
                });
            }).catch(() => {
                message.channel.send({ embeds: [failure_Embed] });
                return message.channel.send({ embeds: [notDone_Embed] });
            });
        }
    }
});