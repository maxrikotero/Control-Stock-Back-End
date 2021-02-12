const express = require("express");
const router = express.Router();
const { saveAuditModel, decodedToken } = require("../utils");

// Provider Model
const Payments = require("../models/payment");
const Sales = require("../models/sale");

// GET all Payments
router.get("/", async (req, res) => {
  const payments = await Payments.find({ isDeleted: { $ne: true } });
  res.json(payments);
});

// GET Payments
router.get("/:id", async (req, res) => {
  const payment = await Payments.findById(req.params.id);
  res.json(payment);
});

// ADD a new Payment
router.post("/", async (req, res) => {
  try {
    const { _id } = decodedToken(req);
    const payment = new Payments({ ...req.body, createdBy: _id });
    await payment.save();

    await saveAuditModel("Tipo de pago creado", _id);

    return res
      .status(201)
      .send({ success: true, message: "Tipo de pago guardado" });
  } catch (error) {
    return res.status(500).send({ message: "Error", error: error.message });
  }
});

// UPDATE a Payment
router.put("/:id", async (req, res) => {
  try {
    const { _id } = decodedToken(req);

    await Payments.findByIdAndUpdate(req.params.id, { ...req.body });

    await saveAuditModel("Tipo de pago Actualizado", _id);

    const payments = await Payments.find({ isDeleted: { $ne: true } });

    return res.status(201).send({
      success: true,
      message: "Tipo de pago actualizado",
      data: payments,
    });
  } catch (error) {
    return res.status(500).send({ message: "Error", error: error.message });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const { _id } = decodedToken(req);

    // const sales = await Sales.find();

    // var ids = sales.reduce(
    //   (acc, obj) => [...acc, obj.paymentType],
    //   []
    // );

    // if (ids.some((id) => id == req.params.id)) {
    //   return res.status(500).send({
    //     success: false,
    //     message: "Error",
    //     error: "Hay formas de pago con este precio.",
    //   });
    // }

    await Payments.findOneAndUpdate(
      { _id: req.params.id },
      {
        deletedAt: new Date(),
        isDeleted: true,
        deletedBy: _id,
      }
    );

    // await Payments.findByIdAndRemove(req.params.id);

    await saveAuditModel("Forma de pago Eliminada", _id);

    const payments = await Payments.find({ isDeleted: { $ne: true } });

    return res.status(201).send({
      success: true,
      message: "Tipo de pago eliminado",
      data: payments,
    });
  } catch (error) {
    return res
      .status(500)
      .send({ success: false, message: "Error", error: error.message });
  }
});

module.exports = router;
