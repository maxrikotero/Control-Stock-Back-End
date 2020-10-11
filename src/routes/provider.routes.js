const express = require("express");
const router = express.Router();

// Provider Model
const Provider = require("../models/provider");

// GET all Providers
router.get("/", async (req, res) => {
  const providers = await Provider.find();

  try {
    return res.status(201).send({ success: true, data: providers });
  } catch (error) {
    return res
      .status(500)
      .send({ success: false, message: "Error", error: error.message });
  }
});

// GET provider
router.get("/:id", async (req, res) => {
  const provider = await Provider.findById(req.params.id);
  res.json(provider);
});

// ADD a new provider
router.post("/", async (req, res) => {
  try {
    const { socialId, dni, phone, email, name } = req.body;

    const provider = new Provider({
      socialId,
      dni,
      phone,
      email,
      name,
    });
    await provider.save();

    return res
      .status(201)
      .send({ success: true, message: "Proveedor Creado", data: [] });
  } catch (error) {
    return res
      .status(500)
      .send({ success: false, message: "Error", error: error.message });
  }
});

// UPDATE a provider
router.put("/:id", async (req, res) => {
  try {
    const { name, socialId, dni, phone, email } = req.body;
    const editProvider = { name, socialId, dni, brand, phone, mobile, email };
    const providerUpdated = await Provider.findByIdAndUpdate(
      req.params.id,
      editProvider
    );
    return res.status(201).send({
      success: true,
      message: "Proveedor Actualizado",
      data: providerUpdated,
    });
  } catch (error) {
    return res
      .status(500)
      .send({ success: false, message: "Error", error: error.message });
  }
});

router.delete("/:id", async (req, res) => {
  await Provider.findByIdAndRemove(req.params.id);
  res.json({ status: "Provider Deleted" });
});

module.exports = router;
