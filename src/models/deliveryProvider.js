const mongoose = require("mongoose");

const deliveryProviderSchema = mongoose.Schema({
  provider: { type: mongoose.Schema.Types, ref: "Provider" },
  total: { type: Number, required: true },
  detail: { type: String },
  description: { type: String },
  createdAt: { type: Date, default: Date.now },
  createdBy: { type: mongoose.Schema.Types, ref: "User" },
  updatedAt: { type: Date },
  updatedBy: { type: mongoose.Schema.Types, ref: "User" },
});

module.exports = mongoose.model("DeliveryProvider", deliveryProviderSchema);
