const { model, Schema } = require("mongoose");

module.exports = model("afk_DB", new Schema({
    GuildID: String,
    UserID: String,
    Time: Number,
    Reason: String
}));