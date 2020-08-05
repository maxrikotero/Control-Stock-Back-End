const express = require("express");
const router = express.Router();
const { isAuth, decodedToken } = require("../utils");

// Product Model
const Product = require("../models/product");

// Product Model
const ProductMovement = require("../models/productMovement");

// GET all Products
router.get("/", async (req, res) => {
  const products = await Product.find();
  console.log("lega ", products);
  res.json(products);
});

// Search products
router.get("/search", async (req, res) => {
  const { query: value } = req.query;
  const products = await Product.find({ code: parseInt(value, 10) });
  return res.json({ products });
});

// GET product
router.get("/:id", async (req, res) => {
  const product = await Product.findById(req.params.id);
  res.json(product);
});

// GET product
router.get("/movement/:id", async (req, res) => {
  const movement = await ProductMovement.find({
    product: req.params.id,
  });
  res.json(movement);
});

// ADD a new product
router.post("/", async (req, res) => {
  const product = new Product({
    code: req.body.code,
    name: req.body.name,
    price: req.body.price,
    category: req.body.category,
    brand: req.body.brand,
    countInStock: req.body.countInStock,
    description: req.body.description,
  });
  const newProduct = await product.save();

  const movement = new ProductMovement({
    product: newProduct._id,
    input: true,
    quality: newProduct.countInStock,
  });

  const newMovement = await movement.save();

  if (newMovement) {
    return res
      .status(201)
      .send({ message: "Nuevo Producto Creado", data: newProduct });
  }
});

// UPDATE a product
router.put("/:id", async (req, res) => {
  const product = await Product.findById(req.body._id);

  if (product) {
    product.name = req.body.name;
    product.price = req.body.price;
    product.brand = req.body.brand;
    product.category = req.body.category;
    product.countInStock = req.body.countInStock;
    product.description = req.body.description;
    const updatedProduct = await product.save();

    const decreseStock = product.countInStock <= req.body.countInStock;

    const movement = new ProductMovement({
      product: req.body._id,
      input: !decreseStock,
      output: decreseStock,
      isUpdated: true,
      quality: req.body.countInStock,
    });

    await movement.save();

    if (updatedProduct) {
      return res
        .status(200)
        .send({ message: "Producto Actualizado", data: updatedProduct });
    }
  }

  return res.status(500).send({ message: " Error Actualizando el Producto." });

  // const product = await Product.findById(req.params.id);

  // const { product_name, price, category } = req.body;
  // const newProduct = { product_name, price, category };
  // await Product.findByIdAndUpdate(req.params.id, newProduct);
  // res.json({ status: "Product Updated" });
});

router.delete("/:id", async (req, res) => {
  const deletedProduct = await Product.findById(req.params.id);
  if (deletedProduct) {
    await deletedProduct.remove();
    res.send({ message: "Producto Borrado" });
  } else {
    res.send("Error en Borrado de producto.");
  }

  // await Product.findByIdAndRemove(req.params.id);
  // res.json({ status: "Product Deleted" });
});

module.exports = router;
