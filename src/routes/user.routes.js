const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const User = require("../models/user");
const Audit = require("../models/audit");
const { saveAuditModel, decodedToken } = require("../utils");

router.delete("/:id", async (req, res) => {
  try {
    const { _id } = decodedToken(req);

    const deletedUser = await User.findById(req.params.id);

    if (deletedUser) await deletedUser.remove();

    await saveAuditModel("Usuario Eliminado", _id);

    return res.status(201).send({
      success: true,
      message: "Usuario Borrado",
    });
  } catch (error) {
    return res
      .status(500)
      .send({ success: false, message: "Error", error: error.message });
  }
});

// Signin
router.post("/signin", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      res.status(404).send({
        success: false,
        message: "Usuario no existe",
      });
    } else {

      if (password !== user.password)
        res.status(404).send({
          success: false,
          message: "Contraseña Invalida",
        });

      const token = jwt.sign({ _id: user._id }, "secretkey", {
        expiresIn: "1d",
      });

      res.status(200).json({
        success: true,
        token,
        userSession: user,
      });
    }
  } catch (error) {
    return res.status(500).send({ message: "Error", error: error.message });
  }
});

// GET all Users
router.get("/", async (req, res) => {
  try {
    const users = await User.find();
    return res.status(201).send(users);
  } catch (error) {
    return res.status(500).send("Error");
  }
});

// GET all Audits
router.get("/audit", async (req, res) => {
  try {
    const audits = await Audit.find().populate({
      path: "createdBy",
      select: "firstName lastName",
    });
    return res.status(201).send(audits);
  } catch (error) {
    return res.status(500).send("Error");
  }
});

// GET User session
router.get("/userdata", async (req, res) => {
  try {
    const { _id } = decodedToken(req);
    const user = await User.findById({ _id });
    return res.status(201).send(user);
  } catch (error) {
    return res.status(500).send("Error");
  }
});

// GET User
router.get("/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    res.status(200).json({
      success: true,
      data: user,
    });
  } catch (error) {
    return res.status(500).send({ message: "Error", error: error.message });
  }
});

// ADD a new user
router.post("/", async (req, res) => {
  try {
    const { _id } = decodedToken(req);
    const role = parseInt(req.body.role, 10);
    const roles = {
      isAdmin: role === 1,
      isSeller: role === 2,
      isControlStock: role === 3,
      isSecretary: role === 4,
    };
    const user = new User({
      ...req.body,
      createdBy: _id,
      ...roles,
    });

    await user.save();

    await saveAuditModel("Usuario Creado", _id);

    res.status(201).send({ success: true, status: "User Saved" });
  } catch (error) {
    return res
      .status(500)
      .send({ success: false, message: "Error", error: error.message });
  }
});

// UPDATE a user
router.put("/:id", async (req, res) => {
  try {
    const { _id } = decodedToken(req);

    const role = req.body.role;

    const roles = {
      isAdmin: role === "Administrador",
      isSeller: role === "Vendedor",
      isControlStock: role === "Control de stock",
    };

    const update = {
      dni: req.body.dni,
      cuil: req.body.cuil,
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      userName: req.body.userName,
      email: req.body.email,
      phone: req.body.phone,
      mobile: req.body.mobile,
      ...roles,
    };
    const user = new User();

    if (req.body.isPasswordChange)
      update.password = await user.encryptPassword(req.body.password);

    const updatedUser = await User.findOneAndUpdate(
      { _id: req.body._id },
      update
    );

    await saveAuditModel("Usuario Actualizado", _id);

    return res.status(201).send({
      success: true,
      message: "Usuario Actualizado",
      data: updatedUser,
    });
  } catch (error) {
    return res
      .status(500)
      .send({ success: false, message: "Error", error: error.message });
  }
});

module.exports = router;
