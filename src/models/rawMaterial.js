const mongoose = require("mongoose");
const { Schema } = mongoose;

const RawMaterialSchema = new Schema({
  name: { type: String, required: true },
  unitPrice: { type: Number, default: 0, required: true },
  totalPrice: { type: Number, default: 0, required: true },
  provider: { type: mongoose.Schema.Types, ref: "Providers" },
  category: { type: mongoose.Schema.Types, ref: "Category" },
  quality: { type: Number, default: 0, required: true },
  description: { type: String },
  createAt: { type: Date, default: Date.now },
  createdBy: { type: mongoose.Schema.Types, ref: "User" },
  updatedAt: { type: Date },
  updatedBy: { type: mongoose.Schema.Types, ref: "User" },
});

module.exports = mongoose.model("RawMaterial", RawMaterialSchema);
