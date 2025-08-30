const Discord = require("discord.js");
const config = require("../../Data/config.json");
const keys = require("../../Data/keys.json");

const fetch = require("node-fetch");


module.exports = async (fetchingURL, commandError, discordMessage) => {
    /*
    ----------------------------------------------------------------------------------------------------
    Start
    ----------------------------------------------------------------------------------------------------
    */
    const fetchedData = await fetch(`${fetchingURL}`, {
        headers: {
            "X-Api-Key": `${keys.api_ninjas.key}`
        }
    });

    const result = await fetchedData.json();
    
    
    /*
    ----------------------------------------------------------------------------------------------------
    Error Handling
    ----------------------------------------------------------------------------------------------------
    */
    const unknownError_Embed = new Discord.EmbedBuilder();
    unknownError_Embed.setTitle(`${commandError}`);
    unknownError_Embed.setColor(`${config.err_hex}`);
    unknownError_Embed.setDescription(`An unknown error just occured. Please try to use this command after some time. If you see, this error is still showing up, try reporting this issue with "\`${config.prefix}report\`" command.`);
    unknownError_Embed.setFooter({ text: discordMessage.author.username, iconURL: discordMessage.author.avatarURL({ dynamic: true }) });
    unknownError_Embed.setTimestamp(discordMessage.createdTimestamp);
    
    // Possble_Error_1
    if (result.error) return discordMessage.reply({ embeds: [unknownError_Embed] });


    /*
    ----------------------------------------------------------------------------------------------------
    Executions
    ----------------------------------------------------------------------------------------------------
    */
    return result;
}