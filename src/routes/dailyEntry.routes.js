const express = require("express");
const router = express.Router();
const { saveAuditModel, decodedToken } = require("../utils");

const DailyEntry = require("../models/dailyEntry");

router.get("/", async (req, res) => {
  const dailyEntryList = await DailyEntry.find();

  return res.json(dailyEntryList);
});

router.delete("/:id", async (req, res) => {
  try {
    const { _id } = decodedToken(req);

    await DailyEntry.findByIdAndRemove(req.params.id);

    await saveAuditModel("Daria Borrada", _id);

    const categories = await DailyEntry.find();

    return res.status(201).send({
      success: true,
      message: "Diaria Borrada",
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

    await DailyEntry.findByIdAndUpdate(req.body._id, { ...req.body });

    const categories = await DailyEntry.find();

    await saveAuditModel("Diaria Actualizada", _id);

    return res.status(201).send({
      success: true,
      message: "Diaria Actualizada",
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

    const dailyEntry = new DailyEntry({ ...req.body, createdBy: _id });

    await dailyEntry.save();

    await saveAuditModel("Diaria Creada", _id);

    const categories = await DailyEntry.find();

    return res
      .status(201)
      .send({ success: true, message: "Diaria Creada", data: categories });
  } catch (error) {
    return res
      .status(500)
      .send({ success: false, message: "Error", error: error.message });
  }
});

module.exports = router;
