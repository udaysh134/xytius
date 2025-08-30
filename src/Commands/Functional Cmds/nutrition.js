const Command = require("../../Structures/Command.js");
const Discord = require("discord.js");
const config = require("../../Data/config.json");
const aubdycad = require("../../Data/aubdycad.json");
const emojis = require("../../Data/emojis.json");
const pictures = require("../../Data/pictures.json");
const keys = require("../../Data/keys.json");

const FUNC_callNinjaAPI = require("../../Systems/External Functions/FUNC_callNinjaAPI.js");


module.exports = new Command({
    name: "nutrition",
    description: "Search for a food using this command, and get a bunch of nutritional data of that food.",
    aliases: ["nutrients"],
    permission: "SendMessages",
    allowedChannels: [`${aubdycad.BotCommands1_C_ID}`, `${aubdycad.BotCommands2_C_ID}`],
    allowedServers: [`${config.TestServer_ID}`, `${config.Aubdycad_ID}`, `${config.XytiusServer_ID}`],
    cooldown: "",
    usage: `${config.prefix}nutrition <query>`,
    usageDesc: `The command provides you data of amount of different minerals present in a food. By default, the selected quantity of any food is 100 grams but you can toggle the value by specifying it in the query.\n\nYou can specify the quantity in grams or kilograms or even in numbers (for some foods). You could come accross with some food names which are valid and even the spelling is correct but is showing an error. For that case, simply ignore the error. Unfortunately, there're some foods in this diverse World which, the bot cannot recognise and hence gives an error.`,
    usageExample: [`${config.prefix}nutrition an apple`, `${config.prefix}nutrition 1 glass of Milk`, `${config.prefix}nutrition 5 bananas`, `${config.prefix}nutrition kiwi, 2 oranges, 250g of chips`],
    forTesting: false,
    HUCat: [`gen`, `functional`],

    async run(message, args, client) {
        const cmndName = `Nutritional Data`;
        const cmndEmoji = [`🥗`];
        const cmndColour = [`77b255`];
        const cmndError = `${config.err_emoji}${config.tls}Nutrition : Command Error`;
        const cmndMarker = `${config.marker}`;

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


        function createLine(length) {
            let result = ``;

            for (let i = 0; i < length; i++) {
                result += `-`;
            }

            // result += ` >>`;
            return result;
        }


        /*
        ----------------------------------------------------------------------------------------------------
        Error Handling
        ----------------------------------------------------------------------------------------------------
        */
        const noWordGiven_Embed = new Discord.EmbedBuilder();
        noWordGiven_Embed.setTitle(`${cmndError}`);
        noWordGiven_Embed.setColor(`${config.err_hex}`);
        noWordGiven_Embed.setDescription(`You just forgot to provide me the query you want nutritional data for. Please provide me a valid query as a food, with or without specified quantity.`);
        noWordGiven_Embed.setFooter({ text: message.author.username, iconURL: message.author.avatarURL({ dynamic: true }) });
        noWordGiven_Embed.setTimestamp(message.createdTimestamp);
        
        // Possible_Error_1
        if(!args[1]) return message.reply({ embeds: [noWordGiven_Embed] });


        /*
        ----------------------------------------------------------------------------------------------------
        Execution
        ----------------------------------------------------------------------------------------------------
        */
        const query = args.slice(1).join(" ");

        const link = `${keys.api_ninjas.links.nutrition}${query}`;
        const res = await FUNC_callNinjaAPI(`${link}`, cmndError, message);


        const invalidQueryGiven_Embed = new Discord.EmbedBuilder();
        invalidQueryGiven_Embed.setTitle(`${cmndError}`);
        invalidQueryGiven_Embed.setColor(`${config.err_hex}`);
        invalidQueryGiven_Embed.setDescription(`The query you gave as a food to get the nutritional data, is invalid. Check yourself once again if you mistakenly, wrote something else other than any food product.`);
        invalidQueryGiven_Embed.setFooter({ text: message.author.username, iconURL: message.author.avatarURL({ dynamic: true }) });
        invalidQueryGiven_Embed.setTimestamp(message.createdTimestamp);
        
        // Possible_Error_2
        if(res.length === 0) return message.reply({ embeds: [invalidQueryGiven_Embed] });



        // Final_Execution ================================================== >>>>>
        let text = ``;
        let m_ = cmndMarker;

        res.forEach((elem) => {
            text += `${m_}**Food :** ${elem.serving_size_g} g of ${standardiseCase(`${elem.name}`)}\n${m_}**Calories :** ${elem.calories} kcal\n${m_}**Fat :** ${elem.fat_total_g} g\n${m_}**Saturated fat :** ${elem.fat_saturated_g} g\n${m_}**Protein :** ${elem.protein_g} g\n${m_}**Carbohydrates :** ${elem.carbohydrates_total_g} g\n${m_}**Fiber :** ${elem.fiber_g} g\n${m_}**Sugar :** ${elem.sugar_g} g\n${m_}**Sodium :** ${elem.sodium_mg} mg\n${m_}**Potassium :** ${elem.potassium_mg} mg\n${m_}**Cholesterol :** ${elem.cholesterol_mg} mg`;
            if(res.length > 1) text += `\n${createLine(50)}\n`
        });
        
        const nutrition_Embed = new Discord.EmbedBuilder();
        nutrition_Embed.setTitle(`${cmndEmoji[0]}${config.tls}${cmndName}`);
        nutrition_Embed.setDescription(`${text}`);
        nutrition_Embed.setColor(`${cmndColour[0]}`);
        nutrition_Embed.setFooter({ text: message.author.username, iconURL: message.author.avatarURL({ dynamic: true }) });
        nutrition_Embed.setTimestamp(message.createdTimestamp);

        return message.reply({ embeds: [nutrition_Embed] });
    }
});