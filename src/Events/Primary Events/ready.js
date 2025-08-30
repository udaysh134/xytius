const Event = require("../../Structures/Event.js");
const keys = require("../../Data/keys.json");

const mongoose = require("mongoose");
const FUNC_chooseActivity = require("../../Systems/External Functions/FUNC_chooseActivity.js");
const FUNC_getInvites = require("../../Systems/External Functions/FUNC_getInvites.js");

const RPTR_cooldown = require("../../Systems/Repeaters/RPTR_cooldown.js");
const RPTR_memberCount = require("../../Systems/Repeaters/RPTR_memberCount.js");
const RPTR_nickTimeLimit = require("../../Systems/Repeaters/RPTR_nickTimeLimit.js");


module.exports = new Event("ready", async (client) => {
    /*
    ----------------------------------------------------------------------------------------------------
    Presence
    ----------------------------------------------------------------------------------------------------
    */    
    setInterval(() => {
        const chosenActivity = FUNC_chooseActivity(client);
        
        client.user.setPresence({
            status: "idle",
            activities: [{ name: chosenActivity.name, type: chosenActivity.type }]
        });
    }, 1000 * 60);
    
    console.log("📡 • Connected to Discord ✅");


    /*
    ----------------------------------------------------------------------------------------------------
    Database
    ----------------------------------------------------------------------------------------------------
    */
    const connectionURL = keys.MongoDB.MongoDB_SRV;
    if(!connectionURL) return console.log(`📡 • Cannot connect to the Database ❌`);

    mongoose.connect(`${connectionURL}`, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    }).then(() => {
        console.log("📡 • Connected to the Database ✅");
    }).catch((err) => {
        console.log(`📡 • Error connecting to the Database ⭕`);
    });


    /*
    ----------------------------------------------------------------------------------------------------
    File Systems
    ----------------------------------------------------------------------------------------------------
    */
    FUNC_getInvites(client);

    RPTR_cooldown(client, 1000 * 1);
    RPTR_nickTimeLimit(client, 1000 * 1);
    RPTR_memberCount(client, 1000 * 60 * 10);
});