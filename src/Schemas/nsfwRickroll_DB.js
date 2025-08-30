const { model, Schema } = require("mongoose");

module.exports = model("nsfwRickroll_DB", new Schema({
    UserTag: String,
    UserID: String,
    Time: Number,
    Count: Number,
}));