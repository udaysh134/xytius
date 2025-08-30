const Command = require("../../Structures/Command.js");
const Discord = require("discord.js");
const config = require("../../Data/config.json");
const aubdycad = require("../../Data/aubdycad.json");
const emojis = require("../../Data/emojis.json");
const pictures = require("../../Data/pictures.json");
const keys = require("../../Data/keys.json");

const fetch = require("node-fetch");
const moment = require("moment");
const advCal = require("advanced-calculator");


module.exports = new Command({
    name: "convert",
    description: "A simple yet useful command for conversions of some units to other.",
    aliases: ["conv"],
    permission: "SendMessages",
    allowedChannels: [`${aubdycad.BotCommands1_C_ID}`, `${aubdycad.BotCommands2_C_ID}`],
    allowedServers: [`${config.TestServer_ID}`, `${config.Aubdycad_ID}`, `${config.XytiusServer_ID}`],
    cooldown: "",
    usage: `${config.prefix}convert <fromUnit-toUnit> <number>  ::  ${config.prefix}convert <currency> <fromCurrency-toCurrency>`,
    usageDesc: `When people sometimes just forget calculation for conversion of, a unit to another, this command could be handy for that scenario. Use this command for simple conversions like meters to kilometers / yards/ feets etc. The command is not just limited to disctance units, but also can be used to convert temperature units, few mathamatical units and most importantly, currencies.\n\nYes, that's right! The command can be used to check live exchange rates of different currencies for other currencies. All you need to know is country's currency code.\n\nGiven below is all of the conversions you can use in this command for converting different values :-\`\`\`\n• c-f\n• f-c\n\n• rad-deg\n• deg-rad\n\n• mm-m\n\n• cm-m\n\n• in-yd\n• in-m\n• in-mi\n\n• ft-in\n• ft-yd\n• ft-m\n• ft-mi\n\n• yd-in\n• yd-ft\n• yd-m\n• yd-mi\n\n• m-mm\n• m-cm\n• m-km\n\n• km-m\n\n• mi-in\n• mi-ft\n• mi-yd\n• mi-m\n\n• currency\`\`\`\nHere,\nc - celcius\nf - fahrenheit\nrad- radian\ndeg - degree\nmm - millimeters\nm - meters\ncm - centimeters\nin - inches\nyd - yards\nmi - miles\nft - feets\nkm - kilometers.\n\n**NOTE :** For converting currencies, you need to specify the keyword "currency" before giving the codes, in the command. Seperate two codes with a hyphen (`-`) to execute the command properly.`,
    usageExample: [`${config.prefix}convert m-km 5250`, `${config.prefix}convert mi-m 7`, `${config.prefix}convert currency usd-inr`],
    forTesting: false,
    HUCat: [`gen`, `functional`],

    async run(message, args, client) {
        const cmndName = `Conversion`;
        const cmndEmoji = [`🔁`];
        const cmndColour = [`3b88c3`];
        const cmndError = `${config.err_emoji}${config.tls}Convert : Command Error!!`;
        const cmndMarker = `${config.marker}`;

        /*
        ----------------------------------------------------------------------------------------------------
        Start
        ----------------------------------------------------------------------------------------------------
        */
        const conversions = [
            `c-f`,
            `f-c`,

            `rad-deg`,
            `deg-rad`,

            `mm-m`,

            `cm-m`,

            `in-yd`,
            `in-m`,
            `in-mi`,

            `ft-in`,
            `ft-yd`,
            `ft-m`,
            `ft-mi`,
            
            `yd-in`,
            `yd-ft`,
            `yd-m`,
            `yd-mi`,

            `m-mm`,
            `m-cm`,
            `m-km`,

            `km-m`,

            `mi-in`,
            `mi-ft`,
            `mi-yd`,
            `mi-m`,
        ];


        /*
        ----------------------------------------------------------------------------------------------------
        Error Handling
        ----------------------------------------------------------------------------------------------------
        */
        const noArgs_Embed = new Discord.EmbedBuilder();
        noArgs_Embed.setTitle(`${cmndError}`);
        noArgs_Embed.setColor(`${config.err_hex}`);
        noArgs_Embed.setDescription(`You didn't specified what conversion to do. Use "\`${config.prefix}usage\`" command for this command to get more details on it.`);
        noArgs_Embed.setFooter({ text: message.author.username, iconURL: message.author.avatarURL({ dynamic: true }) });
        noArgs_Embed.setTimestamp(message.createdTimestamp);

        // Possible_Error_1
        if(!args[1]) return message.reply({ embeds: [noArgs_Embed] });


        /*
        ----------------------------------------------------------------------------------------------------
        Functions                                                                   
        ----------------------------------------------------------------------------------------------------
        */
        function convEmbed(embed, result, unit_1, unit_2, currency, lastUpdated) {
            const quesVal = currency === true ? `1` : `${args[2]}`;
            const resValue = currency === true ? `Rounded : ${result.toLocaleString()} ${unit_2}\nExact : ${result} ${unit_2}` : `${result.toLocaleString()} ${unit_2}`;


            embed.setTitle(`${cmndEmoji[0]}${config.tls}${cmndName}`);
            embed.setColor(`${cmndColour[0]}`);
            embed.addFields({
                name: `${cmndMarker}From :`,
                value: `\`\`\`${quesVal} ${unit_1}\`\`\``,
                inline: false
            }, {
                name: `${cmndMarker}To :`,
                value: `\`\`\`${resValue}\`\`\``,
                inline: false
            });


            if(currency === true) {
                embed.setFooter({ text: `${message.author.username}  |  Last Updated : ${lastUpdated}`, iconURL: message.author.avatarURL({ dynamic: true }) });
            } else {
                embed.setFooter({ text: message.author.username, iconURL: message.author.avatarURL({ dynamic: true }) });
                embed.setTimestamp(message.createdTimestamp);
            }
        }


        /*
        ----------------------------------------------------------------------------------------------------
        Execution
        ----------------------------------------------------------------------------------------------------
        */
        if(args[1] === `currency`) {
            const noCurrencyChosen_Embed = new Discord.EmbedBuilder();
            noCurrencyChosen_Embed.setTitle(`${cmndError}`);
            noCurrencyChosen_Embed.setColor(`${config.err_hex}`);
            noCurrencyChosen_Embed.setDescription(`You just forgot to provide me the conversion values. Please mention, which currency to convert and from what currency to convert. For example : "\`usd-inr\`". Visit [here](https://en.m.wikipedia.org/wiki/ISO_4217) for more info on Currency Codes.`);
            noCurrencyChosen_Embed.setFooter({ text: message.author.username, iconURL: message.author.avatarURL({ dynamic: true }) });
            noCurrencyChosen_Embed.setTimestamp(message.createdTimestamp);

            // Possible_Error_2
            if (!args[2]) return message.reply({ embeds: [noCurrencyChosen_Embed] });


            const splitted = args[2].split("-");
            const fromCurrency = splitted[0];
            const toCurrency = splitted[1];


            const invalidConersion_Embed = new Discord.EmbedBuilder();
            invalidConersion_Embed.setTitle(`${cmndError}`);
            invalidConersion_Embed.setColor(`${config.err_hex}`);
            invalidConersion_Embed.setDescription(`You're using the command wrong!! Please provide both the country's currency code : **from which** you wanna convert and **to which** you wanna convert the values. Use "\`${config.prefix}usage\`" command for this command to get more info about it.`);
            invalidConersion_Embed.setFooter({ text: message.author.username, iconURL: message.author.avatarURL({ dynamic: true }) });
            invalidConersion_Embed.setTimestamp(message.createdTimestamp);

            // Possible_Error_3
            if (!fromCurrency || !toCurrency) return message.reply({ embeds: [invalidConersion_Embed] });


            const apiKey = keys.abstractApi.convertCurrency.key;
            const link = keys.abstractApi.convertCurrency.link;
            const fetchingLink = `${link}api_key=${apiKey}&base=${fromCurrency}`;
            const result = await fetch(fetchingLink);
            const res = await result.json();


            const invalidCurrencyCode_Embed = new Discord.EmbedBuilder();
            invalidCurrencyCode_Embed.setTitle(`${cmndError}`);
            invalidCurrencyCode_Embed.setColor(`${config.err_hex}`);
            invalidCurrencyCode_Embed.setDescription(`An error occured!! Please make sure if the Country's Currency code you gave is valid or not. Visit [here](https://en.m.wikipedia.org/wiki/ISO_4217) for more info on Currency Codes.`);
            invalidCurrencyCode_Embed.setFooter({ text: message.author.username, iconURL: message.author.avatarURL({ dynamic: true }) });
            invalidCurrencyCode_Embed.setTimestamp(message.createdTimestamp);

            // Possible_Error_4
            if (res.error) return message.reply({ embeds: [invalidCurrencyCode_Embed] });
            

            const notThisCurrency_Embed = new Discord.EmbedBuilder();
            notThisCurrency_Embed.setTitle(`${cmndError}`);
            notThisCurrency_Embed.setColor(`${config.err_hex}`);
            notThisCurrency_Embed.setDescription(`Sorry, for now I only support Currency conversion from over 150 countries accross the globe. Unfortunately the currency you're trying conversion on, is not yet supported by me. Please try your hands on any other currency.`);
            notThisCurrency_Embed.setFooter({ text: message.author.username, iconURL: message.author.avatarURL({ dynamic: true }) });
            notThisCurrency_Embed.setTimestamp(message.createdTimestamp);

            // Possible_Error_5
            if (!(res.exchange_rates[`${toCurrency.toUpperCase()}`])) return message.reply({ embeds: [notThisCurrency_Embed] });



            // Execution ================================================== >>>>>
            const targetCurrency = `${toCurrency.toUpperCase()}`;
            const lastUpdt = `${moment((res.last_updated) * 1000).format('ddd, D/M/YY, h:mm a')}`;

            const currency_Embed = new Discord.EmbedBuilder();
            convEmbed(currency_Embed, res.exchange_rates[`${toCurrency.toUpperCase()}`], fromCurrency.toUpperCase(), toCurrency.toUpperCase(), true, `${lastUpdt}`);
            return message.reply({ embeds: [currency_Embed] });
        } else {
            const convCheck = [];
            conversions.forEach((elem) => {
                if(elem === `${args[1].toLowerCase()}`) convCheck.push("yes");
            });


            const notValidConversion_Embed = new Discord.EmbedBuilder();
            notValidConversion_Embed.setTitle(`${cmndError}`);
            notValidConversion_Embed.setColor(`${config.err_hex}`);
            notValidConversion_Embed.setDescription(`The method you gave for conversion is invalid. Please choose any conversion method among these methods given below :\n\`\`\`${conversions.join(", ")}\`\`\``);
            notValidConversion_Embed.setFooter({ text: message.author.username, iconURL: message.author.avatarURL({ dynamic: true }) });
            notValidConversion_Embed.setTimestamp(message.createdTimestamp);
            
            // Possible_Error_2
            if(convCheck.length === 0) return message.reply({ embeds: [notValidConversion_Embed] });


            const noAmountChosen_Embed = new Discord.EmbedBuilder();
            noAmountChosen_Embed.setTitle(`${cmndError}`);
            noAmountChosen_Embed.setColor(`${config.err_hex}`);
            noAmountChosen_Embed.setDescription(`You just forgot to provide me the amount. Please mention, what amount you want to apply the conversion on. For example : "\`1, 10, 500\`"`);
            noAmountChosen_Embed.setFooter({ text: message.author.username, iconURL: message.author.avatarURL({ dynamic: true }) });
            noAmountChosen_Embed.setTimestamp(message.createdTimestamp);

            // Possible_Error_4
            if (!args[2]) return message.reply({ embeds: [noAmountChosen_Embed] });


            const noWords_Embed = new Discord.EmbedBuilder();
            noWords_Embed.setTitle(`${cmndError}`);
            noWords_Embed.setColor(`${config.err_hex}`);
            noWords_Embed.setDescription(`You're using the command wrong. Please provide me a valid number on which the conversion has to be done, not anything other than number.`);
            noWords_Embed.setFooter({ text: message.author.username, iconURL: message.author.avatarURL({ dynamic: true }) });
            noWords_Embed.setTimestamp(message.createdTimestamp);

            // Possible_Error_5
            if(isNaN(args[2])) return message.reply({ embeds: [noWords_Embed] });



            // Execution ================================================== >>>>>
            const conversionMethod = args[1].toLowerCase();

            switch (conversionMethod) {
                // Miscellaneous ----------
                case `c-f`:
                    const cf_Embed = new Discord.EmbedBuilder();
                    convEmbed(cf_Embed, (advCal.toFahrenheit(args[2])), `℃elsius`, `℉ahrenheit`);
                    message.reply({ embeds: [cf_Embed] });
                    break;
                case `f-c`:
                    const fc_Embed = new Discord.EmbedBuilder();
                    convEmbed(fc_Embed, (advCal.toCelsius(args[2])), `℉ahrenheit`, `℃elsius`);
                    message.reply({ embeds: [fc_Embed] });
                    break;

                case `rad-deg`:
                    const radDeg_Embed = new Discord.EmbedBuilder();
                    convEmbed(radDeg_Embed, (advCal.radsToDegs(args[2])), `rad`, `°`);
                    message.reply({ embeds: [radDeg_Embed] });
                    break;
                case `deg-rad`:
                    const degRad_Embed = new Discord.EmbedBuilder();
                    convEmbed(degRad_Embed, (advCal.degsToRads(args[2])), `°`, `rad`);
                    message.reply({ embeds: [degRad_Embed] });
                    break;

                // Millimeters ----------
                case `mm-m`:
                    const mmM_Embed = new Discord.EmbedBuilder();
                    convEmbed(mmM_Embed, (advCal.milliToMetre(args[2])), `millimeters`, `meters`);
                    message.reply({ embeds: [mmM_Embed] });
                    break;

                // Centimeters ----------
                case `cm-m`:
                    const cmM_Embed = new Discord.EmbedBuilder();
                    convEmbed(cmM_Embed, (advCal.centiToMetre(args[2])), `centimeters`, `meters`);
                    message.reply({ embeds: [cmM_Embed] });
                    break;

                // Inches ----------
                case `in-yd`:
                    const inYd_Embed = new Discord.EmbedBuilder();
                    convEmbed(inYd_Embed, (advCal.inchesToYards(args[2])), `inches`, `yards`);
                    message.reply({ embeds: [inYd_Embed] });
                    break;
                case `in-m`:
                    const inM_Embed = new Discord.EmbedBuilder();
                    convEmbed(inM_Embed, (advCal.inchesToMeters(args[2])), `inches`, `meters`);
                    message.reply({ embeds: [inM_Embed] });
                    break;
                case `in-mi`:
                    const inMi_Embed = new Discord.EmbedBuilder();
                    convEmbed(inMi_Embed, (advCal.inchesToMiles(args[2])), `inches`, `miles`);
                    message.reply({ embeds: [inMi_Embed] });
                    break;

                // Feets ----------
                case `ft-in`:
                    const ftIn_Embed = new Discord.EmbedBuilder();
                    convEmbed(ftIn_Embed, (advCal.feetToInches(args[2])), `feets`, `inches`);
                    message.reply({ embeds: [ftIn_Embed] });
                    break;
                case `ft-yd`:
                    const ftYd_Embed = new Discord.EmbedBuilder();
                    convEmbed(ftYd_Embed, (advCal.feetToYards(args[2])), `feets`, `yards`);
                    message.reply({ embeds: [ftYd_Embed] });
                    break;
                case `ft-m`:
                    const ftM_Embed = new Discord.EmbedBuilder();
                    convEmbed(ftM_Embed, (advCal.feetToMeters(args[2])), `feets`, `meters`);
                    message.reply({ embeds: [ftM_Embed] });
                    break;
                case `ft-mi`:
                    const ftMi_Embed = new Discord.EmbedBuilder();
                    convEmbed(ftMi_Embed, (advCal.feetToMiles(args[2])), `feets`, `miles`);
                    message.reply({ embeds: [ftMi_Embed] });
                    break;

                // Yards ----------
                case `yd-in`:
                    const ydIn_Embed = new Discord.EmbedBuilder();
                    convEmbed(ydIn_Embed, (advCal.yardsToInches(args[2])), `yards`, `inches`);
                    message.reply({ embeds: [ydIn_Embed] });
                    break;
                case `yd-ft`:
                    const ydFt_Embed = new Discord.EmbedBuilder();
                    convEmbed(ydFt_Embed, (advCal.yardsToFeet(args[2])), `yards`, `feets`);
                    message.reply({ embeds: [ydFt_Embed] });
                    break;
                case `yd-m`:
                    const ydM_Embed = new Discord.EmbedBuilder();
                    convEmbed(ydM_Embed, (advCal.yardsToMeters(args[2])), `yards`, `meters`);
                    message.reply({ embeds: [ydM_Embed] });
                    break;
                case `yd-mi`:
                    const ydMi_Embed = new Discord.EmbedBuilder();
                    convEmbed(ydMi_Embed, (advCal.yardsToMiles(args[2])), `yards`, `miles`);
                    message.reply({ embeds: [ydMi_Embed] });
                    break;

                // Meters ----------
                case `m-mm`:
                    const mMM_Embed = new Discord.EmbedBuilder();
                    convEmbed(mMM_Embed, (advCal.metreToMilli(args[2])), `meters`, `millimeters`);
                    message.reply({ embeds: [mMM_Embed] });
                    break;
                case `m-cm`:
                    const mCm_Embed = new Discord.EmbedBuilder();
                    convEmbed(mCm_Embed, (advCal.metreToCenti(args[2])), `meters`, `centimeters`);
                    message.reply({ embeds: [mCm_Embed] });
                    break;
                case `m-km`:
                    const mKm_Embed = new Discord.EmbedBuilder();
                    convEmbed(mKm_Embed, (advCal.metreToKilo(args[2])), `meters`, `kilometers`);
                    message.reply({ embeds: [mKm_Embed] });
                    break;

                // Kilometers ----------
                case `km-m`:
                    const kmM_Embed = new Discord.EmbedBuilder();
                    convEmbed(kmM_Embed, (advCal.kiloToMetre(args[2])), `kilometers`, `meters`);
                    message.reply({ embeds: [kmM_Embed] });
                    break;

                // Miles ----------
                case `mi-in`:
                    const miIn_Embed = new Discord.EmbedBuilder();
                    convEmbed(miIn_Embed, (advCal.milesToInches(args[2])), `miles`, `inches`);
                    message.reply({ embeds: [miIn_Embed] });
                    break;
                case `mi-ft`:
                    const miFt_Embed = new Discord.EmbedBuilder();
                    convEmbed(miFt_Embed, (advCal.milesToFeet(args[2])), `miles`, `feets`);
                    message.reply({ embeds: [miFt_Embed] });
                    break;
                case `mi-yd`:
                    const miYd_Embed = new Discord.EmbedBuilder();
                    convEmbed(miYd_Embed, (advCal.milesToYards(args[2])), `miles`, `yards`);
                    message.reply({ embeds: [miYd_Embed] });
                    break;
                case `mi-m`:
                    const miM_Embed = new Discord.EmbedBuilder();
                    convEmbed(miM_Embed, (advCal.milesToMeters(args[2])), `miles`, `meters`);
                    message.reply({ embeds: [miM_Embed] });
                    break;
            }
        }
    }
});