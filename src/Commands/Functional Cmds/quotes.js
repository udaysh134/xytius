const Command = require("../../Structures/Command.js");
const Discord = require("discord.js");
const config = require("../../Data/config.json");
const aubdycad = require("../../Data/aubdycad.json");
const emojis = require("../../Data/emojis.json");
const pictures = require("../../Data/pictures.json");
const keys = require("../../Data/keys.json");

const FUNC_callNinjaAPI = require("../../Systems/External Functions/FUNC_callNinjaAPI.js");


module.exports = new Command({
    name: "quotes",
    description: "Get quotes of numerous categories or from a specified category, written by famous writers.",
    aliases: ["quote"],
    permission: "SendMessages",
    allowedChannels: [`${aubdycad.BotCommands1_C_ID}`, `${aubdycad.BotCommands2_C_ID}`],
    allowedServers: [`${config.TestServer_ID}`, `${config.Aubdycad_ID}`, `${config.XytiusServer_ID}`],
    cooldown: "",
    usage: `${config.prefix}quotes [category]`,
    usageDesc: `To get quotes based on random categorisation, simply type the command with no query. To get quotes based on specified category(s), use the name of the category as the second query in your command. To get details about what query keywords you can use as a category in your command, use "\`${config.prefix}quotes categories\`" command.\n\nThe command gives you two quotes at a time with their writers and the category they belong to. Try not to get rate limited.`,
    usageExample: [`${config.prefix}quotes`, `${config.prefix}quotes friendship`, `${config.prefix}quotes beauty`, `${config.prefix}quotes legal`],
    forTesting: false,
    HUCat: [`gen`, `functional`],

    async run(message, args, client) {
        const cmndName = `Quotes`;
        const cmndEmoji = [`🗒`];
        const cmndColour = [`ccd6dd`];
        const cmndError = `${config.err_emoji}${config.tls}Quotes : Command Error`;
        const cmndMarker = `🖋`;

        /*
        ----------------------------------------------------------------------------------------------------
        Start
        ----------------------------------------------------------------------------------------------------
        */
        const categories = [
            `age`,
            `alone`,
            `amazing`,
            `anger`,
            `architecture`,
            `art`,
            `attitude`,
            `beauty`,
            `best`,
            `birthday`,
            `business`,
            `car`,
            `change`,
            `communications`,
            `computers`,
            `cool`,
            `courage`,
            `dad`,
            `dating`,
            `death`,
            `design`,
            `dreams`,
            `education`,
            `environmental`,
            `equality`,
            `experience`,
            `failure`,
            `faith`,
            `family`,
            `famous`,
            `fear`,
            `fitness`,
            `food`,
            `forgiveness`,
            `freedom`,
            `friendship`,
            `funny`,
            `future`,
            `god`,
            `good`,
            `government`,
            `graduation`,
            `great`,
            `happiness`,
            `health`,
            `history`,
            `home`,
            `hope`,
            `humor`,
            `imagination`,
            `inspirational`,
            `intelligence`,
            `jealousy`,
            `knowledge`,
            `leadership`,
            `learning`,
            `legal`,
            `life`,
            `love`,
            `marriage`,
            `medical`,
            `men`,
            `mom`,
            `money`,
            `morning`,
            `movies`,
            `success`,
        ];

        const limit = 2;


        /*
        ----------------------------------------------------------------------------------------------------
        Function
        ----------------------------------------------------------------------------------------------------
        */
        function standardiseCase(value) {
            const splitted = value.split('');
            const firstVal = splitted[0].toUpperCase();
            const otherVal = splitted.slice(1).join('');

            let resultValue = `${firstVal}${otherVal.toLowerCase().replace(/_/g, " ")}`;
            return resultValue;
        }


        function formatQuotes(responseBodyArr, ctgry) {
            let text = ``;

            responseBodyArr.forEach((elem) => {
                text += `${cmndMarker}  :  ${elem.quote}\n-- ***${elem.author}*** ( Category : ${standardiseCase(`${ctgry}`)} )\n\n`;
            });

            return text;
        }


        /*
        ----------------------------------------------------------------------------------------------------
        Execution
        ----------------------------------------------------------------------------------------------------
        */
        if(args[1]) {
            if(args[1] === `categories`.toLowerCase()) {
                const categoriesInfo_Embed = new Discord.EmbedBuilder();
                categoriesInfo_Embed.setTitle(`${cmndEmoji[0]}${config.tls}${cmndName} Categories`);
                categoriesInfo_Embed.setDescription(`Given below are the categories you can use as a query to get a specific category of quotes as per to your desire :-\n\n\`\`\`${standardiseCase(categories.join(`, `))}.\`\`\``);
                categoriesInfo_Embed.setColor(`${cmndColour[0]}`);
                categoriesInfo_Embed.setFooter({ text: message.author.username, iconURL: message.author.avatarURL({ dynamic: true }) });
                categoriesInfo_Embed.setTimestamp(message.createdTimestamp);

                return message.reply({ embeds: [categoriesInfo_Embed] });
            } else {
                const checkArr = [];
                const chosenCategory = `${args[1].toLowerCase()}`;

                categories.forEach((elem) => {
                    if (elem === chosenCategory) return checkArr.push(`yes`);
                });


                const notAValidCategory_Embed = new Discord.EmbedBuilder();
                notAValidCategory_Embed.setTitle(`${cmndError}`);
                notAValidCategory_Embed.setColor(`${config.err_hex}`);
                notAValidCategory_Embed.setDescription(`The category you provided is not valid as your query is not among the specified categories. To get detail of what categoreies you can choose, use\n"\`${config.prefix}quotes categories\`" command.`);
                notAValidCategory_Embed.setFooter({ text: message.author.username, iconURL: message.author.avatarURL({ dynamic: true }) });
                notAValidCategory_Embed.setTimestamp(message.createdTimestamp);

                // Possible_Error_1
                if (checkArr.length === 0) return message.reply({ embeds: [notAValidCategory_Embed] });



                // Execution ================================================== >>>>>
                const link = `${keys.api_ninjas.links.quotes}${chosenCategory}&limit=${limit}`;
                const res = await FUNC_callNinjaAPI(`${link}`, cmndError, message);

                const desc = formatQuotes(res, chosenCategory);

                const quotes_Embed = new Discord.EmbedBuilder();
                quotes_Embed.setTitle(`${cmndEmoji[0]}${config.tls}${cmndName}`);
                quotes_Embed.setDescription(`${desc}`);
                quotes_Embed.setColor(`${cmndColour[0]}`);
                quotes_Embed.setFooter({ text: message.author.username, iconURL: message.author.avatarURL({ dynamic: true }) });
                quotes_Embed.setTimestamp(message.createdTimestamp);

                return message.reply({ embeds: [quotes_Embed] });
            }
        } else {
            const randomCategory = categories[Math.floor(Math.random() * categories.length)];
            const link = `${keys.api_ninjas.links.quotes}${randomCategory}&limit=${limit}`;
            const res = await FUNC_callNinjaAPI(`${link}`, cmndError, message);



            // Execution ================================================== >>>>>
            const desc = formatQuotes(res, randomCategory);

            const quotes_Embed = new Discord.EmbedBuilder();
            quotes_Embed.setTitle(`${cmndEmoji[0]}${config.tls}${cmndName}`);
            quotes_Embed.setDescription(`${desc}`);
            quotes_Embed.setColor(`${cmndColour[0]}`);
            quotes_Embed.setFooter({ text: message.author.username, iconURL: message.author.avatarURL({ dynamic: true }) });
            quotes_Embed.setTimestamp(message.createdTimestamp);

            return message.reply({ embeds: [quotes_Embed] });
        }
    }
});