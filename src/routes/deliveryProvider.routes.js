const express = require("express");
const router = express.Router();
const { saveAuditModel, decodedToken } = require("../utils");

const deliveryProvider = require("../models/deliveryProvider");

// RawMaterialMovement Model
const RawMaterialMovement = require("../models/rawMaterialMovement");

// Provider Model
const OrderProvider = require("../models/orderProvider");

// RawMaterial Model
const RawMaterial = require("../models/rawMaterial");

const increaseStock = async (_id, _quality) => {
  const product = await RawMaterial.findById(_id);
  RawMaterial.findByIdAndUpdate(
    _id,
    {
      stock: product.stock + parseInt(_quality, 10),
    },
    { new: true },
    (err, product) => {}
  );
};

router.get("/", async (req, res) => {
  const deliveryList = await deliveryProvider.find();

  return res.json(deliveryList);
});

router.delete("/:id", async (req, res) => {
  try {
    const { _id } = decodedToken(req);

    await deliveryProvider.findByIdAndRemove(req.params.id);

    await saveAuditModel("Pedido Borrada", _id);

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
    await saveAuditModel("Pedido Actualizado", _id);

    return res.status(201).send({
      success: true,
      message: "Pedido Actualizado",
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

    await OrderProvider.findByIdAndUpdate(req.body.orderId, {
      isDelivery: true,
      products: req.body.products,
    });

    req.body.products.map(async (item) => {
      increaseStock(item.product, item.amount);

      const movement = new RawMaterialMovement({
        rawMaterial: item.product._id,
        input: true,
        quality: item.amount,
        createdBy: _id,
      });

      await movement.save();
    });

    await saveAuditModel("Pedido Pagado", _id);

    const deliveries = await deliveryProvider.find();

    return res
      .status(201)
      .send({ success: true, message: "Pedido Pagado", data: deliveries });
  } catch (error) {
    return res
      .status(500)
      .send({ success: false, message: "Error", error: error.message });
  }
});

module.exports = router;
