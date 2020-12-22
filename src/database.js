const mongoose = require("mongoose");
const URI = "mongodb://127.0.0.1:27017/marisadb";

mongoose
  .connect(URI, { useNewUrlParser: true })
  .then(() => console.log("Base de datos conectada"))
  .catch((error) => console.error(error));

module.exports = mongoose;
