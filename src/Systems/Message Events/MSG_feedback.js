const Discord = require("discord.js");
const config = require("../../Data/config.json");
const aubdycad = require("../../Data/aubdycad.json");


module.exports = (client, message) => {
    /*
    ----------------------------------------------------------------------------------------------------
    Start
    ----------------------------------------------------------------------------------------------------
    */
    const mark = `-`;
    
    const marker = config.marker;
    const evntColour = `ffdc5d`;
    

    /*
    ----------------------------------------------------------------------------------------------------
    Execution
    ----------------------------------------------------------------------------------------------------
    */
    if(message.channel.id === `${aubdycad.Feedbacks_C_ID}`) {
        if(!(message.content.startsWith(`${mark}`)) && !(message.content.startsWith(`${config.prefix}`))) {
            message.delete().catch();


            // Error_Handling ================================================== >>>>>
            const limitedDescription_Embed = new Discord.EmbedBuilder();
            limitedDescription_Embed.setTitle(`${config.err_emoji}${config.tls}Error!!`);
            limitedDescription_Embed.setColor(`${config.err_hex}`);
            limitedDescription_Embed.setDescription(`Sorry to interrupt, but your description was too long to display here. Please try to write your feedback in not too many words. Try to be specific and to the point.`);
            limitedDescription_Embed.setFooter({ text: message.author.username, iconURL: message.author.avatarURL({ dynamic: true }) });
            limitedDescription_Embed.setTimestamp(message.createdTimestamp);
            
            // Possible_Error_1
            if((message.content).length > 3500) return message.channel.send({ embeds: [limitedDescription_Embed] }).then((limiterrorMsg) => {
                setTimeout(() => {
                    limiterrorMsg.delete();
                }, 1000 * 10);
            });



            // Execution ================================================== >>>>>
            const feedback_Embed = new Discord.EmbedBuilder();
            feedback_Embed.setTitle(`✍️${config.tls}Feedback`);
            feedback_Embed.setDescription(`${marker}**From :** ${message.author}, ${message.author.tag}`);
            feedback_Embed.addFields({
                name: `${marker}Description :`,
                value: `${message.content}`,
                inline: false
            });
            feedback_Embed.setColor(`${evntColour}`);
            feedback_Embed.setThumbnail(message.author.avatarURL({ dynamic: true }));

            
            return message.channel.send({ embeds: [feedback_Embed] });
        }
    }
};