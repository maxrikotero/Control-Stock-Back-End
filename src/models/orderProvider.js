const mongoose = require("mongoose");
const { Schema } = mongoose;

const OrderProviderSchema = new Schema({
  provider: { type: mongoose.Schema.Types, ref: "Provider" },
  isDelivery: { type: Boolean, default: false },
  products: [
    {
      amount: Number,
      unitPrice: Number,
      product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "RawMaterials",
      },
    },
  ],
  createdBy: { type: mongoose.Schema.Types, ref: "User" },
  createAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("OrderProvider", OrderProviderSchema);
