const Command = require("../../Structures/Command.js");
const Discord = require("discord.js");
const config = require("../../Data/config.json");
const aubdycad = require("../../Data/aubdycad.json");
const emojis = require("../../Data/emojis.json");
const pictures = require("../../Data/pictures.json");
const keys = require("../../Data/keys.json");

const fetch = require("node-fetch");


module.exports = new Command({
    name: "define",
    description: "Defines any valid English word for you, like a dictionary.",
    aliases: ["definition", "meaning"],
    permission: "SendMessages",
    allowedChannels: [`${aubdycad.BotCommands1_C_ID}`, `${aubdycad.BotCommands2_C_ID}`],
    allowedServers: [`${config.TestServer_ID}`, `${config.Aubdycad_ID}`, `${config.XytiusServer_ID}`],
    cooldown: "",
    usage: `${config.prefix}define <word>`,
    usageDesc: `Use this command as a dictionary to find meaning of any valid word (basically definition). This command is completely different from "translate" / "google" / "wikipedia" command, as its sole purpose is to define what something means. If available, you can also get some extra details like audio (of how to pronounce the word), definitions of different types, examples (to make you clear with it), and thesaurus (meaning synonyms / antonyms).\n\n**NOTE :** As the command is for defining a word, hence the command input should be only a single word. In case of two or more words, the input will be only the first word.`,
    usageExample: [`${config.prefix}define hallucination`, `${config.prefix}define charisma`, `${config.prefix}define scarecrow`],
    forTesting: false,
    HUCat: [`gen`, `functional`],

    async run(message, args, client) {
        const cmndName = `Definition`;
        const cmndEmoji = [`📚`, `🔸`];
        const cmndColour = [`55acee`];
        const cmndError = `${config.err_emoji}${config.tls}Define : Command Error!!`;
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
        noWordGiven_Embed.setDescription(`You just forgot to provide me a word. Please provide a valid word so that I can provide you the definitions for it.`);
        noWordGiven_Embed.setFooter({ text: message.author.username, iconURL: message.author.avatarURL({ dynamic: true }) });
        noWordGiven_Embed.setTimestamp(message.createdTimestamp);
        
        // Possible_Error_1
        if(!args[1]) return message.reply({ embeds: [noWordGiven_Embed] });


        /*
        ----------------------------------------------------------------------------------------------------
        Execution
        ----------------------------------------------------------------------------------------------------
        */
        const chosenWord = `${args[1].toLowerCase()}`;
        
        const link = `${keys.define.link}${chosenWord}`;
        const fetchedData = await fetch(link).then((result) => result.json());
        const res = fetchedData[0];


        const notAValidWord_Embed = new Discord.EmbedBuilder();
        notAValidWord_Embed.setTitle(`${cmndError}`);
        notAValidWord_Embed.setColor(`${config.err_hex}`);
        notAValidWord_Embed.setDescription(`Cannot find any definition(s) for the word - "**${chosenWord}**". Please make sure you gave a single word and not more than one. Also, make sure that the given word is valid. Spelling error can also affect this, so confirm if you gave the right word.`);
        notAValidWord_Embed.setFooter({ text: message.author.username, iconURL: message.author.avatarURL({ dynamic: true }) });
        notAValidWord_Embed.setTimestamp(message.createdTimestamp);
        
        // Possible_Error_2
        if(fetchedData.title === `No Definitions Found`) return message.reply({ embeds: [notAValidWord_Embed] });



        // Secondary_Execution ================================================== >>>>>
        const marker = `${cmndEmoji[1]}`;
        const marker2 = ` • `;

        const theWord = `${standardiseCase(`${res.word}`)}`;
        const thePhonetic = `${res.phonetic || `*Not available*`}`;


        let audioArr = [];
        (res.phonetics).forEach((elem) => {
            if(elem.audio !== ``) audioArr.push(elem.audio);
        });
        const theAudio = audioArr.length === 0 ? `*Not available*` : `[Click here](${audioArr[0]})`;


        let wholeText = ``;
        (res.meanings).forEach((elem) => {
            wholeText += `\n\n${marker}**Definitions ( ${standardiseCase(`${elem.partOfSpeech}`)} ) :**`;
            
            (elem.definitions).forEach((element) => {
                wholeText += `\n**(◈)** - ${element.definition}`;
                if(element.example) wholeText += `\n\`\`\`${config.invChar}${config.invChar}Example - ${element.example}\`\`\``;
            });

            if((elem.synonyms).length !== 0) wholeText += `\n${marker2}*Synonyms* - ${(elem.synonyms).join(", ")}`;
            if((elem.antonyms).length !== 0) wholeText += `\n${marker2}*Antonyms* - ${(elem.antonyms).join(", ")}`;
        });



        // Final_Execution ================================================== >>>>>
        const definition_Embed = new Discord.EmbedBuilder();
        definition_Embed.setTitle(`${cmndEmoji[0]}${config.tls}${cmndName}`);
        definition_Embed.setColor(`${cmndColour[0]}`);
        definition_Embed.setFooter({ text: message.author.username, iconURL: message.author.avatarURL({ dynamic: true }) });
        definition_Embed.setTimestamp(message.createdTimestamp);


        if(wholeText.length > 1000) {
            definition_Embed.addFields({
                name: `${cmndMarker}${theWord}`,
                value: `${marker}**Phonetic :** ${thePhonetic}\n${marker}**Audio :** ${theAudio}`,
                inline: false
            }, {
                name: `${createLine(40)} >>`,
                value: `${wholeText.slice(0, 1000)}`,
                inline: false
            }, {
                name: `${config.invChar}`,
                value: `${wholeText.slice(1000)}`,
                inline: false
            });
        } else {
            definition_Embed.addFields({
                name: `${cmndMarker}${theWord}`,
                value: `${marker}**Phonetic :** ${thePhonetic}\n${marker}**Audio :** ${theAudio}`,
                inline: false
            }, {
                name: `${createLine(40)} >>`,
                value: `${wholeText}`,
                inline: false
            });
        }


        message.reply({ embeds: [definition_Embed] }).then().catch(() => {
            const unknownErr_Embed = new Discord.EmbedBuilder();
            unknownErr_Embed.setTitle(`${cmndError}`);
            unknownErr_Embed.setColor(`${config.err_hex}`);
            unknownErr_Embed.setDescription(`An unknown error just occured. Please try this command later after some time. `);
            unknownErr_Embed.setFooter({ text: message.author.username, iconURL: message.author.avatarURL({ dynamic: true }) });
            unknownErr_Embed.setTimestamp(message.createdTimestamp);
            
            // Possible_Error_3
            return message.reply({ embeds: [unknownErr_Embed] });
        });
    }
});