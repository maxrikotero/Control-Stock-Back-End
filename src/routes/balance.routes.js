const express = require("express");
const router = express.Router();
const { saveAuditModel, decodedToken } = require("../utils");

// Provider Model
const Balance = require("../models/balance");

// GET all Balance
router.get("/", async (req, res) => {
  const payments = await Balance.find();
  res.json(payments);
});

// GET Balance
router.get("/:id", async (req, res) => {
  const payment = await Balance.findById(req.params.id);
  res.json(payment);
});

// ADD a new Payment
router.post("/", async (req, res) => {
  try {
    const { _id } = decodedToken(req);
    const balance = new Balance({ ...req.body, createdBy: _id });
    await balance.save();

    await saveAuditModel("Caja guardada", _id);

    return res.status(201).send({ success: true, message: "Caja guardada" });
  } catch (error) {
    console.log(error.message);
    return res.status(500).send({ message: "Error", error: error.message });
  }
});

// UPDATE a Payment
router.put("/:id", async (req, res) => {
  try {
    const { _id } = decodedToken(req);

    await Balance.findByIdAndUpdate(req.params.id, { ...req.body });

    await saveAuditModel("Caja Actualizada", _id);

    const payments = await Balance.find();

    return res.status(201).send({
      success: true,
      message: "Caja actualizada",
      data: payments,
    });
  } catch (error) {
    return res.status(500).send({ message: "Error", error: error.message });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const { _id } = decodedToken(req);

    await Balance.findByIdAndRemove(req.params.id);

    await saveAuditModel("Caja Eliminada", _id);

    const payments = await Balance.find();

    return res.status(201).send({
      success: true,
      message: "Caja eliminada",
      data: payments,
    });
  } catch (error) {
    return res
      .status(500)
      .send({ success: false, message: "Error", error: error.message });
  }
});

module.exports = router;
