const fs = require("fs");


module.exports = async (client) => {
    /*
    ----------------------------------------------------------------------------------------------------
    Start
    ----------------------------------------------------------------------------------------------------
    */
    const allInvites = {};


    /*
    ----------------------------------------------------------------------------------------------------
    Functions
    ----------------------------------------------------------------------------------------------------
    */
    const getInviteCounts = async (theServer) => {
        return await new Promise((resolve) => {
            theServer.invites.fetch().then((fetchedInvites) => {
                const inviteCounter = {}

                fetchedInvites.forEach((invites) => {
                    const theUser = `${invites.inviter.tag}`;
                    inviteCounter[theUser] = {
                        "id": `${invites.inviter.id}`,
                        "invitesCount": (inviteCounter[theUser[`invitesCount`]] || 0) + invites.uses
                    };
                });

                resolve(inviteCounter);
            });
        });
    }


    /*
    ----------------------------------------------------------------------------------------------------
    Execution
    ----------------------------------------------------------------------------------------------------
    */
    for (const guild of client.guilds.cache.values()) {
        allInvites[`${guild.name} - ${guild.id}`] = await getInviteCounts(guild);
    }

    
    fs.writeFile("./src/Data/Others/invites.json", JSON.stringify(allInvites, null, 4), err => {
        if(err) {
            console.log(`Error while writing data!!`, err);
        }
    });
}