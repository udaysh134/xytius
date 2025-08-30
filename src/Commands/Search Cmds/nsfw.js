const Command = require("../../Structures/Command.js");
const Discord = require("discord.js");
const config = require("../../Data/config.json");
const aubdycad = require("../../Data/aubdycad.json");
const emojis = require("../../Data/emojis.json");
const pictures = require("../../Data/pictures.json");
const keys = require("../../Data/keys.json");

const nsfwRickroll_DB = require("../../Schemas/nsfwRickroll_DB");
const moment = require("moment");


module.exports = new Command({
    name: "nsfw",
    description: "Get a bunch of collections of adult content, privately, just by a click.",
    aliases: [],
    permission: "SendMessages",
    allowedChannels: [`${aubdycad.BotCommands1_C_ID}`, `${aubdycad.BotCommands2_C_ID}`],
    allowedServers: [`${config.TestServer_ID}`, `${config.Aubdycad_ID}`, `${config.XytiusServer_ID}`],
    cooldown: "",
    usage: `${config.prefix}nsfw  ::  ${config.prefix}nsfw [data / clear]`,
    usageDesc: `As name suggests, this command provides you NSFW (Not Safe For Work) content, according to your preference. Use of this command is private, meaning nobody can see who used the command and you'll get a new collection of adult content anonymously.\n\nOnce you used the command, you can choose your gender preference from the prompt. If left untouched, the prompt will automatically disappear after few seconds.\n\nThe content you recieve, gets constantly updated. So there'll be always something new for you.`,
    usageExample: [`${config.prefix}nsfw`],
    forTesting: false,
    HUCat: [`gen`, `search`],

    async run(message, args, client) {
        const cmndName = `NSFW`;
        const cmndEmoji = [`🔞`, `🤣`];
        const cmndColour = [`ffffff`];
        const cmndError = `${config.err_emoji}${config.tls}NSFW : Command Error!!`;
        const cmndMarker = `${config.marker}`;

        /*
        ----------------------------------------------------------------------------------------------------
        Start
        ----------------------------------------------------------------------------------------------------
        */
        const Admin_Perm = message.member.permissions.has("ADMINISTRATOR");
        const rickRoll_Picture = pictures.nsfw_cmd.rickRoll;


        /*
        ----------------------------------------------------------------------------------------------------
        Embeds
        ----------------------------------------------------------------------------------------------------
        */
        const options_Embed = new Discord.MessageEmbed();
        options_Embed.setTitle(`${cmndEmoji[0]}${config.tls}${cmndName}`);
        options_Embed.setDescription(`Choose the gender of which you would like to get the NSFW content for you, from options given below. Your identity (for accessing NSFW content) will be anonymous for others and you'll get a private collection of it.`);
        options_Embed.setColor(`${cmndColour[0]}`);

        const options_Buttons = new Discord.MessageActionRow().addComponents(
            new Discord.MessageButton()
            .setCustomId(`nsfw_optionsMale`)
            .setLabel(`Male`)
            .setStyle(`SECONDARY`)
            .setEmoji(`♂️`),
        
            new Discord.MessageButton()
            .setCustomId(`nsfw_optionsFemale`)
            .setLabel(`Female`)
            .setStyle(`SECONDARY`)
            .setEmoji(`♀️`),

            new Discord.MessageButton()
            .setCustomId(`nsfw_optionsOthers`)
            .setLabel(`Others`)
            .setStyle(`SECONDARY`)
            .setEmoji(`👤`),
        );


        const rickRolled_Embed = new Discord.MessageEmbed();
        rickRolled_Embed.setTitle(`${cmndEmoji[1]}${config.tls}Get Rick-Rolled!!`);
        rickRolled_Embed.setDescription(`So... how's it?? Got your NSFW content?? And wait, don't stop here, go and convince your friends and others to use this command and rick-roll them too. And ofcourse, you need not to tell the secret behind it to spoil the fun. Never ever reveal in public about the secret behind this and stay quite!!`);
        rickRolled_Embed.setColor(`${cmndColour[0]}`);
        rickRolled_Embed.setImage(rickRoll_Picture);
        rickRolled_Embed.setFooter({ text: `Go! Go! Go!` });


        const dataOptions_Embed = new Discord.MessageEmbed();
        dataOptions_Embed.setTitle(`${cmndEmoji[0]}${config.tls}${cmndName} Data`);
        dataOptions_Embed.setDescription(`Select, what sub-data you would like to have?`);
        dataOptions_Embed.setColor(`${cmndColour[0]}`);
        dataOptions_Embed.setFooter({ text: message.author.username, iconURL: message.author.avatarURL({ dynamic: true }) });
        dataOptions_Embed.setTimestamp(message.createdTimestamp);

        const dataOptions_Buttons = new Discord.MessageActionRow().addComponents(
            new Discord.MessageButton()
            .setCustomId(`nsfw_dataAll`)
            .setLabel(`All`)
            .setStyle(`PRIMARY`),

            new Discord.MessageButton()
            .setCustomId(`nsfw_dataRecent`)
            .setLabel(`Recent`)
            .setStyle(`SECONDARY`),
        );


        const confirmClear_Embed = new Discord.MessageEmbed();
        confirmClear_Embed.setTitle(`${cmndEmoji[0]}${config.tls}${cmndName} Purge`);
        confirmClear_Embed.setDescription(`Are you sure, you want to clear all NSFW's database? This will delete every single document present in it.`);
        confirmClear_Embed.setColor(`${cmndColour[0]}`);
        confirmClear_Embed.setFooter({ text: message.author.username, iconURL: message.author.avatarURL({ dynamic: true }) });
        confirmClear_Embed.setTimestamp(message.createdTimestamp);

        const confirmClear_Buttons = new Discord.MessageActionRow().addComponents(
            new Discord.MessageButton()
            .setCustomId(`nsfw_clearYes`)
            .setLabel(`Yes`)
            .setStyle(`DANGER`),

            new Discord.MessageButton()
            .setCustomId(`nsfw_clearCancel`)
            .setLabel(`Cancel`)
            .setStyle(`SECONDARY`),
        );

        const confirmClearYes_Embed = new Discord.MessageEmbed();
        confirmClearYes_Embed.setTitle(`${cmndEmoji[0]}${config.tls}${cmndName} Purge`);
        confirmClearYes_Embed.setColor(`${cmndColour[0]}`);
        confirmClearYes_Embed.setFooter({ text: message.author.username, iconURL: message.author.avatarURL({ dynamic: true }) });
        confirmClearYes_Embed.setTimestamp(message.createdTimestamp);


        /*
        ----------------------------------------------------------------------------------------------------
        Functions
        ----------------------------------------------------------------------------------------------------
        */
        async function sendData() {
            if(message.author.id !== config.uday_ID) {
                nsfwRickroll_DB.findOne({
                    UserID: message.author.id,
                }).then(async (foundData) => {
                    if(foundData) {
                        await nsfwRickroll_DB.updateOne({
                            UserID: message.author.id,
                        }, {
                            UserTag: message.author.tag,
                            Time: message.createdTimestamp,
                            Count: foundData.Count + 1,
                        });
                    } else if(!foundData) {
                        await nsfwRickroll_DB.create({
                            UserTag: message.author.tag,
                            UserID: message.author.id,
                            Time: message.createdTimestamp,
                            Count: 1,
                        });
                    }
                });
            }
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


        /*
        ----------------------------------------------------------------------------------------------------
        Execution
        ----------------------------------------------------------------------------------------------------
        */
        if(args[1] === `data`) {
            const noPermission_Embed = new Discord.MessageEmbed();
            noPermission_Embed.setTitle(`${cmndError}`);
            noPermission_Embed.setColor(`${config.err_hex}`);
            noPermission_Embed.setDescription(`Sorry, you cannot use this option of this command, as you lack permissions for it. Only Admins can use this command option.`);
            noPermission_Embed.setFooter({ text: message.author.username, iconURL: message.author.avatarURL({ dynamic: true }) });
            noPermission_Embed.setTimestamp(message.createdTimestamp);
            
            // Possible_Error_1
            if(!Admin_Perm) return message.reply({ embeds: [noPermission_Embed] });

            // Execution ================================================== >>>>>
            message.channel.send({ embeds: [dataOptions_Embed], components: [dataOptions_Buttons] }).then((dataoptionsMsg) => {
                const dataOptions_Collector = message.channel.createMessageComponentCollector({ time: 1000 * 30 });
                const checkInteraction = [];

                dataOptions_Collector.on(`collect`, async (interaction) => {
                    const notYouCanDo_Embed = new Discord.MessageEmbed();
                    notYouCanDo_Embed.setTitle(`${cmndError}`);
                    notYouCanDo_Embed.setColor(`${config.err_hex}`);
                    notYouCanDo_Embed.setDescription(`Oh oh!! Sorry ${interaction.user.tag}, but you cannot do that. Only ${message.author.tag} can use the button.`);
    
                    // Possible_Error_2
                    if (interaction.user.id !== message.author.id) return interaction.reply({ embeds: [notYouCanDo_Embed], ephemeral: true });
    
    
                    if (interaction.customId === `nsfw_dataAll`) {
                        checkInteraction.push(`Button clicked`);
                        interaction.deferUpdate();

                        await nsfwRickroll_DB.find({}).then(async (foundData) => {
                            if(foundData.length === 0) {
                                const nothingFound_Embed = new Discord.MessageEmbed();
                                nothingFound_Embed.setTitle(`${cmndEmoji[0]}${config.tls}${cmndName} Data : All`);
                                nothingFound_Embed.setDescription(`There was no any data found in the Database. Probably, no one has used this command yet or maybe the data was purged.`);
                                nothingFound_Embed.setColor(`${cmndColour[0]}`);
                                nothingFound_Embed.setFooter({ text: message.author.username, iconURL: message.author.avatarURL({ dynamic: true }) });
                                nothingFound_Embed.setTimestamp(message.createdTimestamp);

                                return dataoptionsMsg.edit({ embeds: [nothingFound_Embed], components: [] });
                            } else {
                                // First Execution ================================================== >>>>>
                                let serialNum = 0;
                                const dataDeposit = {};
                                const sortedArr = [];
                                
                                foundData.forEach((document) => {
                                    dataDeposit[document.UserTag] = document.Count;
                                });

                                const sortedData = Object.keys(dataDeposit).sort((a, b) => dataDeposit[b] - dataDeposit[a]);

                                sortedData.forEach((key) => {
                                    const result = `**${++serialNum}.** ${key} : ${dataDeposit[key]}`;
                                    sortedArr.push(result);
                                });


                                // Second Execution ================================================== >>>>>
                                const chunkSize = 10;
                                const chunkedArr = [];
                                const sourceEmbeds = [];

                                for (let i = 0; i < sortedArr.length; i += chunkSize) {
                                    const chunk = sortedArr.slice(i, i + chunkSize);
                                    chunkedArr.push(chunk);
                                }

                                for (let i = 0; i < chunkedArr.length; ++i) {
                                    sourceEmbeds.push(
                                        new Discord.MessageEmbed()
                                        .setTitle(`${cmndEmoji[0]}${config.tls}${cmndName} Data : All`)
                                        .setDescription(`${chunkedArr[i].join('\n')}`)
                                        .setColor(`${cmndColour[0]}`)
                                        .setFooter({ text: `Users : ${sortedArr.length} | Page: ${i + 1} / ${chunkedArr.length}`, iconURL: message.author.avatarURL({ dynamic: true }) })
                                    );
                                }

                                return await buttonPaginator(sourceEmbeds, dataoptionsMsg);
                            }
                        });
                    }
                    
                    if (interaction.customId === `nsfw_dataRecent`) {
                        checkInteraction.push(`Button clicked`);
                        interaction.deferUpdate();

                        await nsfwRickroll_DB.find({}).then(async (foundData) => {
                            if(foundData.length === 0) {
                                const nothingFound_Embed = new Discord.MessageEmbed();
                                nothingFound_Embed.setTitle(`${cmndEmoji[0]}${config.tls}${cmndName} Data : Recent`);
                                nothingFound_Embed.setDescription(`There was no any recent use found in the Database, for this command. Probably, no one has used this command yet or maybe the data was purged.`);
                                nothingFound_Embed.setColor(`${cmndColour[0]}`);
                                nothingFound_Embed.setFooter({ text: message.author.username, iconURL: message.author.avatarURL({ dynamic: true }) });
                                nothingFound_Embed.setTimestamp(message.createdTimestamp);

                                return dataoptionsMsg.edit({ embeds: [nothingFound_Embed], components: [] });
                            } else {
                                // First Execution ================================================== >>>>>
                                let serialNum = 0;
                                const dataDeposit = {};
                                const sortedArr = [];
                                
                                foundData.forEach((document) => {
                                    dataDeposit[document.UserTag] = document.Time;
                                });

                                const sortedData = Object.keys(dataDeposit).sort((a, b) => dataDeposit[b] - dataDeposit[a]);

                                sortedData.forEach((key) => {
                                    const result = `**${++serialNum}.** ${key} : \`${moment(dataDeposit[key]).format('ddd, D/M/YYYY, h:mm:ss a')}\``;
                                    sortedArr.push(result);
                                });

                                const mostRecent = dataDeposit[sortedData[0]];


                                // Second Execution ================================================== >>>>>
                                const chunkSize = 10;
                                const chunkedArr = [];
                                const sourceEmbeds = [];

                                for (let i = 0; i < sortedArr.length; i += chunkSize) {
                                    const chunk = sortedArr.slice(i, i + chunkSize);
                                    chunkedArr.push(chunk);
                                }

                                for (let i = 0; i < chunkedArr.length; ++i) {
                                    sourceEmbeds.push(
                                        new Discord.MessageEmbed()
                                        .setTitle(`${cmndEmoji[0]}${config.tls}${cmndName} Data : Recent`)
                                        .setDescription(`${chunkedArr[i].join('\n')}`)
                                        .setColor(`${cmndColour[0]}`)
                                        .setFooter({ text: `Most Recent : ${moment(mostRecent).fromNow()} | Page: ${i + 1} / ${chunkedArr.length}`, iconURL: message.author.avatarURL({ dynamic: true }) })
                                    );
                                }

                                return await buttonPaginator(sourceEmbeds, dataoptionsMsg);
                            }
                        });
                    }
                });


                dataOptions_Collector.on(`end`, async () => {
                    dataOptions_Buttons.components[0].setDisabled(true);
                    dataOptions_Buttons.components[1].setDisabled(true);
    
                    if (checkInteraction.length !== 0) return;
                    return dataoptionsMsg.edit({ embeds: [dataOptions_Embed], components: [dataOptions_Buttons] });
                });
            });
        } else if(args[1] === `clear` || args[1] === `purge`) {
            const noPermission_Embed = new Discord.MessageEmbed();
            noPermission_Embed.setTitle(`${cmndError}`);
            noPermission_Embed.setColor(`${config.err_hex}`);
            noPermission_Embed.setDescription(`Sorry, you cannot use this option of this command, as you lack permissions for it. Only Admins can use this command option.`);
            noPermission_Embed.setFooter({ text: message.author.username, iconURL: message.author.avatarURL({ dynamic: true }) });
            noPermission_Embed.setTimestamp(message.createdTimestamp);
            
            // Possible_Error_1
            if(!Admin_Perm) return message.reply({ embeds: [noPermission_Embed] });

            

            // Execution ================================================== >>>>>
            message.channel.send({ embeds: [confirmClear_Embed], components: [confirmClear_Buttons] }).then((confirmclearMsg) => {
                const confirmClear_Collector = message.channel.createMessageComponentCollector({ time: 1000 * 30 });
                const checkInteraction = [];

                confirmClear_Collector.on(`collect`, async (interaction) => {
                    const notYouCanDo_Embed = new Discord.MessageEmbed();
                    notYouCanDo_Embed.setTitle(`${cmndError}`);
                    notYouCanDo_Embed.setColor(`${config.err_hex}`);
                    notYouCanDo_Embed.setDescription(`Oh oh!! Sorry ${interaction.user.tag}, but you cannot do that. Only ${message.author.tag} can use the button.`);
    
                    // Possible_Error_2
                    if (interaction.user.id !== message.author.id) return interaction.reply({ embeds: [notYouCanDo_Embed], ephemeral: true });
    
    
                    if (interaction.customId === `nsfw_clearYes`) {
                        checkInteraction.push(`Button clicked`);
                        interaction.deferUpdate();
                        
                        nsfwRickroll_DB.deleteMany({}).then((returnedVal) => {
                            const deleteCount = returnedVal.deletedCount;

                            if(deleteCount === 0) {
                                confirmClearYes_Embed.setDescription(`There was no any data found to delete in NSFW's database of this server. Cleared **0** documents.`);

                                confirmClear_Buttons.components[0].setDisabled(true);
                                confirmClear_Buttons.components[1].setDisabled(true);

                                return confirmclearMsg.edit({ embeds: [confirmClearYes_Embed], components: [confirmClear_Buttons] });
                            } else {
                                confirmClearYes_Embed.setDescription(`Done!! A total of **${deleteCount}** member's data from NSFW's database has been sent into the mouth of a big monster called "DELETE".`);

                                confirmClear_Buttons.components[0].setDisabled(true);
                                confirmClear_Buttons.components[1].setDisabled(true);

                                return confirmclearMsg.edit({ embeds: [confirmClearYes_Embed], components: [confirmClear_Buttons] });
                            }
                        });
                    }
    
                    if (interaction.customId === `nsfw_clearCancel`) {
                        checkInteraction.push(`Button clicked`);
                        interaction.deferUpdate();

                        return confirmclearMsg.delete().catch();
                    }
                });


                confirmClear_Collector.on(`end`, async () => {
                    if (checkInteraction.length !== 0) return;
                    return confirmclearMsg.delete().catch();
                });
            });
        } else {
            message.delete().catch();
            message.channel.send({ embeds: [options_Embed], components: [options_Buttons] }).then((optionsMsg) => {
                const options_Collector = message.channel.createMessageComponentCollector({ time: 1000 * 30 });
                const checkInteraction = [];

                options_Collector.on(`collect`, async (interaction) => {
                    const notYouCanDo_Embed = new Discord.MessageEmbed();
                    notYouCanDo_Embed.setTitle(`${cmndError}`);
                    notYouCanDo_Embed.setColor(`${config.err_hex}`);
                    notYouCanDo_Embed.setDescription(`Oh oh!! Sorry ${interaction.user.tag}, but you cannot do that. Only ${message.author.tag} can use the button.`);
    
                    // Possible_Error_1
                    if (interaction.user.id !== message.author.id) return interaction.reply({ embeds: [notYouCanDo_Embed], ephemeral: true });
    
    
                    if (interaction.customId === `nsfw_optionsMale`) {
                        checkInteraction.push(`Button clicked`);

                        options_Buttons.components[0].setDisabled(true);
                        options_Buttons.components[1].setDisabled(true);
                        options_Buttons.components[2].setDisabled(true);

                        await sendData();

                        optionsMsg.edit({ embeds: [options_Embed], components: [options_Buttons] });
                        return interaction.reply({ embeds: [rickRolled_Embed], ephemeral: true });
                    }
    
                    if (interaction.customId === `nsfw_optionsFemale`) {
                        checkInteraction.push(`Button clicked`);

                        options_Buttons.components[0].setDisabled(true);
                        options_Buttons.components[1].setDisabled(true);
                        options_Buttons.components[2].setDisabled(true);

                        await sendData();

                        optionsMsg.edit({ embeds: [options_Embed], components: [options_Buttons] });
                        return interaction.reply({ embeds: [rickRolled_Embed], ephemeral: true });
                    }
    
                    if (interaction.customId === `nsfw_optionsOthers`) {
                        checkInteraction.push(`Button clicked`);

                        options_Buttons.components[0].setDisabled(true);
                        options_Buttons.components[1].setDisabled(true);
                        options_Buttons.components[2].setDisabled(true);

                        await sendData();

                        optionsMsg.edit({ embeds: [options_Embed], components: [options_Buttons] });
                        return interaction.reply({ embeds: [rickRolled_Embed], ephemeral: true });
                    }
                });


                options_Collector.on(`end`, async () => {
                    options_Buttons.components[0].setDisabled(true);
                    options_Buttons.components[1].setDisabled(true);
                    options_Buttons.components[2].setDisabled(true);
    
                    if (checkInteraction.length !== 0) return;
                    return optionsMsg.delete().catch();
                });
            });
        }
    }
});