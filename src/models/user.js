const mongoose = require("mongoose");
const { Schema } = mongoose;

const UserSchema = new Schema({
  dni: { type: Number },
  firstName: { type: String },
  lastName: { type: String },
  userName: { type: String },
  email: { type: String },
  password: { type: String },
  phone: { type: Number },
  createdOn: { type: Date },
  createdBy: { type: String },
});

module.exports = mongoose.model("User", UserSchema);
