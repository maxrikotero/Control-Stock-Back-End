const mongoose = require("mongoose");
const { Schema } = mongoose;

const RawMaterialSchema = new Schema({
  name: { type: String, required: true, unique: true },
  image: { type: String },
  brand: { type: String },
  providers: [
    {
      price: Number,
      provider: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Provider",
      },
    },
  ],
  expire: { type: Date, default: Date.now },
  category: { type: mongoose.Schema.Types, ref: "Category" },
  minStock: { type: Number, default: 0 },
  stock: { type: Number, default: 0, required: true },
  description: { type: String },
  isDeleted: { type: Boolean, default: false },
  deletedAt: { type: Date },
  deletedBy: { type: mongoose.Schema.Types, ref: "User" },
  createAt: { type: Date, default: Date.now },
  createdBy: { type: mongoose.Schema.Types, ref: "User" },
  updatedAt: { type: Date },
  updatedBy: { type: mongoose.Schema.Types, ref: "User" },
});

RawMaterialSchema.index(
  { name: 1 },
  {
    unique: true,
    partialFilterExpression: {
      isDeleted: { $eq: false },
    },
  }
);

module.exports = mongoose.model("RawMaterials", RawMaterialSchema);
