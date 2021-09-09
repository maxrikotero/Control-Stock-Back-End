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

const increaseStock = async (_id, _quality) => {
  const product = await Product.findById(_id);

  Product.findByIdAndUpdate(
    _id,
    {
      stock: product.stock + _quality,
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

      const products = req.body.products
        .reduce(
          (acc, item) =>
            !acc.includes(item.product) ? [...acc, item.product] : acc,
          []
        )
        .map((itemProduct) => ({
          productId: itemProduct,
          quality: req.body.products
            .filter((productItem) => productItem.product === itemProduct)
            .reduce((acc, i) => acc + Number(i.quality), 0),
        }));

      products.map(async (item) => {
        decreaseStock(item.productId, item.quality);

        const movement = new ProductMovement({
          product: item.productId,
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

router.put("/:id", async (req, res) => {
  try {
    const { _id } = decodedToken(req);

    const sale = await Sale.findById(req.params.id);

    if (sale) {
      await Sale.findOneAndUpdate({ _id: req.params.id }, { $set: req.body });
      res.status(200).send({
        success: true,
        message: "Venta actualizada exitosamente.",
      });
    }
  } catch (error) {
    return res
      .status(500)
      .send({ success: false, message: "Error", error: error.message });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const { _id } = decodedToken(req);

    // const deletedProduct = await Product.findById(req.params.id);

    // if (deletedProduct) await deletedProduct.remove();

    const sale = await Sale.findById({ _id: req.params.id });

    //console.log(sale.products);
    const products = sale.products
      .reduce(
        (acc, item) =>
          !acc.some((i) => i !== item.product)
            ? [...acc, item.product.toString()]
            : acc,
        []
      )
      .map((itemProduct) => {
        return {
          productId: itemProduct,
          quality: sale.products
            .filter(
              (productItem) => productItem.product.toString() === itemProduct
            )
            .reduce((acc, i) => acc + Number(i.quality), 0),
        };
      });

    products.map(async (item) => increaseStock(item.productId, item.quality));

    //   // const movement = new ProductMovement({
    //   //   product: item.productId,
    //   //   output: true,
    //   //   isSale: true,
    //   //   quality: item.quality,
    //   // });

    //   // await movement.save();
    // });

    await Sale.remove();
    // await saveAuditModel("Venta Borrada", _id);

    return res.status(201).send({
      success: true,
      message: "Venta Borrada",
    });
  } catch (error) {
    console.log(error.message);
    return res
      .status(500)
      .send({ success: false, message: "Error", error: error.message });
  }
});

module.exports = router;
