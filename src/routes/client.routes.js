const express = require("express");
const router = express.Router();
const { saveAuditModel, decodedToken } = require("../utils");

const Client = require("../models/client");

router.get("/", async (req, res) => {
  try {
    const clients = await Client.find();

    return res.status(201).send(clients);
  } catch (error) {
    return res
      .status(500)
      .send({ success: true, message: "Error", error: error.message });
  }
});

// UPDATE Client
router.put("/:id", async (req, res) => {
  try {
    const { _id } = decodedToken(req);

    const update = {
      name: req.body.name,
      address: req.body.address,
      phone: req.body.phone,
      mobile: req.body.mobile,
      cuil: req.body.cuil,
      description: req.body.description,
      createdBy: _id,
    };

    await Client.findOneAndUpdate({ _id: req.body._id }, update);

    await saveAuditModel("Cliente Actualizado", _id);

    const clients = await Client.find();

    return res.status(201).send({
      success: true,
      message: "Cliente Actualizado",
      data: clients,
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

    if (_id) {
      const client = new Client({ ...req.body });

      const newClient = await client.save();

      await saveAuditModel("cliente creado", _id);

      return res
        .status(201)
        .send({ success: true, message: "Cliente creado", data: newClient });
    } else {
      return res.status(500).send({ message: " No autorizado." });
    }
  } catch (error) {
    return res.status(500).send({ message: "Error", error: error.message });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const { _id } = decodedToken(req);

    const deletedClient = await Client.findById(req.params.id);

    if (deletedClient) await deletedClient.remove();

    await saveAuditModel("Cliente Eliminado", _id);

    const clients = await Client.find();

    return res.status(201).send({
      success: true,
      message: "Cliente Borrado",
      data: clients,
    });
  } catch (error) {
    return res
      .status(500)
      .send({ success: false, message: "Error", error: error.message });
  }
});

module.exports = router;
