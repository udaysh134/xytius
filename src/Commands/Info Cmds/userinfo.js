const Command = require("../../Structures/Command.js");
const Discord = require("discord.js");
const config = require("../../Data/config.json");
const aubdycad = require("../../Data/aubdycad.json");
const emojis = require("../../Data/emojis.json");
const pictures = require("../../Data/pictures.json");
const keys = require("../../Data/keys.json");

const moment = require("moment");
const Canvas = require("canvas");
const FUNC_getBadges = require("../../Systems/External Functions/FUNC_getBadges.js");


module.exports = new Command({
    name: "userinfo",
    description: "Get some basic and more than basic information of a user from the server.",
    aliases: ["uinfo"],
    permission: "SendMessages",
    allowedChannels: [`${aubdycad.BotCommands1_C_ID}`, `${aubdycad.BotCommands2_C_ID}`],
    allowedServers: [`${config.TestServer_ID}`, `${config.Aubdycad_ID}`, `${config.XytiusServer_ID}`],
    cooldown: "",
    usage: `${config.prefix}userinfo [user_mention / user_id]`,
    usageDesc: `The command provides you a lot of information of a user from the server. You can use this command for any user within the server, by either mentioning them or putting their ID as a second query in the command. The mentioned user should be mandatorily in the server.\n\nThe command later provides info in "PRIMARY" and "SECONDARY" sections. For more and other type of user information, you can check "\`${config.prefix}profile\`" command`,
    usageExample: [`${config.prefix}uinfo`, `${config.prefix}uinfo @RandomGuy#0001`, `${config.prefix}uinfo 886291251119419432`],
    forTesting: false,
    HUCat: [`gen`, `info`],

    async run(message, args, client) {
        const cmndName = `User Info`;
        const cmndEmoji = [`👤`];
        const cmndColour = [`ffffff`];
        const cmndError = `${config.err_emoji}${config.tls}User Info : Command Error`;
        const cmndMarker = `${config.marker}`;

        /*
        ----------------------------------------------------------------------------------------------------
        Start
        ----------------------------------------------------------------------------------------------------
        */
        const target = message.mentions.users.first();
        const alphabet = isNaN(args[1]);

        const canvas = Canvas.createCanvas(2048, 2048);
        const context = canvas.getContext("2d");


        /*
        ----------------------------------------------------------------------------------------------------
        Functions
        ----------------------------------------------------------------------------------------------------
        */
        function errorHandle() {
            const invalidID_Embed = new Discord.MessageEmbed();
            invalidID_Embed.setTitle(`${cmndError}`);
            invalidID_Embed.setColor(`${config.err_hex}`);
            invalidID_Embed.setDescription(`The query you just provided me is wrong. Please provide me a valid ID/mention of the user/member to get their information.`);
            invalidID_Embed.setFooter({ text: message.author.username, iconURL: message.author.avatarURL({ dynamic: true }) });
            invalidID_Embed.setTimestamp(message.createdTimestamp);

            return message.reply({ embeds: [invalidID_Embed] });
        }


        function standardiseCase(value) {
            const splitted = value.split('');
            const firstVal = splitted[0].toUpperCase();
            const otherVal = splitted.slice(1).join('');

            let resultValue = `${firstVal}${otherVal.toLowerCase().replace(/_/g, " ")}`;
            return resultValue;
        }


        function elementsDisplay(arr, limit) {
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


        async function finalResult(memb) {
            const m_ = cmndMarker;
            const embedColour = await getColourCode(memb.user.avatarURL({ format: "png" }));


            // Primary_Info_Section ================================================== >>>>>
            let userName = memb.user.username;
            let userDiscriminator = `#${memb.user.discriminator}`;
            let userId = memb.id;
            let userNickname = memb.nickname === null ? `None` : `${memb.nickname}`;
            
            const badgesRes = await FUNC_getBadges(memb.user, `emoji`);
            let userBadges = `${badgesRes.join(" ")}`;
            let userStatus = memb.presence === null ? `Offline` : `${standardiseCase(memb.presence?.status)}`;
            let isUserBot = memb.user.bot === false ? `No` : `Yes`;
            let isServerBooster = memb.premiumSinceTimestamp === null ? `No` : `Yes`;

            let timeOutEnd;
            if(memb.communicationDisabledUntilTimestamp === null) {
                timeOutEnd = `${m_}**Timeout :** Inactive`;
            } else {
                if(memb.communicationDisabledUntilTimestamp > Date.now()) {
                    timeOutEnd = `${m_}**Timeout ends on :** ${moment(memb.communicationDisabledUntilTimestamp).format('ddd, Do MMM YYYY, h:mm a')}`;
                } else {
                    timeOutEnd = `${m_}**Timeout ended on :** ${moment(memb.communicationDisabledUntilTimestamp).format('ddd, Do MMM YYYY, h:mm a')}`;
                }
            }


            // Secondary_Info_Section ================================================== >>>>>
            let userAvatar = `[Click Here](${memb.user.avatarURL({ dynamic: true, size: 4096 })})`;

            const allRoles = memb.roles.cache.sort((a, b) => b.rawPosition - a.rawPosition).map(r => r);
            let userRoles = `( ${allRoles.length} ) - ${elementsDisplay(allRoles, 3)}`;

            const rawPerms = memb.permissions.toArray();
            const allPerms = [];
            rawPerms.forEach((elem) => {
                allPerms.push(standardiseCase(`${elem}`));
            });
            let userPermissions = `( ${allPerms.length} ) - ${elementsDisplay(allPerms, 3)}`;
            let serverJoiningDate = `${moment(memb.joinedAt).format('ddd, Do MMM YYYY, h:mm a')}. About ${moment(memb.joinedAt).startOf('days').fromNow()}.`;
            let discordJoiningDate = `${moment(memb.user.createdAt).format('ddd, Do MMM YYYY, h:mm a')}. About ${moment(memb.user.createdAt).startOf('days').fromNow()}.`;



            // Embeds ================================================== >>>>>
            const final1_Embed = new Discord.MessageEmbed();
            final1_Embed.setTitle(`${cmndEmoji[0]}${config.tls}${cmndName}`);
            final1_Embed.setDescription(`${m_}**Name :** ${userName}\n${m_}**Discriminator :** ${userDiscriminator}\n${m_}**User id :** ${userId}\n${m_}**Nickname :** ${userNickname}\n${m_}**Badges :** ${userBadges}\n${m_}**Status :** ${userStatus}\n${m_}**Is a bot :** ${isUserBot}\n${m_}**Is a booster :** ${isServerBooster}\n${timeOutEnd}`);
            final1_Embed.setThumbnail(memb.user.avatarURL({ dynamic: true }));
            final1_Embed.setColor(`${embedColour}`);
            final1_Embed.setFooter({ text: message.author.username, iconURL: message.author.avatarURL({ dynamic: true }) });
            final1_Embed.setTimestamp(message.createdTimestamp);

            const final2_Embed = new Discord.MessageEmbed();
            final2_Embed.setTitle(`${cmndEmoji[0]}${config.tls}${cmndName}`);
            final2_Embed.setDescription(`${m_}**Avatar :** ${userAvatar}\n${m_}**Roles :** ${userRoles}\n${m_}**Permissions :** ${userPermissions}\n${m_}**Joined Server on :** ${serverJoiningDate}\n${m_}**Joined Discord on :** ${discordJoiningDate}\n\n\`\`\`You can also use ${config.prefix}profile command to get more details of a Member of this Server.\`\`\``);
            final2_Embed.setThumbnail(memb.user.avatarURL({ dynamic: true }));
            final2_Embed.setColor(`${embedColour}`);
            final2_Embed.setFooter({ text: message.author.username, iconURL: message.author.avatarURL({ dynamic: true }) });
            final2_Embed.setTimestamp(message.createdTimestamp);


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
                        .setDisabled(true)
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
                        .setDisabled(page === `s`)
                    );
                }

                if(page === `p`) {
                    navigation_Buttons.components[0].setStyle(`SECONDARY`);
                    navigation_Buttons.components[1].setStyle(`PRIMARY`);
                } else if(page === `s`) {
                    navigation_Buttons.components[0].setStyle(`PRIMARY`);
                    navigation_Buttons.components[1].setStyle(`SECONDARY`);
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
                });


                navigation_Collector.on(`end`, async () => {
                    const lastClickedRes = lastClicked.pop();
                    const embVal = lastClickedRes === `p` ? final1_Embed : final2_Embed;
                    
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
            const member = message.guild.members.cache.get(`${message.author.id}`);

            // Possible_Error_1
            if(member === null || member === undefined) return errorHandle();

            // Execution ================================================== >>>>>
            return await finalResult(member);
        } else if(target && args[1].startsWith("<@")) {
            const firstSect = args[1].slice(2);
            const secSect = firstSect.split("");
            secSect.splice(-1);
            const member = message.guild.members.cache.get(`${secSect.join("")}`);

            // Possible_Error_1
            if(member === null || member === undefined) return errorHandle();
            
            // Execution ================================================== >>>>>
            return await finalResult(member);
        } else if(!alphabet) {
            const member = message.guild.members.cache.get(`${args[1]}`);

            // Possible_Error_1
            if(member === null || member === undefined) return errorHandle();
            
            // Execution ================================================== >>>>>
            return await finalResult(member);
        } else {
            const unknownError_Embed = new Discord.MessageEmbed();
            unknownError_Embed.setTitle(`${cmndError}`);
            unknownError_Embed.setColor(`${config.err_hex}`);
            unknownError_Embed.setDescription(`An unknown error just occured!! You probably did something wrong. Use "\`${config.prefix}usage\`" command for this command to get more details on it.`);
            unknownError_Embed.setFooter({ text: message.author.username, iconURL: message.author.avatarURL({ dynamic: true }) });
            unknownError_Embed.setTimestamp(message.createdTimestamp);

            // Possible_Error_1
            return message.reply({ embeds: [unknownError_Embed] });
        }
    }
});