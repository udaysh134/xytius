const Event = require("../../Structures/Event.js");
const aubdycad = require("../../Data/aubdycad.json");


module.exports = new Event("messageReactionAdd", async (client, reaction, user) => {
    if (reaction.message.partial) await reaction.message.fetch();
    if (reaction.partial) await reaction.fetch();
    if (user === client.user) return;

    /*
    ----------------------------------------------------------------------------------------------------
    Start
    ----------------------------------------------------------------------------------------------------
    */
    const reactionChnls = [
        aubdycad.Polls_C_ID,
        aubdycad.WouldYouRather_TC_ID,
        aubdycad.Reports_C_ID
    ];

    const reactions = reaction.message.reactions.cache;

    
    /*
    ----------------------------------------------------------------------------------------------------
    Execution
    ----------------------------------------------------------------------------------------------------
    */
    if(reactionChnls.includes(reaction.message.channel.id)) {
        reactions.map((eachReaction) => {
            if(eachReaction.emoji.name !== reaction.emoji.name && eachReaction.users.cache.has(user.id)) {
                eachReaction.users.remove(user.id)
            }
        });
    }
});