const mongoose = require("mongoose");
const { Schema } = mongoose;

const UserSchema = new Schema({
  dni: { type: String },
  cuil: { type: String },
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  userName: { type: String, required: true },
  email: { type: String, required: true, unique: true, lowercase: true },
  password: { type: String, required: true },
  phone: { type: String },
  mobile: { type: String },
  isAdmin: { type: Boolean, default: false },
  isSeller: { type: Boolean, default: false },
  isControlStock: { type: Boolean, default: false },
  isSecretary: { type: Boolean, default: false },
  deletedAt: { type: Date },
  isDeleted: { type: Boolean, default: false },
  deletedBy: { type: String },
  createdAt: { type: Date, default: Date.now },
  createdBy: { type: mongoose.Schema.Types, ref: "User" },
});

// UserSchema.index(
//   { email: 1 },
//   {
//     unique: true,
//     partialFilterExpression: {
//       isDeleted: { $eq: false },
//     },
//   }
// );

module.exports = mongoose.model("User", UserSchema);
