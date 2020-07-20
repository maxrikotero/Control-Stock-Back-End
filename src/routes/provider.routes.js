const express = require("express");
const router = express.Router();

// Provider Model
const Provider = require("../models/provider");

// GET all Providers
router.get("/", async (req, res) => {
  const providers = await Provider.find();
  res.json(providers);
});

// GET provider
router.get("/:id", async (req, res) => {
  const provider = await Provider.findById(req.params.id);
  res.json(provider);
});

// ADD a new provider
router.post("/", async (req, res) => {
  const { socialId, dni, brand, phone, mobile, email } = req.body;

  const provider = new Provider({ socialId, dni, brand, phone, mobile, email });
  await provider.save();
  res.json({ status: "Provider Saved" });
});

// UPDATE a provider
router.put("/:id", async (req, res) => {
  const { socialId, dni, brand, phone, mobile, email } = req.body;
  const newProvider = { socialId, dni, brand, phone, mobile, email };
  await Provider.findByIdAndUpdate(req.params.id, newProvider);
  res.json({ status: "Provider Updated" });
});

router.delete("/:id", async (req, res) => {
  await Provider.findByIdAndRemove(req.params.id);
  res.json({ status: "Provider Deleted" });
});

module.exports = router;
