const mongoose = require("mongoose");
const { Schema } = mongoose;

const productSchema = new mongoose.Schema({
  quality: { type: Number },
  price: { type: String },
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
  },
});

const SaleSchema = new Schema(
  {
    // user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    paidAt: { type: Date, default: Date.now },
    totalPrice: { type: Number },
    client: { type: Number },
    products: [productSchema],
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Sale", SaleSchema);
