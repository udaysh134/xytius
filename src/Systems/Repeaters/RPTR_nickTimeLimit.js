const nick_T_DB = require("../../Schemas/nick_T_DB.js");


module.exports = async (client, freq) => {
    setInterval(() => {
        nick_T_DB.find().then((foundData) => {
            foundData.forEach((doc) => {
                const theUser = doc.MemberID;
                const theTime = doc.Time;
                const timeOut = theTime - Date.now();
    
                if(theUser) {
                    setTimeout(async () => {
                        await nick_T_DB.deleteOne({
                            GuildID: doc.GuildID,
                            MemberID: theUser,
                            MessageID: doc.MessageID,
                            Time: theTime
                        });
                    }, timeOut); 
                } else {
                    return;
                }
            });
        });
    }, freq);
}