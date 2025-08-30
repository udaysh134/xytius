const Command = require("../../Structures/Command.js");
const Discord = require("discord.js");
const config = require("../../Data/config.json");
const aubdycad = require("../../Data/aubdycad.json");
const emojis = require("../../Data/emojis.json");
const pictures = require("../../Data/pictures.json");
const keys = require("../../Data/keys.json");

const moment = require("moment");


module.exports = new Command({
    name: "channelinfo",
    description: "Use this to fetch some key info about any type of channel from the server.",
    aliases: ["cinfo"],
    permission: "SendMessages",
    allowedChannels: [`${aubdycad.BotCommands1_C_ID}`, `${aubdycad.BotCommands2_C_ID}`],
    allowedServers: [`${config.TestServer_ID}`, `${config.Aubdycad_ID}`, `${config.XytiusServer_ID}`],
    cooldown: "",
    usage: `${config.prefix}channelinfo [channel_mention / channel_id]`,
    usageDesc: `For getting details of the channel you're in, using just the command without any extra query wil be enough. But for other channel, you can either mention that channel or put it's channel ID as the second query, specifying that channel to the command.\n\nYou can fetch details on every type of channels except "Store Channels". For fetching information of a thread channel, you first need to check if the bot is present in there or not. If not, the bot cannot provide details of that channel.\n\nOther than that, you can fetch info from channels like "Announcement Channel", "Text Channel", "Category", "Stage Channel", "Voice Channel", "Announcement Thread", "Private Thread" and "Public Thread". Detail parameters about a channel may vary as the channel type changes.`,
    usageExample: [`${config.prefix}channelinfo`, `${config.prefix}channelinfo #memes`, `${config.prefix}channelinfo 918900039613558814`],
    forTesting: false,
    HUCat: [`gen`, `info`],

    async run(message, args, client) {
        const cmndName = `Channel Info`;
        const cmndEmoji = [`#️⃣`];
        const cmndColour = [`ffffff`];
        const cmndError = `${config.err_emoji}${config.tls}Channel Info : Command Error!!`;
        const cmndMarker = `${config.marker}`;

        /*
        ----------------------------------------------------------------------------------------------------
        Start
        ----------------------------------------------------------------------------------------------------
        */
        const targetChannel = message.mentions.channels.first();
        const alphabet = isNaN(args[1]);


        /*
        ----------------------------------------------------------------------------------------------------
        Functions
        ----------------------------------------------------------------------------------------------------
        */
        function notValidQueryErr() {
            const marker = `🔸`;

            const invalidID_Embed = new Discord.EmbedBuilder();
            invalidID_Embed.setTitle(`${cmndError}`);
            invalidID_Embed.setColor(`${config.err_hex}`);
            invalidID_Embed.setDescription(`This is to inform you that, there's an error occured while procceding further for this command. There could be either of reasons (from below) for this error to possibly occur.\n\n**${marker}** The query you just provided me is wrong. Try providing me a valid ID / mention of any **channel** (of this server) to get its information.\n**${marker}** The query (of a channel) you're trying to provide me is a Private thread and I'm either absent from there or the thread is now archived.\n\n\`\`\`\nResolve the issue and try again!!\n\`\`\``);
            invalidID_Embed.setFooter({ text: message.author.username, iconURL: message.author.avatarURL({ dynamic: true }) });
            invalidID_Embed.setTimestamp(message.createdTimestamp);

            return message.reply({ embeds: [invalidID_Embed] });
        }


        function finalMsgCreator(type, description) {
            const lineSeperator = createLine(30);

            const finalMsg_Embed = new Discord.EmbedBuilder();
            finalMsg_Embed.setTitle(`${cmndEmoji[0]}${config.tls}${cmndName}`);
            finalMsg_Embed.setDescription(`${cmndMarker}**Type :** ${type}\n${lineSeperator}\n${description}`);
            finalMsg_Embed.setColor(`${cmndColour[0]}`);
            finalMsg_Embed.setFooter({ text: message.author.username, iconURL: message.author.avatarURL({ dynamic: true }) });
            finalMsg_Embed.setTimestamp(message.createdTimestamp);

            return message.reply({ embeds: [finalMsg_Embed] });
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
            
            return `${days}${daysText} ${hours}${hoursText} ${minutes}${minutesText}`;
        }


        function createLine(length) {
            let result = ``;

            for (let i = 0; i < length; i++) {
                result += `-`;
            }

            result += ` >>`
            return result;
        }


        function fetchUser(userId) {
            const fetchedUser = client.users.cache.get(`${userId}`);
            return fetchedUser;
        }

        
        async function chnlActiveThreads_Display(channel) {
            let actvThrd = await channel.threads.fetch({ active: true });

            let pvt_actvThrd = actvThrd.threads.filter((t) => t.type === 12);
            let pub_actvThrd = actvThrd.threads.filter((t) => t.type === 11);

            return `${actvThrd.threads.size} - (${pvt_actvThrd.size} Pvt, ${pub_actvThrd.size} Pub)`;
        }


        async function chnlArchivedThreads_Display(channel) {
            let archvdThrd = await channel.threads.fetch({ archived: { fetchAll: true } });
            let pub_archvdThrd = archvdThrd.threads.filter((t) => t.type === 11);

            return `${pub_archvdThrd.size} (Pub)`;
        }


        function checkForumTags(elem, arr) {
            if(elem.moderated === false) {
                if(elem.emoji === null) {
                    arr.push(`*${elem.name}*`);
                } else {
                    if(elem.emoji.name === null) {
                        const customEmj = client.emojis.cache.get(elem.emoji.id);
                        const theEmoji = customEmj.animated === true ? `<a:${customEmj.name}:${customEmj.id}>` : `<:${customEmj.name}:${customEmj.id}>`;

                        arr.push(`*${theEmoji} ${elem.name}*`);
                    } else {
                        arr.push(`*${elem.emoji.name} ${elem.name}*`);
                    }
                }
            } else {
                if(elem.emoji === null) {
                    arr.push(`*${elem.name} (Mod)*`);
                } else {
                    if(elem.emoji.name === null) {
                        const customEmj = client.emojis.cache.get(elem.emoji.id);
                        const theEmoji = customEmj.animated === true ? `<a:${customEmj.name}:${customEmj.id}>` : `<:${customEmj.name}:${customEmj.id}>`;

                        arr.push(`*${theEmoji} ${elem.name} (Mod)*`);
                    } else {
                        arr.push(`*${elem.emoji.name} ${elem.name} (Mod)*`);
                    }
                }
            }
        }


        function getDfltReactnEmji(channel) {
            if(channel.defaultReactionEmoji.id === null) {
                return `${channel.defaultReactionEmoji.name}`;
            }

            if(channel.defaultReactionEmoji.name === null) {
                const emojiID = channel.defaultReactionEmoji.id;
                const customEmj = client.emojis.cache.get(emojiID);
                const theEmoji = customEmj.animated === true ? `<a:${customEmj.name}:${customEmj.id}>` : `<:${customEmj.name}:${customEmj.id}>`;

                return `${theEmoji}`;
            }
        }


        async function finalResult(chnl) {
            let chnlType, parentCategory, chnlId, chnlName, chnlTopic, chnlPosition, chnlActiveThreads, chnlArchivedThreads, chnlNsfw, chnlSlowmode;
            let chnlBitrate, chnlUserlimit, chnlVideoQualityMode, chnlRegion;
            let chnlLocked, chnlArchived, chnlArchiveDuration, chnlArchiveTimestamp, chnlOwner, chnlCreatedAt, chnlMembers, chnlCurrentMessages, chnlTotalMessages;
            let forumChnlTags, forumChnlDefaultReactionEmoji, forumChnlPostsSlowmode, forumChnlMsgsSlowmode, forumChnlSortOrder, forumChnlAutoArchiveDuration;

            const m_ = cmndMarker;

            switch (chnl.type) {
                case 0: // GuildText
                    chnlType = `Text Channel`;
                    parentCategory = chnl.parentId === null ? `None` : `<#${chnl.parentId}>`;
                    chnlId = chnl.id;
                    chnlName = `${chnl.name}, <#${chnl.id}>`;
                    chnlTopic = chnl.topic === null ? `None` : `"${chnl.topic}"`;
                    chnlPosition = `${chnl.rawPosition + 1}, in Text channels.`;
                    chnlActiveThreads = await chnlActiveThreads_Display(chnl);
                    chnlArchivedThreads = await chnlArchivedThreads_Display(chnl);
                    chnlNsfw = chnl.nsfw === true ? `Enabled` : `Disabled`;

                    if(chnl.rateLimitPerUser === 0) {
                        chnlSlowmode = `Not enabled`;
                    } else if(chnl.rateLimitPerUser <= 60) {
                        chnlSlowmode = `${chnl.rateLimitPerUser} seconds`;
                    } else {
                        const milliSeconds = chnl.rateLimitPerUser * 1000;
                        chnlSlowmode = msToTime(milliSeconds);
                    }

                    finalMsgCreator(chnlType, `${m_}**Parent category :** ${parentCategory}\n${m_}**Channel id :** ${chnlId}\n${m_}**Name :** ${chnlName}\n${m_}**Topic :** ${chnlTopic}\n${m_}**Position :** ${chnlPosition}\n${m_}**Active Threads :** ${chnlActiveThreads}\n${m_}**Inactive Threads :** ${chnlArchivedThreads}\n${m_}**NSFW :** ${chnlNsfw}\n${m_}**Slowmode :** ${chnlSlowmode}`);
                    break;

                case 2: // GuildVoice
                    chnlType = `Voice Channel`;
                    parentCategory = chnl.parentId === null ? `None` : `<#${chnl.parentId}>`;
                    chnlId = chnl.id;
                    chnlName = `${chnl.name}, <#${chnl.id}>`;
                    chnlPosition = `${chnl.rawPosition + 1}, in Voice channels.`;
                    chnlBitrate = `${chnl.bitrate / 1000} kbps`;
                    chnlUserlimit = chnl.userLimit === 0 ? `None (Unlimited)` : `${chnl.userLimit} users`;
                    chnlVideoQualityMode = chnl.videoQualityMode === 1 ? `Auto` : chnl.videoQualityMode === 2 ? `Full (720p)` : `Default (Auto)`;

                    if(chnl.rtcRegion === null) {
                        chnlRegion = `None (Default : Automatic)`;
                    } else {
                        const countryArr = (chnl.rtcRegion).split("");
                        const first = countryArr[0].toUpperCase();
                        const rest = countryArr.slice(1).join("");

                        chnlRegion = `${first}${rest}`;
                    }

                    finalMsgCreator(chnlType, `${m_}**Parent category :** ${parentCategory}\n${m_}**Channel id :** ${chnlId}\n${m_}**Name :** ${chnlName}\n${m_}**Position :** ${chnlPosition}\n${m_}**Bitrate :** ${chnlBitrate}\n${m_}**User limit :** ${chnlUserlimit}\n${m_}**Video Quality Mode :** ${chnlVideoQualityMode}\n${m_}**Region :** ${chnlRegion}`);
                    break;

                case 4: // GuildCategory
                    chnlType = `Category`;
                    chnlId = chnl.id;
                    chnlName = `${chnl.name}, <#${chnl.id}>`;
                    chnlPosition = `${chnl.rawPosition + 1}, in Categories.`;

                    finalMsgCreator(chnlType, `${m_}**Category id :** ${chnlId}\n${m_}**Name :** ${chnlName}\n${m_}**Position :** ${chnlPosition}`);
                    break;

                case 5: // GuildAnnouncement
                    chnlType = `Announcement Channel`;
                    parentCategory = chnl.parentId === null ? `None` : `<#${chnl.parentId}>`;
                    chnlId = chnl.id;
                    chnlName = `${chnl.name}, <#${chnl.id}>`;
                    chnlTopic = chnl.topic === null ? `None` : `"${chnl.topic}"`;
                    chnlPosition = `${chnl.rawPosition + 1}, in Text channels.`;

                    let actvThrd = await chnl.threads.fetch({ active: true });
                    let archvdThrd = await chnl.threads.fetch({ archived: { fetchAll: true } });

                    chnlActiveThreads = `${actvThrd.threads.size}`;
                    chnlArchivedThreads = `${archvdThrd.threads.size}`;
                    chnlNsfw = chnl.nsfw === true ? `Enabled` : `Disabled`;
                    
                    finalMsgCreator(chnlType, `${m_}**Parent category :** ${parentCategory}\n${m_}**Channel id :** ${chnlId}\n${m_}**Name :** ${chnlName}\n${m_}**Topic :** ${chnlTopic}\n${m_}**Position :** ${chnlPosition}\n${m_}**Active Threads :** ${chnlActiveThreads}\n${m_}**Inactive Threads :** ${chnlArchivedThreads}\n${m_}**NSFW :** ${chnlNsfw}`);
                    break;

                case 10: // AnnouncementThread
                    chnlType = `Announcement Thread`;
                    parentCategory = chnl.parentId === null ? `None` : `<#${chnl.parentId}>`;
                    chnlId = chnl.id;
                    chnlName = `${chnl.name}, <#${chnl.id}>`;
                    chnlOwner = `${fetchUser(chnl.ownerId).tag}, ${fetchUser(chnl.ownerId)}`;
                    chnlCreatedAt = `${moment(chnl._createdTimestamp).format('ddd, Do MMM YYYY, h:mm a')}`;
                    chnlMembers = chnl.memberCount;
                    chnlCurrentMessages = chnl.messageCount;
                    chnlTotalMessages = chnl.totalMessageSent;

                    if(chnl.rateLimitPerUser === 0) {
                        chnlSlowmode = `Not enabled`;
                    } else if(chnl.rateLimitPerUser <= 60) {
                        chnlSlowmode = `${chnl.rateLimitPerUser} seconds`;
                    } else {
                        const milliSeconds = chnl.rateLimitPerUser * 1000;
                        chnlSlowmode = msToTime(milliSeconds);
                    }

                    chnlLocked = chnl.locked === false ? `No` : `Yes`;
                    chnlArchived = chnl.archived === false ? `No` : `Yes`;
                    chnlArchiveDuration = `${msToTime(chnl.autoArchiveDuration * 60 * 1000)}`;
                    chnlArchiveTimestamp = `${moment(chnl.archiveTimestamp).format('ddd, Do MMM YYYY, h:mm a')}`;

                    finalMsgCreator(chnlType, `${m_}**Parent channel :** ${parentCategory}\n${m_}**Thread id :** ${chnlId}\n${m_}**Name :** ${chnlName}\n${m_}**Thread owner :** ${chnlOwner}\n${m_}**Creation time :** ${chnlCreatedAt}\n${m_}**Members in thread :** ${chnlMembers}\n${m_}**Message count :** ${chnlCurrentMessages}\n${m_}**Total messages :** ${chnlTotalMessages}\n${m_}**Slowmode :** ${chnlSlowmode}\n${m_}**Is locked :** ${chnlLocked}\n${m_}**Is archived :** ${chnlArchived}\n${m_}**Auto archive duration :** ${chnlArchiveDuration}\n${m_}**Unarchived on :** ${chnlArchiveTimestamp}`);
                    break;

                case 11: // PublicThread
                    chnlType = `Public Thread`;
                    parentCategory = chnl.parentId === null ? `None` : `<#${chnl.parentId}>`;
                    chnlId = chnl.id;
                    chnlName = `${chnl.name}, <#${chnl.id}>`;
                    chnlOwner = `${fetchUser(chnl.ownerId).tag}, ${fetchUser(chnl.ownerId)}`;
                    chnlCreatedAt = `${moment(chnl._createdTimestamp).format('ddd, Do MMM YYYY, h:mm a')}`;
                    chnlMembers = chnl.memberCount;
                    chnlCurrentMessages = chnl.messageCount;
                    chnlTotalMessages = chnl.totalMessageSent;

                    if(chnl.rateLimitPerUser === 0) {
                        chnlSlowmode = `Not enabled`;
                    } else if(chnl.rateLimitPerUser <= 60) {
                        chnlSlowmode = `${chnl.rateLimitPerUser} seconds`;
                    } else {
                        const milliSeconds = chnl.rateLimitPerUser * 1000;
                        chnlSlowmode = msToTime(milliSeconds);
                    }

                    chnlLocked = chnl.locked === false ? `No` : `Yes`;
                    chnlArchived = chnl.archived === false ? `No` : `Yes`;
                    chnlArchiveDuration = `${msToTime(chnl.autoArchiveDuration * 60 * 1000)}`;
                    chnlArchiveTimestamp = `${moment(chnl.archiveTimestamp).format('ddd, Do MMM YYYY, h:mm a')}`;

                    finalMsgCreator(chnlType, `${m_}**Parent channel :** ${parentCategory}\n${m_}**Thread id :** ${chnlId}\n${m_}**Name :** ${chnlName}\n${m_}**Thread owner :** ${chnlOwner}\n${m_}**Creation time :** ${chnlCreatedAt}\n${m_}**Members in thread :** ${chnlMembers}\n${m_}**Message count :** ${chnlCurrentMessages}\n${m_}**Total messages :** ${chnlTotalMessages}\n${m_}**Slowmode :** ${chnlSlowmode}\n${m_}**Is locked :** ${chnlLocked}\n${m_}**Is archived :** ${chnlArchived}\n${m_}**Auto archive duration :** ${chnlArchiveDuration}\n${m_}**Unarchived on :** ${chnlArchiveTimestamp}`);
                    break;

                case 12: // PrivateThread
                    chnlType = `Private Thread`;
                    parentCategory = chnl.parentId === null ? `None` : `<#${chnl.parentId}>`;
                    chnlId = chnl.id;
                    chnlName = `${chnl.name}, <#${chnl.id}>`;
                    chnlOwner = `${fetchUser(chnl.ownerId).tag}, ${fetchUser(chnl.ownerId)}`;
                    chnlCreatedAt = `${moment(chnl._createdTimestamp).format('ddd, Do MMM YYYY, h:mm a')}`;
                    chnlMembers = chnl.memberCount;
                    chnlCurrentMessages = chnl.messageCount;
                    chnlTotalMessages = chnl.totalMessageSent;

                    if(chnl.rateLimitPerUser === 0) {
                        chnlSlowmode = `Not enabled`;
                    } else if(chnl.rateLimitPerUser <= 60) {
                        chnlSlowmode = `${chnl.rateLimitPerUser} seconds`;
                    } else {
                        const milliSeconds = chnl.rateLimitPerUser * 1000;
                        chnlSlowmode = msToTime(milliSeconds);
                    }

                    chnlLocked = chnl.locked === false ? `No` : `Yes`;
                    chnlArchived = chnl.archived === false ? `No` : `Yes`;
                    chnlArchiveDuration = `${msToTime(chnl.autoArchiveDuration * 60 * 1000)}`;
                    chnlArchiveTimestamp = `${moment(chnl.archiveTimestamp).format('ddd, Do MMM YYYY, h:mm a')}`;

                    finalMsgCreator(chnlType, `${m_}**Parent channel :** ${parentCategory}\n${m_}**Thread id :** ${chnlId}\n${m_}**Name :** ${chnlName}\n${m_}**Thread owner :** ${chnlOwner}\n${m_}**Creation time :** ${chnlCreatedAt}\n${m_}**Members in thread :** ${chnlMembers}\n${m_}**Message count :** ${chnlCurrentMessages}\n${m_}**Total messages :** ${chnlTotalMessages}\n${m_}**Slowmode :** ${chnlSlowmode}\n${m_}**Is locked :** ${chnlLocked}\n${m_}**Is archived :** ${chnlArchived}\n${m_}**Auto archive duration :** ${chnlArchiveDuration}\n${m_}**Unarchived on :** ${chnlArchiveTimestamp}`);
                    break;

                case 13: // GuildStageVoice
                    chnlType = `Stage Channel`;
                    parentCategory = chnl.parentId === null ? `None` : `<#${chnl.parentId}>`;
                    chnlId = chnl.id;
                    chnlName = `${chnl.name}, <#${chnl.id}>`;
                    chnlTopic = chnl.topic === null ? `No current topic is active` : `"${chnl.topic}"`;
                    chnlPosition = `${chnl.rawPosition + 1}, in Voice channels.`;
                    chnlBitrate = `${chnl.bitrate / 1000} kbps`;
                    chnlUserlimit = `${(chnl.userLimit).toLocaleString()} users`;

                    if(chnl.rtcRegion === null) {
                        chnlRegion = `None (Default : Automatic)`;
                    } else {
                        const countryArr = (chnl.rtcRegion).split("");
                        const first = countryArr[0].toUpperCase();
                        const rest = countryArr.slice(1).join("");

                        chnlRegion = `${first}${rest}`;
                    }

                    finalMsgCreator(chnlType, `${m_}**Parent category :** ${parentCategory}\n${m_}**Channel id :** ${chnlId}\n${m_}**Name :** ${chnlName}\n${m_}**Topic :** ${chnlTopic}\n${m_}**Position :** ${chnlPosition}\n${m_}**Bitrate :** ${chnlBitrate}\n${m_}**User limit :** ${chnlUserlimit}\n${m_}**Region :** ${chnlRegion}`);
                    break;

                case 15: // GuildForum
                    chnlType = `Forum Channel`;
                    parentCategory = chnl.parentId === null ? `None` : `<#${chnl.parentId}>`;
                    chnlId = chnl.id;
                    chnlName = `${chnl.name}, <#${chnl.id}>`;
                    chnlTopic = chnl.topic === null || chnl.topic === "" ? `None` : `"${chnl.topic}"`;
                    chnlPosition = `${chnl.rawPosition + 1}, in Text channels.`;

                    if((chnl.availableTags).length !== 0) {
                        let tags = [];

                        (chnl.availableTags).forEach((elem) => {
                            checkForumTags(elem, tags);
                        });

                        forumChnlTags = `(${tags.length}) - ${tags.join("  |  ")}`;
                    } else {
                        forumChnlTags = `None`;
                    }

                    chnlActiveThreads = await chnlActiveThreads_Display(chnl);
                    chnlArchivedThreads = await chnlArchivedThreads_Display(chnl);
                    forumChnlDefaultReactionEmoji = chnl.defaultReactionEmoji === null ? `None` : `${getDfltReactnEmji(chnl)}`;
                    forumChnlSortOrder = chnl.defaultSortOrder === 0 ? `By "Recent Activity"` : chnl.defaultSortOrder === 1 ? `By "Creation Time"` : `None`;
                    chnlNsfw = chnl.nsfw === true ? `Enabled` : `Disabled`;

                    if(chnl.rateLimitPerUser === 0) {
                        forumChnlPostsSlowmode = `Not enabled`;
                    } else if(chnl.rateLimitPerUser <= 60) {
                        forumChnlPostsSlowmode = `${chnl.rateLimitPerUser} seconds`;
                    } else {
                        const milliSeconds = chnl.rateLimitPerUser * 1000;
                        forumChnlPostsSlowmode = msToTime(milliSeconds);
                    }

                    if(chnl.defaultThreadRateLimitPerUser === 0 || chnl.defaultThreadRateLimitPerUser === null) {
                        forumChnlMsgsSlowmode = `Not enabled`;
                    } else if(chnl.defaultThreadRateLimitPerUser <= 60) {
                        forumChnlMsgsSlowmode = `${chnl.defaultThreadRateLimitPerUser} seconds`;
                    } else {
                        const milliSeconds = chnl.defaultThreadRateLimitPerUser * 1000;
                        forumChnlMsgsSlowmode = msToTime(milliSeconds);
                    }

                    forumChnlAutoArchiveDuration = chnl.defaultAutoArchiveDuration === null ? `Default (None)` : `${msToTime(chnl.defaultAutoArchiveDuration * 60 * 1000)}`;
                
                    finalMsgCreator(chnlType, `${m_}**Parent category :** ${parentCategory}\n${m_}**Channel id :** ${chnlId}\n${m_}**Name :** ${chnlName}\n${m_}**Topic :** ${chnlTopic}\n${m_}**Position :** ${chnlPosition}\n${m_}**Available tags :** ${forumChnlTags}\n${m_}**Active posts :** ${chnlActiveThreads}\n${m_}**Inactive posts :** ${chnlArchivedThreads}\n${m_}**Default Reaction emoji :** ${forumChnlDefaultReactionEmoji}\n${m_}**Default Sort order :** ${forumChnlSortOrder}\n${m_}**NSFW :** ${chnlNsfw}\n${m_}**Posts slowmode :** ${forumChnlPostsSlowmode}\n${m_}**Messages slowmode :** ${forumChnlMsgsSlowmode}\n${m_}**Posts Auto-archive duration :** ${forumChnlAutoArchiveDuration}`);
                    break;


                default:
                    finalMsgCreator(`Unrecognised`, `No details available.`);
                    break;
            }
        }
        
        
        /*
        ----------------------------------------------------------------------------------------------------
        Execution
        ----------------------------------------------------------------------------------------------------
        */
        if(!args[1]) {
            const srcChnl = message.channel;
            
            return await finalResult(srcChnl);
        } else if(targetChannel && args[1].startsWith("<#")) {
            const splittedArg = args[1].split("");
            const operation_1 = splittedArg.slice(2);
            operation_1.pop();
            const num = operation_1.join("");

            const srcChnl = message.guild.channels.cache.get(`${num}`) ?? `None`;


            // Possible_Error_1
            if(srcChnl === `None`) return notValidQueryErr();


            // Execution ================================================== >>>>>
            return await finalResult(srcChnl);
        } else if(!alphabet) {
            const channelId = args[1];
            const srcChnl = message.guild.channels.cache.get(`${channelId}`) ?? `None`;


            // Possible_Error_1
            if(srcChnl === `None`) return notValidQueryErr();


            // Execution ================================================== >>>>>
            return await finalResult(srcChnl);
        } else {
            const unknownError_Embed = new Discord.EmbedBuilder();
            unknownError_Embed.setTitle(`${cmndError}`);
            unknownError_Embed.setColor(`${config.err_hex}`);
            unknownError_Embed.setDescription(`That's a very wrong query, you just provided me. Please mention me a valid channel for which you want information of. Use "\`${config.prefix}usage\`" command for this command to get more details on it.`);
            unknownError_Embed.setFooter({ text: message.author.username, iconURL: message.author.avatarURL({ dynamic: true }) });
            unknownError_Embed.setTimestamp(message.createdTimestamp);

            // Possible_Error_1
            return message.reply({ embeds: [unknownError_Embed] });
        }
    }
});