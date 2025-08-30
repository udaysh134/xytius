const cooldowns_DB = require("../../Schemas/cooldowns_DB.js");


module.exports = async (client, freq) => {
    setInterval(() => {
        cooldowns_DB.find().then((foundData) => {
            foundData.forEach((doc) => {
                const theUser = doc.UserID;
                const theCooldown = doc.Cooldown;
                const timeOut = theCooldown - Date.now();

                if(theUser) {
                    setTimeout(async () => {
                        await cooldowns_DB.deleteOne({
                            GuildID: doc.GuildID,
                            UserID: theUser,
                            Cooldown: theCooldown,
                        });
                    }, timeOut); 
                }
            });
        });
    }, freq);
}