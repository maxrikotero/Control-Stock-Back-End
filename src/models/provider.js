const mongoose = require("mongoose");
const { Schema } = mongoose;

const ProviderSchema = new Schema({
  socialId: { type: String },
  dni: { type: Number },
  phone: { type: Number },
  mobile: { type: Number },
  email: { type: String },
  firstName: { type: String },
  lastName: { type: String },
});

module.exports = mongoose.model("Provider", ProviderSchema);
