const express = require("express");
const router = express.Router();
const { saveAuditModel, decodedToken } = require("../utils");

// Provider Model
const Balance = require("../models/balance");

// GET all Balance
router.get("/openbalance", async (req, res) => {
  const balances = await Balance.find({ isOpen: true }).populate({
    path: "createdBy",
    select: "_id firstName lastName",
  });
  res.json(balances);
});

// GET all Balance
router.get("/", async (req, res) => {
  const balances = await Balance.find({ isOpen: false });
  res.json(balances);
});

// GET Balance
router.get("/:id", async (req, res) => {
  const balance = await Balance.findById(req.params.id);
  res.json(balance);
});

// ADD a new Payment
router.post("/", async (req, res) => {
  try {
    const { _id } = decodedToken(req);
    const balance = new Balance({ ...req.body, createdBy: _id });
    await balance.save();

    await saveAuditModel("Caja guardada", _id);

    return res
      .status(201)
      .send({ success: true, message: "Caja guardada", data: balance });
  } catch (error) {
    console.log(error.message);
    return res.status(500).send({ message: "Error", error: error.message });
  }
});

// UPDATE a Payment
router.put("/:id", async (req, res) => {
  try {
    const { _id } = decodedToken(req);
    await Balance.findByIdAndUpdate(req.params.id, {
      ...req.body,
    });

    const balance = await Balance.findById(req.params.id);
    await saveAuditModel("Caja Actualizada", _id);

    return res.status(201).send({
      success: true,
      message: "Caja actualizada",
      data: balance,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({ message: "Error", error: error.message });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const { _id } = decodedToken(req);

    await Balance.findByIdAndRemove(req.params.id);

    await saveAuditModel("Caja Eliminada", _id);

    const balances = await Balance.find();

    return res.status(201).send({
      success: true,
      message: "Caja eliminada",
      data: balances,
    });
  } catch (error) {
    return res
      .status(500)
      .send({ success: false, message: "Error", error: error.message });
  }
});

module.exports = router;
