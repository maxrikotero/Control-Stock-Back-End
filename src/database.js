const mongoose = require("mongoose");
const URI = 'mongodb+srv://marisa:YObongo1@cluster0.g9taz.mongodb.net/myFirstDatabase?retryWrites=true&w=majority'
// const URI = "mongodb://127.0.0.1:27017/marisadb";

mongoose
  .connect(URI, { useNewUrlParser: true  })
  .then(() => console.log("Base de datos conectada"))
  .catch((error) => console.error(error));

module.exports = mongoose;
