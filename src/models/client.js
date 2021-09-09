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
  cuil: { type: Number, required: true },
  description: { type: String },
  createdAt: { type: Date, default: Date.now },
  deletedAt: { type: Date },
  isDeleted: { type: Boolean, default: false },
  createdBy: { type: mongoose.Schema.Types, ref: "User" },
});

// ClientSchema.index(
//   { cuil: 1 },
//   {
//     unique: true,
//     partialFilterExpression: {
//       isDeleted: { $eq: false },
//     },
//   }
// );

module.exports = mongoose.model("Client", ClientSchema);
