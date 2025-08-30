const Command = require("../../Structures/Command.js");
const Discord = require("discord.js");
const config = require("../../Data/config.json");
const aubdycad = require("../../Data/aubdycad.json");
const emojis = require("../../Data/emojis.json");
const pictures = require("../../Data/pictures.json");
const keys = require("../../Data/keys.json");

const moment = require("moment");


module.exports = new Command({
    name: "report",
    description: "Register a complaint about anything 'not right' in the server with total privacy.",
    aliases: [],
    permission: "SendMessages",
    allowedChannels: [`${aubdycad.ModCmds_C_ID}`, `${aubdycad.GeneralChats_C_ID}`, `${aubdycad.Media_C_ID}`, `${aubdycad.BotCommands1_C_ID}`, `${aubdycad.BotCommands2_C_ID}`],
    allowedServers: [`${config.Aubdycad_ID}`],
    cooldown: "",
    usage: `${config.prefix}report <description>`,
    usageDesc: `**NOTE :** Before using the command, you should turn "\`Allow direct messages from server members\`" option ON, from the "\`Privacy & Safety\`" section of your Discord settings (if it's not yet). This option will allow server members to send DMs to you. You can turn this option OFF, once you're done reporting your issue. This action is necessary to proceed with the command. It's just for your own privacy.\n\nTo report any issue, just use the command in any valid channel and describe (while using the command), what issue you're having. For your privacy, the moment you send the command, it disappears from the channel and automatically shifts to your DMs (so that only you can see the proceedings). From there, you can choose if your report is going to be "PUBLIC" or "PRIVATE". As name says, PUBLIC reports will be visible to all, but PRIVATE reports can only be accessed by the Owner of the server, nobody else. If this all was done by mistake, you still have chance to cancel to proceeding.\n\nAll PUBLIC reports are accessible from <#${aubdycad.Reports_C_ID}> channel. Users can upvote or downvote reports symbolising, they stand for or against other's reports.`,
    usageExample: [`${config.prefix}report I'm having an issue with X command, where I'm not able to use button where others can. What could be the issue?`, `${config.prefix}report A user, @RandomGuy#0001 is bullying me in #general chats. Please help me!!`],
    forTesting: false,
    HUCat: [`gen`, `general`],

    async run(message, args, client) {
        const cmndName = `Report`;
        const cmndEmoji = [`📑`, `✅`, `💢`,  `🔺`, `🔻`];
        const cmndColour = [`744eaa`, `77b255`, `be1931`];
        const cmndError = `${config.err_emoji}${config.tls}Report : Command Error!!`;
        const cmndMarker = `${config.marker}`;

        /*
        ----------------------------------------------------------------------------------------------------
        Start                                                                   
        ----------------------------------------------------------------------------------------------------
        */
        const description = args.slice(1).join(" ");
        const AubdycadServer = client.guilds.cache.get(`${config.Aubdycad_ID}`);
        const Reports_Chnl = message.guild.channels.cache.get(`${aubdycad.Reports_C_ID}`);
        const PvtReports_Chnl = message.guild.channels.cache.get(`${aubdycad.PvtReports_C_ID}`);
        const ReportsLogs_Chnl = message.guild.channels.cache.get(`${aubdycad.ReportsLogs_C_ID}`);


        /*
        ----------------------------------------------------------------------------------------------------
        Embeds                                                                   
        ----------------------------------------------------------------------------------------------------
        */
        const DMsOff_Embed = new Discord.EmbedBuilder();
        DMsOff_Embed.setTitle(`${cmndError}`);
        DMsOff_Embed.setColor(`${config.err_hex}`);
        DMsOff_Embed.setDescription(`Your **"Allow direct messages from server members"** option is **OFF** (🔴). Please turn this option **ON** (🟢) from your Settings. I cannot proceed further without this. Once you're done with it, you can try again.`);
        DMsOff_Embed.setFooter({ text: message.author.username, iconURL: message.author.avatarURL({ dynamic: true }) });
        DMsOff_Embed.setTimestamp(message.createdTimestamp);


        const confirm_Embed = new Discord.EmbedBuilder();
        confirm_Embed.setTitle(`${cmndEmoji[0]}${config.tls}${cmndName} Confirmation`);
        confirm_Embed.setColor(`${cmndColour[0]}`);
        confirm_Embed.setDescription(`Please confirm whether you want your report to be Public or Private. Any Public report is available for all in ${AubdycadServer.channels.cache.get(`${aubdycad.Reports_C_ID}`)} channel. Private reports are only accessible by the Owner of **${message.guild.name}** Server and no one else (not even any Moderator or any other Admin). So, be very sure about the privacy of your report, if you want it to be seen by the Owner only.`);
        confirm_Embed.setFooter({ text: client.user.username, iconURL: client.user.avatarURL({ dynamic: true }) });
        confirm_Embed.setTimestamp(message.createdTimestamp);

        const confirmSuccess_Embed = new Discord.EmbedBuilder();
        confirmSuccess_Embed.setTitle(`${cmndEmoji[1]}${config.tls}${cmndName} Confirmation Done`);
        confirmSuccess_Embed.setColor(`${cmndColour[1]}`);
        confirmSuccess_Embed.setFooter({ text: client.user.username, iconURL: client.user.avatarURL({ dynamic: true }) });
        confirmSuccess_Embed.setTimestamp(message.createdTimestamp);

        const confirmCancelled_Embed = new Discord.EmbedBuilder();
        confirmCancelled_Embed.setTitle(`${cmndEmoji[2]}${config.tls}${cmndName} Confirmation Cancelled`);
        confirmCancelled_Embed.setColor(`${cmndColour[2]}`);
        confirmCancelled_Embed.setDescription(`You just cancelled your report from proceeding further. Hope you had a nice experience. Thank you!!`);
        confirmCancelled_Embed.setFooter({ text: client.user.username, iconURL: client.user.avatarURL({ dynamic: true }) });
        confirmCancelled_Embed.setTimestamp(message.createdTimestamp);

        const confirmExpired_Embed = new Discord.EmbedBuilder();
        confirmExpired_Embed.setTitle(`${cmndEmoji[2]}${config.tls}${cmndName} Confirmation Expired`);
        confirmExpired_Embed.setColor(`${cmndColour[2]}`);
        confirmExpired_Embed.setDescription(`Your confirmation message has been expired, as you didn't responded within a minute. If you wanna report again, you can go through the same procedure again. Hope you had a nice experience. Thank you!!`);
        confirmExpired_Embed.setFooter({ text: client.user.username, iconURL: client.user.avatarURL({ dynamic: true }) });
        confirmExpired_Embed.setTimestamp(message.createdTimestamp);

        const confirm_Buttons = new Discord.ActionRowBuilder().addComponents(
            new Discord.ButtonBuilder()
            .setLabel("Public")
            .setStyle(Discord.ButtonStyle.Secondary)
            .setCustomId("report_public"),

            new Discord.ButtonBuilder()
            .setLabel("Private")
            .setStyle(Discord.ButtonStyle.Secondary)
            .setCustomId("report_private"),

            new Discord.ButtonBuilder()
            .setLabel("Cancel")
            .setStyle(Discord.ButtonStyle.Danger)
            .setCustomId("report_cancel")
        );


        /*
        ----------------------------------------------------------------------------------------------------
        Error Handling                                                                   
        ----------------------------------------------------------------------------------------------------
        */
        const noDescription_Embed = new Discord.EmbedBuilder();
        noDescription_Embed.setTitle(`${cmndError}`);
        noDescription_Embed.setColor(`${config.err_hex}`);
        noDescription_Embed.setDescription(`You didn't provided me any description for your report. Please describe your content about what you wanna report.`);
        noDescription_Embed.setFooter({ text: message.author.username, iconURL: message.author.avatarURL({ dynamic: true }) });
        noDescription_Embed.setTimestamp(message.createdTimestamp);

        // Possible_Error_1
        if(!description) {
            message.delete().catch();
            return message.author.send({ embeds: [noDescription_Embed] }).catch(() => {
                return message.channel.send({ embeds: [DMsOff_Embed] }).then((dmsoffMsg) => {
                    setTimeout(() => {
                        dmsoffMsg.delete();
                    }, 1000 * 15);
                });
            });
        }


        /*
        ----------------------------------------------------------------------------------------------------
        Functions                                                                   
        ----------------------------------------------------------------------------------------------------
        */
        function reportsLogs(msg) {
            const log_Embed = new Discord.EmbedBuilder();
            log_Embed.setTitle(`${cmndEmoji[0]}${config.tls}${cmndName} | ${message.author.tag}`);
            log_Embed.setColor(`${cmndColour[0]}`);
            log_Embed.setDescription(`${msg}`);
            log_Embed.setFooter({ text: message.author.username, iconURL: message.author.avatarURL({ dynamic: true }) });

            ReportsLogs_Chnl.send({ embeds: [log_Embed] });
        }


        function channelErrCheck(channel, msg) {
            const unknownErrorChnl_Embed = new Discord.EmbedBuilder();
            unknownErrorChnl_Embed.setTitle(`${cmndError}`);
            unknownErrorChnl_Embed.setColor(`${config.err_hex}`);
            unknownErrorChnl_Embed.setDescription(`An unknown error just occured and I cannot find the specified channel!! Please address this issue either to the Owner or to the Moderators to get this issue fixed as soon as possible.`);
            unknownErrorChnl_Embed.setFooter({ text: message.author.username, iconURL: message.author.avatarURL({ dynamic: true }) });
            unknownErrorChnl_Embed.setTimestamp(message.createdTimestamp);

            // Possible_Error_3
            if(channel === undefined || channel === null) {
                confirm_Buttons.components[0].setDisabled(true);
                confirm_Buttons.components[1].setDisabled(true);
                confirm_Buttons.components[2].setDisabled(true);

                msg.edit({ embeds: [confirm_Embed], components: [confirm_Buttons] });
                return message.author.send({ embeds: [unknownErrorChnl_Embed] });
            }


            const botChnlPerms = channel.permissionsFor(client.user, true).toArray();
            const neededBotChnlPerms = [`ViewChannel`, `SendMessages`, `UseExternalEmojis`, `AddReactions`];


            const unknownErrorPerms_Embed = new Discord.EmbedBuilder();
            unknownErrorPerms_Embed.setTitle(`${cmndError}`);
            unknownErrorPerms_Embed.setColor(`${config.err_hex}`);
            unknownErrorPerms_Embed.setDescription(`An unknown error just occured and I don't have permission to proceed!! Please address this issue either to the Owner or to the Moderators to get this issue fixed as soon as possible.`);
            unknownErrorPerms_Embed.setFooter({ text: message.author.username, iconURL: message.author.avatarURL({ dynamic: true }) });
            unknownErrorPerms_Embed.setTimestamp(message.createdTimestamp);

            // Possible_Error_4
            if(!(
                botChnlPerms.includes(`${neededBotChnlPerms[0]}`)
                && botChnlPerms.includes(`${neededBotChnlPerms[1]}`)
                && botChnlPerms.includes(`${neededBotChnlPerms[2]}`)
                && botChnlPerms.includes(`${neededBotChnlPerms[3]}`)
            )) {
                confirm_Buttons.components[0].setDisabled(true);
                confirm_Buttons.components[1].setDisabled(true);
                confirm_Buttons.components[2].setDisabled(true);

                msg.edit({ embeds: [confirm_Embed], components: [confirm_Buttons] });
                return message.author.send({ embeds: [unknownErrorPerms_Embed] });
            }
        }


        function finalSendEmbed(embed) {
            embed.setTitle(`${cmndEmoji[0]}${config.tls}${cmndName} | ${message.author.tag}`);
            embed.setColor(`${cmndColour[0]}`);
            embed.setDescription(`${cmndMarker}**Member :** ${message.author}\n${cmndMarker}**From :** ${message.channel} channel\n${cmndMarker}**Time :** ${moment(message.createdTimestamp).format('ddd, Do MMM YYYY, h:mm a')}`);
            embed.addFields({
                name: `${cmndMarker}Description :`,
                value: `${description}`,
                inline: false
            });
            embed.setThumbnail(message.author.avatarURL({ dynamic: true }));
        }


        /*
        ----------------------------------------------------------------------------------------------------
        Execution                                                                   
        ----------------------------------------------------------------------------------------------------
        */
        message.delete().catch();
        reportsLogs(`Used from ${message.channel} channel.`);

        message.author.send({ embeds: [confirm_Embed], components: [confirm_Buttons] }).then((confirmMsg) => {
            const confirm_Collector = confirmMsg.channel.createMessageComponentCollector({ time: 1000 * 60 });
            const checkInteraction = [];

            confirm_Collector.on(`collect`, async (interaction) => {
                const notYouCanDo_Embed = new Discord.EmbedBuilder();
                notYouCanDo_Embed.setTitle(`${cmndError}`);
                notYouCanDo_Embed.setColor(`${config.err_hex}`);
                notYouCanDo_Embed.setDescription(`Oh oh!! Sorry ${interaction.user.tag}, but you cannot do that. Only ${message.author.tag} can use the button.`);

                // Possible_Error_2
                if (interaction.user.id !== message.author.id) return interaction.reply({ embeds: [notYouCanDo_Embed], ephemeral: true });


                if (interaction.customId === `report_public`) {
                    interaction.deferUpdate();
                    checkInteraction.push(`Button clicked`);
                    reportsLogs(`Chose "PUBLIC" button.`);

                    channelErrCheck(Reports_Chnl, confirmMsg);

                    const publicReport_Embed = new Discord.EmbedBuilder();
                    finalSendEmbed(publicReport_Embed);

                    Reports_Chnl.send({ embeds: [publicReport_Embed] }).then((publicreportMsg) => {
                        publicreportMsg.react(`${cmndEmoji[3]}`);
                        publicreportMsg.react(`${cmndEmoji[4]}`);


                        confirmSuccess_Embed.setDescription(`Your report has been succesfully submitted. You can view your report in ${AubdycadServer.channels.cache.get(`${aubdycad.Reports_C_ID}`)} channel. Hope you had a nice experience. Thank you!!`);

                        confirm_Buttons.components[0].setDisabled(true);
                        confirm_Buttons.components[1].setDisabled(true);
                        confirm_Buttons.components[2].setDisabled(true);

                        return confirmMsg.edit({ embeds: [confirmSuccess_Embed], components: [confirm_Buttons] });
                    });
                }

                if (interaction.customId === `report_private`) {
                    interaction.deferUpdate();
                    checkInteraction.push(`Button clicked`);
                    reportsLogs(`Chose "PRIVATE" button.`);

                    channelErrCheck(PvtReports_Chnl, confirmMsg);

                    const privateReport_Embed = new Discord.EmbedBuilder();
                    finalSendEmbed(privateReport_Embed);

                    PvtReports_Chnl.send({ embeds: [privateReport_Embed] }).then((privatereportMsg) => {
                        confirmSuccess_Embed.setDescription(`Your report has been succesfully submitted and is on the queue to be viewed by the Owner himself. Never to worry, your private reports will always be private and will never be exposed to anyone else. Hope you had a nice experience. Thank you!!`);

                        confirm_Buttons.components[0].setDisabled(true);
                        confirm_Buttons.components[1].setDisabled(true);
                        confirm_Buttons.components[2].setDisabled(true);

                        return confirmMsg.edit({ embeds: [confirmSuccess_Embed], components: [confirm_Buttons] });
                    });
                }

                if (interaction.customId === `report_cancel`) {
                    interaction.deferUpdate();
                    checkInteraction.push(`Button clicked`);
                    reportsLogs(`Chose "CANCEL" button.`);

                    confirm_Buttons.components[0].setDisabled(true);
                    confirm_Buttons.components[1].setDisabled(true);
                    confirm_Buttons.components[2].setDisabled(true);

                    return confirmMsg.edit({ embeds: [confirmCancelled_Embed], components: [confirm_Buttons] });
                }
            });


            confirm_Collector.on(`end`, async () => {
                confirm_Buttons.components[0].setDisabled(true);
                confirm_Buttons.components[1].setDisabled(true);
                confirm_Buttons.components[2].setDisabled(true);

                if (checkInteraction.length !== 0) return;
                reportsLogs(`Confirmation message expired.`);
                return confirmMsg.edit({ embeds: [confirmExpired_Embed], components: [confirm_Buttons] });
            });
        }).catch(() => {
            reportsLogs(`User's DMs are "OFF".`);
            return message.channel.send({ embeds: [DMsOff_Embed] }).then((dmsoffMsg) => {
                setTimeout(() => {
                    dmsoffMsg.delete();
                }, 1000 * 8);
            });
        });
    }
});