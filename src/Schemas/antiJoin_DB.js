const { model, Schema } = require("mongoose");

module.exports = model("antiJoin_DB", new Schema({
    GuildID: String,
    UserID: String,
    UserName: String,
    ChannelID: String,
    Time: Number
}));