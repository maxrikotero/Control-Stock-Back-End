const mongoose = require("mongoose");
const { Schema } = mongoose;

const PriceTypeSchema = new Schema({
  name: { type: String, required: true },
  description: { type: String },
  createdBy: { type: mongoose.Schema.Types, ref: "User" },
  createAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("PriceType", PriceTypeSchema);
