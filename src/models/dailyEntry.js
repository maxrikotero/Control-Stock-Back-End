const mongoose = require("mongoose");

const DailyEntrySchema = mongoose.Schema({
  product: { type: String },
  amount: { type: Number },
  worker: { type: String },
  description: { type: String },
  createdAt: { type: Date, default: Date.now },
  createdBy: { type: mongoose.Schema.Types, ref: "User" },
  updatedAt: { type: Date },
  updatedBy: { type: mongoose.Schema.Types, ref: "User" },
});

module.exports = mongoose.model("DailyEntry", DailyEntrySchema);
