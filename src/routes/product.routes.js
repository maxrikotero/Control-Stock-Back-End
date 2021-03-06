const express = require("express");
const router = express.Router();
const { saveAuditModel, decodedToken } = require("../utils");

// Product Model
const Product = require("../models/product");

// ProductMovement Model
const ProductMovement = require("../models/productMovement");

// GET all Products
router.get("/", async (req, res) => {
  const products = await Product.find().populate({
    path: "prices",
    populate: { path: "priceType", select: "_id name" },
  });
  res.json(products);
});

// GET all Raw Material
router.get("/rawmaterial", async (req, res) => {
  const products = await Product.find();

  res.json(products);
});

// Search products
router.get("/search", async (req, res) => {
  const { query: value } = req.query;
  const products = await Product.find({ code: parseInt(value, 10) }).populate({
    path: "prices",
    populate: { path: "priceType", select: "_id name" },
  });
  return res.json({ products });
});

// GET product
router.get("/:id", async (req, res) => {
  const product = await Product.findById(req.params.id)
    .populate({
      path: "prices",
      select: "_id name",
    })
    .populate({
      path: "category",
      select: "_id name",
    });
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
  try {
    const { _id } = decodedToken(req);

    const product = new Product({
      ...req.body,
      createdBy: _id,
    });

    const newProduct = await product.save();

    const movement = new ProductMovement({
      product: newProduct._id,
      input: true,
      quality: newProduct.stock,
    });

    await saveAuditModel("Producto Creado", _id);

    await movement.save();

    return res.status(201).send({
      success: true,
      message: "Nuevo Producto Creado",
      data: {},
    });
  } catch (error) {
    return res
      .status(500)
      .send({ success: false, message: "Error", error: error.message });
  }
});

// UPDATE a product
router.put("/:id", async (req, res) => {
  try {
    const { _id } = decodedToken(req);

    const product = await Product.findById(req.body._id);

    if (product) {
      const update = {
        code: req.body.code,
        name: req.body.name,
        brand: req.body.brand,
        prices: req.body.prices,
        stock: req.body.stock,
        minStock: req.body.minStock,
        category: req.body.category,
        expire: req.body.expire,
        description: req.body.description,
      };

      await Product.findOneAndUpdate({ _id: req.body._id }, update);

      const decreseStock = product.stock <= req.body.countInStock;

      const updateStock = product.stock !== req.body.countInStock;

      if (updateStock) {
        const movement = new ProductMovement({
          product: req.body._id,
          input: !decreseStock,
          output: decreseStock,
          isUpdated: true,
          quality: req.body.stock,
          createdBy: _id,
        });
        await movement.save();
      }

      await saveAuditModel("Producto Actualizado", _id);

      const products = await Product.find();

      return res.status(201).send({
        success: true,
        message: "Producto Actualizado",
        data: products,
      });
    }
  } catch (error) {
    return res
      .status(500)
      .send({ success: false, message: "Error", error: error.message });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const { _id } = decodedToken(req);

    const deletedProduct = await Product.findById(req.params.id);

    if (deletedProduct) await deletedProduct.remove();

    await saveAuditModel("Producto Eliminado", _id);

    return res.status(201).send({
      success: true,
      message: "Producto Borrado",
    });
  } catch (error) {
    return res
      .status(500)
      .send({ success: false, message: "Error", error: error.message });
  }
});

module.exports = router;
