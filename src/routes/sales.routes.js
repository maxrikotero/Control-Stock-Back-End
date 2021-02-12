const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const createPdf = require("../documents/ticket");
const { saveAuditModel, decodedToken } = require("../utils");

// Sales Model
const Sale = require("../models/sale");

const Product = require("../models/product");
const Client = require("../models/client");
const User = require("../models/user");

const ProductMovement = require("../models/productMovement");

const decreaseStock = async (_id, _quality) => {
  const product = await Product.findById(_id);

  Product.findByIdAndUpdate(
    _id,
    {
      stock: product.stock - _quality,
    },
    { new: true },
    (err, product) => {}
  );
};

router.get("/", async (req, res) => {
  try {
    const sales = await Sale.find().populate({
      path: "products",
      populate: { path: "product" },
    });
    res.status(200).send({ success: true, data: sales });
  } catch (error) {
    return res.status(500).send({ message: "Error", error });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const sale = await Sale.find({ _id: req.params.id })
      .populate({
        path: "products",
        populate: { path: "product" },
      })
      .populate({
        path: "user",
        select: "firstName lastName",
      })
      .populate({
        path: "client",
        select: "name address phone cuil",
      });

    res.status(200).send({ success: true, data: sale });
  } catch (error) {
    return res.status(500).send({ message: "Error", error });
  }
});

router.post("/", async (req, res) => {
  try {
    const { _id } = decodedToken(req);
    if (_id) {
      const allProducts = await Product.find({
        _id: {
          $in: req.body.products.map((item) =>
            mongoose.Types.ObjectId(item.product)
          ),
        },
      });

      if (
        allProducts.some((p) =>
          req.body.products.find(
            (pv) =>
              pv.product === p._id.toString() &&
              parseInt(pv.quality, 10) > p.stock
          )
        )
      ) {
        return res
          .status(500)
          .send({ message: "No hay stock suficiente", error: error.message });
      }

      const sales = await Sale.find();
      const totalPrice = req.body.totalPrice;
      const totalIva = totalPrice * 0.21;
      const totalPriceIva = totalPrice + totalIva;

      const newSale = new Sale({
        products: req.body.products,
        user: _id,
        billNumber: sales.length + 1,
        paymentType: req.body.paymentType,
        billType: req.body.billType,
        totalPrice: req.body.totalPrice,
        totalIva: req.body.billType !== "1" ? totalPriceIva : totalPrice,
        client: req.body.client,
      });

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

      const sale = await newSale.save();

      await saveAuditModel("Venta Generada", _id);

      const client = await Client.find({ _id: req.body.client });

      const users = await User.find({ _id });

      await createPdf(
        req.body,
        client,
        users,
        sale._id,
        sale,
        res,
        sales.length
      );
    } else {
      return res.status(200).send({ message: " No autorizado." });
    }
  } catch (error) {
    return res.status(500).send({ message: "Error", error: error.message });
  }
});

module.exports = router;
