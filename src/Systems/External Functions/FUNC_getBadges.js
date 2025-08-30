const emojis = require("../../Data/emojis.json");


module.exports = async (person, type) => {
    /*
    ----------------------------------------------------------------------------------------------------
    Start
    ----------------------------------------------------------------------------------------------------
    */
    const userFlags = person.flags.toArray();

    const dataEmojiObj = {
        "ActiveDeveloper": `${emojis.ACTIVE_DEVELOPER}`,
        "BotHTTPInteractions" : `${emojis.HTTP_INTERACTIONS}`,
        "BugHunterLevel1" : `${emojis.BUGHUNTER_LEVEL_1}`,
        "BugHunterLevel2" : `${emojis.BUGHUNTER_LEVEL_2}`,
        "CertifiedModerator": `${emojis.DISCORD_CERTIFIED_MODERATOR}`,
        "HypeSquadOnlineHouse1" : `${emojis.HOUSE_BRAVERY}`,
        "HypeSquadOnlineHouse2" : `${emojis.HOUSE_BRILLIANCE}`,
        "HypeSquadOnlineHouse3" : `${emojis.HOUSE_BALANCE}`,
        "Hypesquad" : `${emojis.HYPESQUAD_EVENTS}`,
        "Partner" : `${emojis.PARTNERED_SERVER_OWNER}`,
        "PremiumEarlySupporter" : `${emojis.EARLY_SUPPORTER}`,
        "Quarantined" : `${emojis.QUARANTINE}`,
        "Spammer" : `${emojis.SPAMMER}`,
        "Staff" : `${emojis.DISCORD_EMPLOYEE}`,
        "TeamPseudoUser" : `${emojis.TEAM_USER}`,
        "VerifiedBot" : `${emojis.VERIFIED_BOT}`,
        "VerifiedDeveloper" : `${emojis.EARLY_VERIFIED_BOT_DEVELOPER}`,
    };

    const dataNameObj = {
        "ActiveDeveloper": `Active Developer`,
        "BotHTTPInteractions" : `Bot HTTP Interactions`,
        "BugHunterLevel1" : `Bughunter Level-1`,
        "BugHunterLevel2" : `Bughunter Level-2`,
        "CertifiedModerator": `Certified Moderator`,
        "HypeSquadOnlineHouse1" : `House Bravery`,
        "HypeSquadOnlineHouse2" : `House Brilliance`,
        "HypeSquadOnlineHouse3" : `House Balance`,
        "Hypesquad" : `Hypesquad`,
        "Partner" : `Partnered Server Owner`,
        "PremiumEarlySupporter" : `Premium Early Supporter`,
        "Quarantined" : `Quarantined`,
        "Spammer" : `Spammer`,
        "Staff" : `Discord Employee`,
        "TeamPseudoUser" : `Team User`,
        "VerifiedBot" : `Verified Bot`,
        "VerifiedDeveloper" : `Verified Bot Developer`,
    };


    /*
    ----------------------------------------------------------------------------------------------------
    Functions
    ----------------------------------------------------------------------------------------------------
    */
    function getResult(type, obj) {
        const finalResultFlags = [];

        if(userFlags.length === 0) {
            if(type === `emoji`) finalResultFlags.push(`${emojis.NO_SIGN_GREY}`);
            if(type === `name`) finalResultFlags.push(`None`);
        } else {
            userFlags.forEach((flag) => {
                finalResultFlags.push(`${obj[`${flag}`]}`);
            });
        }

        return finalResultFlags;
    }
    
    
    /*
    ----------------------------------------------------------------------------------------------------
    Execution
    ----------------------------------------------------------------------------------------------------
    */
    if(type === `emoji`) {
        return getResult(type, dataEmojiObj);
    } else if(type === `name`) {
        return getResult(type, dataNameObj);
    }
}