const mongoose = require("mongoose");
const { Schema } = mongoose;

const ClientSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  address: { type: String },
  phone: { type: String },
  mobile: { type: String },
  cuil: { type: Number, required: true, unique: true },
  description: { type: String },
  createdAt: { type: Date, default: Date.now },
  createdBy: { type: mongoose.Schema.Types, ref: "User" },
});

module.exports = mongoose.model("Client", ClientSchema);
