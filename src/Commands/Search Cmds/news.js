const Command = require("../../Structures/Command.js");
const Discord = require("discord.js");
const config = require("../../Data/config.json");
const aubdycad = require("../../Data/aubdycad.json");
const emojis = require("../../Data/emojis.json");
const pictures = require("../../Data/pictures.json");
const keys = require("../../Data/keys.json");

const fetch = require("node-fetch");
const moment = require("moment");


module.exports = new Command({
    name: "news",
    description: "Get latest news from accross the world, from over 80,000+ sources.",
    aliases: [],
    permission: "SendMessages",
    allowedChannels: [`${aubdycad.News_TC_ID}`],
    allowedServers: [`${config.TestServer_ID}`, `${config.Aubdycad_ID}`, `${config.XytiusServer_ID}`],
    cooldown: "",
    usage: `${config.prefix}news [query]  ::  ${config.prefix}news country <country_code>  ::  ${config.prefix}news category <category_name>`,
    usageDesc: `This command could be confusing for some, but it's not that difficult to understand. As you may already know, the command is used to get latest news from accross the world, from over 80,000+ sources. The command gives you results differently for different methods, used to get news. There are four different ways by which you can use this command according to your needs.\n\n\n》 **FIRST METHOD :** Simply use the command "\`${config.prefix}news\`", without any external query. This will give you, only the top headlines from accross the world, as in a brief way for a quick self-update from news.\n\n》 **SECOND METHOD :** Use one or more keywords as a query. Basically, this specifies the latest news, similar to what keyword(s) you give. This will provide you news content related directly or indirectly to the query you give. Using this method, you can search for specific news you're looking for, just like a search engine.\n\n》 **THIRD METHOD :** Get news from within a country. You can use this method to get latest news from your's or other's country by giving a query, "country" and then specifying the ISO Code of that country. To find more about ISO codes, click [here](https://en.wikipedia.org/wiki/ISO_3166-1_alpha-2). This will limit the souces to only that country, hence providing news from within the country you chose. Important thing to note is that, the command does not fully support every single country in the world. Try putting your desired country's correct Code. If it supports that country, the result will be out for you. If not, it will provide you with all the countries it supports for the moment. Apologies, if your desired country's code is not listed, but try to understand, this itself is not easy in its own way.\n\n》 **FOURTH METHOD :** This last method will give you news according to a category of your interest, among listed ones (coming following). Meaning, you can specify a query, "category" and the name of the category after that, to get news results related to that field only. The category names you can use, as to specify your interest of results are : "Business", "Entertainment", "Health", "Science", "Sports" and "Technology". For now, the command is limited to these categories only.\n\n\nUsing either of these four methods, you can fetch news according to your needs. Coming forward to the usage of the command, you'll have to use buttons (given below the results), to navigate through the News articles.`,
    usageExample: [`${config.prefix}news`, `${config.prefix}news Covid-19`, `${config.prefix}news Meeting on Global warming`, `${config.prefix}news country au`, `${config.prefix}news country Id`, `${config.prefix}news category sports`, `${config.prefix}news category health`],
    forTesting: false,
    HUCat: [`gen`, `search`],

    async run(message, args, client) {
        const cmndName = `News`;
        const cmndEmoji = [`📰`, `${emojis.ANIMATED_LOADING}`];
        const cmndColour = [`2f3136`];
        const cmndError = `${config.err_emoji}${config.tls}News : Command Error!!`;
        const cmndMarker = `${config.marker}`;

        /*
        ----------------------------------------------------------------------------------------------------
        Start
        ----------------------------------------------------------------------------------------------------
        */
        const mainLink = keys.news.link;
        const mainKey = keys.news.key;


        /*
        ----------------------------------------------------------------------------------------------------
        Embeds
        ----------------------------------------------------------------------------------------------------
        */
        const gettingIt_Embed = new Discord.MessageEmbed();
        gettingIt_Embed.setTitle(`${cmndEmoji[0]}${config.tls}${cmndName}`);
        gettingIt_Embed.setDescription(`Getting it, please wait... ${cmndEmoji[1]}`);
        gettingIt_Embed.setColor(`${cmndColour[0]}`);


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


        function chunkAnArray(rawArr, theChunk) {
            const chunkedArr = [];

            for (let i = 0; i < rawArr.length; i += theChunk) {
                const chunk = rawArr.slice(i, i + theChunk);
                chunkedArr.push(chunk);
            }

            return chunkedArr;
        }


        async function proceedToNews(res, emptyDesc, articleCount, topHeader, msgEdit) {
            const sourceEmbeds = [];

            if ((res.articles).length === 0) {
                sourceEmbeds.push(
                    new Discord.MessageEmbed()
                    .setDescription(`${emptyDesc}`)
                    .setColor(`${cmndColour[0]}`)
                );
            } else {
                (res.articles).forEach((elem) => {
                    const newsHeading = elem.title;
                    const newsDescription = elem.description === null ? `` : `${elem.description}`;
                    const newsContent = elem.content === null ? `` : `\n${elem.content}`;
                    const newsImage = elem.urlToImage;

                    let publishingTime = Math.round(new Date(`${elem.publishedAt}`).getTime());
                    const newsPublishedAt = `${moment(publishingTime).format('ddd, Do MMM YYYY, h:mm a')}`;
                    const newsSource = elem.source.name;


                    sourceEmbeds.push(
                        new Discord.MessageEmbed()
                        .setDescription(`${cmndMarker}**[${newsHeading}](${elem.url})**\n${newsDescription}${newsContent}`)
                        .setColor(`${cmndColour[0]}`)
                        .setImage(newsImage)
                        .setFooter({ text: `Source : ${newsSource}\nPublished at : ${newsPublishedAt}` }),
                    );
                });
            }


            // Execution ================================================== >>>>>
            const chunkLength = articleCount;
            const allChunkedEmbeds = chunkAnArray(sourceEmbeds, chunkLength);

            let num = 0;


            allChunkedEmbeds.forEach((page) => {
                page.unshift(
                    new Discord.MessageEmbed()
                    .setTitle(`${cmndEmoji[0]}${config.tls}${topHeader}`)
                    .setColor(`${cmndColour[0]}`)
                );

                page.push(
                    new Discord.MessageEmbed()
                    .setFooter({ text: `${message.author.username} | Total articles : ${(res.articles).length} | Page : ${++num} / ${allChunkedEmbeds.length}`, iconURL: message.author.avatarURL({ dynamic: true }) })
                    .setColor(`${cmndColour[0]}`)
                );
            });

            await buttonPaginator(allChunkedEmbeds, msgEdit);
        }


        async function buttonPaginator(embs, msg) {
            const allEmbeds = embs;
            const pageCheck = {};
            
            function getRow(id) {
                const paginator_Buttons = new Discord.MessageActionRow();

                if(id === `forcedDisabled`) {
                    paginator_Buttons.addComponents(
                        new Discord.MessageButton()
                        .setCustomId(`news_first`)
                        .setStyle(`PRIMARY`)
                        .setEmoji(`⏮`)
                        .setDisabled(true),
                        
                        new Discord.MessageButton()
                        .setCustomId(`news_previous`)
                        .setLabel(`Prev`)
                        .setStyle(`SECONDARY`)
                        .setDisabled(true),
                    
                        new Discord.MessageButton()
                        .setCustomId(`news_next`)
                        .setLabel(`Next`)
                        .setStyle(`SECONDARY`)
                        .setDisabled(true),

                        new Discord.MessageButton()
                        .setCustomId(`news_last`)
                        .setStyle(`PRIMARY`)
                        .setEmoji(`⏭`)
                        .setDisabled(true),

                        new Discord.MessageButton()
                        .setCustomId(`news_jump`)
                        .setStyle(`SECONDARY`)
                        .setEmoji(`⌨`)
                        .setDisabled(true)
                    );
                } else {
                    paginator_Buttons.addComponents(
                        new Discord.MessageButton()
                        .setCustomId(`news_first`)
                        .setStyle(`PRIMARY`)
                        .setEmoji(`⏮`)
                        .setDisabled(pageCheck[id] === 0),
                        
                        new Discord.MessageButton()
                        .setCustomId(`news_previous`)
                        .setLabel(`Prev`)
                        .setStyle(`SECONDARY`)
                        .setDisabled(pageCheck[id] === 0),
                    
                        new Discord.MessageButton()
                        .setCustomId(`news_next`)
                        .setLabel(`Next`)
                        .setStyle(`SECONDARY`)
                        .setDisabled(pageCheck[id] === allEmbeds.length - 1),

                        new Discord.MessageButton()
                        .setCustomId(`news_last`)
                        .setStyle(`PRIMARY`)
                        .setEmoji(`⏭`)
                        .setDisabled(pageCheck[id] === allEmbeds.length - 1),

                        new Discord.MessageButton()
                        .setCustomId(`news_jump`)
                        .setStyle(`SECONDARY`)
                        .setEmoji(`⌨`)
                        .setDisabled(pageCheck[id] === 0 && pageCheck[id] === allEmbeds.length - 1),
                    );
                }

                return paginator_Buttons;
            }


            // Execution ================================================== >>>>>
            const id = `Page number`;
            pageCheck[id] = pageCheck[id] || 0;


            msg.edit({ embeds: allEmbeds[pageCheck[id]], components: [getRow(id)] }).then(() => {
                const paginator_Collector = message.channel.createMessageComponentCollector({ time: 1000 * 120 });

                paginator_Collector.on(`collect`, async (interaction) => {
                    const notYouCanDo_Embed = new Discord.MessageEmbed();
                    notYouCanDo_Embed.setTitle(`${cmndError}`);
                    notYouCanDo_Embed.setColor(`${config.err_hex}`);
                    notYouCanDo_Embed.setDescription(`Oh oh!! Sorry ${interaction.user.tag}, but you cannot do that. Only ${message.author.tag} can use the button.`);
    
                    // Possible_Error_2
                    if (interaction.user.id !== message.author.id) return interaction.reply({ embeds: [notYouCanDo_Embed], ephemeral: true });
    
    
                    if (interaction.customId === `news_first`) {
                        interaction.deferUpdate();

                        pageCheck[id] = 0;
                        msg.edit({ embeds: allEmbeds[pageCheck[id]], components: [getRow(id)] });
                    }
                    
                    if (interaction.customId === `news_previous`) {
                        interaction.deferUpdate();
                        
                        --pageCheck[id];
                        msg.edit({ embeds: allEmbeds[pageCheck[id]], components: [getRow(id)] });
                    }
    
                    if (interaction.customId === `news_next`) {
                        interaction.deferUpdate();

                        ++pageCheck[id];
                        msg.edit({ embeds: allEmbeds[pageCheck[id]], components: [getRow(id)] });
                    }

                    if (interaction.customId === `news_last`) {
                        interaction.deferUpdate();

                        pageCheck[id] = allEmbeds.length - 1;
                        msg.edit({ embeds: allEmbeds[pageCheck[id]], components: [getRow(id)] });
                    }

                    if (interaction.customId === `news_jump`) {
                        interaction.deferUpdate();
                        msg.edit({ embeds: allEmbeds[pageCheck[id]], components: [getRow(`forcedDisabled`)] });

                        const filt = m => { if(m.author.id === message.author.id) return true };
                        const collec = message.channel.createMessageCollector({ filter: filt, time: 1000 * 5 });
                        const btnCheck = [];

                        collec.on("collect", collectedMessages => {
                            const content = collectedMessages.content;
                            
                            if(!content) {
                                // Do nothing!!
                            } else {
                                const intContent = parseInt(content);

                                if(intContent === undefined || !intContent || intContent === null || intContent === 0 || intContent > allEmbeds.length) {
                                    // Do nothing!!
                                } else {
                                    btnCheck.push("Clicked!!");
                                    pageCheck[id] = intContent - 1;

                                    return msg.edit({ embeds: allEmbeds[pageCheck[id]], components: [getRow(id)] });
                                }
                            }
                        });

                        collec.on("end", collected => {
                            if(btnCheck.length === 0) {
                                return msg.edit({ embeds: allEmbeds[pageCheck[id]], components: [getRow(id)] });
                            } else {
                                // Do nothing!!
                            }
                        });
                    }
                });


                paginator_Collector.on(`end`, async () => {
                    return msg.edit({ embeds: allEmbeds[pageCheck[id]], components: [getRow(`forcedDisabled`)] });
                });
            });
        }


        /*
        ----------------------------------------------------------------------------------------------------
        Execution
        ----------------------------------------------------------------------------------------------------
        */
        if(!args[1]) {
            message.channel.send({ embeds: [gettingIt_Embed] }).then(async (gettingitMsg) => {
                const link = `${mainLink}top-headlines?language=en&apiKey=${mainKey}`;

                const fetchedData = await fetch(link);
                const res = await fetchedData.json();


                const unknownError_Embed = new Discord.MessageEmbed();
                unknownError_Embed.setTitle(`${cmndError}`);
                unknownError_Embed.setColor(`${config.err_hex}`);
                unknownError_Embed.setDescription(`An unknown error just occured!! Please wait and try this command after some time. If the error is not resolved even after hours of wait, please report this issue using "\`${config.prefix}report\`" command.`);
                unknownError_Embed.setFooter({ text: message.author.username, iconURL: message.author.avatarURL({ dynamic: true }) });
                unknownError_Embed.setTimestamp(message.createdTimestamp);

                // Possible_Error_1
                if (res.status === `error`) return gettingitMsg.edit({ embeds: [unknownError_Embed] });



                // Execution ================================================== >>>>>
                return await proceedToNews(
                    res,
                    `No any top news available right now!! Try using the command again, after some time.`,
                    1,
                    `${cmndName} : Top Headlines`,
                    gettingitMsg
                );
            });
        } else if(args[1].toLowerCase()) {
            if(args[1].toLowerCase() === `country`) {
                message.channel.send({ embeds: [gettingIt_Embed] }).then(async (gettingitMsg) => {
                    const noCountryCodeProvided_Embed = new Discord.MessageEmbed();
                    noCountryCodeProvided_Embed.setTitle(`${cmndError}`);
                    noCountryCodeProvided_Embed.setColor(`${config.err_hex}`);
                    noCountryCodeProvided_Embed.setDescription(`You just forgot to provide me the country code. Please mention your desired country code ( [ISO 3166-1 code](https://en.m.wikipedia.org/wiki/ISO_3166-1) ) to get news of that country only.`);
                    noCountryCodeProvided_Embed.setFooter({ text: message.author.username, iconURL: message.author.avatarURL({ dynamic: true }) });
                    noCountryCodeProvided_Embed.setTimestamp(message.createdTimestamp);

                    // Possible_Error_1
                    if (!args[2]) return gettingitMsg.edit({ embeds: [noCountryCodeProvided_Embed] });


                    const link = `${mainLink}top-headlines?country=${args[2]}&apiKey=${mainKey}`;

                    const fetchedData = await fetch(link);
                    const res = await fetchedData.json();

                    const codeCheck = [];
                    const supportedCountryCodes = [`ae`, `ar`, `at`, `au`, `be`, `bg`, `br`, `ca`, `ch`, `cn`, `co`, `cu`, `cz`, `de`, `eg`, `fr`, `gb`, `gr`, `hk`, `hu`, `id`, `ie`, `il`, `in`, `it`, `jp`, `kr`, `lt`, `lv`, `ma`, `mx`, `my`, `ng`, `nl`, `no`, `nz`, `ph`, `pl`, `pt`, `ro`, `rs`, `ru`, `sa`, `se`, `sg`, `si`, `sk`, `th`, `tr`, `tw`, `ua`, `us`, `ve`, `za`];
                    supportedCountryCodes.forEach((code) => {
                        if(args[2].toLowerCase() === `${code.toLowerCase()}`) codeCheck.push(`yes`);
                    });


                    const noSupportedCode_Embed = new Discord.MessageEmbed();
                    noSupportedCode_Embed.setTitle(`${cmndError}`);
                    noSupportedCode_Embed.setColor(`${config.err_hex}`);
                    noSupportedCode_Embed.setDescription(`Sorry, I don't support that country code for now. The only countries I can provides news from, are given below :\n\`\`\`${supportedCountryCodes.join(", ")}\`\`\``);
                    noSupportedCode_Embed.setFooter({ text: message.author.username, iconURL: message.author.avatarURL({ dynamic: true }) });
                    noSupportedCode_Embed.setTimestamp(message.createdTimestamp);
                    
                    // Possible_Error_2
                    if(codeCheck.length === 0) return gettingitMsg.edit({ embeds: [noSupportedCode_Embed] });


                    const unknownError_Embed = new Discord.MessageEmbed();
                    unknownError_Embed.setTitle(`${cmndError}`);
                    unknownError_Embed.setColor(`${config.err_hex}`);
                    unknownError_Embed.setDescription(`An unknown error just occured!! Please wait and try this command after some time. If the error is not resolved even after hours of wait, please report this issue using "\`${config.prefix}report\`" command.`);
                    unknownError_Embed.setFooter({ text: message.author.username, iconURL: message.author.avatarURL({ dynamic: true }) });
                    unknownError_Embed.setTimestamp(message.createdTimestamp);

                    // Possible_Error_3
                    if (res.status === `error`) return gettingitMsg.edit({ embeds: [unknownError_Embed] });



                    // Execution ================================================== >>>>>
                    return await proceedToNews(
                        res,
                        `No current, top news available from this country's sources. Try checking again, later!!`,
                        1,
                        `${cmndName} : From Country, ${args[2].toUpperCase()}`,
                        gettingitMsg
                    );
                });
            } else if(args[1].toLowerCase() === `category`) {
                message.channel.send({ embeds: [gettingIt_Embed] }).then(async (gettingitMsg) => {
                    const categories = [`Business`, `Entertainment`, `Health`, `Science`, `Sports`, `Technology`];


                    const noCategoryProvided_Embed = new Discord.MessageEmbed();
                    noCategoryProvided_Embed.setTitle(`${cmndError}`);
                    noCategoryProvided_Embed.setColor(`${config.err_hex}`);
                    noCategoryProvided_Embed.setDescription(`You just forgot to provide me the category name. If you want to get news of a specific category only, please mention one of the category name provided below.\n\`\`\`${categories.join("\n")}\`\`\``);
                    noCategoryProvided_Embed.setFooter({ text: message.author.username, iconURL: message.author.avatarURL({ dynamic: true }) });
                    noCategoryProvided_Embed.setTimestamp(message.createdTimestamp);

                    // Possible_Error_1
                    if (!args[2]) return gettingitMsg.edit({ embeds: [noCategoryProvided_Embed] });


                    const link = `${mainLink}top-headlines?category=${args[2]}&language=en&apiKey=${mainKey}`;

                    const fetchedData = await fetch(link);
                    const res = await fetchedData.json();

                    const categoryCheck = [];
                    categories.forEach((ctgry) => {
                        if(args[2].toLowerCase() === `${ctgry.toLowerCase()}`) categoryCheck.push(`yes`);
                    });


                    const noSupportedCategory_Embed = new Discord.MessageEmbed();
                    noSupportedCategory_Embed.setTitle(`${cmndError}`);
                    noSupportedCategory_Embed.setColor(`${config.err_hex}`);
                    noSupportedCategory_Embed.setDescription(`Sorry, I don't support that category for now. The only categories I can provides news from, are given below :\n\`\`\`${categories.join("\n")}\`\`\``);
                    noSupportedCategory_Embed.setFooter({ text: message.author.username, iconURL: message.author.avatarURL({ dynamic: true }) });
                    noSupportedCategory_Embed.setTimestamp(message.createdTimestamp);
                    
                    // Possible_Error_2
                    if(categoryCheck.length === 0) return gettingitMsg.edit({ embeds: [noSupportedCategory_Embed] });


                    const unknownError_Embed = new Discord.MessageEmbed();
                    unknownError_Embed.setTitle(`${cmndError}`);
                    unknownError_Embed.setColor(`${config.err_hex}`);
                    unknownError_Embed.setDescription(`An unknown error just occured!! Please wait and try this command after some time. If the error is not resolved even after hours of wait, please report this issue using "\`${config.prefix}report\`" command.`);
                    unknownError_Embed.setFooter({ text: message.author.username, iconURL: message.author.avatarURL({ dynamic: true }) });
                    unknownError_Embed.setTimestamp(message.createdTimestamp);

                    // Possible_Error_3
                    if (res.status === `error`) return gettingitMsg.edit({ embeds: [unknownError_Embed] });



                    // Execution ================================================== >>>>>
                    return await proceedToNews(
                        res,
                        `No current, top news available from this category. Try checking again, later!!`,
                        1,
                        `${cmndName} : From Category, ${standardiseCase(args[2])}`,
                        gettingitMsg
                    );
                });
            } else {
                message.channel.send({ embeds: [gettingIt_Embed] }).then(async (gettingitMsg) => {
                    const query = args.slice(1).join(" ");
                    const link = `${mainLink}everything?q=${encodeURIComponent(query)}&sortBy=publishedAt&language=en&apiKey=${mainKey}`;

                    const fetchedData = await fetch(link);
                    const res = await fetchedData.json();


                    const unknownError_Embed = new Discord.MessageEmbed();
                    unknownError_Embed.setTitle(`${cmndError}`);
                    unknownError_Embed.setColor(`${config.err_hex}`);
                    unknownError_Embed.setDescription(`An unknown error just occured!! Please wait and try this command after some time. If the error is not resolved even after hours of wait, please report this issue using "\`${config.prefix}report\`" command.`);
                    unknownError_Embed.setFooter({ text: message.author.username, iconURL: message.author.avatarURL({ dynamic: true }) });
                    unknownError_Embed.setTimestamp(message.createdTimestamp);

                    // Possible_Error_1
                    if (res.status === `error`) return gettingitMsg.edit({ embeds: [unknownError_Embed] });



                    // Execution ================================================== >>>>>
                    return await proceedToNews(
                        res,
                        `No any results found for the query you gave. Try specifying your query more to the match and be relevant!!`,
                        1,
                        `${cmndName} : ${standardiseCase(query)}`,
                        gettingitMsg
                    );
                });
            }
        }
    }
});