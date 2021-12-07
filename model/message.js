const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema({
    author: {type: Object, blackbox: true},
    message: {type: String, default: null},
    created_at: {type: Date, default: Date.now()}
});

module.exports = mongoose.model("message", messageSchema);
