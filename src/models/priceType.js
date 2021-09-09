const mongoose = require("mongoose");
const { Schema } = mongoose;

const PriceTypeSchema = new Schema({
  name: { type: String, required: true },
  description: { type: String },
  createdBy: { type: mongoose.Schema.Types, ref: "User" },
  createAt: { type: Date, default: Date.now },
  isDeleted: { type: Boolean, default: false },
  deletedAt: { type: Date },
  deletedBy: { type: mongoose.Schema.Types, ref: "User" },
});

// PriceTypeSchema.index(
//   { name: 1 },
//   {
//     unique: true,
//     partialFilterExpression: {
//       isDeleted: { $eq: false },
//     },
//   }
// );

module.exports = mongoose.model("PriceType", PriceTypeSchema);
