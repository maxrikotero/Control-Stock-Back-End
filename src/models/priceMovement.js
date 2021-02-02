const mongoose = require("mongoose");
const { Schema } = mongoose;

const PriceMovementSchema = new Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
  },
  prices: [
    {
      price: Number,
      priceType: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "PriceType",
      },
    },
  ],
  createdBy: { type: mongoose.Schema.Types, ref: "User" },
  createAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("PriceMovement", PriceMovementSchema);
