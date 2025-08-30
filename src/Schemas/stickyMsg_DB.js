const { model, Schema } = require("mongoose");

module.exports = model("stickyMsg_DB", new Schema({
    ChannelID: String,
    MessageID: String,
}));