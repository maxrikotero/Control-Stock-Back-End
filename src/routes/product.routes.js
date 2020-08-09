const express = require("express");
const router = express.Router();
const { saveAuditModel, decodedToken } = require("../utils");

// Product Model
const Product = require("../models/product");

// Product Model
const ProductMovement = require("../models/productMovement");

// GET all Products
router.get("/", async (req, res) => {
  const products = await Product.find();

  // {
  //   ...product,
  //   expire: product.expire
  //     ? new Date(product.expire).toISOString().split("T")[0]
  //     : "",
  // };
  // console.log("lega ", products);
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
      data: newProduct,
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
        price: req.body.price,
        stock: req.body.stock,
        minStock: req.body.minStock,
        category: req.body.category,
        expire: req.body.expire,
        description: req.body.description,
      };

      const updatedProduct = await Product.findOneAndUpdate(
        { _id: req.body._id },
        update
      );

      const decreseStock = product.stock <= req.body.countInStock;

      const movement = new ProductMovement({
        product: req.body._id,
        input: !decreseStock,
        output: decreseStock,
        isUpdated: true,
        quality: req.body.stock,
        createdBy: _id,
      });

      await movement.save();

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
  const { _id } = decodedToken(req);
  const deletedProduct = await Product.findById(req.params.id);
  await saveAuditModel("Producto Creado", _id);

  res.json({ success: true });
  // const deletedProduct = await Product.findById(req.params.id);
  // if (deletedProduct) {
  //   await deletedProduct.remove();
  //   res.send({ message: "Producto Borrado" });
  // } else {
  //   res.send("Error en Borrado de producto.");
  // }

  // await Product.findByIdAndRemove(req.params.id);
  // res.json({ status: "Product Deleted" });
});

module.exports = router;
