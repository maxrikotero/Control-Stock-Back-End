const mongoose = require("mongoose");

const auditSchema = mongoose.Schema({
  audit: { type: String },
  createdAt: { type: Date, default: Date.now },
  createdBy: { type: mongoose.Schema.Types, ref: "User" },
});

module.exports = mongoose.model("Audit", auditSchema);
