const express = require("express");
const router = express.Router();
const { saveAuditModel, decodedToken } = require("../utils");

// RawMaterial Model
const RawMaterial = require("../models/rawMaterial");

// RawMaterialMovement Model
const RawMaterialMovement = require("../models/rawMaterialMovement");

// GET all RowMaterials
router.get("/", async (req, res) => {
  const rawMaterials = await RawMaterial.find().populate({
    path: "providers",
    populate: { path: "provider", select: "_id name" },
  });
  res.json(rawMaterials);
});

// GET all Raw Material
router.get("/rawmaterial", async (req, res) => {
  const rawMaterials = await RawMaterial.find();

  res.json(rawMaterials);
});

// // Search rawMaterials
// router.get("/search", async (req, res) => {
//   const { query: value } = req.query;
//   const rawMaterials = await RawMaterial.find({
//     code: parseInt(value, 10),
//   }).populate({
//     path: "providers",
//     populate: { path: "priceType", select: "_id name" },
//   });
//   return res.json({ rawMaterials });
// });

// GET rawMaterial
router.get("/:id", async (req, res) => {
  const rawMaterial = await RawMaterial.findById(req.params.id)
    .populate({
      path: "providers",
      select: "_id name",
    })
    .populate({
      path: "category",
      select: "_id name",
    });
  res.json(rawMaterial);
});

// GET rawMaterial
router.get("/movement/:id", async (req, res) => {
  const movement = await RawMaterialMovement.find({
    rawMaterial: req.params.id,
  });
  res.json(movement);
});

// ADD a new rawMaterial
router.post("/", async (req, res) => {
  try {
    const { _id } = decodedToken(req);

    const rawMaterial = new RawMaterial({
      ...req.body,
      createdBy: _id,
    });

    const newRawMaterial = await rawMaterial.save();

    const movement = new RawMaterialMovement({
      rawMaterial: newRawMaterial._id,
      input: true,
      quality: newRawMaterial.stock,
    });

    await saveAuditModel("Materia Prima Creada", _id);

    await movement.save();

    return res.status(201).send({
      success: true,
      message: "Nueva Materia Prima Creada",
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
        providers: req.body.providers,
        stock: req.body.stock,
        minStock: req.body.minStock,
        category: req.body.category,
        expire: req.body.expire,
        description: req.body.description,
      };

      await RawMaterial.findOneAndUpdate({ _id: req.body._id }, update);

      const decreseStock = rawMaterial.stock <= req.body.countInStock;

      const movement = new RawMaterialMovement({
        rawMaterial: req.body._id,
        input: !decreseStock,
        output: decreseStock,
        isUpdated: true,
        quality: req.body.stock,
        createdBy: _id,
      });

      await movement.save();

      await saveAuditModel("Materia Prima Actualizada", _id);

      const rawMaterials = await RawMaterial.find();

      return res.status(201).send({
        success: true,
        message: "Materia Prima Actualizada",
        data: [],
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

    const deletedRawMaterial = await RawMaterial.findById(req.params.id);

    if (deletedRawMaterial) await deletedRawMaterial.remove();

    await saveAuditModel("Materia Prima Eliminado", _id);

    return res.status(201).send({
      success: true,
      message: "Materia Prima Borrado",
    });
  } catch (error) {
    return res
      .status(500)
      .send({ success: false, message: "Error", error: error.message });
  }
});

module.exports = router;
