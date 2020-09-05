const mongoose = require("mongoose");

const UserSessionSchema = new mongoose.Schema({
    userId: { type: Number, default: -1 },
    timestamp: { type: Date, defulat: Date.now() },
    isDeleted: { type: Boolean, defualt:false }
  });

  module.exports = mongoose.model("", UserSessionSchema)