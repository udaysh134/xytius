const Command = require("../../Structures/Command.js");
const Discord = require("discord.js");
const config = require("../../Data/config.json");
const aubdycad = require("../../Data/aubdycad.json");
const emojis = require("../../Data/emojis.json");
const pictures = require("../../Data/pictures.json");
const keys = require("../../Data/keys.json");

const antiJoin_DB = require("../../Schemas/antiJoin_DB");
const moment = require("moment");


module.exports = new Command({
    name: "antijoin",
    description: "Enables a system which prevents any user to join the server.",
    aliases: ["aj"],
    permission: "SendMessages",
    allowedChannels: [`${aubdycad.ModCmds_C_ID}`],
    allowedServers: [`${config.TestServer_ID}`, `${config.Aubdycad_ID}`, `${config.XytiusServer_ID}`],
    cooldown: "",
    usage: `${config.prefix}antijoin`,
    usageDesc: `Just use the command and you'll be provided the status of the system at the time. If it's disabled, you can enable it just by a click. If it's enabled, you'll be able to see who and when enabled this service. Once again, you can disable it at any time.\n\nEnabeling this service won't let anyone to enter in the server, untill it's turned back off. This is a feature to prevent sudden raids.`,
    usageExample: [`${config.prefix}antijoin`],
    forTesting: false,
    HUCat: [`admin`],

    async run(message, args, client) {
        const cmndName = `Anti-Join`;
        const cmndEmoji = [`🚪`];
        const cmndColour = [`bf6952`];
        const cmndError = `${config.err_emoji}${config.tls}Anti-Join : Command Error!!`;
        const cmndMarker = `${config.marker}`;

        /*
        ----------------------------------------------------------------------------------------------------
        Start
        ----------------------------------------------------------------------------------------------------
        */
        const Admin_Perm = message.member.permissions.has("ADMINISTRATOR");


        /*
        ----------------------------------------------------------------------------------------------------
        Error Handling
        ----------------------------------------------------------------------------------------------------
        */
        const notThisGuild_Embed = new Discord.MessageEmbed();
        notThisGuild_Embed.setTitle(`${cmndError}`);
        notThisGuild_Embed.setColor(`${config.err_hex}`);
        notThisGuild_Embed.setDescription(`Sorry, but you cannot use this command in this Server, as this server is not yet registered in my programmed brain.`);
        notThisGuild_Embed.setFooter({ text: message.author.username, iconURL: message.author.avatarURL({ dynamic: true }) });
        notThisGuild_Embed.setTimestamp(message.createdTimestamp);

        // Possible_Error_1
        if(
            message.guild.id !== `${config.Aubdycad_ID}`
            && message.guild.id !== `${config.TestServer_ID}`
            && message.guild.id !== `${config.XytiusServer_ID}`
        ) return message.reply({ embeds: [notThisGuild_Embed] });


        const notEligible_Embed = new Discord.MessageEmbed();
        notEligible_Embed.setTitle(`${cmndError}`);
        notEligible_Embed.setColor(`${config.err_hex}`);
        notEligible_Embed.setDescription(`Sorry, you don't have permission to use this command as you're not currently eligible for this. The command is for only **Admins** in this server.`);
        notEligible_Embed.setFooter({ text: message.author.username, iconURL: message.author.avatarURL({ dynamic: true }) });
        notEligible_Embed.setTimestamp(message.createdTimestamp);

        // Possible_Error_2
        if(!Admin_Perm) return message.reply({ embeds: [notEligible_Embed] });


        /*
        ----------------------------------------------------------------------------------------------------
        Functions
        ----------------------------------------------------------------------------------------------------
        */
        function getRows(page, disabled) {
            const navigation_Buttons = new Discord.MessageActionRow();

            if(disabled === `yes`) {
                navigation_Buttons.addComponents(
                    new Discord.MessageButton()
                    .setCustomId(`aj_turnOn`)
                    .setLabel(`Turn ON`)
                    .setStyle(`SUCCESS`)
                    .setDisabled(true),
                
                    new Discord.MessageButton()
                    .setCustomId(`aj_turnOff`)
                    .setLabel(`Turn OFF`)
                    .setStyle(`DANGER`)
                    .setDisabled(true)
                );
            } else {
                navigation_Buttons.addComponents(
                    new Discord.MessageButton()
                    .setCustomId(`aj_turnOn`)
                    .setLabel(`Turn ON`)
                    .setStyle(`SUCCESS`)
                    .setDisabled(page === `on`),
                
                    new Discord.MessageButton()
                    .setCustomId(`aj_turnOff`)
                    .setLabel(`Turn OFF`)
                    .setStyle(`DANGER`)
                    .setDisabled(page === `off`)
                );
            }

            return navigation_Buttons;
        }


        async function finalResult(guild, sendChannel) {
            let AJ_status;
            let AJ_user;
            let AJ_channel;
            let AJ_time;

            await antiJoin_DB.findOne({ GuildID: message.guild.id }).then((data) => {
                if(!data) {
                    AJ_status = `off`;
                } else {
                    AJ_status = `on`;
                    AJ_user = client.users.cache.get(`${data.UserID}`);
                    AJ_channel = guild.channels.cache.get(`${data.ChannelID}`);
                    AJ_time = `${moment(data.Time).format('ddd, Do MMM YYYY, h:mm:ss a')}`;
                }
            });


            const antijoin_Embed = new Discord.MessageEmbed();
            antijoin_Embed.setTitle(`${cmndEmoji[0]}${config.tls}${cmndName}`);
            antijoin_Embed.setColor(`${cmndColour[0]}`);
            antijoin_Embed.setThumbnail(message.guild.iconURL());

            if(AJ_status === `off`) {
                antijoin_Embed.setDescription(`${cmndMarker}**Current status :** 🔴`);
            } else if(AJ_status === `on`) {
                antijoin_Embed.setDescription(`${cmndMarker}**Current status :** 🟢\n${cmndMarker}**By :** ${AJ_user}, ${AJ_user.tag}\n${cmndMarker}**From :** ${AJ_channel} channel\n${cmndMarker}**On :** ${AJ_time}`);
            }



            // Error_Handling ================================================== >>>>>
            const noChannel_Embed = new Discord.MessageEmbed();
            noChannel_Embed.setTitle(`${cmndError}`);
            noChannel_Embed.setColor(`${config.err_hex}`);
            noChannel_Embed.setDescription(`I cannot find the specified channel to work with. And hence, I cannot proceed further with this command.`);
            noChannel_Embed.setFooter({ text: message.author.username, iconURL: message.author.avatarURL({ dynamic: true }) });
            noChannel_Embed.setTimestamp(message.createdTimestamp);

            // Possible_Error_3
            if(sendChannel === undefined || sendChannel === null) return message.reply({ embeds: [noChannel_Embed] });


            const botChnlPerms = sendChannel.permissionsFor(client.user, true).toArray();
            const neededBotChnlPerms = [`VIEW_CHANNEL`, `SEND_MESSAGES`, `USE_EXTERNAL_EMOJIS`];

            const notHavingPerms_Embed = new Discord.MessageEmbed();
            notHavingPerms_Embed.setTitle(`${cmndError}`);
            notHavingPerms_Embed.setColor(`${config.err_hex}`);
            notHavingPerms_Embed.setDescription(`I cannot proceed further as I'm lacking necessary permissions. I need **${neededBotChnlPerms.join(", ")}** permissions for ${sendChannel} channel to proceed to the next step.`);
            notHavingPerms_Embed.setFooter({ text: message.author.username, iconURL: message.author.avatarURL({ dynamic: true }) });
            notHavingPerms_Embed.setTimestamp(message.createdTimestamp);

            // Possible_Error_4
            if (!(
                botChnlPerms.includes(`${neededBotChnlPerms[0]}`)
                && botChnlPerms.includes(`${neededBotChnlPerms[1]}`)
                && botChnlPerms.includes(`${neededBotChnlPerms[2]}`)
            )) return message.reply({ embeds: [notHavingPerms_Embed] });



            // Execution ================================================== >>>>>
            message.channel.send({ embeds: [antijoin_Embed], components: [getRows(AJ_status)] }).then((ajMsg) => {
                const navigation_Collector = message.channel.createMessageComponentCollector({ time: 1000 * 30 });
                const lastClicked = [`${AJ_status}`];

                navigation_Collector.on(`collect`, async (interaction) => {
                    const notYouCanDo_Embed = new Discord.MessageEmbed();
                    notYouCanDo_Embed.setTitle(`${cmndError}`);
                    notYouCanDo_Embed.setColor(`${config.err_hex}`);
                    notYouCanDo_Embed.setDescription(`Oh oh!! Sorry ${interaction.user.tag}, but you cannot do that. Only ${message.author.tag} can use the button.`);

                    // Possible_Error_1
                    if(interaction.user.id !== message.author.id) return interaction.reply({ embeds: [notYouCanDo_Embed], ephemeral: true });


                    if(interaction.customId === `aj_turnOn`) {
                        lastClicked.push(`on`);
                        interaction.deferUpdate();


                        await antiJoin_DB.create({
                            GuildID: message.guild.id,
                            UserID: message.author.id,
                            UserName: message.author.tag,
                            ChannelID: message.channel.id,
                            Time: interaction.createdTimestamp
                        }).then(() => {
                            const logChannelMessage_Embed = new Discord.MessageEmbed();
                            logChannelMessage_Embed.setTitle(`${cmndEmoji[0]}${config.tls}${cmndName}`);
                            logChannelMessage_Embed.setDescription(`*Anti-Join function was turned **ON*** ...\n${cmndMarker}**By :** ${message.author}, ${message.author.tag}\n${cmndMarker}**From :** ${message.channel} channel\n${cmndMarker}**On :** ${moment(interaction.createdTimestamp).format('ddd, Do MMM YYYY, h:mm:ss a')}`);
                            logChannelMessage_Embed.setColor(`${cmndColour[0]}`);
                            logChannelMessage_Embed.setThumbnail(message.author.avatarURL({ dynamic: true }));

                            antijoin_Embed.setDescription(`*Anti-Join function is now **ACTIVATED***.\nToggled by ${message.author}, from ${message.channel} channel, on ${moment(interaction.createdTimestamp).format('ddd, Do MMM YYYY, h:mm:ss a')}`);
                            
                            sendChannel.send({ embeds: [logChannelMessage_Embed] });
                            ajMsg.edit({ embeds: [antijoin_Embed], components: [getRows(`off`, `yes`)] });
                        });

                        return navigation_Collector.stop();
                    }


                    if(interaction.customId === `aj_turnOff`) {
                        lastClicked.push(`off`);
                        interaction.deferUpdate();


                        await antiJoin_DB.findOne({ GuildID: message.guild.id }).then((data) => {
                            const dataUser = client.users.cache.get(`${data.UserID}`);
                            const dataChannel = guild.channels.cache.get(`${data.ChannelID}`);
                            const dataTime = `${moment(data.Time).format('ddd, Do MMM YYYY, h:mm:ss a')}`;


                            const logChannelMessage_Embed = new Discord.MessageEmbed();
                            logChannelMessage_Embed.setTitle(`${cmndEmoji[0]}${config.tls}${cmndName}`);
                            logChannelMessage_Embed.setDescription(`*Anti-Join function was turned **OFF*** ...\n${cmndMarker}**By :** ${message.author}, ${message.author.tag}\n${cmndMarker}**From :** ${message.channel} channel\n${cmndMarker}**On :** ${moment(interaction.createdTimestamp).format('ddd, Do MMM YYYY, h:mm:ss a')}\n\n*It was previously turned **ON*** ...\n${cmndMarker}**By :** ${dataUser}, ${dataUser.tag}\n${cmndMarker}**From :** ${dataChannel} channel\n${cmndMarker}**On :** ${dataTime}`);
                            logChannelMessage_Embed.setColor(`${cmndColour[0]}`);
                            logChannelMessage_Embed.setThumbnail(message.author.avatarURL({ dynamic: true }));

                            antijoin_Embed.setDescription(`*Anti-Join function is now **DEACTIVATED***.\nToggled by ${message.author}, from ${message.channel} channel, on ${moment(interaction.createdTimestamp).format('ddd, Do MMM YYYY, h:mm:ss a')}`);
                            
                            sendChannel.send({ embeds: [logChannelMessage_Embed] });
                            ajMsg.edit({ embeds: [antijoin_Embed], components: [getRows(`on`, `yes`)] });
                        });

                        await antiJoin_DB.deleteOne({ GuildID: message.guild.id });
                        return navigation_Collector.stop();
                    }
                });


                navigation_Collector.on(`end`, async () => {
                    const lastClickedRes = lastClicked.pop();
                    
                    ajMsg.edit({ components: [getRows(lastClickedRes, `yes`)] });
                    return navigation_Collector.stop();
                });
            });
        }


        /*
        ----------------------------------------------------------------------------------------------------
        Execution
        ----------------------------------------------------------------------------------------------------
        */
        if (message.guild.id === `${config.Aubdycad_ID}`) {
            const Aubdycad_Srvr = client.guilds.cache.get(`${config.Aubdycad_ID}`);
            const DefenseLogs_Chnl = Aubdycad_Srvr.channels.cache.get(`${aubdycad.DefenseLogs_C_ID}`);


            // Execution ================================================== >>>>>
            return await finalResult(Aubdycad_Srvr, DefenseLogs_Chnl);
        } else if(message.guild.id === `${config.TestServer_ID}`) {
            const Test_Srvr = client.guilds.cache.get(`${config.TestServer_ID}`);
            const TestAntijoin_Chnl = Test_Srvr.channels.cache.get(`994230548027420722`);


            // Execution ================================================== >>>>>
            return await finalResult(Test_Srvr, TestAntijoin_Chnl);
        } else if(message.guild.id === `${config.XytiusServer_ID}`) {
            const Xytius_Srvr = client.guilds.cache.get(`${config.XytiusServer_ID}`);
            const XytiusAntijoin_Chnl = Xytius_Srvr.channels.cache.get(`968582856869814302`);


            // Execution ================================================== >>>>>
            return await finalResult(Xytius_Srvr, XytiusAntijoin_Chnl);
        }
    }
});