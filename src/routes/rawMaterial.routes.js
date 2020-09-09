const express = require("express");
const router = express.Router();
const { saveAuditModel, decodedToken } = require("../utils");

// RawMaterial Model
const RawMaterial = require("../models/rawMaterial");

// // ProductMovement Model
// const ProductMovement = require("../models/productMovement");

// GET all Products
router.get("/", async (req, res) => {
  const products = await RawMaterial.find();
  res.json(products);
});

// GET all Raw Material
router.get("/rawmaterial", async (req, res) => {
  const products = await RawMaterial.find();

  res.json(products);
});

// Search products
router.get("/search", async (req, res) => {
  const { query: value } = req.query;
  const products = await RawMaterial.find({
    code: parseInt(value, 10),
  }).populate({
    path: "prices",
    populate: { path: "priceType", select: "_id name" },
  });
  return res.json({ products });
});

// GET rawMaterial
router.get("/:id", async (req, res) => {
  const rawMaterial = await RawMaterial.findById(req.params.id).populate({
    path: "prices",
    select: "_id name",
  });
  res.json(rawMaterial);
});

// // GET rawMaterial
// router.get("/movement/:id", async (req, res) => {
//   const movement = await ProductMovement.find({
//     rawMaterial: req.params.id,
//   });
//   res.json(movement);
// });

// ADD a new rawMaterial
router.post("/", async (req, res) => {
  try {
    const { _id } = decodedToken(req);

    const rawMaterial = new RawMaterial({
      ...req.body,
      createdBy: _id,
    });

    const newProduct = await rawMaterial.save();

    // const movement = new ProductMovement({
    //   rawMaterial: newProduct._id,
    //   input: true,
    //   quality: newProduct.stock,
    // });

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

// UPDATE a rawMaterial
router.put("/:id", async (req, res) => {
  try {
    const { _id } = decodedToken(req);

    const rawMaterial = await RawMaterial.findById(req.body._id);

    if (rawMaterial) {
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

      const updatedProduct = await RawMaterial.findOneAndUpdate(
        { _id: req.body._id },
        update
      );

      const decreseStock = rawMaterial.stock <= req.body.countInStock;

      // const movement = new ProductMovement({
      //   rawMaterial: req.body._id,
      //   input: !decreseStock,
      //   output: decreseStock,
      //   isUpdated: true,
      //   quality: req.body.stock,
      //   createdBy: _id,
      // });

      // await movement.save();

      await saveAuditModel("Producto Actualizado", _id);

      const products = await RawMaterial.find();
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

    const deletedProduct = await RawMaterial.findById(req.params.id);

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
