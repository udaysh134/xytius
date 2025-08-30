const { model, Schema } = require("mongoose");

module.exports = model("nick_T_DB", new Schema({
    GuildID: String,
    MemberID: String,
    MessageID: String,
    Time: Number,
}));