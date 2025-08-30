const Discord = require("discord.js");
const config = require("../../Data/config.json");
const aubdycad = require("../../Data/aubdycad.json");
const emojis = require("../../Data/emojis.json");
const pictures = require("../../Data/pictures.json");
const keys = require("../../Data/keys.json");


module.exports = {
    name: "emit",
    description: "(Developer only) Emit any listed event voluntarily.",
    permission: Discord.PermissionsBitField.Flags.Administrator,
    allowedChannels: [],
    allowedServers: [`${config.TestServer_ID}`, `${config.Aubdycad_ID}`, `${config.XytiusServer_ID}`],
    options: [
        {
            name: "event",
            description: "Select an event you wanna emit",
            required: true,
            type: Discord.ApplicationCommandOptionType.String,
            choices: [
                {
                    name: "Guild Member Add",
                    value: "guild_Member_Add"
                }, {
                    name: "Guild Member Remove",
                    value: "guild_Member_Remove"
                }
            ]
        }
    ],


    /**
     * 
     * @param {Discord.Client} client 
     * @param {Discord.CommandInteraction} interaction
     */
    execute(client, interaction) {
        const cmndName = `Emit`;
        const cmndEmoji = [`👍`];
        const cmndColour = [`00bf00`];
        const cmndError = `${config.err_emoji}${config.tls}Emit : Slash Command Error!!`;
        const cmndMarker = `${config.marker}`;

        /*
        ----------------------------------------------------------------------------------------------------
        Start
        ----------------------------------------------------------------------------------------------------
        */
        const chosenEvent = interaction.options.getString(`event`);


        /*
        ----------------------------------------------------------------------------------------------------
        Embeds
        ----------------------------------------------------------------------------------------------------
        */
        const done_Embed = new Discord.EmbedBuilder();
        done_Embed.setTitle(`${cmndEmoji[0]}${config.tls}Done`);
        done_Embed.setColor(`${cmndColour[0]}`);


        /*
        ----------------------------------------------------------------------------------------------------
        Execution
        ----------------------------------------------------------------------------------------------------
        */
        switch (chosenEvent) {
            case "guild_Member_Add": {
                client.emit("guildMemberAdd", interaction.member);
                interaction.reply({ embeds: [done_Embed], ephemeral: true });
            }
                break;
            case "guild_Member_Remove": {
                client.emit("guildMemberRemove", interaction.member);
                interaction.reply({ embeds: [done_Embed], ephemeral: true });
            }
                break;
        }
    }
}