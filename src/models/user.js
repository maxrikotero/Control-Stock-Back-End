const mongoose = require("mongoose");
const { Schema } = mongoose;

const UserSchema = new Schema({
  dni: { type: Number, required: true },
  cuil: { type: Number },
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  userName: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true, lowercase: true },
  password: { type: String, required: true },
  phone: { type: Number },
  mobile: { type: Number },
  isAdmin: { type: Boolean, default: false },
  isSeller: { type: Boolean, default: false },
  isControlStock: { type: Boolean, default: false },
  isSecretary:{type: Boolean, default: false},
  deletedAt: { type: Date, default: Date.now },
  deletedBy: { type: String },
  createdAt: { type: Date, default: Date.now },
  createdBy: { type: mongoose.Schema.Types, ref: "User" },
});

module.exports = mongoose.model("User", UserSchema);
