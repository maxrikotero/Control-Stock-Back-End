const express = require("express");
const router = express.Router();
const { saveAuditModel, decodedToken } = require("../utils");

// Provider Model
const OrderProvider = require("../models/orderProvider");

// GET Orders
router.get("/", async (req, res) => {
  try {
    const orderProviders = await OrderProvider.find()
      .populate({
        path: "provider",
        select: "_id name",
      })
      .populate({
        path: "products",
        populate: { path: "product", select: "_id name" },
      });
    res.json(orderProviders);
  } catch (error) {
    return res.status(500).send({ message: "Error", error: error.message });
  }
});

// GET Order Provider
router.get("/:id", async (req, res) => {
  try {
    const orderProvider = await OrderProvider.findById(req.params.id).populate({
      path: "products",
      populate: { path: "_id", select: "_id name" },
    });
    res.json(orderProvider);
  } catch (error) {
    return res.status(500).send({ message: "Error", error: error.message });
  }
});

// ADD order provider
router.post("/", async (req, res) => {
  try {
    const { _id } = decodedToken(req);
    const orderProvider = new OrderProvider({ ...req.body });
    await orderProvider.save();

    await saveAuditModel("Pedido a proveedor agregado", _id);

    return res.status(201).send({ success: true, message: "Pedido guardado" });
  } catch (error) {
    return res.status(500).send({ message: "Error", error: error.message });
  }
});

// UPDATE order
router.put("/:id", async (req, res) => {
  try {
    const { _id } = decodedToken(req);
    await saveAuditModel("Pedido a proveedor Actualizado", _id);
    await OrderProvider.findByIdAndUpdate(req.params.id, { ...req.body });

    const orderProviders = await OrderProvider.find();

    return res.status(201).send({
      success: true,
      message: "Pedido a proveedores actualizado",
      data: orderProviders,
    });
  } catch (error) {
    return res.status(500).send({ message: "Error", error: error.message });
  }
});

// Delete Order
router.delete("/:id", async (req, res) => {
  try {
    const { _id } = decodedToken(req);

    await OrderProvider.findByIdAndRemove(req.params.id);

    await saveAuditModel("Pedido a proveedor Eliminado", _id);

    const orderProviders = await OrderProvider.find();

    return res.status(201).send({
      success: true,
      message: "Tipo de precio eliminado",
      data: orderProviders,
    });
  } catch (error) {
    return res
      .status(500)
      .send({ success: false, message: "Error", error: error.message });
  }
});

module.exports = router;
