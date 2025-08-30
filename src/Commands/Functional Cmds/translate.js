const Command = require("../../Structures/Command.js");
const Discord = require("discord.js");
const config = require("../../Data/config.json");
const aubdycad = require("../../Data/aubdycad.json");
const emojis = require("../../Data/emojis.json");
const pictures = require("../../Data/pictures.json");
const keys = require("../../Data/keys.json");

const translate = require('@vitalets/google-translate-api');


module.exports = new Command({
    name: "translate",
    description: "Translates any text of a language to other languages.",
    aliases: [],
    permission: "SendMessages",
    allowedChannels: [`${aubdycad.GeneralChats_C_ID}`, `${aubdycad.BotCommands1_C_ID}`, `${aubdycad.BotCommands2_C_ID}`],
    allowedServers: [`${config.TestServer_ID}`, `${config.Aubdycad_ID}`, `${config.XytiusServer_ID}`],
    cooldown: "",
    usage: `${config.prefix}translate <query> | [language_code]  ::  ${config.prefix}translate <c-l / l-c> <language_code / language_name>`,
    usageDesc: `The command can be used to translate any text of any language to other languages. By default, any input from any language is translated into English. In case for translation into other languages, simply provide that language's code separated from main text by "\` | \`" sign. You don't need to specify which language your text is in, it can detect the language of the input. You only need to specify, in which language you want your result to be.\n\nYou can also use the command in other way, if you wanna check which language does an ISO code belongs to. Like for example, you can use "\`${config.prefix}translate c-l es\`". Here "\`c-l\`" means "\`code to language\`" and "\`es\`" is a code, meaning you want to convert a code "es" and wanna check which language does it belong to, and as a result, you get to see, it belongs to "\`Spanish\`". You can do the same conversely. Meaning, you can use "\`${config.prefix}translate l-c Korean\`" and you'll get to know the ISO code of "Korean" language is "\`ko\`". To get more details on ISO codes, [click here](https://en.wikipedia.org/wiki/List_of_ISO_639-1_codes)`,
    usageExample: [`${config.prefix}translate рад встрече`, `${config.prefix}translate كيف كنت؟ | mn`, `${config.prefix}translate c-l pt`, `${config.prefix}translate l-c French`],
    forTesting: false,
    HUCat: [`gen`, `functional`],

    async run(message, args, client) {
        const cmndName = `Translation`;
        const cmndEmoji = [`🈶`];
        const cmndColour = [`dba100`];
        const cmndError = `${config.err_emoji}${config.tls}Translate : Command Error!!`;
        const cmndMarker = `${config.marker}`;

        /*
        ----------------------------------------------------------------------------------------------------
        Start
        ----------------------------------------------------------------------------------------------------
        */
        const breaker = "|";
        const splittedContent = args.join(" ").split(` ${breaker} `);
        const text = splittedContent[0].slice(10);
        const isoCode = splittedContent[1] ?? `None`;

        const languages = translate.languages;


        /*
        ----------------------------------------------------------------------------------------------------
        Embeds
        ----------------------------------------------------------------------------------------------------
        */
        const unknownError_Embed = new Discord.EmbedBuilder();
        unknownError_Embed.setTitle(`${cmndError}`);
        unknownError_Embed.setColor(`${config.err_hex}`);
        unknownError_Embed.setDescription(`An unknown error just occurred!! Make sure, you're using the command right and please try again later.`);
        unknownError_Embed.setFooter({ text: message.author.username, iconURL: message.author.avatarURL({ dynamic: true }) });
        unknownError_Embed.setTimestamp(message.createdTimestamp);


        const translateCodes_Button = new Discord.ActionRowBuilder().addComponents(
            new Discord.ButtonBuilder()
            .setLabel(`More about ISO codes (639-1)`)
            .setURL(`https://en.wikipedia.org/wiki/List_of_ISO_639-1_codes`)
            .setStyle(Discord.ButtonStyle.Link)
        );


        /*
        ----------------------------------------------------------------------------------------------------
        Error Handling
        ----------------------------------------------------------------------------------------------------
        */
        const noArgs_Embed = new Discord.EmbedBuilder();
        noArgs_Embed.setTitle(`${cmndError}`);
        noArgs_Embed.setColor(`${config.err_hex}`);
        noArgs_Embed.setDescription(`You didn't provided me any word/sentence for translation. Please mention what you want to translate.`);
        noArgs_Embed.setFooter({ text: message.author.username, iconURL: message.author.avatarURL({ dynamic: true }) });
        noArgs_Embed.setTimestamp(message.createdTimestamp);

        // Possible_Error_1
        if(!args[1]) return message.reply({ embeds: [noArgs_Embed] });


        /*
        ----------------------------------------------------------------------------------------------------
        Functions
        ----------------------------------------------------------------------------------------------------
        */
        function codesLangsSendMessage(embed, desc) {
            embed.setTitle(`${cmndEmoji[0]}${config.tls}${cmndName}`);
            embed.setColor(`${cmndColour[0]}`);
            embed.setDescription(`${desc}`);
            embed.setFooter({ text: message.author.username, iconURL: message.author.avatarURL({ dynamic: true }) });
            embed.setTimestamp(message.createdTimestamp);
        }


        function finalSend(embed, response, to_Lang) {
            let fromLang = (response.from.language.iso).toUpperCase();
            let resToLang = to_Lang ?? `None`;
            let toLang = resToLang === `None` ? `EN (default)` : `${to_Lang.toUpperCase()}`;

            let translated = response.text;
            let pronunciation = response.pronunciation;


            embed.setTitle(`${cmndEmoji[0]}${config.tls}${cmndName}`);
            embed.setColor(`${cmndColour[0]}`);
            embed.addFields({
                name: `${cmndMarker}Text :`,
                value: `\`\`\`${text}\`\`\``,
                inline: true
            }, {
                name: `${cmndMarker}Result :`,
                value: `\`\`\`${translated}\`\`\``,
                inline: true
            });
            embed.setFooter({ text: `${message.author.username} | ${fromLang} - ${toLang}`, iconURL: message.author.avatarURL({ dynamic: true }) });

            if(pronunciation !== null) embed.addField(`${cmndMarker}🎙 :`, `\`\`\`${pronunciation}\`\`\``, false);
        }


        /*
        ----------------------------------------------------------------------------------------------------
        Execution
        ----------------------------------------------------------------------------------------------------
        */
        if(args[1] === `c-l`) {
            const noCodeProvided_Embed = new Discord.EmbedBuilder();
            noCodeProvided_Embed.setTitle(`${cmndError}`);
            noCodeProvided_Embed.setColor(`${config.err_hex}`);
            noCodeProvided_Embed.setDescription(`You just forgot to provide me the ISO code to translate into its language. Use "\`${config.prefix}usage\`" command for this command to get more details on it.`);
            noCodeProvided_Embed.setFooter({ text: message.author.username, iconURL: message.author.avatarURL({ dynamic: true }) });
            noCodeProvided_Embed.setTimestamp(message.createdTimestamp);

            // Possible_Error_2
            if(!args[2]) return message.reply({ embeds: [noCodeProvided_Embed] });


            const codeFromUser = args[2];
            const result = languages[`${codeFromUser}`] ?? `None`;


            const invalidCode_Embed = new Discord.EmbedBuilder();
            invalidCode_Embed.setTitle(`${cmndError}`);
            invalidCode_Embed.setColor(`${config.err_hex}`);
            invalidCode_Embed.setDescription(`The ISO code you just provided me is either invalid or I cannot recognize it. Click on the button below to get more info about ISO codes (639-1).`);
            invalidCode_Embed.setFooter({ text: message.author.username, iconURL: message.author.avatarURL({ dynamic: true }) });
            invalidCode_Embed.setTimestamp(message.createdTimestamp);

            // Possible_Error_3
            if(result === `None`) return message.reply({ embeds: [invalidCode_Embed], components: [translateCodes_Button] });



            // Execution ================================================== >>>>>
            const c_lSend_Embed = new Discord.EmbedBuilder();
            codesLangsSendMessage(c_lSend_Embed, `**"${codeFromUser}"** is the ISO code of **"${result}"** language.`);

            return message.reply({ embeds: [c_lSend_Embed] });
        } else if(args[1] === `l-c`) {
            const noLangProvided_Embed = new Discord.EmbedBuilder();
            noLangProvided_Embed.setTitle(`${cmndError}`);
            noLangProvided_Embed.setColor(`${config.err_hex}`);
            noLangProvided_Embed.setDescription(`You just forgot to provide me the language to translate into its ISO code. Use "\`${config.prefix}usage\`" command for this command to get more details on it.`);
            noLangProvided_Embed.setFooter({ text: message.author.username, iconURL: message.author.avatarURL({ dynamic: true }) });
            noLangProvided_Embed.setTimestamp(message.createdTimestamp);

            // Possible_Error_2
            if(!args[2]) return message.reply({ embeds: [noLangProvided_Embed] });


            const langFromUser = args[2];
            const result = languages.getCode(`${langFromUser}`);


            const invalidLang_Embed = new Discord.EmbedBuilder();
            invalidLang_Embed.setTitle(`${cmndError}`);
            invalidLang_Embed.setColor(`${config.err_hex}`);
            invalidLang_Embed.setDescription(`The language you just provided me is either invalid or I cannot recognize it. Click on the button below to get more info about ISO codes (639-1) and their respective languages.`);
            invalidLang_Embed.setFooter({ text: message.author.username, iconURL: message.author.avatarURL({ dynamic: true }) });
            invalidLang_Embed.setTimestamp(message.createdTimestamp);

            // Possible_Error_3
            if(result === false) return message.reply({ embeds: [invalidLang_Embed], components: [translateCodes_Button] });



            // Execution ================================================== >>>>>
            const l_cSend_Embed = new Discord.EmbedBuilder();
            codesLangsSendMessage(l_cSend_Embed, `The ISO code of **"${langFromUser}"** language is **"${result}"**.`);

            return message.reply({ embeds: [l_cSend_Embed] });
        } else {
            if(isoCode === `None`) {
                translate(`${text}`, {to: 'en'}).then(defaultResponse => {
                    const defaultTranslate_Embed = new Discord.EmbedBuilder();
                    finalSend(defaultTranslate_Embed, defaultResponse);

                    return message.delete().catch() && message.channel.send({ embeds: [defaultTranslate_Embed] });
                }).catch(() => {
                    return message.reply({ embeds: [unknownError_Embed] });
                });
            } else {
                translate(`${text}`, {to: `${isoCode}`}).then(response => {
                    const translate_Embed = new Discord.EmbedBuilder();
                    finalSend(translate_Embed, response, isoCode);

                    return message.delete().catch() && message.channel.send({ embeds: [translate_Embed] });
                }).catch(() => {
                    return message.reply({ embeds: [unknownError_Embed] });
                });
            }
        }
    }
});