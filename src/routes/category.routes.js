const express = require("express");
const router = express.Router();

const Category = require("../models/category");

router.get("/", async (req, res) => {
  const categoryList = await Category.find();

  return res.json(categoryList);
});

router.post("/", async (req, res) => {
  const category = new Category({ ...req.body });

  const newCategory = await category.save();

  if (newCategory) {
    return res
      .status(201)
      .send({ message: "Categoria Creada", data: newCategory });
  } else {
    return res.status(500).send({ message: " Error Creando la categoria." });
  }
});

module.exports = router;
