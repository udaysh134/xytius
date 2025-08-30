const Command = require("../../Structures/Command.js");
const Discord = require("discord.js");
const config = require("../../Data/config.json");
const aubdycad = require("../../Data/aubdycad.json");
const emojis = require("../../Data/emojis.json");
const pictures = require("../../Data/pictures.json");
const keys = require("../../Data/keys.json");

const fetch = require('node-fetch');


module.exports = new Command({
    name: "wikipedia",
    description: "A command to search any article about anything (available) from wikipedia.",
    aliases: ["wiki"],
    permission: "SendMessages",
    allowedChannels: [`${aubdycad.BotCommands1_C_ID}`, `${aubdycad.BotCommands2_C_ID}`],
    allowedServers: [`${config.TestServer_ID}`, `${config.Aubdycad_ID}`, `${config.XytiusServer_ID}`],
    cooldown: "",
    usage: `${config.prefix}wikipedia <query>`,
    usageDesc: `A very simple command to use. Just put the query of whatever you want a Wikipedia page of. If the search result is valid (or say, a Wikipedia page is available for that term), you'll get the result right here in Discord. If not, you'll get the confirmation about that too.\n\nFor quick summary, the result will be enough just being here, but you can always view the original page in the browser, just by clicking "Go to the page" button right below the result, directly from Discord.`,
    usageExample: [`${config.prefix}wikipedia Yeti`, `${config.prefix}wikipedia Earth Day`, `${config.prefix}wikipedia KSHMR`],
    forTesting: false,
    HUCat: [`gen`, `search`],

    async run(message, args, client) {
        const cmndName = `Wikipedia`;
        const cmndEmoji = [`${emojis.WIKIPEDIA_LOGO}`, `${emojis.ANIMATED_LOADING}`];
        const cmndColour = [`2f3136`, `d3d3d3`];
        const cmndError = `${config.err_emoji}${config.tls}Wikipedia Error!!`;
        const cmndMarker = `${config.marker}`;

        /*
        ----------------------------------------------------------------------------------------------------
        Start
        ----------------------------------------------------------------------------------------------------
        */
        const query = args.slice(1).join(" ");
        const link = `${keys.wikipedia.link}${encodeURIComponent(query)}`;

        const noResultFound_Image = pictures.wikipedia_cmd.noResultsFound;
        

        /*
        ----------------------------------------------------------------------------------------------------
        Error Handling
        ----------------------------------------------------------------------------------------------------
        */
        const noQuery_Embed = new Discord.EmbedBuilder();
        noQuery_Embed.setTitle(`${cmndError}`);
        noQuery_Embed.setColor(`${config.err_hex}`);
        noQuery_Embed.setDescription(`You didn't provided me any query for your search. Please provide me a valid search query to get a valid result.`);
        noQuery_Embed.setFooter({ text: message.author.username, iconURL: message.author.avatarURL({ dynamic: true }) });
        noQuery_Embed.setTimestamp(message.createdTimestamp);
        
        // Possible_Error_1
        if(!query) return message.reply({ embeds: [noQuery_Embed] });


        /*
        ----------------------------------------------------------------------------------------------------
        Execution
        ----------------------------------------------------------------------------------------------------
        */
        const searching_Embed = new Discord.EmbedBuilder();
        searching_Embed.setColor(`${cmndColour[0]}`);
        searching_Embed.setDescription(`Searching ${cmndEmoji[1]}`);

        message.reply({ embeds: [searching_Embed] }).then(async (searchingMsg) => {
            const result = await fetch(link).then((res) => res.json()).catch(() => { return `None` });


            const unknownError_Embed = new Discord.EmbedBuilder();
            unknownError_Embed.setTitle(`${cmndError}`);
            unknownError_Embed.setColor(`${config.err_hex}`);
            unknownError_Embed.setDescription(`An unknown error just occured. Please try again later.`);
            unknownError_Embed.setFooter({ text: message.author.username, iconURL: message.author.avatarURL({ dynamic: true }) });
            unknownError_Embed.setTimestamp(message.createdTimestamp);

            // Possible_Error_2
            if(result === `None` || !result) return searchingMsg.edit({ embeds: [unknownError_Embed] });


            const noResultsFound_Embed = new Discord.EmbedBuilder();
            noResultsFound_Embed.setTitle(`${cmndEmoji[0]}${config.tls}${cmndName}`);
            noResultsFound_Embed.setColor(`${cmndColour[1]}`);
            noResultsFound_Embed.setDescription(`No results found here!! Please make sure you're using a valid query for the search, or try again later.`);
            noResultsFound_Embed.setImage(noResultFound_Image);
            noResultsFound_Embed.setFooter({ text: message.author.username, iconURL: message.author.avatarURL({ dynamic: true }) });
            noResultsFound_Embed.setTimestamp(message.createdTimestamp);

            // Possible_Error_3
            if (result.title === `Not found.`) return searchingMsg.edit({ embeds: [noResultsFound_Embed] });



            // Execution ================================================== >>>>>
            const goToThePage_Button = new Discord.ActionRowBuilder().addComponents(
                new Discord.ButtonBuilder()
                .setLabel(`Go to the page`)
                .setStyle(Discord.ButtonStyle.Link)
                .setURL(result.content_urls.mobile.page)
            );


            if(result.type === `disambiguation`) {
                const wikiResult_Embed = new Discord.EmbedBuilder();
                wikiResult_Embed.setTitle(`${cmndEmoji[0]}${config.tls}${cmndName}`);
                wikiResult_Embed.setColor(`${cmndColour[1]}`);
                wikiResult_Embed.setDescription(`There's no any specific article for your provided query. This Wikipedia search term has some common results. Please prefer visiting the page, by clicking on the button below.`);
                wikiResult_Embed.setFooter({ text: message.author.username, iconURL: message.author.avatarURL({ dynamic: true }) });
                wikiResult_Embed.setTimestamp(message.createdTimestamp);

                return searchingMsg.edit({ embeds: [wikiResult_Embed], components: [goToThePage_Button] });
            } else {
                const wikiResult_Embed = new Discord.EmbedBuilder();
                wikiResult_Embed.setTitle(`${cmndEmoji[0]}${config.tls}${cmndName}`);
                wikiResult_Embed.setColor(`${cmndColour[1]}`);
                wikiResult_Embed.addFields({
                    name: `${result.title} - ${result.description}`,
                    value: `${result.extract}`,
                    inline: false
                });
                wikiResult_Embed.setFooter({ text: message.author.username, iconURL: message.author.avatarURL({ dynamic: true }) });
                wikiResult_Embed.setTimestamp(message.createdTimestamp);

                if(result.originalimage !== undefined) wikiResult_Embed.setThumbnail(`${result.originalimage.source}`);
                
                return searchingMsg.edit({ embeds: [wikiResult_Embed], components: [goToThePage_Button] });
            }
        });
    }
});