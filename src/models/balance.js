const mongoose = require("mongoose");
const { Schema } = mongoose;

const imcome = new mongoose.Schema({
  amount: { type: Number, required: true },
  description: { type: String },
});

const exit = new mongoose.Schema({
  amount: { type: Number, required: true },
  description: { type: String },
});

const BalanceSchema = new Schema({
  isOpen: { type: Boolean },
  incomes: [imcome],
  exits: [exit],
  closeAt: { type: Boolean },
  createdBy: { type: mongoose.Schema.Types, ref: "User" },
  createAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Balance", BalanceSchema);
