const express = require("express");
const router = express.Router();
const { decodedToken } = require("../utils");

const Client = require("../models/client");

router.get("/", async (req, res) => {
  try {
    const clients = await Client.find();

    return res.status(201).send(clients);
  } catch (error) {
    return res.status(500).send({ message: "Error", error: error.message });
  }
});

router.post("/", async (req, res) => {
  try {
    const { _id } = decodedToken(req);

    if (_id) {
      const client = new Client({ ...req.body });

      const newClient = await client.save();

      return res
        .status(201)
        .send({ message: "Cliente creado", data: newClient });
    } else {
      return res.status(500).send({ message: " No autorizado." });
    }
  } catch (error) {
    return res.status(500).send({ message: "Error", error: error.message });
  }
});

module.exports = router;
