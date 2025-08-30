const Command = require("../../Structures/Command.js");
const Discord = require("discord.js");
const config = require("../../Data/config.json");
const aubdycad = require("../../Data/aubdycad.json");
const emojis = require("../../Data/emojis.json");
const pictures = require("../../Data/pictures.json");
const keys = require("../../Data/keys.json");


module.exports = {
    name: "wrandom",
    description: "(Developer only) Get weighted random values for test.",
    permission: Discord.PermissionsBitField.Flags.Administrator,
    allowedChannels: [],
    allowedServers: [`${config.TestServer_ID}`, `${config.Aubdycad_ID}`, `${config.XytiusServer_ID}`],


    /**
     * 
     * @param {Discord.Client} client 
     * @param {Discord.CommandInteraction} interaction
     */
    execute(client, interaction) {
        const cmndName = `Weighted Random`;
        const cmndEmoji = [`🎲`];
        const cmndColour = [`ea596e`];
        const cmndError = `${config.err_emoji}${config.tls}Weighted Random : Slash Command Error!!`;
        const cmndMarker = `${config.marker}`;

        /*
        ----------------------------------------------------------------------------------------------------
        Start
        ----------------------------------------------------------------------------------------------------
        */
        const dataObject = {
            "Very Common": 50,
            "Common": 30,
            "Uncommon": 10,
            "Rare": 5,
            "Very Rare": 3,
            "Extremely Rare": 1.8,
            "Mythical": 0.2,
        }

        const result = weightedRandom(dataObject);
        const objDisplay_Arr = [];


        /*
        ----------------------------------------------------------------------------------------------------
        Functions
        ----------------------------------------------------------------------------------------------------
        */
        function weightedRandom(theObj) {
            let sum = 0;
            let random = Math.random() * 100;

            for (let property in theObj) {
                sum += theObj[property];
                if(random <= sum) return property;
            }
        }


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
        let num = 0;

        for (const key in dataObject) {
            objDisplay_Arr.push(`${++num}. ${key} (${dataObject[`${key}`]}%)`);
        }

        result_Embed.setDescription(`The random was rolled and rolling participants with their possibility of getting selected are :\n\n${objDisplay_Arr.join("\n")}.\n\nThe chosen result is : **${result.toUpperCase()}**`);
        interaction.reply({ embeds: [result_Embed] });
    }
}