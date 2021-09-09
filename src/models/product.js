const mongoose = require("mongoose");
const { Schema } = mongoose;

const ProductSchema = new Schema({
  code: { type: Number, default: 0, required: true },
  name: { type: String, required: true },
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
  isDeleted: { type: Boolean, default: false },
  deletedAt: { type: Date },
  deletedBy: { type: mongoose.Schema.Types, ref: "User" },
  createAt: { type: Date, default: Date.now },
  createdBy: { type: mongoose.Schema.Types, ref: "User" },
  updatedAt: { type: Date },
  updatedBy: { type: mongoose.Schema.Types, ref: "User" },
});

// ProductSchema.index(
//   { code: 1 },
//   {
//     unique: true,
//     partialFilterExpression: {
//       isDeleted: { $eq: false },
//     },
//   }
// );

module.exports = mongoose.model("Product", ProductSchema);
