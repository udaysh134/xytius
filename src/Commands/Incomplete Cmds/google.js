const Command = require("../../Structures/Command.js");
const Discord = require("discord.js");
const config = require("../../Data/config.json");
const aubdycad = require("../../Data/aubdycad.json");
const emojis = require("../../Data/emojis.json");
const pictures = require("../../Data/pictures.json");
const keys = require("../../Data/keys.json");

const fetch = require('node-fetch');


module.exports = new Command({
    name: "google",
    description: "A command to search over the internet and get results of anything from Google, right with in Discord.",
    aliases: [],
    permission: "SendMessages",
    allowedChannels: [`${aubdycad.BotCommands1_C_ID}`, `${aubdycad.BotCommands2_C_ID}`],
    allowedServers: [`${config.TestServer_ID}`, `${config.Aubdycad_ID}`, `${config.XytiusServer_ID}`],
    cooldown: "",
    usage: `${config.prefix}google <query>`,
    usageDesc: `As name says, you can use this command to search anything from Google and you'll get structured result right here in Discord. The command is fairly simple to use. Just put the query (your search terms) while using the command and you'll get the same response as in Google. The first result is the top one only, but you can always view more. One thing to keep in mind is that Google sometimes shows its custom snippets for search terms in app or in browser, but those custom snippets are not available in commands's output, as they're only made for app's or browser's search results.\n\nThe output will always show results from different websites, which btw you can view the original one, by clicking the heading.`,
    usageExample: [`${config.prefix}google github`, `${config.prefix}google vincenzo`, `${config.prefix}google what is fermentation`],
    forTesting: false,
    HUCat: [`gen`, `search`],

    async run(message, args, client) {
        const cmndName = `Google`;
        const cmndEmoji = [`${emojis.ANIMATED_GOOGLE}`, `${emojis.ANIMATED_GOOGLE_SEARCH}`];
        const cmndColour = [`2f3136`, `e53935`, `fbc02d`, `4caf50`, `1565c0`];
        const cmndError = `${config.err_emoji}${config.tls}Google Error!!`;
        const cmndMarker = `${config.marker}`;

        /*
        ----------------------------------------------------------------------------------------------------
        Start                                                                   
        ----------------------------------------------------------------------------------------------------
        */
        const query = args.slice(1).join(" ");

        const link = keys.google.link;
        const cx = keys.google.cx;
        const key = keys.google.key;
        const mainLink = `${link}?q=${query}&cx=${cx}&key=${key}`;

        const noResultFound_Image = pictures.google_cmd.noResultsFound;
        

        /*
        ----------------------------------------------------------------------------------------------------
        Error Handling                                                                   
        ----------------------------------------------------------------------------------------------------
        */
        const noQuery_Embed = new Discord.EmbedBuilder();
        noQuery_Embed.setTitle(`${cmndError}`);
        noQuery_Embed.setColor(`${config.err_hex}`);
        noQuery_Embed.setDescription(`You didn't provided me any query for your search. Please provide a valid search query to get a valid result.`);
        noQuery_Embed.setFooter({ text: message.author.username, iconURL: message.author.avatarURL({ dynamic: true }) });
        noQuery_Embed.setTimestamp(message.createdTimestamp);

        // Possible_Error_1
        if(!query) return message.reply({ embeds: [noQuery_Embed] });


        /*
        ----------------------------------------------------------------------------------------------------
        Functions                                                                   
        ----------------------------------------------------------------------------------------------------
        */
        function resultEmbs(embed, colour, searchRes) {
            const res_title = searchRes.title ?? `No title here!!`;
            const res_titleLink = searchRes.link;
            const res_description = searchRes.snippet ?? `No description here!!`;

            let res_image

            embed.setColor(`${colour}`);
            embed.setDescription(`${cmndMarker}**[${res_title}](${res_titleLink})**\n${res_description}`);
            

            if(searchRes.pagemap.cse_image) {
                res_image = searchRes.pagemap.cse_image[0].src;

                if(!(res_image.startsWith("http"))) {
                    // Do nothing
                } else {
                    embed.setThumbnail(res_image);
                }
            } else {
                // Do nothing
            }
        }


        function moreResults(array, msg, srchRes1_Embed) {
            if(srchRes1_Embed.data.image !== null && srchRes1_Embed.data.image.url !== null) {
                srchRes1_Embed.setThumbnail(srchRes1_Embed.data.image.url);
                srchRes1_Embed.setImage(null);
            }

            if(array[3]) {
                const srchRes2_Embed = new Discord.EmbedBuilder();
                resultEmbs(srchRes2_Embed, cmndColour[2], array[1]);

                const srchRes3_Embed = new Discord.EmbedBuilder();
                resultEmbs(srchRes3_Embed, cmndColour[3], array[2]);

                const srchRes4_Embed = new Discord.EmbedBuilder();
                resultEmbs(srchRes4_Embed, cmndColour[4], array[3]);

                return msg.edit({ embeds: [srchRes1_Embed, srchRes2_Embed, srchRes3_Embed, srchRes4_Embed], components: [] });
            } else if(array[2]) {
                const srchRes2_Embed = new Discord.EmbedBuilder();
                resultEmbs(srchRes2_Embed, cmndColour[2], array[1]);

                const srchRes3_Embed = new Discord.EmbedBuilder();
                resultEmbs(srchRes3_Embed, cmndColour[3], array[2]);

                return msg.edit({ embeds: [srchRes1_Embed, srchRes2_Embed, srchRes3_Embed], components: [] });
            } else if(array[2]) {
                const srchRes2_Embed = new Discord.EmbedBuilder();
                resultEmbs(srchRes2_Embed, cmndColour[2], array[1]);

                return msg.edit({ embeds: [srchRes1_Embed, srchRes2_Embed], components: [] });
            }
        }


        /*
        ----------------------------------------------------------------------------------------------------
        Execution                                                                   
        ----------------------------------------------------------------------------------------------------
        */
        const searching_Embed = new Discord.EmbedBuilder();
        searching_Embed.setColor(`${cmndColour[0]}`);
        searching_Embed.setDescription(`${cmndEmoji[1]}   Searching   ${cmndEmoji[1]}`);

        message.reply({ embeds: [searching_Embed] }).then(async (searchingMsg) => {
            const result = await fetch(mainLink).then(res => res.json()).catch(() => { return `None` });
            

            const unknownError_Embed = new Discord.EmbedBuilder();
            unknownError_Embed.setTitle(`${cmndError}`);
            unknownError_Embed.setColor(`${config.err_hex}`);
            unknownError_Embed.setDescription(`An unknown error just occured. Please try again later.`);
            unknownError_Embed.setFooter({ text: message.author.username, iconURL: message.author.avatarURL({ dynamic: true }) });
            unknownError_Embed.setTimestamp(message.createdTimestamp);

            // Possible_Error_2
            if(result === `None` || !result) return searchingMsg.edit({ embeds: [unknownError_Embed] });


            const noResultFound_Embed = new Discord.EmbedBuilder();
            noResultFound_Embed.setTitle(`${cmndEmoji[0]}${config.tls}${cmndName}`);
            noResultFound_Embed.setColor(`${cmndColour[4]}`);
            noResultFound_Embed.setDescription(`No results found here!! Please make sure you're using a valid query for the search, or try again later.`);
            noResultFound_Embed.setImage(noResultFound_Image);
            noResultFound_Embed.setFooter({ text: message.author.username, iconURL: message.author.avatarURL({ dynamic: true }) });
            noResultFound_Embed.setTimestamp(message.createdTimestamp);

            // Possible_Error_3
            if(!result.items) return searchingMsg.edit({ embeds: [noResultFound_Embed] });



            // First Start ================================================== >>>>>
            const timeTaken = `${result.searchInformation.formattedSearchTime} seconds`;
            const resultArray = result.items;

            const title = resultArray[0].title;
            const titleLink = resultArray[0].link;
            const description = resultArray[0].snippet;

            const srchRes1_Embed = new Discord.EmbedBuilder();
            srchRes1_Embed.setTitle(`${cmndEmoji[0]}${config.tls}Top search results from Google`);
            srchRes1_Embed.setColor(`${cmndColour[4]}`);
            srchRes1_Embed.setDescription(`${cmndMarker}**[${title}](${titleLink})**\n${description}`);
            srchRes1_Embed.setFooter({ text: `${message.author.username} | Took ${timeTaken}`, iconURL: message.author.avatarURL({ dynamic: true }) });

            if((resultArray[0].pagemap) !== undefined) {
                if(resultArray[0].pagemap.cse_image) srchRes1_Embed.setImage(resultArray[0].pagemap.cse_image[0].src);
            }

            const viewMore_Button = new Discord.ActionRowBuilder().addComponents(
                new Discord.ButtonBuilder()
                .setCustomId(`google_viewMore`)
                .setLabel(`View more`)
                .setEmoji(`🔽`)
                .setStyle(Discord.ButtonStyle.Secondary)
            );


            // Execution ================================================== >>>>>
            searchingMsg.edit({ embeds: [srchRes1_Embed], components: [viewMore_Button] }).then((resultMsg) => {
                const google_Collector = message.channel.createMessageComponentCollector({ time: 1000 * 20 });
                const checkInteraction = [];

                google_Collector.on(`collect`, async (interaction) => {
                    const notYouCanDo_Embed = new Discord.EmbedBuilder();
                    notYouCanDo_Embed.setTitle(`${cmndError}`);
                    notYouCanDo_Embed.setColor(`${config.err_hex}`);
                    notYouCanDo_Embed.setDescription(`Oh oh!! Sorry ${interaction.user.tag}, but you cannot do that. Only ${message.author.tag} can use the button.`);

                    // Possible_Error_4
                    if(interaction.user.id !== message.author.id) return interaction.reply({ embeds: [notYouCanDo_Embed], ephemeral: true });


                    if(interaction.customId === `google_viewMore`) {
                        checkInteraction.push(`Button clicked`);
                        interaction.deferUpdate();

                        srchRes1_Embed.setColor(`${cmndColour[1]}`);

                        return moreResults(resultArray, resultMsg, srchRes1_Embed);
                    }
                });


                google_Collector.on(`end`, async () => {
                    viewMore_Button.components[0].setDisabled(true);

                    if(checkInteraction.length !== 0) return;
                    return resultMsg.edit({ embeds: [srchRes1_Embed], components: [viewMore_Button] });
                });
            });
        });
    }
});