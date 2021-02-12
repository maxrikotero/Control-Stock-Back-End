const mongoose = require("mongoose");

const categorySchema = mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String },
  isDeleted: { type: Boolean, default: false },
  deletedAt: { type: Date },
  deletedBy: { type: mongoose.Schema.Types, ref: "User" },
  createdAt: { type: Date, default: Date.now },
  createdBy: { type: mongoose.Schema.Types, ref: "User" },
  updatedAt: { type: Date },
  updatedBy: { type: mongoose.Schema.Types, ref: "User" },
});

categorySchema.index(
  { name: 1 },
  {
    unique: true,
    partialFilterExpression: {
      isDeleted: { $eq: false },
    },
  }
);

module.exports = mongoose.model("Category", categorySchema);
