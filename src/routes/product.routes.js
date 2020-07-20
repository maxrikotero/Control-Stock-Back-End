const express = require("express");
const router = express.Router();

// Task Model
const Product = require("../models/product");

// GET all Products
router.get("/", async (req, res) => {
  const products = await Product.find();
  res.json(products);
});

// GET product
router.get("/:id", async (req, res) => {
  const product = await Product.findById(req.params.id);
  res.json(product);
});

// ADD a new product
router.post("/", async (req, res) => {
  const { product_name, price, category } = req.body;
  const product = new Product({ product_name, price, category });
  await product.save();
  res.json({ status: "Product Saved" });
});

// UPDATE a product
router.put("/:id", async (req, res) => {
  const { product_name, price, category } = req.body;
  const newProduct = { product_name, price, category };
  await Product.findByIdAndUpdate(req.params.id, newProduct);
  res.json({ status: "Product Updated" });
});

router.delete("/:id", async (req, res) => {
  await Product.findByIdAndRemove(req.params.id);
  res.json({ status: "Product Deleted" });
});

module.exports = router;
