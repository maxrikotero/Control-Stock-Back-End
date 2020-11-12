const mongoose = require("mongoose");
const { Schema } = mongoose;

const RawMaterialMovementSchema = new Schema({
  rawMaterial: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "RawMaterial",
  },
  input: { type: Boolean, default: false },
  output: { type: Boolean, default: false },
  quality: { type: Number, default: 0 },
  isUpdated: { type: Boolean, default: false },
  createdBy: { type: mongoose.Schema.Types, ref: "User", default: false },
  isSale: { type: Boolean, default: false },
  dateAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model(
  "RawMaterialMovement",
  RawMaterialMovementSchema
);
