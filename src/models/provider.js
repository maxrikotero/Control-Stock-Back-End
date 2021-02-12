const mongoose = require("mongoose");
const { Schema } = mongoose;

const ProviderSchema = new Schema({
  razonSocial: { type: String },
  dni: { type: Number, required: true },
  phone: { type: Number },
  email: { type: String },
  isDeleted: { type: Boolean, default: false },
  deletedAt: { type: Date },
  deletedBy: { type: mongoose.Schema.Types, ref: "User" },
  name: { type: String, required: true },
  createdBy: { type: mongoose.Schema.Types, ref: "User" },
  updatedBy: { type: mongoose.Schema.Types, ref: "User" },
});

ProviderSchema.index(
  { dni: 1 },
  {
    unique: true,
    partialFilterExpression: {
      isDeleted: { $eq: false },
    },
  }
);

module.exports = mongoose.model("Provider", ProviderSchema);
