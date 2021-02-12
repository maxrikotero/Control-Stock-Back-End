const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const { decodedToken } = require("../utils");

// Provider Model
const PriceMovement = require("../models/priceMovement");

router.post("/", async (req, res) => {
  try {
    const { _id } = decodedToken(req);

    if (!_id)
      return res.status(500).send({ message: "Error", error: "No permitido" });

    const details = await PriceMovement.find({
      product: mongoose.Types.ObjectId(req.body.productId),
      $expr: { $eq: [{ $year: "$createAt" }, req.body.year] },
    });
    return res.status(201).send({ success: true, data: details });
  } catch (error) {
    return res.status(500).send({ message: "Error", error: error.message });
  }
});

module.exports = router;
