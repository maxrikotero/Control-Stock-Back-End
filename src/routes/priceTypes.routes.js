const express = require("express");
const router = express.Router();

// Provider Model
const PriceType = require("../models/priceType");

// GET all PriceTypes
router.get("/", async (req, res) => {
  const priceTypes = await PriceType.find();
  res.json(priceTypes);
});

// GET PriceType
router.get("/:id", async (req, res) => {
  const priceType = await PriceType.findById(req.params.id);
  res.json(priceType);
});

// ADD a new price type
router.post("/", async (req, res) => {
  try {
    const { _id } = decodedToken(req);
    const priceType = new PriceType(...req.body);
    await priceType.save();

    await saveAuditModel("Tipo de precio creado", _id);

    return res
      .status(201)
      .send({ success: true, message: "Tipo de precio guardado" });
  } catch (error) {
    return res.status(500).send({ message: "Error", error: error.message });
  }
});

// UPDATE a price type
router.put("/:id", async (req, res) => {
  try {
    const { _id } = decodedToken(req);
    await saveAuditModel("Tipo de precio Actualizado", _id);
    await PriceType.findByIdAndUpdate(req.params.id, ...req.body);

    const priceTypes = await PriceType.find();

    return res.status(201).send({
      success: true,
      message: "Tipo de precio actualizado",
      data: priceTypes,
    });
  } catch (error) {
    return res.status(500).send({ message: "Error", error: error.message });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const { _id } = decodedToken(req);

    await PriceType.findByIdAndRemove(req.params.id);

    await saveAuditModel("Tipo de precio Eliminado", _id);

    const priceTypes = await PriceType.find();

    return res.status(201).send({
      success: true,
      message: "Tipo de precio eliminado",
      data: priceTypes,
    });
  } catch (error) {
    return res
      .status(500)
      .send({ success: false, message: "Error", error: error.message });
  }
});

module.exports = router;
