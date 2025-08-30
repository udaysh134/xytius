const config = require("../config.json");
const emojis = require("../emojis.json");


const system = {
    "tls": `${config.tls}`,
    "errHex": `${config.err_hex}`,

    "cmndName": `Akinator`,
    "cmndEmoji": [`${emojis.AKINATOR}`, `${emojis.ANIMATED_LOADING}`],
    "cmndColour": [`6699ff`],
    "cmndError": `${config.err_emoji}${config.tls}Akinator : Command Error!!`,
    "cmndMarker": `${config.marker}`
}

module.exports = system;