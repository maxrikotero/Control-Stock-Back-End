const mongoose = require("mongoose");
const { Schema } = mongoose;

const RawSchema = new Schema({
  code: { type: Number, default: 0, required: true, unique: true },
  name: { type: String, required: true, unique: true },
  image: { type: String },
  brand: { type: String },
  price: { type: Number, default: 0, required: true },
  expire: { type: Date, default: Date.now },
  category: { type: mongoose.Schema.Types, ref: "Category" },
  minStock: { type: Number, default: 0 },
  stock: { type: Number, default: 0, required: true },
  isRawMaterial: { type: Boolean, default: false },
  description: { type: String },
  createAt: { type: Date, default: Date.now },
  createdBy: { type: mongoose.Schema.Types, ref: "User" },
  updatedAt: { type: Date },
  updatedBy: { type: mongoose.Schema.Types, ref: "User" },
});

module.exports = mongoose.model("RawMaterial", RawSchema);
