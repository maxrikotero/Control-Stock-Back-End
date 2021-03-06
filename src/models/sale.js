const mongoose = require("mongoose");
const { Schema } = mongoose;

const productSchema = new mongoose.Schema({
  quality: { type: Number, required: true },
  price: { type: String, required: true },
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
    required: true,
  },
});

const SaleSchema = new Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    paidAt: { type: Date, default: Date.now },
    billNumber: Number,
    totalPrice: { type: Number, required: true },
    paymentType: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Payments",
    },
    billType: Number,
    totalIva: Number,
    client: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Client",
      required: true,
    },
    products: [productSchema],
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Sale", SaleSchema);
