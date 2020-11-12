const express = require("express");
const router = express.Router();

// Provider Model
const Provider = require("../models/provider");
const { decodedToken } = require("../utils");

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
    const { _id } = decodedToken(req);

    const provider = new Provider({
      ...req.body,
      createdBy: _id,
    });
    await provider.save();

    return res
      .status(201)
      .send({ success: true, message: "Proveedor Creado", data: [] });
  } catch (error) {
    return res
      .status(500)
      .send({ success: false, message: "Error", error: "error" });
  }
});

// UPDATE a provider
router.put("/:id", async (req, res) => {
  try {
    const { _id } = decodedToken(req);

    const providerUpdated = await Provider.findByIdAndUpdate(req.params.id, {
      ...req.body,
      updatedBy: _id,
    });
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
  try {
    const { _id } = decodedToken(req);

    if (_id) await Provider.findByIdAndRemove(req.params.id);
    else throw "Error";
    return res.status(201).send({
      success: true,
      message: "Proveedor Borrado",
    });
  } catch (error) {
    return res
      .status(500)
      .send({ success: false, message: "Error", error: error.message });
  }

  res.json({ status: "Provider Deleted" });
});

module.exports = router;
