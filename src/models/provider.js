const mongoose = require("mongoose");
const { Schema } = mongoose;

const ProviderSchema = new Schema({
  razonSocial: { type: String },
  dni: { type: Number },
  phone: { type: Number },
  email: { type: String },
  name: { type: String, required: true },
  createdBy: { type: mongoose.Schema.Types, ref: "User" },
  updatedBy: { type: mongoose.Schema.Types, ref: "User" },
});

module.exports = mongoose.model("Provider", ProviderSchema);
