const Command = require("../../Structures/Command.js");
const Discord = require("discord.js");
const config = require("../../Data/config.json");
const aubdycad = require("../../Data/aubdycad.json");
const emojis = require("../../Data/emojis.json");
const pictures = require("../../Data/pictures.json");
const keys = require("../../Data/keys.json");

const { createClient } = require("pexels");
const { createApi } = require("unsplash-js");
const fetch = require("node-fetch");


module.exports = new Command({
    name: "images",
    description: "Get lots and lots of free, stock images, for anything in an organised way.",
    aliases: [],
    permission: "SendMessages",
    allowedChannels: [`${aubdycad.BotCommands1_C_ID}`, `${aubdycad.BotCommands2_C_ID}`],
    allowedServers: [`${config.TestServer_ID}`, `${config.Aubdycad_ID}`, `${config.XytiusServer_ID}`],
    cooldown: "",
    usage: `${config.prefix}images <query>`,
    usageDesc: `A very simple search command to get stock images for any of your projects or for whatever you want. Just put a query of what you're searching for while using the command and you'll be then provided with a collection of images similar to what you're looking for. Within the result below, you can see, collection number. This is because you get results in collections after collections. Also, you get to see what image at you currently are, out of how many images (in total) in that collection. To get any of the image, you can either directly download within Discord or you can click on the blue text (could be "Unsplash" or "Pexels") to download it from the original place.\n\nTo navigate through all of the images, you'll have to use buttons, placed right below the result. The button which says **"Prev"** meaning "Previous" is used to go back to the previous image, and similarly the button which says **"Next"** is used to view the next image. The "⏮" button is used to go to the very first image of the collection, and similarly the "⏭" button is used to go to the last image of the collection. If you're not at the last page (last image of the collection), the 5th button will be **"⌨ Input"**, and if you are, then that button will change to **"⏏ Load more"** button.\n\nThe function of **"⌨ Input"** button is used to directly jump to the page number you give. For example, if you're on 3rd image and want to directly jump to 14th image without clicking **"Next"** button again and again, you can simply click on **"⌨ Input"** button and this will wait for your response for 5 seconds. You'll have to specify a number of the page you want to jump on (in this case, 14). If everything goes right, you'll be directly redirected to page 14 of that collection. Now, **"⏏ Load more"** button is used to load a new collection of images. You'll get this button on every last page of the collection, so that you can load more images to find out what exactly you're looking for, if you ran out of images and still want to search more.`,
    usageExample: [`${config.prefix}images landscape`, `${config.prefix}images temple`, `${config.prefix}images cameras`],
    forTesting: false,
    HUCat: [`gen`, `search`],

    async run(message, args, client) {
        const cmndName = `Stock Images`;
        const cmndEmoji = [`🖼`, `${emojis.ANIMATED_LOADING}`];
        const cmndColour = [`d79e84`];
        const cmndError = `${config.err_emoji}${config.tls}Images : Command Error!!`;
        const cmndMarker = `${config.marker}`;

        /*
        ----------------------------------------------------------------------------------------------------
        Start
        ----------------------------------------------------------------------------------------------------
        */
        const pexels = createClient(keys.images.pexels.key);
        const unsplash = createApi({ accessKey: keys.images.unsplash.acs_key, fetch: fetch });

        const query = args.slice(1).join(" ");


        /*
        ----------------------------------------------------------------------------------------------------
        Error Handling
        ----------------------------------------------------------------------------------------------------
        */
        const noQuery_Embed = new Discord.MessageEmbed();
        noQuery_Embed.setTitle(`${cmndError}`);
        noQuery_Embed.setColor(`${config.err_hex}`);
        noQuery_Embed.setDescription(`You just forgot to provide me the query, from which I can proceed to give you images. Please provide a valid query to search for your need of images.`);
        noQuery_Embed.setFooter({ text: message.author.username, iconURL: message.author.avatarURL({ dynamic: true }) });
        noQuery_Embed.setTimestamp(message.createdTimestamp);
        
        // Possible_Error_1
        if(!query) return message.reply({ embeds: [noQuery_Embed] });


        /*
        ----------------------------------------------------------------------------------------------------
        Functions
        ----------------------------------------------------------------------------------------------------
        */
        function shuffleArray(arr) {
            let currentIndex = arr.length;
            let randomIndex;
        
            while (currentIndex != 0) {
                randomIndex = Math.floor(Math.random() * currentIndex);
                currentIndex--;
        
                [arr[currentIndex], arr[randomIndex]] = [arr[randomIndex], arr[currentIndex]];
            }
        
            return arr;
        }


        async function finalResult(page_no) {
            const imagesArr = [];

            await pexels.photos.search({ query: query, page: page_no }).then(async (res) => {
                const collection = res.photos;

                collection.map((col) => {
                    const width = col.width;
                    const height = col.height;
                    const avgColour = col.avg_color;
                    const author = col.photographer;
                    const authorUrl = col.photographer_url;
                    const displayImg = col.src.original;
                    const link = col.url;

                    const imagesObj = {};

                    imagesObj["Resolution"] = `${width} × ${height} (w × h)`;
                    imagesObj["Avg_Colour"] = `${avgColour}`;
                    imagesObj["Author"] = `${author}`;
                    imagesObj["Author_Url"] = `${authorUrl}`;
                    imagesObj["Image"] = `${displayImg}`;
                    imagesObj["Main_Url"] = `${link}`;
                    imagesObj["Company"] = `Pexels`;

                    imagesArr.push(imagesObj);
                });
            });

            await unsplash.search.getPhotos({ query: query, page: page_no }).then((res) => {
                if(res.type === `error`) {
                    // Do nothing!!
                } else {
                    const collection = res.response.results;

                    collection.map((col) => {
                        const width = col.width;
                        const height = col.height;
                        const avgColour = col.color;
                        const author = col.user.name;
                        const authorUrl = col.user.links.html;
                        const displayImg = col.urls.full;
                        const link = col.links.html;

                        const imagesObj = {};

                        imagesObj["Resolution"] = `${width} × ${height} (w × h)`;
                        imagesObj["Avg_Colour"] = `${avgColour}`;
                        imagesObj["Author"] = `${author}`;
                        imagesObj["Author_Url"] = `${authorUrl}`;
                        imagesObj["Image"] = `${displayImg}`;
                        imagesObj["Main_Url"] = `${link}`;
                        imagesObj["Company"] = `Unsplash`;

                        imagesArr.push(imagesObj);
                    });
                }
            });
            

            // Second Section ================================================== >>>>>
            const imagesObjData = shuffleArray(imagesArr);

            if(imagesObjData.length === 0) {
                return `No Data!!`
            } else {
                const sourceEmbeds = [];

                for (let i = 0; i < imagesObjData.length; ++i) {
                    sourceEmbeds.push(
                        new Discord.MessageEmbed()
                        .setTitle(`${cmndEmoji[0]}${config.tls}${cmndName}`)
                        .setDescription(`By **[${imagesObjData[i].Author}](${imagesObjData[i].Author_Url})** from **[${imagesObjData[i].Company}](${imagesObjData[i].Main_Url})**\n\n**Query :** ${query}\n**Resolution :** ${imagesObjData[i].Resolution}\n**Accent Colour :** ${imagesObjData[i].Avg_Colour}`)
                        .setColor(`${imagesObjData[i].Avg_Colour}`)
                        .setImage(`${imagesObjData[i].Image}`)
                        .setFooter({ text: `${message.author.username} | Image: ${i + 1} / ${imagesObjData.length} | Collection : ${page_no}`, iconURL: message.author.avatarURL({ dynamic: true }) })
                    );
                }

                return sourceEmbeds;
            }
        }


        async function buttonPaginator(embs, msg, collectionNumber) {
            const allEmbeds = embs;
            const pageCheck = {};
        
            function getRow(id) {
                const paginator_Buttons = new Discord.MessageActionRow();
        
                if (id === `forcedDisabled`) {
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
                        .setDisabled(true),

                        new Discord.MessageButton()
                        .setCustomId(`paginator_jump`)
                        .setStyle(`SECONDARY`)
                        .setLabel(`Input`)
                        .setEmoji(`⌨`)
                        .setDisabled(true)
                    );
                } else {
                    if(pageCheck[id] === allEmbeds.length - 1) {
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
                            .setDisabled(pageCheck[id] === allEmbeds.length - 1),

                            new Discord.MessageButton()
                            .setCustomId(`paginator_loadMore`)
                            .setLabel(`⏏  Load more`)
                            .setStyle(`SUCCESS`)
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
                            .setDisabled(pageCheck[id] === allEmbeds.length - 1),

                            new Discord.MessageButton()
                            .setCustomId(`paginator_jump`)
                            .setStyle(`SECONDARY`)
                            .setLabel(`Input`)
                            .setEmoji(`⌨`)
                        );
                    }
                }
        
                return paginator_Buttons;
            }
        
        
            // Execution ================================================== >>>>>
            const id = `Page number`;
            pageCheck[id] = pageCheck[id] || 0;

            let collectionNo = {};
            collectionNo["Num"] = collectionNumber;


            msg.edit({ embeds: [allEmbeds[pageCheck[id]]], components: [getRow(id)] }).then((paginationMsg) => {
                const paginator_Collector = message.channel.createMessageComponentCollector({ time: 1000 * 60 * 3 });
        
                paginator_Collector.on(`collect`, async (interaction) => {
                    const notYouCanDo_Embed = new Discord.MessageEmbed();
                    notYouCanDo_Embed.setTitle(`${cmndError}`);
                    notYouCanDo_Embed.setColor(`${config.err_hex}`);
                    notYouCanDo_Embed.setDescription(`Oh oh!! Sorry ${interaction.user.tag}, but you cannot do that. Only ${message.author.tag} can use the button.`);
        
                    // Possible_Error_1
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

                    if (interaction.customId === `paginator_jump`) {
                        interaction.deferUpdate();
                        msg.edit({ embeds: [allEmbeds[pageCheck[id]]], components: [getRow(`forcedDisabled`)] });

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

                                    return msg.edit({ embeds: [allEmbeds[pageCheck[id]]], components: [getRow(id)] });
                                }
                            }
                        });

                        collec.on("end", collected => {
                            if(btnCheck.length === 0) {
                                return msg.edit({ embeds: [allEmbeds[pageCheck[id]]], components: [getRow(id)] });
                            } else {
                                // Do nothing!!
                            }
                        });
                    }

                    if (interaction.customId === `paginator_loadMore`) {
                        interaction.deferUpdate();
                        paginator_Collector.stop();

                        collectionNo["Num"] = collectionNo.Num + 1;

                        const switching_Embed = new Discord.MessageEmbed();
                        switching_Embed.setTitle(`${cmndEmoji[0]}${config.tls}${cmndName}`);
                        switching_Embed.setDescription(`Switching to Collection : ${collectionNo.Num} ${cmndEmoji[1]}`);
                        switching_Embed.setColor(`${cmndColour[0]}`);

                        
                        paginationMsg.edit({ embeds: [switching_Embed] }).then(async (nextMsg) => {
                            const readyEmbedsNext = await finalResult(collectionNo.Num);

                            if(readyEmbedsNext === `No Data!!`) {
                                const noData_Embed = new Discord.MessageEmbed();
                                noData_Embed.setTitle(`${cmndEmoji[0]}${config.tls}${cmndName}`);
                                noData_Embed.setColor(`${cmndColour[0]}`);
                                noData_Embed.setDescription(`No more images can be found. You've reached the end of all collections.`);
                                noData_Embed.setFooter({ text: `${message.author.username} | Image: 0 / 0 | Collection : ${collectionNo.Num}`, iconURL: message.author.avatarURL({ dynamic: true }) })

                                setTimeout(() => {
                                    // Possible_Error_3
                                    return nextMsg.edit({ embeds: [noData_Embed] });
                                }, 1000 * 3);
                            } else {
                                setTimeout(async () => {
                                    return await buttonPaginator(readyEmbedsNext, nextMsg, collectionNo.Num);
                                }, 1000 * 3);
                            }
                        });
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
        const gettingCollection_Embed = new Discord.MessageEmbed();
        gettingCollection_Embed.setTitle(`${cmndEmoji[0]}${config.tls}${cmndName}`);
        gettingCollection_Embed.setDescription(`Getting collections!! Please wait... ${cmndEmoji[1]}`);
        gettingCollection_Embed.setColor(`${cmndColour[0]}`);

        message.delete().catch();
        message.channel.send({ embeds : [gettingCollection_Embed] }).then(async (firstMsg) => {
            const defaultPage = 1;
            const readyEmbeds = await finalResult(defaultPage);


            if(readyEmbeds === `No Data!!`) {
                const noData_Embed = new Discord.MessageEmbed();
                noData_Embed.setTitle(`${cmndError}`);
                noData_Embed.setColor(`${config.err_hex}`);
                noData_Embed.setDescription(`There was nothing found about the query you searched for. Please check once again, if you used a valid query.`);
                noData_Embed.setFooter({ text: message.author.username, iconURL: message.author.avatarURL({ dynamic: true }) });
                noData_Embed.setTimestamp(message.createdTimestamp);

                setTimeout(() => {
                    // Possible_Error_2
                    return firstMsg.edit({ embeds: [noData_Embed] });
                }, 1000 * 3);
            } else {
                setTimeout(async () => {
                    await buttonPaginator(readyEmbeds, firstMsg, defaultPage);
                }, 1000 * 3);
            }
        });
    }
});