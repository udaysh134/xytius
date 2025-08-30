const Command = require("../../Structures/Command.js");
const Discord = require("discord.js");
const config = require("../../Data/config.json");
const aubdycad = require("../../Data/aubdycad.json");
const emojis = require("../../Data/emojis.json");
const pictures = require("../../Data/pictures.json");
const keys = require("../../Data/keys.json");

const Canvas = require("canvas");
const package = require("../../../package.json");
const moment = require("moment");
const { connection } = require("mongoose");
const os = require("os");
const osu = require("node-os-utils");


module.exports = new Command({
    name: "botinfo",
    description: "As name says, get more detailed info about Xytius.",
    aliases: ["binfo"],
    permission: "SendMessages",
    allowedChannels: [`${aubdycad.BotCommands1_C_ID}`, `${aubdycad.BotCommands2_C_ID}`],
    allowedServers: [`${config.TestServer_ID}`, `${config.Aubdycad_ID}`, `${config.XytiusServer_ID}`],
    cooldown: "",
    usage: `${config.prefix}botinfo`,
    usageDesc: `The command provides bunch of details about the Bot itself. Using the command, you get two pages of embeded message. The first page is pretty self-explanatory. You get a description of what the bot is with some other basic details. The second page is for (mainly) techy people. If you can understand what its all about, details given there will be enough for you. If not, just ignore it. Its not that important to interpret each of those details to know about the Bot.`,
    usageExample: [`${config.prefix}botinfo`],
    forTesting: false,
    HUCat: [`gen`, `info`],

    async run(message, args, client) {
        const cmndName = `Bot Info`;
        const cmndEmoji = [`🤖`, `${emojis.ANIMATED_LOADING}`];
        const cmndColour = [`ffffff`];
        const cmndError = `${config.err_emoji}${config.tls}Bot Info : Command Error!!`;
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
        Embeds
        ----------------------------------------------------------------------------------------------------
        */
        const getheringInfo_Embed = new Discord.EmbedBuilder();
        getheringInfo_Embed.setTitle(`${cmndEmoji[1]} Gathering info...`);
        getheringInfo_Embed.setColor(`${cmndColour[0]}`);

        const final_Embed = new Discord.EmbedBuilder();
        final_Embed.setAuthor({ name: `• Bot Info`, iconURL: client.user.avatarURL({ dynamic: true }) });
        final_Embed.setThumbnail(client.user.avatarURL({ dynamic: true }));
        final_Embed.setFooter({ text: message.author.username, iconURL: message.author.avatarURL({ dynamic: true }) });
        final_Embed.setTimestamp(message.createdTimestamp);

        const final2_Embed = new Discord.EmbedBuilder();
        final2_Embed.setAuthor({ name: `• Bot Info`, iconURL: client.user.avatarURL({ dynamic: true }) });
        final2_Embed.setThumbnail(client.user.avatarURL({ dynamic: true }));
        final2_Embed.setFooter({ text: message.author.username, iconURL: message.author.avatarURL({ dynamic: true }) });
        final2_Embed.setTimestamp(message.createdTimestamp);


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


        async function getColourCode(userImg) {
            let palette = { r: 0, g: 0, b: 0 };
            let count = 0;

            await Canvas.loadImage(userImg).then((img) => {
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
            
            return `${days}${daysText} ${hours}${hoursText} ${minutes}${minutesText} ${seconds}${secondsText}`;
        }


        function standardiseCase(value) {
            const splitted = value.split('');
            const firstVal = splitted[0].toUpperCase();
            const otherVal = splitted.slice(1).join('');

            let resultValue = `${firstVal}${otherVal.toLowerCase().replace(/_/g, " ")}`;
            return resultValue;
        }


        function databaseReadystate(value) {
            let status = ` `;
            
            switch (value) {
                case 0: status = `Disconnected`
                break;
                case 1: status = `Connected`
                break;
                case 2: status = `Connecting`
                break;
                case 3: status = `Disconnecting`
                break;
            }

            return status;
        }


        function formatBytes(value) {
            let result;

            if (value >= 1073741824) { result = `${(value / 1073741824).toFixed(2)} GB`; }
            else if (value >= 1048576) { result = `${(value / 1048576).toFixed(2)} MB`; }
            else if (value >= 1024) { result = `${(value / 1024).toFixed(2)} KB`; }
            else if (value > 1) { result = `${value} Bytes`; }
            else if (value == 1) { result = `${value} Byte`; }
            else { result = "0 Bytes"; }

            return result;
        }


        function createLine(length) {
            let result = ``;

            for (let i = 0; i < length; i++) {
                result += `-`;
            }

            result += ` >>`
            return result;
        }


        /*
        ----------------------------------------------------------------------------------------------------
        Execution
        ----------------------------------------------------------------------------------------------------
        */
        message.channel.send({ embeds: [getheringInfo_Embed] }).then(async (gatheringinfoMsg) => {
            const embedColour = await getColourCode(client.user.avatarURL({ extension: "png" }));
            const m_ = cmndMarker;

            // General_Information ================================================== >>>>>
            let botPrefix = `${config.prefix}`;
            let botVersion = `${package.version}`;
            let botStatus = client.user.presence === null ? `OFFLINE` : `${standardiseCase(client.user.presence.status)}`;
            let botVerification = client.user.flags.has("VerifiedBot") ? "Yes" : "No";
            let botUsers = client.guilds.cache.reduce((a, b) => a + b.memberCount, 0);
            let botServers = client.guilds.cache.size;
            
            const creator = client.users.cache.get(`${config.uday_ID}`);
            let botCreator = `${creator.tag}`;
            let botCreationDate = `${moment(client.user.createdAt).format('D/M/YY, h:mm a')}`;
            
            
            
            // Technical_Information ================================================== >>>>>
            let botAccentColour = `${embedColour}`;
            let botApiPing = `${client.ws.ping} ms`;
            let botMessagePing = `${gatheringinfoMsg.createdTimestamp - message.createdTimestamp} ms`;
            let botUptime = `${msToTime(client.uptime)}`;
            let NodeJS = `${process.version}`;
            let DiscordJS = `v${(package.dependencies["discord.js"]).slice(1)}`;
            let botCommands = `${client.commands.size}`;
            let botDatabaseConnection = databaseReadystate(connection.readyState);

            const databaseStat = await connection.db.stats();
            let botDataSize = formatBytes(databaseStat.dataSize);
            let botDataStorageSize = formatBytes(databaseStat.storageSize);
            let botoperatingSystem = os.type().replace("Windows_NT", "Windows").replace("Darwin", "MacOS");
            let botCPUModel = `(${os.cpus().length} logical cores) ${os.cpus()[0].model}`;
            
            const cpu = osu.cpu;
            const cpuUsage = await cpu.usage();
            let botCPUUsage = `${cpuUsage}%`;


            // Embeds ================================================== >>>>>
            final_Embed.setColor(embedColour);
            final_Embed.setDescription(`None`);
            final_Embed.addFields({
                name: `${createLine(30)}`,
                value: `${m_}**Bot prefix :** ${botPrefix}\n${m_}**Bot version :** ${botVersion}\n${m_}**Status :** ${botStatus}\n${m_}**Is verified :** ${botVerification}\n${m_}**Total users :** ${botUsers}\n${m_}**Total servers :** ${botServers}\n${m_}**Creator :** ${botCreator}\n${m_}**Created on :** ${botCreationDate}`,
                inline: true
            });


            final2_Embed.setColor(embedColour);
            final2_Embed.addFields({
                name: `${config.invChar}`,
                value: `${m_}**Accent :** ${botAccentColour}\n${m_}**API ping :** ${botApiPing}\n${m_}**Latency :** ${botMessagePing}\n${m_}**Uptime :** ${botUptime}\n${m_}**NodeJS :** ${NodeJS}\n${m_}**DiscordJS :** ${DiscordJS}\n${m_}**Total commands :** ${botCommands}`,
                inline: true
            }, {
                name: `${config.invChar}`,
                value: `${m_}**Database :** ${botDatabaseConnection}\n${m_}**DB's data :** ${botDataSize}\n${m_}**DB's storage :** ${botDataStorageSize}\n${m_}**OS :** ${botoperatingSystem}\n${m_}**CPU :** ${botCPUModel}\n${m_}**CPU usage :** ${botCPUUsage}`,
                inline: true
            });


            function getRows(page, disabled) {
                const navigation_Buttons = new Discord.ActionRowBuilder();

                if(disabled === `yes`) {
                    navigation_Buttons.addComponents(
                        new Discord.ButtonBuilder()
                        .setCustomId(`navigation_primary`)
                        .setLabel(`General`)
                        .setDisabled(true),
                    
                        new Discord.ButtonBuilder()
                        .setCustomId(`navigation_secondary`)
                        .setLabel(`Technical`)
                        .setDisabled(true)
                    );
                } else {
                    navigation_Buttons.addComponents(
                        new Discord.ButtonBuilder()
                        .setCustomId(`navigation_primary`)
                        .setLabel(`General`)
                        .setDisabled(page === `p`),
                    
                        new Discord.ButtonBuilder()
                        .setCustomId(`navigation_secondary`)
                        .setLabel(`Technical`)
                        .setDisabled(page === `s`)
                    );
                }

                if(page === `p`) {
                    navigation_Buttons.components[0].setStyle(Discord.ButtonStyle.Secondary);
                    navigation_Buttons.components[1].setStyle(Discord.ButtonStyle.Primary);
                } else if(page === `s`) {
                    navigation_Buttons.components[0].setStyle(Discord.ButtonStyle.Primary);
                    navigation_Buttons.components[1].setStyle(Discord.ButtonStyle.Secondary);
                }

                return navigation_Buttons;
            }



            // Execution ================================================== >>>>>
            gatheringinfoMsg.edit({ embeds: [final_Embed], components: [getRows(`p`)] }).then(() => {
                const navigation_Collector = message.channel.createMessageComponentCollector({ time: 1000 * 120 });
                const lastClicked = [`p`];

                navigation_Collector.on(`collect`, async (interaction) => {
                    const notYouCanDo_Embed = new Discord.EmbedBuilder();
                    notYouCanDo_Embed.setTitle(`${cmndError}`);
                    notYouCanDo_Embed.setColor(`${config.err_hex}`);
                    notYouCanDo_Embed.setDescription(`Oh oh!! Sorry ${interaction.user.tag}, but you cannot do that. Only ${message.author.tag} can use the button.`);

                    // Possible_Error_1
                    if(interaction.user.id !== message.author.id) return interaction.reply({ embeds: [notYouCanDo_Embed], ephemeral: true });


                    if(interaction.customId === `navigation_primary`) {
                        lastClicked.push(`p`);
                        interaction.deferUpdate();

                        return gatheringinfoMsg.edit({ embeds: [final_Embed], components: [getRows(`p`)] });
                    }

                    if(interaction.customId === `navigation_secondary`) {
                        lastClicked.push(`s`);
                        interaction.deferUpdate();

                        return gatheringinfoMsg.edit({ embeds: [final2_Embed], components: [getRows(`s`)] });
                    }
                });


                navigation_Collector.on(`end`, async () => {
                    const lastClickedRes = lastClicked.pop();
                    const embVal = lastClickedRes === `p` ? final_Embed : final2_Embed;
                    
                    gatheringinfoMsg.edit({ embeds: [embVal], components: [getRows(lastClickedRes, `yes`)] });
                    return navigation_Collector.stop();
                });
            });
        });
    }
});