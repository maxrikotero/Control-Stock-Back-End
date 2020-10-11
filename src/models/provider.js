const mongoose = require("mongoose");
const { Schema } = mongoose;

const ProviderSchema = new Schema({
  socialId: { type: String },
  dni: { type: Number },
  phone: { type: Number },
  email: { type: String },
  name: { type: String, required: true },
});

module.exports = mongoose.model("Provider", ProviderSchema);
