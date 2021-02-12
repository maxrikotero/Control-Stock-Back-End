const express = require("express");
const router = express.Router();
const { saveAuditModel, decodedToken } = require("../utils");

const Category = require("../models/category");

router.get("/", async (req, res) => {
  const categoryList = await Category.find({ isDeleted: { $ne: true } });

  return res.json(categoryList);
});

router.delete("/:id", async (req, res) => {
  try {
    const { _id } = decodedToken(req);

    await Category.findOneAndUpdate(
      { _id: req.params.id },
      {
        deletedAt: new Date(),
        isDeleted: true,
        deletedBy: _id,
      }
    );
    // await Category.findByIdAndRemove(req.params.id);

    await saveAuditModel("Categoria Borrada", _id);

    const categories = await Category.find({ isDeleted: { $ne: true } });

    return res.status(201).send({
      success: true,
      message: "Categoria Borrada",
      data: categories,
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

    const data = {
      name: req.body.name,
      description: req.body.description,
      updatedBy: _id,
    };

    await Category.findByIdAndUpdate(req.body._id, data);

    const categories = await Category.find({ isDeleted: { $ne: true } });
    await saveAuditModel("categoria Actualizada", _id);

    return res.status(201).send({
      success: true,
      message: "Categoria Actualizada",
      data: categories,
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

    const category = new Category({ ...req.body, createdBy: _id });

    await category.save();

    await saveAuditModel("Categoria Creada", _id);

    const categories = await Category.find({ isDeleted: { $ne: true } });

    return res
      .status(201)
      .send({ success: true, message: "Categoria Creada", data: categories });
  } catch (error) {
    return res
      .status(500)
      .send({ success: false, message: "Error", error: error.message });
  }
});

module.exports = router;
