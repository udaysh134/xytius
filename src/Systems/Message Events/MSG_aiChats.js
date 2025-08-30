const Discord = require("discord.js");
const config = require("../../Data/config.json");
const aubdycad = require("../../Data/aubdycad.json");
const keys = require("../../Data/keys.json");

const fetch = require("node-fetch");


module.exports = async (client, message) => {
    /*
    ----------------------------------------------------------------------------------------------------
    Start
    ----------------------------------------------------------------------------------------------------
    */
    const XytiusChat1_Chnl = `${aubdycad.XytiusChat1_C_ID}`;
    const XytiusChat2_Chnl = `${aubdycad.XytiusChat2_C_ID}`;
    const TestServerXC_Chnl = `917129366448775188`;

    const userID = keys.AI_Xytius.userID;
    const brainID = keys.AI_Xytius.brainID;
    const apiKey = keys.AI_Xytius.key;
    const msgCont = message.content;
    const initialURL = keys.AI_Xytius.link;
    const link = `${initialURL}bid=${brainID}&key=${apiKey}&uid=${userID}&msg=${msgCont}`;

    
    /*
    ----------------------------------------------------------------------------------------------------
    Execution
    ----------------------------------------------------------------------------------------------------
    */
    if(message.channel.id === `${XytiusChat1_Chnl}` || message.channel.id === `${XytiusChat2_Chnl}` || message.channel.id === `${TestServerXC_Chnl}`) {
        const result = await fetch(link);
        const res = await result.json();



        // Error_Handling ================================================== >>>>>
        const unknownError_Embed = new Discord.EmbedBuilder();
        unknownError_Embed.setTitle(`${config.err_emoji}${config.tls}I felt an electric shock!!`);
        unknownError_Embed.setColor(`${config.err_hex}`);
        unknownError_Embed.setDescription(`An unknown error just occured. I don't think I'm well right now 🤒. Try talking me later!!`);
        unknownError_Embed.setFooter({ text: message.author.username, iconURL: message.author.avatarURL({ dynamic: true }) });
        unknownError_Embed.setTimestamp(message.createdTimestamp);
        
        // Possible_Error_1
        if(!(res.cnt) || res.cnt === "" || res.cnt === undefined || res.cnt === null) return message.reply({ embeds: [unknownError_Embed] });



        // Final_Execution ================================================== >>>>>
        const replyMsg_Embed = new Discord.EmbedBuilder();
        replyMsg_Embed.setAuthor({ name: message.author.username, iconURL: message.author.avatarURL({ dynamic: true }) });
        replyMsg_Embed.setDescription(`${res.cnt}`);
        replyMsg_Embed.setColor(`ffffff`);

        message.reply({ embeds: [replyMsg_Embed] }).catch(() => {
            message.reply({ embeds: [unknownError_Embed] });
        });
    }
};