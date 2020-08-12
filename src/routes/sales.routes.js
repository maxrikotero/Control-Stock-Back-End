const express = require("express");
const router = express.Router();
const { saveAuditModel, decodedToken } = require("../utils");

// Sales Model
const Sale = require("../models/sale");

const Product = require("../models/product");

const ProductMovement = require("../models/productMovement");

const decreaseStock = async (_id, _quality) => {
  const product = await Product.findById(_id);

  Product.findByIdAndUpdate(
    _id,
    {
      stock: product.stock - _quality,
    },
    { new: true },
    (err, product) => {
      console.log("teste", err, product);
    }
  );
};

router.get("/", async (req, res) => {
  const sales = await Sale.find({});
  res.send(sales);
});

router.post("/", async (req, res) => {
  try {
    const { _id } = decodedToken(req);

    if (_id) {
      const newSale = new Sale({
        products: req.body.products,
        user: _id,
        totalPrice: req.body.totalPrice,
        client: req.body.client,
      });

      const sale = await newSale.save();

      req.body.products.map(async (item) => {
        decreaseStock(item.product, item.quality);

        const movement = new ProductMovement({
          product: item.product,
          output: true,
          isSale: true,
          quality: item.quality,
        });

        await movement.save();
      });

      await saveAuditModel("Venta Generada", _id);

      return res.status(201).send({ success: true, message: "Venta Generada" });
    } else {
      return res.status(500).send({ message: " No autorizado." });
    }
  } catch (error) {
    return res.status(500).send({ message: "Error", error: error.message });
  }

  res
    .status(201)
    .send({ message: "Nueva Venta Generada", data: newSaleCreated });
});

module.exports = router;
