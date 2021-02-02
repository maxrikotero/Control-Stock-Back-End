const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const { saveAuditModel, decodedToken } = require("../utils");

// Provider Model
const PriceMovement = require("../models/priceMovement");
//Product Model
const Product = require("../models/product");

// // GET all PriceTypes
// router.get("/", async (req, res) => {
//   const priceTypes = await PriceType.find();
//   res.json(priceTypes);
// });

// // GET PriceType
// router.get("/:id", async (req, res) => {
//   const priceType = await PriceType.findById(req.params.id);
//   res.json(priceType);
// });

// ADD a new price type
router.post("/", async (req, res) => {
  try {
    const { _id } = decodedToken(req);
    // console.log(new Date(req.body.year));
    const details = await PriceMovement.find({
      product: mongoose.Types.ObjectId(req.body.productId),
      $expr: { $eq: [{ $year: "$createAt" }, req.body.year] },
    });

    console.log(details);

    // const priceType = new PriceType({ ...req.body });
    // await priceType.save();

    // await saveAuditModel("Tipo de precio creado", _id);

    return res.status(201).send({ success: true, data: details });
  } catch (error) {
    return res.status(500).send({ message: "Error", error: error.message });
  }
});

// // UPDATE a price type
// router.put("/:id", async (req, res) => {
//   try {
//     const { _id } = decodedToken(req);
//     await saveAuditModel("Tipo de precio Actualizado", _id);
//     await PriceType.findByIdAndUpdate(req.params.id, { ...req.body });

//     const priceTypes = await PriceType.find();

//     return res.status(201).send({
//       success: true,
//       message: "Tipo de precio actualizado",
//       data: priceTypes,
//     });
//   } catch (error) {
//     return res.status(500).send({ message: "Error", error: error.message });
//   }
// });

// router.delete("/:id", async (req, res) => {
//   try {
//     const { _id } = decodedToken(req);

//     const products = await Product.find();

//     var ids = products.reduce(
//       (acc, obj) => [...acc, obj.prices[0].priceType._id],
//       []
//     );

//     if (ids.some((id) => id == req.params.id)) {
//       return res.status(500).send({
//         success: false,
//         message: "Error",
//         error: "Hay Productos con este precio",
//       });
//     }

//     await PriceType.findByIdAndRemove(req.params.id);

//     await saveAuditModel("Tipo de precio Eliminado", _id);

//     const priceTypes = await PriceType.find();

//     return res.status(201).send({
//       success: true,
//       message: "Tipo de precio eliminado",
//       data: priceTypes,
//     });
//   } catch (error) {
//     return res
//       .status(500)
//       .send({ success: false, message: "Error", error: error.message });
//   }
// });

module.exports = router;
