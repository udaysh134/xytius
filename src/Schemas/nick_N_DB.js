const { model, Schema } = require("mongoose");

module.exports = model("nick_N_DB", new Schema({
    GuildID: String,
    MemberID: String,
    MessageID: String,
    ChosenName: String,
}));