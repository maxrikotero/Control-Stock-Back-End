const mongoose = require("mongoose");
const { Schema } = mongoose;

const ClientSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  address: { type: String },
  phone_number: { type: String },
  createdAt: { type: Date, default: Date.now },
  createdBy: { type: mongoose.Schema.Types, ref: "User" },
});

module.exports = mongoose.model("Client", ClientSchema);
