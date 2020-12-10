const express = require("express");
const router = express.Router();
const { saveAuditModel, decodedToken } = require("../utils");

const deliveryProvider = require("../models/deliveryProvider");

router.get("/", async (req, res) => {
  const deliveryList = await deliveryProvider.find();

  return res.json(deliveryList);
});

router.delete("/:id", async (req, res) => {
  try {
    const { _id } = decodedToken(req);

    await deliveryProvider.findByIdAndRemove(req.params.id);

    await saveAuditModel("Entrega Borrada", _id);

    const deliveries = await deliveryProvider.find();

    return res.status(201).send({
      success: true,
      message: "Entrega Borrada",
      data: deliveries,
    });
  } catch (error) {
    return res
      .status(500)
      .send({ success: false, message: "Error", error: error.message });
  }
});

router.put("/:id", async (req, res) => {
  try {
    const { _id } = decodedToken(req);

    await deliveryProvider.findByIdAndUpdate(req.params.id, { ...req.body });

    const deliveries = await deliveryProvider.find();
    await saveAuditModel("Entrega Actualizada", _id);

    return res.status(201).send({
      success: true,
      message: "Entrega Actualizada",
      data: deliveries,
    });
  } catch (error) {
    return res
      .status(500)
      .send({ success: false, message: "Error", error: error.message });
  }
});

router.post("/", async (req, res) => {
  try {
    const { _id } = decodedToken(req);

    const delivery = new deliveryProvider({ ...req.body, createdBy: _id });

    await delivery.save();

    await saveAuditModel("Categoria Creada", _id);

    const deliveries = await deliveryProvider.find();

    return res
      .status(201)
      .send({ success: true, message: "Entrega Creada", data: deliveries });
  } catch (error) {
    return res
      .status(500)
      .send({ success: false, message: "Error", error: error.message });
  }
});

module.exports = router;
