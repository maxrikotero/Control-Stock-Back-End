const express = require("express");
const morgan = require("morgan");
const path = require("path");
var cors = require("cors");

const app = express();

// Db connection
// const { mongoose } = require('./database');

// Settings
app.set("port", process.env.PORT || 3000);

// Middlewares
app.use(morgan("dev"));
app.use(express.json());
app.use(cors());
// Routes
app.use("/api/tasks", require("./routes/task.routes"));
app.use("/api/users", require("./routes/user.routes"));

// Static Files
app.use(express.static(path.join(__dirname, "public")));

// Starting the server
app.listen(app.get("port"), () => {
  console.log(`Server on port ${app.get("port")}`);
});
