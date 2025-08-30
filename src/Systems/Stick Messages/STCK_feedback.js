const Discord = require("discord.js");
const config = require("../../Data/config.json");
const aubdycad = require("../../Data/aubdycad.json");

const stickyMsg_DB = require("../../Schemas/stickyMsg_DB.js");


module.exports = async (client, message) => {
    if(message.guild.id !== `${config.Aubdycad_ID}`) return;
    if(message.channel.id !== `${aubdycad.Feedbacks_C_ID}`) return;

    /*
    ----------------------------------------------------------------------------------------------------
    Start
    ----------------------------------------------------------------------------------------------------
    */
    const Feedbacks_Chnl = message.guild.channels.cache.get(`${aubdycad.Feedbacks_C_ID}`);


    /*
    ----------------------------------------------------------------------------------------------------
    Embeds
    ----------------------------------------------------------------------------------------------------
    */
    const stickFeedback_1_Embed = new Discord.EmbedBuilder();
    stickFeedback_1_Embed.setTitle(`⚠️${config.tls}Important`);
    stickFeedback_1_Embed.setDescription(`To share your feedback, no need to use any command or prefix, just type and send your message here.\n\nTo say anything else other than your feedback, just include a hyphen ( \`-\` ) before your text, and then send the message. For example : "*- He's right. You need to improve here!!*".`);
    stickFeedback_1_Embed.setColor(`ffcc4d`);
    stickFeedback_1_Embed.setFooter({ text: client.user.tag, iconURL: client.user.avatarURL({ dynamic: true }) });    


    /*
    ----------------------------------------------------------------------------------------------------
    Functions
    ----------------------------------------------------------------------------------------------------
    */
    function createNewDataAndMsg() {
        Feedbacks_Chnl.send({ embeds: [stickFeedback_1_Embed] }).then(async (stickMsg) => {
            await stickyMsg_DB.create({
                ChannelID: aubdycad.Feedbacks_C_ID,
                MessageID: stickMsg.id,
            });
        });
    }
    

    /*
    ----------------------------------------------------------------------------------------------------
    Execution
    ----------------------------------------------------------------------------------------------------
    */
    stickyMsg_DB.findOne({ ChannelID: aubdycad.Feedbacks_C_ID }).then(async (foundData) => {
        if(foundData) {
            const theMessage = await Feedbacks_Chnl.messages.fetch(`${foundData.MessageID}`).catch(() => { return `None` });

            if (theMessage !== `None`) {
                // Deletion ================================================== >>>>>
                theMessage.delete().catch();
                await stickyMsg_DB.deleteOne({ MessageID: foundData.MessageID });

                // Creation ================================================== >>>>>
                return createNewDataAndMsg();
            } else {
                // Deletion ================================================== >>>>>
                await stickyMsg_DB.deleteOne({ MessageID: foundData.MessageID });

                // Creation ================================================== >>>>>
                return createNewDataAndMsg();
            }
        } else {
            // Creation ================================================== >>>>>
            return createNewDataAndMsg();
        }
    });
};