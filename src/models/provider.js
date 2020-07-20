const mongoose = require("mongoose");
const { Schema } = mongoose;

const ProviderSchema = new Schema({
  socialId: { type: String },
  dni: { type: Number },
  brand: { type: String },
  phone: { type: Number },
  mobile: { type: Number },
  email: { type: String },
});

module.exports = mongoose.model("Provider", ProviderSchema);
