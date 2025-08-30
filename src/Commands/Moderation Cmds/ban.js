const Command = require("../../Structures/Command.js");
const Discord = require("discord.js");
const config = require("../../Data/config.json");
const aubdycad = require("../../Data/aubdycad.json");
const emojis = require("../../Data/emojis.json");
const pictures = require("../../Data/pictures.json");
const keys = require("../../Data/keys.json");

const Canvas = require("canvas");
const moment = require("moment");


module.exports = new Command({
    name: "ban",
    description: "A command to directly ban a member from the server.",
    aliases: [],
    permission: "SendMessages",
    allowedChannels: [`${aubdycad.ModCmds_C_ID}`],
    allowedServers: [`${config.TestServer_ID}`, `${config.Aubdycad_ID}`, `${config.XytiusServer_ID}`],
    cooldown: "",
    usage: `${config.prefix}ban <member_mention / member_id> | <reason>  ::  ${config.prefix}ban <list>`,
    usageDesc: `Using this command, a valid executer can ban a valid member from the server. The command always asks for a reason why you're banning the user, so that transparency can be made. Either ID or MENTION, both of the ways can be used to ban a user.\n\nThe command also gives an extra useful feature. A query, "\`list\`" can be used within the command, to get all the banned users from this server. The list also provides every user's ID, if needed in case of unbanning any user.`,
    usageExample: [`${config.prefix}ban @RandomGuy#0001 | User is a raider.`, `${config.prefix}ban 886291251119419432 | Was misbehaving and broke rules 3rd time.`, `${config.prefix}ban list`],
    forTesting: false,
    HUCat: [`admin`],

    async run(message, args, client) {
        const cmndName = `Ban`;
        const cmndEmoji = [`⚒`, `${emojis.ANIMATED_LOADING}`, `👍`];
        const cmndColour = [`f4900c`, `00bf00`];
        const cmndError = `${config.err_emoji}${config.tls}Ban : Command Error!!`;
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


        const canvas = Canvas.createCanvas(2048, 2048);
        const context = canvas.getContext("2d");
        const embedColour = await getColourCode(message.guild.iconURL({ format: "png" }));

        const Admin_Perm = message.member.permissions.has("ADMINISTRATOR");

        const Aubdycad_Srvr = client.guilds.cache.get(`${config.Aubdycad_ID}`);
        const PublicModLogs_Chnl = Aubdycad_Srvr.channels.cache.get(`${aubdycad.PublicModLogs_C_ID}`);


        /*
        ----------------------------------------------------------------------------------------------------
        Embeds
        ----------------------------------------------------------------------------------------------------
        */
        const fetching_Embed = new Discord.MessageEmbed();
        fetching_Embed.setTitle(`${cmndEmoji[1]}  Getting it, please wait...`);
        fetching_Embed.setColor(`${embedColour}`);

        const done_Embed = new Discord.MessageEmbed();
        done_Embed.setTitle(`${cmndEmoji[2]}${config.tls}Done`);
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
        noOptions_Embed.setDescription(`You just forgot to provide me a query for a member to ban from this server. Please provide me either mention/id of the member or "list" option. Use "\`${config.prefix}usage\`" command for this command to get more details on it.`);
        noOptions_Embed.setFooter({ text: message.author.username, iconURL: message.author.avatarURL({ dynamic: true }) });
        noOptions_Embed.setTimestamp(message.createdTimestamp);

        // Possible_Error_2
        if (!args[1]) return message.reply({ embeds: [noOptions_Embed] });


        /*
        ----------------------------------------------------------------------------------------------------
        Functions       
        ----------------------------------------------------------------------------------------------------
        */
        function componentToHex(c) {
            let hex = c.toString(16);
            return hex.length == 1 ? "0" + hex : hex;
        }

        function rgbToHex(r, g, b) {
            return "#" + componentToHex(r) + componentToHex(g) + componentToHex(b);
        }

        async function getColourCode(img) {
            let palette = { r: 0, g: 0, b: 0 };
            let count = 0;

            await Canvas.loadImage(img).then((img) => {
                context.drawImage(img, 0, 0, canvas.width, canvas.height);
            });

            const imgData = context.getImageData(0, 0, canvas.width, canvas.height);
            const dataLength = imgData.data.length;


            for (let i = 0; i < dataLength; i += 4) {
                palette.r += imgData.data[i];
                palette.g += imgData.data[i + 1];
                palette.b += imgData.data[i + 2];

                count++;
            }
    
            palette.r = Math.floor(palette.r / count);
            palette.g = Math.floor(palette.g / count);
            palette.b = Math.floor(palette.b / count);

            const finalHex = `${rgbToHex(palette.r, palette.g, palette.b)}`;
            return finalHex;
        }


        function errorHandle() {
            const invalidID_Embed = new Discord.MessageEmbed();
            invalidID_Embed.setTitle(`${cmndError}`);
            invalidID_Embed.setColor(`${config.err_hex}`);
            invalidID_Embed.setDescription(`The query you just provided me is wrong. Please provide me a valid ID/mention of the member who is in this server, to Ban from this server.`);
            invalidID_Embed.setFooter({ text: message.author.username, iconURL: message.author.avatarURL({ dynamic: true }) });
            invalidID_Embed.setTimestamp(message.createdTimestamp);

            return message.reply({ embeds: [invalidID_Embed] });
        }



        async function buttonPaginator(embs, msg) {
            const allEmbeds = embs;
            const pageCheck = {};
            
            function getRow(id) {
                const paginator_Buttons = new Discord.MessageActionRow();

                if(id === `forcedDisabled`) {
                    paginator_Buttons.addComponents(
                        new Discord.MessageButton()
                        .setCustomId(`paginator_first`)
                        .setStyle(`PRIMARY`)
                        .setEmoji(`⏮`)
                        .setDisabled(true),
                        
                        new Discord.MessageButton()
                        .setCustomId(`paginator_previous`)
                        .setLabel(`Prev`)
                        .setStyle(`SECONDARY`)
                        .setDisabled(true),
                    
                        new Discord.MessageButton()
                        .setCustomId(`paginator_next`)
                        .setLabel(`Next`)
                        .setStyle(`SECONDARY`)
                        .setDisabled(true),

                        new Discord.MessageButton()
                        .setCustomId(`paginator_last`)
                        .setStyle(`PRIMARY`)
                        .setEmoji(`⏭`)
                        .setDisabled(true)
                    );
                } else {
                    paginator_Buttons.addComponents(
                        new Discord.MessageButton()
                        .setCustomId(`paginator_first`)
                        .setStyle(`PRIMARY`)
                        .setEmoji(`⏮`)
                        .setDisabled(pageCheck[id] === 0),
                        
                        new Discord.MessageButton()
                        .setCustomId(`paginator_previous`)
                        .setLabel(`Prev`)
                        .setStyle(`SECONDARY`)
                        .setDisabled(pageCheck[id] === 0),
                    
                        new Discord.MessageButton()
                        .setCustomId(`paginator_next`)
                        .setLabel(`Next`)
                        .setStyle(`SECONDARY`)
                        .setDisabled(pageCheck[id] === allEmbeds.length - 1),

                        new Discord.MessageButton()
                        .setCustomId(`paginator_last`)
                        .setStyle(`PRIMARY`)
                        .setEmoji(`⏭`)
                        .setDisabled(pageCheck[id] === allEmbeds.length - 1)
                    );
                }

                return paginator_Buttons;
            }


            // Execution ================================================== >>>>>
            const id = `Page number`;
            pageCheck[id] = pageCheck[id] || 0;


            msg.edit({ embeds: [allEmbeds[pageCheck[id]]], components: [getRow(id)] }).then(() => {
                const paginator_Collector = message.channel.createMessageComponentCollector({ time: 1000 * 60 });

                paginator_Collector.on(`collect`, async (interaction) => {
                    const notYouCanDo_Embed = new Discord.MessageEmbed();
                    notYouCanDo_Embed.setTitle(`${cmndError}`);
                    notYouCanDo_Embed.setColor(`${config.err_hex}`);
                    notYouCanDo_Embed.setDescription(`Oh oh!! Sorry ${interaction.user.tag}, but you cannot do that. Only ${message.author.tag} can use the button.`);
    
                    // Possible_Error_2
                    if (interaction.user.id !== message.author.id) return interaction.reply({ embeds: [notYouCanDo_Embed], ephemeral: true });
    
    
                    if (interaction.customId === `paginator_first`) {
                        interaction.deferUpdate();

                        pageCheck[id] = 0;
                        msg.edit({ embeds: [allEmbeds[pageCheck[id]]], components: [getRow(id)] });
                    }
                    
                    if (interaction.customId === `paginator_previous`) {
                        interaction.deferUpdate();
                        
                        --pageCheck[id];
                        msg.edit({ embeds: [allEmbeds[pageCheck[id]]], components: [getRow(id)] });
                    }
    
                    if (interaction.customId === `paginator_next`) {
                        interaction.deferUpdate();

                        ++pageCheck[id];
                        msg.edit({ embeds: [allEmbeds[pageCheck[id]]], components: [getRow(id)] });
                    }

                    if (interaction.customId === `paginator_last`) {
                        interaction.deferUpdate();

                        pageCheck[id] = allEmbeds.length - 1;
                        msg.edit({ embeds: [allEmbeds[pageCheck[id]]], components: [getRow(id)] });
                    }
                });


                paginator_Collector.on(`end`, async () => {
                    return msg.edit({ embeds: [allEmbeds[pageCheck[id]]], components: [getRow(`forcedDisabled`)] });
                });
            });
        }



        async function bannedList(Msg) {
            // First_Section ================================================== >>>>>
            const fetchedBans = await message.guild.bans.fetch();
            const banArr = [];
            let count = 0;

            fetchedBans.forEach((mem) => {
                const everyBannedUser = `**${++count}.** ${mem.user.tag} • \`${mem.user.id}\``;
                banArr.push(everyBannedUser);
            });


            // Error_Handling ================================================== >>>>>
            const noBansFound_Embed = new Discord.MessageEmbed();
            noBansFound_Embed.setTitle(`${cmndEmoji[0]}${config.tls}Banned Members : ${message.guild.name}`);
            noBansFound_Embed.setDescription(`**0** Bans found\nNo any member is currently banned from this server.`);
            noBansFound_Embed.setColor(`${embedColour}`);
            noBansFound_Embed.setThumbnail(message.guild.iconURL({ dynamic: true }));
            noBansFound_Embed.setFooter({ text: `Total : 0 | Page: 0 / 0`, iconURL: message.author.avatarURL({ dynamic: true }) });

            // Possible_Error_3
            if(banArr.length === 0) return Msg.edit({ embeds: [noBansFound_Embed] });


            // Second_Section ================================================== >>>>>
            const chunkSize = 10;
            const chunkedArr = [];
            const sourceEmbeds = [];

            for (let i = 0; i < banArr.length; i += chunkSize) {
                const chunk = banArr.slice(i, i + chunkSize);
                chunkedArr.push(chunk);
            }

            for (let i = 0; i < chunkedArr.length; ++i) {
                sourceEmbeds.push(
                    new Discord.MessageEmbed()
                    .setTitle(`${cmndEmoji[0]}${config.tls}Banned Members : ${message.guild.name}`)
                    .setDescription(`${chunkedArr[i].join('\n')}`)
                    .setColor(`${embedColour}`)
                    .setThumbnail(message.guild.iconURL({ dynamic: true }))
                    .setFooter({ text: `Total : ${banArr.length} | Page: ${i + 1} / ${chunkedArr.length}`, iconURL: message.author.avatarURL({ dynamic: true }) })
                );
            }

            return await buttonPaginator(sourceEmbeds, Msg);
        }



        async function banAMember(memb, method) {
            // Error_Handling ================================================== >>>>>
            const notYourself_Embed = new Discord.MessageEmbed();
            notYourself_Embed.setTitle(`${cmndError}`);
            notYourself_Embed.setColor(`${config.err_hex}`);
            notYourself_Embed.setDescription(`Are you alright dude? You wanna ban yourself? Sorry, I can't do this for you. You can ask your Admin for that, if you really wanna ban yourself.`);
            notYourself_Embed.setFooter({ text: message.author.username, iconURL: message.author.avatarURL({ dynamic: true }) });
            notYourself_Embed.setTimestamp(message.createdTimestamp);

            // Possible_Error_4
            if (memb.id === message.author.id) return message.reply({ embeds: [notYourself_Embed] });


            const notManageable_Embed = new Discord.MessageEmbed();
            notManageable_Embed.setTitle(`${cmndError}`);
            notManageable_Embed.setColor(`${config.err_hex}`);
            notManageable_Embed.setDescription(`The user you're trying to ban is above you, and hence I can't ban that user. I guess, even you can get banned after them seeing this message.\nJust saying... 🙄 👉 👈`);
            notManageable_Embed.setFooter({ text: message.author.username, iconURL: message.author.avatarURL({ dynamic: true }) });
            notManageable_Embed.setTimestamp(message.createdTimestamp);

            // Possible_Error_5
            if (!memb.manageable || memb.id === client.user.id) return message.reply({ embeds: [notManageable_Embed] });


            const noReasonProvided_Embed = new Discord.MessageEmbed();
            noReasonProvided_Embed.setTitle(`${cmndError}`);
            noReasonProvided_Embed.setColor(`${config.err_hex}`);
            noReasonProvided_Embed.setDescription(`I cannot proceed further as you just forgot to provide me the reason for the ban. PLease specify a valid reason to ban that user from this server. Use "\`${config.prefix}usage\`" command for this command to get more details on it.`);
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
            modLogMessage_Embed.setTitle(`${cmndEmoji[0]}${config.tls}Member Banned!!`);
            modLogMessage_Embed.setColor(`${cmndColour[0]}`);
            modLogMessage_Embed.setThumbnail(memb.user.avatarURL({ dynamic: true }));
            modLogMessage_Embed.setFooter({ text: client.user.username, iconURL: client.user.avatarURL({ dynamic: true }) });
            modLogMessage_Embed.setTimestamp(message.createdTimestamp);

            const userInformingNotice_Embed = new Discord.MessageEmbed();
            userInformingNotice_Embed.setTitle(`${cmndEmoji[0]}${config.tls}Ban Notice!!`);
            userInformingNotice_Embed.setDescription(`This is to inform you that, you've been Banned from **"${message.guild.name}"** server.\n\n${m_}**Reason :** ${reason}`);
            userInformingNotice_Embed.setColor(`${cmndColour[0]}`);
            userInformingNotice_Embed.setFooter({ text: client.user.username, iconURL: client.user.avatarURL({ dynamic: true }) });
            userInformingNotice_Embed.setTimestamp(message.createdTimestamp);



            // Execution ================================================== >>>>>
            memb.ban({ reason: reason });

            message.delete().catch();
            message.channel.send({ embeds: [done_Embed] }).then((msg) => {
                setTimeout(() => {
                    msg.delete();
                }, 1000 * 3);
            });


            const isInformed = [`Yes`];

            await memb.user.send({ embeds: [userInformingNotice_Embed] }).catch(() => { isInformed.push(`No`) });

            modLogMessage_Embed.setDescription(`${m_}**User :** ${memb.user}, ${memb.user.tag}\n${m_}**User id :** ${memb.user.id}\n${m_}**Method :** ${method}\n${m_}**Joined on :** ${moment(memb.joinedAt).format('ddd, Do MMM YYYY, h:mm a')}\n${m_}**Action by :** ${message.author}, ${message.author.tag}\n${m_}**From :** ${message.channel} channel\n${m_}**Is informed :** ${isInformed[isInformed.length - 1]}\n${m_}**Reason for Ban :** ${reason}`);
            
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
        if (args[1] === `list`) {
            message.channel.send({ embeds: [fetching_Embed] }).then(async (fetchingMsg) => {
                await bannedList(fetchingMsg);
            });
        } else if (target && args[1].startsWith("<@")) {
            const firstSect = args[1].slice(2);
            const secSect = firstSect.split("");
            secSect.splice(-1);
            const member = message.guild.members.cache.get(`${secSect.join("")}`);

            // Possible_Error_3
            if (member === null || member === undefined) return errorHandle();

            return await banAMember(member, `By Mention`);
        } else if (!alphabet) {
            const member = message.guild.members.cache.get(`${args[1]}`);

            // Possible_Error_3
            if (member === null || member === undefined) return errorHandle();

            return await banAMember(member, `By Id`);
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