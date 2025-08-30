const Command = require("../../Structures/Command.js");
const Discord = require("discord.js");
const config = require("../../Data/config.json");
const aubdycad = require("../../Data/aubdycad.json");
const emojis = require("../../Data/emojis.json");
const pictures = require("../../Data/pictures.json");
const keys = require("../../Data/keys.json");

const Perspective = require('perspective-api-client');


module.exports = {
    name: "toxicity",
    description: "(Developer only) Check how much a word or a sentence is toxic.",
    permission: Discord.PermissionsBitField.Flags.Administrator,
    allowedChannels: [],
    allowedServers: [`${config.TestServer_ID}`, `${config.Aubdycad_ID}`, `${config.XytiusServer_ID}`],
    options: [
        {
            name: "text",
            description: "Type the text to check it's toxicity",
            required: true,
            type: Discord.ApplicationCommandOptionType.String,
        }
    ],


    /**
     * 
     * @param {Discord.Client} client 
     * @param {Discord.CommandInteraction} interaction
     */
    async execute(client, interaction) {
        const cmndName = `Toxicity`;
        const cmndEmoji = [`🧪`];
        const cmndColour = [`68e090`];
        const cmndError = `${config.err_emoji}${config.tls}Toxicity : Slash Command Error!!`;
        const cmndMarker = `${config.marker}`;

        /*
        ----------------------------------------------------------------------------------------------------
        Start
        ----------------------------------------------------------------------------------------------------
        */
        const perspective = new Perspective({ apiKey: keys.Perspective_API.key });
        const text = interaction.options.getString(`text`);

        const finalDataObj = {};
        const attributes = {
            TOXICITY: {},
            SEVERE_TOXICITY: {},
            INSULT: {},
            IDENTITY_ATTACK: {},
            PROFANITY: {},
            SEXUALLY_EXPLICIT: {},
            // SPAM: {},
            // INCOHERENT: {},
            // FLIRTATION: {},
            // THREAT: {},
        }

        const typesData = {
            "TOXICITY": `Toxic`,
            "SEVERE_TOXICITY": `Severely toxic`,
            "INSULT": `Insulting`,
            "IDENTITY_ATTACK": `Identity targeted`,
            "PROFANITY": `Vulgar`,
            "SEXUALLY_EXPLICIT": `Sexually explicit`,
            // "SPAM": `Spammy`,
            // "INCOHERENT": `Unclear`,
            // "FLIRTATION": `Flirty`,
            // "THREAT": `Intimidating`,
        }

        let resultDisplay = ``;
        let num = 0;


        /*
        ----------------------------------------------------------------------------------------------------
        Embeds
        ----------------------------------------------------------------------------------------------------
        */
        const result_Embed = new Discord.EmbedBuilder();
        result_Embed.setTitle(`${cmndEmoji[0]}${config.tls}${cmndName}`);
        result_Embed.setColor(`${cmndColour[0]}`);
        result_Embed.setFooter({ text: interaction.user.username, iconURL: interaction.user.avatarURL({ dynamic: true }) });
        result_Embed.setTimestamp(interaction.createdTimestamp);


        /*
        ----------------------------------------------------------------------------------------------------
        Execution
        ----------------------------------------------------------------------------------------------------
        */
        await interaction.deferReply();

        // Getting_Final_Object ================================================== >>>>>
        const result = await perspective.analyze({
            comment: { text },
            languages: [`en`],
            requestedAttributes: attributes
        });

        const processedData = Object.entries(result.attributeScores);

        processedData.forEach((elem) => {
            const attribute = elem[0];
            const value = (elem[1].summaryScore.value) * 100;

            finalDataObj[attribute] = value;
        });



        // Display_Work ================================================== >>>>>
        for (const key in finalDataObj) {
            resultDisplay += `${++num}. ${key} : ${(finalDataObj[key]).toLocaleString()}%\n`;
        }

        const sortedByKeys = Object.keys(finalDataObj).sort((a, b) => finalDataObj[b] - finalDataObj[a]);
        const sortedByValues = Object.values(finalDataObj).sort((a, b) => b - a);

        const resultDescription = sortedByValues[0] > 80 && sortedByValues[0] < 90 ? `The given text is not appropriate and shouldn't be used.` : sortedByValues[0] > 90 ? `The given text is inappropriate and is not accepted in any conversations.` : `It's okay if the given text is used in chats.`;
        const resultType = typesData[`${sortedByKeys[0]}`];



        // Final_Execution ================================================== >>>>>
        result_Embed.setDescription(`${resultDescription} The given text is : *${resultType}*`);
        result_Embed.addFields({
            name: `${cmndMarker}Extracted data :`,
            value: `\`\`\`${resultDisplay}\`\`\``,
            inline: false
        });

        return interaction.followUp({ embeds: [result_Embed] });
    }
}