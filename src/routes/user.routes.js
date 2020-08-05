const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
// const bcrypt = require("bcrypt");
// User Model
const User = require("../models/user");
const { isAuth, decodedToken } = require("../utils");

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
      const validPassword = await user.validatePassword(password);

      if (!validPassword)
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
  console.log("llega get");
  //   const tasks = await User.find();
  res.json("llega");
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

// GET all Tasks
router.get("/:id", async (req, res) => {
  const user = await Task.findById(req.params.id);

  return res.status(201).send({ user });
});

// ADD a new user
router.post("/", async (req, res) => {
  try {
    const { _id } = decodedToken(req);
    const user = new User({
      dni: req.body.dni,
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      userName: req.body.userName,
      email: req.body.email,
      password: req.body.password,
      phone: req.body.phone,
      createdBy: _id,
    });
    user.password = await user.encryptPassword(req.body.password);

    await user.save();

    res.json({ status: "User Saved" });
  } catch (error) {
    return res.status(500).send({ message: "Error", error: error.message });
  }
});

// UPDATE a new task
router.put("/:id", async (req, res) => {
  const {
    dni,
    firstName,
    lastName,
    userName,
    email,
    password,
    phone,
  } = req.body;
  const updateUser = {
    dni,
    firstName,
    lastName,
    userName,
    email,
    password,
    phone,
  };
  console.log("llega post");
  //   await User.findByIdAndUpdate(req.params.id, updateUser);
  //   res.json({ status: "User Updated" });
});

// router.delete("/:id", async (req, res) => {
//   await Task.findByIdAndRemove(req.params.id);
//   res.json({ status: "Task Deleted" });
// });

module.exports = router;
