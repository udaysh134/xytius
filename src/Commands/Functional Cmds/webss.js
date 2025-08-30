const Command = require("../../Structures/Command.js");
const Discord = require("discord.js");
const config = require("../../Data/config.json");
const aubdycad = require("../../Data/aubdycad.json");
const emojis = require("../../Data/emojis.json");
const pictures = require("../../Data/pictures.json");
const keys = require("../../Data/keys.json");

const fetch = require("node-fetch");


module.exports = new Command({
    name: "webss",
    description: "Get a full/single page screenshot of any website. Just provide it's web URL.",
    aliases: [],
    permission: "SendMessages",
    allowedChannels: [`${aubdycad.BotCommands1_C_ID}`, `${aubdycad.BotCommands2_C_ID}`],
    allowedServers: [`${config.TestServer_ID}`, `${config.Aubdycad_ID}`, `${config.XytiusServer_ID}`],
    cooldown: "",
    usage: `${config.prefix}webss <web_url> | [full / fullpage / f]`,
    usageDesc: `In any case, if you want a screenshot of a website (maybe for reading articles or capturing full webpage screenshot), this command may come handy for you as it can provide you a single page or a full webpage screenshot just in seconds without any hassle. All you need to do is, just provide a valid url of that website and specify if the captured screenshot is gonna be full or not by adding an extra query (f / full / fullpage) after seperating the url from "\` | \`" sign. If you don't want your screenshot to be full, you simply don't need to specify anything extra, just provide the URL. This will give you the first page (home screen) of that URL.\n\n**NOTE :** All screenshots will be from the PC version of the web. Try not to get rate limited, you'll be prohibited from using the command.`,
    usageExample: [`${config.prefix}webss https://www.apple.com/`, `${config.prefix}webss www.youtube.com | f`, `${config.prefix}webss starbucks.com`, `${config.prefix}webss https://en.wikipedia.org/wiki/Earth | full`],
    forTesting: false,
    HUCat: [`gen`, `functional`],

    async run(message, args, client) {
        const cmndName = `Webpage Screenshot`;
        const cmndEmoji = [`📸`, `${emojis.ANIMATED_LOADING}`];
        const cmndColour = [`ffac33`];
        const cmndError = `${config.err_emoji}${config.tls}WebSS : Command Error!!`;
        const cmndMarker = `${config.marker}`;

        /*
        ----------------------------------------------------------------------------------------------------
        Start
        ----------------------------------------------------------------------------------------------------
        */
        const apiKey = keys.webss.key;
        const partialLink = keys.webss.link;

        const linkFresh = true;
        const linkFile = `png`;
        const linkNoCookieBanners = true;
        const linkDestroySS = true;
        const linkDarkMode = true;
        const linkBlockTracking = true;
        const linkLazyLoad = true;


        /*
        ----------------------------------------------------------------------------------------------------
        Embeds
        ----------------------------------------------------------------------------------------------------
        */
        const searchingURL_Embed = new Discord.EmbedBuilder();
        searchingURL_Embed.setTitle(`${cmndEmoji[0]}${config.tls}${cmndName}`);
        searchingURL_Embed.setDescription(`Searching for the URL... ${cmndEmoji[1]}`);
        searchingURL_Embed.setColor(`${cmndColour[0]}`);

        const takingSS_Embed = new Discord.EmbedBuilder();
        takingSS_Embed.setTitle(`${cmndEmoji[0]}${config.tls}${cmndName}`);
        takingSS_Embed.setDescription(`Taking screenshot!! This may take time, please wait... ${cmndEmoji[1]}`);
        takingSS_Embed.setColor(`${cmndColour[0]}`);


        /*
        ----------------------------------------------------------------------------------------------------
        Error Handling
        ----------------------------------------------------------------------------------------------------
        */
        const noURLGiven_Embed = new Discord.EmbedBuilder();
        noURLGiven_Embed.setTitle(`${cmndError}`);
        noURLGiven_Embed.setColor(`${config.err_hex}`);
        noURLGiven_Embed.setDescription(`You just forgot to provide me the URL of the webpage, you want screenshot of. Please mention a valid URL (link) and remember to provide the full URL (including http:// or https://) or you'll get an error.`);
        noURLGiven_Embed.setFooter({ text: message.author.username, iconURL: message.author.avatarURL({ dynamic: true }) });
        noURLGiven_Embed.setTimestamp(message.createdTimestamp);
        
        // Possible_Error_1
        if(!args[1]) return message.reply({ embeds: [noURLGiven_Embed] });


        /*
        ----------------------------------------------------------------------------------------------------
        Functions
        ----------------------------------------------------------------------------------------------------
        */
        async function getWebSS(msg, result, fullP) {
            const error_Embed = new Discord.EmbedBuilder();
            error_Embed.setTitle(`${cmndError}`);
            error_Embed.setColor(`${config.err_hex}`);
            error_Embed.setDescription(`An error just occured while getting the screeshot of the query you gave. Please make sure you're giving a valid URL and it should contain the whole domain of the website or page you specifically want screenshot of. For example : "\`https://discord.com\`" or "\`www.shutterstock.com\`" or "\`youtube.com\`".`);
            error_Embed.setFooter({ text: message.author.username, iconURL: message.author.avatarURL({ dynamic: true }) });
            error_Embed.setTimestamp(message.createdTimestamp);
            
            // Possible_Error_3
            if(result.error) return msg.edit({ embeds: [error_Embed] });



            // Execution ================================================== >>>>>
            const isFullPage = fullP === true ? `Yes` : `No`;

            const finalSS_Embed = new Discord.EmbedBuilder();
            finalSS_Embed.setTitle(`${cmndEmoji[0]}${config.tls}${cmndName}`);
            finalSS_Embed.setDescription(`**Webpage :** [Click here](${result.url})\n**Is captured full :** ${isFullPage}\n**Image file :** ${(result.file_type).toUpperCase()}`);
            finalSS_Embed.setColor(`${cmndColour[0]}`);
            finalSS_Embed.setImage(`${result.screenshot}`);
            finalSS_Embed.setFooter({ text: message.author.username, iconURL: message.author.avatarURL({ dynamic: true }) });
            finalSS_Embed.setTimestamp(message.createdTimestamp);

            return msg.edit({ embeds: [finalSS_Embed] });
        }


        /*
        ----------------------------------------------------------------------------------------------------
        Execution
        ----------------------------------------------------------------------------------------------------
        */
        message.channel.send({ embeds: [searchingURL_Embed] }).then(async (searchingMsg) => {
            const separator = "|";
            const msgCont = `${message.content}`;
            const splitted = args.join(" ").split(` ${separator} `);
            const splittedFlag = splitted[1];



            // Primary_Execution ================================================== >>>>>
            setTimeout(() => {
                searchingMsg.edit({ embeds: [takingSS_Embed] }).then(async () => {
                    if (msgCont.includes(`${separator}`) && splittedFlag) {
                        if (splittedFlag === `f` || splittedFlag === `full` || splittedFlag === `fullpage`) {
                            const fp_Link = `${partialLink}token=${apiKey}&url=${args[1]}&full_page=true&fresh=${linkFresh}&output=json&file_type=${linkFile}&no_cookie_banners=${linkNoCookieBanners}&lazy_load=${linkLazyLoad}&destroy_screenshot=${linkDestroySS}&dark_mode=${linkDarkMode}&block_tracking=${linkBlockTracking}&wait_for_event=load`;
                            const fp_Result = await fetch(fp_Link);
                            const fp_Res = await fp_Result.json();


                            // Final_Execution ================================================== >>>>>
                            return await getWebSS(searchingMsg, fp_Res, true);
                        } else {
                            const invalidFlag_Embed = new Discord.EmbedBuilder();
                            invalidFlag_Embed.setTitle(`${cmndError}`);
                            invalidFlag_Embed.setColor(`${config.err_hex}`);
                            invalidFlag_Embed.setDescription(`The flag you provided at the end is invalid as, only "\`f\`" flag is available for now for getting full page of the website. You can also define it as "\`full\`" / "\`fullpage\`".`);
                            invalidFlag_Embed.setFooter({ text: message.author.username, iconURL: message.author.avatarURL({ dynamic: true }) });
                            invalidFlag_Embed.setTimestamp(message.createdTimestamp);

                            // Possible_Error_2
                            return searchingMsg.edit({ embeds: [invalidFlag_Embed] });
                        }
                    } else {
                        const link = `${partialLink}token=${apiKey}&url=${args[1]}&fresh=${linkFresh}&output=json&file_type=${linkFile}&no_cookie_banners=${linkNoCookieBanners}&lazy_load=${linkLazyLoad}&destroy_screenshot=${linkDestroySS}&dark_mode=${linkDarkMode}&block_tracking=${linkBlockTracking}&wait_for_event=load`;
                        const result = await fetch(link);
                        const res = await result.json();


                        // Final_Execution ================================================== >>>>>
                        return await getWebSS(searchingMsg, res);
                    }
                });
            }, 1000 * 3);
        });
    }
});