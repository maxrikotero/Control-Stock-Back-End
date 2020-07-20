const mongoose = require("mongoose");
const { Schema } = mongoose;

const ProductSchema = new Schema({
  product_name: { type: String },
  price: { type: Number },
  category: { type: String },
});

module.exports = mongoose.model("Product", ProductSchema);
