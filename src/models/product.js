const mongoose = require("mongoose");
const { Schema } = mongoose;

const ProductSchema = new Schema({
  code: { type: Number, default: 0 },
  name: { type: String },
  image: { type: String },
  brand: { type: String },
  price: { type: Number, default: 0 },
  category: { type: mongoose.Schema.Types, ref: "Category" },
  countInStock: { type: Number, default: 0 },
  description: { type: String },
  createAt: { type: Date, default: Date.now },
  createdBy: { type: mongoose.Schema.Types, ref: "User" },
  updatedAt: { type: Date },
  updatedBy: { type: mongoose.Schema.Types, ref: "User" },
});

module.exports = mongoose.model("Product", ProductSchema);
