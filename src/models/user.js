const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const { Schema } = mongoose;

const UserSchema = new Schema({
  dni: { type: Number },
  firstName: { type: String },
  lastName: { type: String },
  userName: { type: String },
  email: { type: String },
  password: { type: String },
  phone: { type: Number },
  isAdmin: { type: Boolean, required: true, default: false },
  deletedAt: { type: Date, default: Date.now },
  deletedBy: { type: String },
  createdAt: { type: Date, default: Date.now },
  createdBy: { type: mongoose.Schema.Types, ref: "User" },
});

UserSchema.methods.encryptPassword = async (password) => {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
};

UserSchema.methods.validatePassword = function (password) {
  return bcrypt.compare(password, this.password);
};

module.exports = mongoose.model("User", UserSchema);
