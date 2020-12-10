const express = require("express");
const fs = require("fs");
const morgan = require("morgan");
const path = require("path");
var cors = require("cors");

const app = express();

// Db connection
const { mongoose } = require("./database");

// Settings
app.set("port", process.env.PORT || 3000);

// Middlewares
app.use(morgan("dev"));
app.use(express.json());
app.use(cors());
// Routes
app.use("/api/users", require("./routes/user.routes"));
app.use("/api/products", require("./routes/product.routes"));
app.use("/api/providers", require("./routes/provider.routes"));
app.use("/api/sales", require("./routes/sales.routes"));
app.use("/api/clients", require("./routes/client.routes"));
app.use("/api/categories", require("./routes/category.routes"));
app.use("/api/payments", require("./routes/payments.routes"));
app.use("/api/balance", require("./routes/balance.routes"));
app.use("/api/pricetype", require("./routes/priceTypes.routes"));
app.use("/api/process", require("./routes/process.routes"));
app.use("/api/rawmaterial", require("./routes/rawMaterial.routes"));
app.use("/api/orders", require("./routes/orderProvider.routes"));
app.use("/api/delivery", require("./routes/deliveryProvider.routes"));

app.get("/api/fetch-pdf/:id", (req, res) => {
  res.sendFile(
    `${__dirname}/documents/tickets/sale${req.params.id}.pdf`,
    (err) => {
      if (err) {
        res.status(err.status).end();
      }
    }
  );
});

// Static Files
app.use(express.static(path.join(__dirname, "public")));

// Starting the server
app.listen(app.get("port"), () => {
  console.log(`Server on port ${app.get("port")}`);
});
