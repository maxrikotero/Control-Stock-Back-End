const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const { saveAuditModel, decodedToken } = require("../utils");

// Product Model
const Product = require("../models/product");

// ProductMovement Model
const ProductMovement = require("../models/productMovement");

const PriceMovement = require("../models/priceMovement");

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
    // const session = await mongoose.startSession();

    // await session.startTransaction();

    const product = await Product.findById(req.params.id);
    const { prices = [] } = req.body || {};

    if (product) {
      let goToMovement = [];
      product.prices.some((pb) => {
        const checkedMovement = prices.filter(
          (p) => p.priceType === pb.priceType.toString() && p.price !== pb.price
        );
        if (checkedMovement.length > 0) {
          try {
            goToMovement = [...goToMovement, pb];
          } catch (error) {
            console.log(error);
          }
        }
      });
      if (goToMovement.length > 0) {
        const movement = new PriceMovement({
          product: product._id,
          prices: goToMovement,
          createdBy: _id,
        });
        movement.save();
      }

      await Product.findOneAndUpdate({ _id: req.params.id }, { ...req.body });

      const decreseStock = product.stock >= req.body.stock;
      const updateStock = product.stock !== req.body.stock;

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

      //   // await session.commitTransaction();
      //   // session.endSession();

      return res.status(201).send({
        success: true,
        message: "Producto Actualizado",
        data: products,
      });
    }

    return res
      .status(500)
      .send({ success: false, message: "Error", error: "error.message" });
  } catch (error) {
    // await session.abortTransaction();
    // session.endSession();
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
