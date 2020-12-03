const express = require("express");
const router = express.Router();
const { saveAuditModel, decodedToken } = require("../utils");

// Provider Model
const Process = require("../models/process");

// GET all PriceTypes
router.get("/", async (req, res) => {
  const priceTypes = await Process.find();
  res.json(priceTypes);
});

// GET Process
router.get("/:id", async (req, res) => {
  const allProcess = await Process.findById(req.params.id);
  res.json(allProcess);
});

// ADD a new process
router.post("/", async (req, res) => {
  try {
    const { _id } = decodedToken(req);
    const process = new Process({ ...req.body });
    await process.save();

    await saveAuditModel("Proceso creado", _id);

    return res.status(201).send({ success: true, message: "Proceso guardado" });
  } catch (error) {
    return res.status(500).send({ message: "Error", error: error.message });
  }
});

// UPDATE a process
router.put("/:id", async (req, res) => {
  try {
    const { _id } = decodedToken(req);
    await saveAuditModel("Proceso Actualizado", _id);
    await Process.findByIdAndUpdate(req.params.id, { ...req.body });

    const priceTypes = await Process.find();

    return res.status(201).send({
      success: true,
      message: "Proceso actualizado",
      data: priceTypes,
    });
  } catch (error) {
    return res.status(500).send({ message: "Error", error: error.message });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const { _id } = decodedToken(req);

    await Process.findByIdAndRemove(req.params.id);

    await saveAuditModel("Proceso Eliminado", _id);

    const priceTypes = await Process.find();

    return res.status(201).send({
      success: true,
      message: "Proceso eliminado",
      data: priceTypes,
    });
  } catch (error) {
    return res
      .status(500)
      .send({ success: false, message: "Error", error: error.message });
  }
});

module.exports = router;
