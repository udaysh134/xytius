const Event = require("../../Structures/Event.js");
const Discord = require("discord.js");

const FUNC_getInvites = require("../../Systems/External Functions/FUNC_getInvites");


module.exports = new Event("inviteCreate", async (client) => {
    /*
    ----------------------------------------------------------------------------------------------------
    Execution
    ----------------------------------------------------------------------------------------------------
    */
    FUNC_getInvites(client);
});