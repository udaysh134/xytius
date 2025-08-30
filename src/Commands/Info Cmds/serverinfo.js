const Command = require("../../Structures/Command.js");
const Discord = require("discord.js");
const config = require("../../Data/config.json");
const aubdycad = require("../../Data/aubdycad.json");
const emojis = require("../../Data/emojis.json");
const pictures = require("../../Data/pictures.json");
const keys = require("../../Data/keys.json");

const moment = require("moment");
const Canvas = require("canvas");


module.exports = new Command({
    name: "serverinfo",
    description: "Fetch detailed information of a server you're in.",
    aliases: ["sinfo"],
    permission: "SendMessages",
    allowedChannels: [`${aubdycad.BotCommands1_C_ID}`, `${aubdycad.BotCommands2_C_ID}`],
    allowedServers: [`${config.TestServer_ID}`, `${config.Aubdycad_ID}`, `${config.XytiusServer_ID}`],
    cooldown: "",
    usage: `${config.prefix}serverinfo [server_id]`,
    usageDesc: `The command is used, similarly as "\`${config.prefix}chhannelinfo\`" command. Just use the command in a server and you'll get to see a lot of information of that server. The command can also be optionally used with an ID (a server's ID). You can give a second query as the ID of another server and Xytius will fetch info from that server too. But in this case, you'll have to make sure that the bot is present there too. If not, it cannot proceed.\n\nThe fetched info is later categorised into "PRIMARY", "SECONDARY" and "TERTIARY" tabs. This is it, to organise all the parameters of data, to provide info according to the needs of the users and to give an overall minimal look.`,
    usageExample: [`${config.prefix}serverinfo`, `${config.prefix}serverinfo 890847536485634058`],
    forTesting: false,
    HUCat: [`gen`, `info`],

    async run(message, args, client) {
        const cmndName = `Server Info`;
        const cmndEmoji = [`📡`];
        const cmndColour = [`ffffff`];
        const cmndError = `${config.err_emoji}${config.tls}Server Info : Command Error!!`;
        const cmndMarker = `${config.marker}`;

        /*
        ----------------------------------------------------------------------------------------------------
        Start                                                                   
        ----------------------------------------------------------------------------------------------------
        */
        const canvas = Canvas.createCanvas(2048, 2048);
        const context = canvas.getContext("2d");


        /*
        ----------------------------------------------------------------------------------------------------
        Functions
        ----------------------------------------------------------------------------------------------------
        */
        function standardiseCase(value) {
            const splitted = value.split('');
            const firstVal = splitted[0].toUpperCase();
            const otherVal = splitted.slice(1).join('');

            let resultValue = `${firstVal}${otherVal.toLowerCase().replace(/_/g, " ")}`;
            return resultValue;
        }


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
            
            return `${hours}${hoursText} ${minutes}${minutesText}`;
        }


        function rolesDisplay(arr, limit) {
            if(arr.length === 0) {
                return `None`;
            } else if(arr.length > limit) {
                let text = ``;

                for (let i = 0; i < (limit - 1); i++) {
                    text += `${arr[i]}, `;
                }

                text += `...(+${arr.length - (limit)} more)... , `;
                text += `${arr[arr.length - 1]}`;

                return text;
            } else {
                let text = ``;

                arr.forEach((elem) => {
                    text += `${elem}, `;
                });

                let res = text.split("");
                res.splice(-2);
                return res.join("");
            }
        }


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


        function pluralForm(query, condition) {
            let res = condition ? `${query}s` : `${query}`;
            return res;
        }


        async function finalResult(srvr) {
            // Primary_Info_Section ================================================== >>>>>
            let svrName = srvr.name;
            let svrDesc = srvr.description ?? `None`;
            let svrId = srvr.id;
            
            const owner = client.users.cache.get(`${srvr.ownerId}`);
            let svrOwner = `${owner}, ${owner.tag}`;
            
            const totalMembs = srvr.members.cache;
            const serverUsers = totalMembs.filter(m => !m.user.bot).size;
            const serverBots = totalMembs.filter(m => m.user.bot).size;
            let svrMembers = `( ${srvr.memberCount} ) - ${serverUsers} ${pluralForm(`user`, serverUsers > 1)}, ${serverBots} ${pluralForm(`bot`, serverBots > 1)}`;
            let svrCurrentBoosts = `${srvr.premiumSubscriptionCount} ${pluralForm(`boost`, srvr.premiumSubscriptionCount > 1)}`;
            let svrBoostTier = standardiseCase(srvr.premiumTier);
            let svrCommunity = srvr.publicUpdatesChannelId === null ? `Disabled` : `Enabled`;
            let svrCreationDate = `${moment(srvr.createdTimestamp).format('ddd, Do MMM YYYY, h:mm a')}`;
            

            // Secondary_Info_Section ================================================== >>>>>
            const allRoles = srvr.roles.cache.sort((a, b) => b.rawPosition - a.rawPosition).map(r => r.name);
            let svrRoles = `( ${allRoles.length} ) - ${rolesDisplay(allRoles, 3)}`;

            const allEmojis = srvr.emojis.cache;
            const staticEmojis = allEmojis.filter(emj => !emj.animated).size;
            const animatedEmojis = allEmojis.filter(emj => emj.animated).size;
            let svrEmojis = allEmojis < 1 ? `None` : `( ${staticEmojis + animatedEmojis} ) - ${staticEmojis} static, ${animatedEmojis} animated`;

            const allChannels = srvr.channels.cache;
            const totalChannels = allChannels.filter(c => c.type !== "GUILD_CATEGORY" && c.type !== "GUILD_STORE").size;
            const textChannels = allChannels.filter(c => c.type === "GUILD_TEXT" || c.type === "GUILD_NEWS").size;
            const threadChannels = allChannels.filter(c => c.type === "GUILD_NEWS_THREAD" || c.type === "GUILD_PRIVATE_THREAD" || c.type === "GUILD_PUBLIC_THREAD").size;
            const voiceChannels = allChannels.filter(c => c.type === "GUILD_VOICE").size;
            const stageChannels = allChannels.filter(c => c.type === "GUILD_STAGE_VOICE").size;
            let svrChannels = `( ${totalChannels} ) - ${textChannels} text, ${voiceChannels} voice, ${stageChannels} stage, ${threadChannels} thread`;
            let svrCategories = allChannels.filter(c => c.type === "GUILD_CATEGORY").size;
            
            const onlineMem = totalMembs.filter(m => m.presence?.status === "online").size;
            const dndMem = totalMembs.filter(m => m.presence?.status === "dnd").size;
            const idleMem = totalMembs.filter(m => m.presence?.status === "idle").size;
            const offlineMem = totalMembs.size - (onlineMem + dndMem + idleMem);
            let svrOnlineMembers = `( ${onlineMem + dndMem + idleMem} ) - ${onlineMem} online, ${idleMem} idle, ${dndMem} dnd`;
            let svrOfflineMembers = `${offlineMem} ${pluralForm(`member`, offlineMem > 1)}`;
            let svrLanguage = srvr.preferredLocale;
            let svrRegion = `India`;
            let svrProgressBar = srvr.premiumProgressBarEnabled === false ? `Disabled` : `Enabled`;
            let svrDefaultNotifications = standardiseCase(srvr.defaultMessageNotifications);


            // Tertiary_Info_Section ================================================== >>>>>
            const featuresArr = [];
            (srvr.features).forEach((elem) => {
                const res = standardiseCase(elem);
                featuresArr.push(res);
            });
            let svrFeatures = featuresArr.length === 0 ? `None` : `${featuresArr.join(', ')}`;
            let svrNsfwLvl = standardiseCase(srvr.nsfwLevel);
            let svrVerificationLvl = standardiseCase(srvr.verificationLevel);
            let svrAfkTimeout = msToTime((srvr.afkTimeout) * 1000);
            let svrContentFilter = standardiseCase(srvr.explicitContentFilter);
            let svrMaxMembers = `${(srvr.maximumMembers).toLocaleString()} members`;
            let svrIsLarge = srvr.large === false ? `No` : `Yes`;
            
            let svrPublicUpdatesChannel;
            if(srvr.publicUpdatesChannelId === null) {
                svrPublicUpdatesChannel = `None`;
            } else {
                const publicUpdatesChannel = srvr.channels.cache.get(`${srvr.publicUpdatesChannelId}`);
                svrPublicUpdatesChannel = `${publicUpdatesChannel.name}, ${publicUpdatesChannel}`;
            }
            
            let svrRulesChannel;
            if(srvr.rulesChannelId === null) {
                svrRulesChannel = `None`;
            } else {
                const rulesChannel = srvr.channels.cache.get(`${srvr.rulesChannelId}`);
                svrRulesChannel = `${rulesChannel.name}, ${rulesChannel}`;
            }
            
            const systemChannel = srvr.channels.cache.get(`${srvr.systemChannelId}`);
            let svrSystemChannel = `${systemChannel.name}, ${systemChannel}`;



            // Embeds ================================================== >>>>>
            const m_ = cmndMarker;
            const embedColour = await getColourCode(srvr.iconURL({ format: "png" }));

            const final1_Embed = new Discord.MessageEmbed();
            final1_Embed.setTitle(`${cmndEmoji[0]}${config.tls}${cmndName}`);
            final1_Embed.setColor(`${embedColour}`);
            final1_Embed.setThumbnail(srvr.iconURL({ dynamic: true }));
            final1_Embed.setDescription(`${m_}**Name :** ${svrName}\n${m_}**Description :** ${svrDesc}\n${m_}**Server id :** ${svrId}\n${m_}**Owner :** ${svrOwner}\n${m_}**Total members :** ${svrMembers}\n${m_}**Current boosts :** ${svrCurrentBoosts}\n${m_}**Boost tier :** ${svrBoostTier}\n${m_}**Community :** ${svrCommunity}\n${m_}**Created on :** ${svrCreationDate}`);
            final1_Embed.setFooter({ text: message.author.username, iconURL: message.author.avatarURL({ dynamic: true }) });
            final1_Embed.setTimestamp(message.createdTimestamp);

            const final2_Embed = new Discord.MessageEmbed();
            final2_Embed.setTitle(`${cmndEmoji[0]}${config.tls}${cmndName}`);
            final2_Embed.setColor(`${embedColour}`);
            final2_Embed.setThumbnail(srvr.iconURL({ dynamic: true }));
            final2_Embed.setDescription(`${m_}**Roles :** ${svrRoles}\n${m_}**Emojis :** ${svrEmojis}\n${m_}**Channels :** ${svrChannels}\n${m_}**Categories :** ${svrCategories}\n${m_}**Members online :** ${svrOnlineMembers}\n${m_}**Members offline :** ${svrOfflineMembers}\n${m_}**Primary language :** ${svrLanguage}\n${m_}**Server region :** ${svrRegion}\n${m_}**Progress bar :** ${svrProgressBar}\n${m_}**Default notification :** ${svrDefaultNotifications}`);
            final2_Embed.setFooter({ text: message.author.username, iconURL: message.author.avatarURL({ dynamic: true }) });
            final2_Embed.setTimestamp(message.createdTimestamp);

            const final3_Embed = new Discord.MessageEmbed();
            final3_Embed.setTitle(`${cmndEmoji[0]}${config.tls}${cmndName}`);
            final3_Embed.setColor(`${embedColour}`);
            final3_Embed.setThumbnail(srvr.iconURL({ dynamic: true }));
            final3_Embed.setDescription(`${m_}**Features :** ${svrFeatures}\n${m_}**NSFW level :** ${svrNsfwLvl}\n${m_}**Verification level :** ${svrVerificationLvl}\n${m_}**AFK timeout :** ${svrAfkTimeout}\n${m_}**Content filter :** ${svrContentFilter}\n${m_}**Max members :** ${svrMaxMembers}\n${m_}**Is server large :** ${svrIsLarge}\n${m_}**Public updates channel :** ${svrPublicUpdatesChannel}\n${m_}**Rules channel :** ${svrRulesChannel}\n${m_}**System channel :** ${svrSystemChannel}`);
            final3_Embed.setFooter({ text: message.author.username, iconURL: message.author.avatarURL({ dynamic: true }) });
            final3_Embed.setTimestamp(message.createdTimestamp);


            function getRows(page, disabled) {
                const navigation_Buttons = new Discord.MessageActionRow();

                if(disabled === `yes`) {
                    navigation_Buttons.addComponents(
                        new Discord.MessageButton()
                        .setCustomId(`navigation_primary`)
                        .setLabel(`Primary`)
                        .setDisabled(true),
                    
                        new Discord.MessageButton()
                        .setCustomId(`navigation_secondary`)
                        .setLabel(`Secondary`)
                        .setDisabled(true),
        
                        new Discord.MessageButton()
                        .setCustomId(`navigation_tertiary`)
                        .setLabel(`Tertiary`)
                        .setDisabled(true),
                    );
                } else {
                    navigation_Buttons.addComponents(
                        new Discord.MessageButton()
                        .setCustomId(`navigation_primary`)
                        .setLabel(`Primary`)
                        .setDisabled(page === `p`),
                    
                        new Discord.MessageButton()
                        .setCustomId(`navigation_secondary`)
                        .setLabel(`Secondary`)
                        .setDisabled(page === `s`),
        
                        new Discord.MessageButton()
                        .setCustomId(`navigation_tertiary`)
                        .setLabel(`Tertiary`)
                        .setDisabled(page === `t`),
                    );
                }

                if(page === `p`) {
                    navigation_Buttons.components[0].setStyle(`SECONDARY`);
                    navigation_Buttons.components[1].setStyle(`PRIMARY`);
                    navigation_Buttons.components[2].setStyle(`PRIMARY`);
                } else if(page === `s`) {
                    navigation_Buttons.components[0].setStyle(`PRIMARY`);
                    navigation_Buttons.components[1].setStyle(`SECONDARY`);
                    navigation_Buttons.components[2].setStyle(`PRIMARY`);
                } else if(page === `t`) {
                    navigation_Buttons.components[0].setStyle(`PRIMARY`);
                    navigation_Buttons.components[1].setStyle(`PRIMARY`);
                    navigation_Buttons.components[2].setStyle(`SECONDARY`);
                }

                return navigation_Buttons;
            }


            // Execution ================================================== >>>>>
            message.channel.send({ embeds: [final1_Embed], components: [getRows(`p`)] }).then((firstMsg) => {
                const navigation_Collector = message.channel.createMessageComponentCollector({ time: 1000 * 120 });
                const lastClicked = [`p`];

                navigation_Collector.on(`collect`, async (interaction) => {
                    const notYouCanDo_Embed = new Discord.MessageEmbed();
                    notYouCanDo_Embed.setTitle(`${cmndError}`);
                    notYouCanDo_Embed.setColor(`${config.err_hex}`);
                    notYouCanDo_Embed.setDescription(`Oh oh!! Sorry ${interaction.user.tag}, but you cannot do that. Only ${message.author.tag} can use the button.`);

                    // Possible_Error_1
                    if(interaction.user.id !== message.author.id) return interaction.reply({ embeds: [notYouCanDo_Embed], ephemeral: true });


                    if(interaction.customId === `navigation_primary`) {
                        lastClicked.push(`p`);
                        interaction.deferUpdate();

                        return firstMsg.edit({ embeds: [final1_Embed], components: [getRows(`p`)] });
                    }

                    if(interaction.customId === `navigation_secondary`) {
                        lastClicked.push(`s`);
                        interaction.deferUpdate();

                        return firstMsg.edit({ embeds: [final2_Embed], components: [getRows(`s`)] });
                    }

                    if(interaction.customId === `navigation_tertiary`) {
                        lastClicked.push(`t`);
                        interaction.deferUpdate();

                        return firstMsg.edit({ embeds: [final3_Embed], components: [getRows(`t`)] });
                    }
                });


                navigation_Collector.on(`end`, async () => {
                    const lastClickedRes = lastClicked.pop();
                    const embVal = lastClickedRes === `p` ? final1_Embed : lastClickedRes === `s` ? final2_Embed : final3_Embed;
                    
                    firstMsg.edit({ embeds: [embVal], components: [getRows(lastClickedRes, `yes`)] });
                    return navigation_Collector.stop();
                });
            });
        }
        
        
        /*
        ----------------------------------------------------------------------------------------------------
        Execution
        ----------------------------------------------------------------------------------------------------
        */
        if(!args[1]) {
            const server = message.guild;
            

            return await finalResult(server);
        } else {
            const otherServerId = args[1];
            const server = client.guilds.cache.get(`${otherServerId}`);


            const noServer_Embed = new Discord.MessageEmbed();
            noServer_Embed.setTitle(`${cmndError}`);
            noServer_Embed.setColor(`${config.err_hex}`);
            noServer_Embed.setDescription(`The query you just provided me is not a valid ID of a server where I'm in. If you want server info of other servers (from this server only), please check if I'm there or not. I cannot proceed further if I'm absent from there.`);
            noServer_Embed.setFooter({ text: message.author.username, iconURL: message.author.avatarURL({ dynamic: true }) });
            noServer_Embed.setTimestamp(message.createdTimestamp);
            
            // Possible_Error_1
            if(server === undefined || server === null) return message.reply({ embeds: [noServer_Embed] });


            return await finalResult(server);
        }
    }
});