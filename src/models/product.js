const mongoose = require("mongoose");
const { Schema } = mongoose;

const ProductSchema = new Schema({
  code: { type: Number, default: 0, required: true, unique: true },
  name: { type: String, required: true, unique: true },
  image: { type: String },
  brand: { type: String },
  prices: [
    {
      price: Number,
      priceType: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "PriceType",
      },
    },
  ],
  expires: [{ expire: Date, entryDate: Date, amount: Number }],
  category: { type: mongoose.Schema.Types, ref: "Category" },
  minStock: { type: Number, default: 0 },
  stock: { type: Number, default: 0, required: true },
  description: { type: String },
  createAt: { type: Date, default: Date.now },
  createdBy: { type: mongoose.Schema.Types, ref: "User" },
  updatedAt: { type: Date },
  updatedBy: { type: mongoose.Schema.Types, ref: "User" },
});

module.exports = mongoose.model("Product", ProductSchema);
