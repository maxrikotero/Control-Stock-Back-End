const mongoose = require("mongoose");
const { Schema } = mongoose;

const PaymentSchema = new Schema({
  name: { type: String, required: true },
  description: { type: String },
  isDeleted: { type: Boolean, default: false },
  deletedAt: { type: Date },
  deletedBy: { type: mongoose.Schema.Types, ref: "User" },
  createdBy: { type: mongoose.Schema.Types, ref: "User" },
  createAt: { type: Date, default: Date.now },
});

// PaymentSchema.index(
//   { name: 1 },
//   {
//     unique: true,
//     partialFilterExpression: {
//       isDeleted: { $eq: false },
//     },
//   }
// );

module.exports = mongoose.model("Payments", PaymentSchema);
