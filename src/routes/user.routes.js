const express = require("express");
const router = express.Router();

// User Model
const User = require("../models/user");

// GET all Users
router.get("/", async (req, res) => {
  console.log("llega get");
  //   const tasks = await User.find();
  res.json("llega");
});

// GET all Tasks
router.get("/:id", async (req, res) => {
  //   const task = await Task.findById(req.params.id);
  res.json({
    firstName: "Yamil",
    dni: 123,
    lastName: "Apellido",
  });
});

// ADD a new user
router.post("/", async (req, res) => {
  console.log(req.body);
  const {
    dni,
    firstName,
    lastName,
    userName,
    email,
    password,
    phone,
  } = req.body;

  const user = new User({
    dni,
    firstName,
    lastName,
    userName,
    email,
    password,
    phone,
    createdOn: new Date(),
    createdBy: "Maxi",
  });
  await user.save();
  res.json({ status: "User Saved" });
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
