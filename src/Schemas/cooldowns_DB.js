const { model, Schema } = require("mongoose");

module.exports = model("cooldowns_DB", new Schema({
    GuildID: String,
    UserID: String,
    CommandName: String,
    Cooldown: Number
}));