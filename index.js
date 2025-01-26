const express = require("express");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const vendorRoutes = require("./routes/vendorRoutes");
const firmRoutes = require("./routes/firmRoutes");
const productRoutes = require("./routes/productRoutes");
const bodyParser = require("body-parser");
const cors = require("cors");
const path = require("path");

const app = express();
dotenv.config();
app.use(bodyParser.json());
app.use(cors());

const PORT = process.env.PORT || 4000;

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("Database connected successfully"))
  .catch((error) => console.log("Error connecting to database:", error));

app.use("/vendor", vendorRoutes);
app.use("/firm", firmRoutes);
app.use("/product", productRoutes);
app.use("/uploads", express.static("uploads"));

app.listen(PORT, () => {
  console.log(`Server started and running successfully on port : ${PORT}`);
});

app.get("/", (req, res) => {
  res.send("<h1> Welcome to Swiggy Clone API by Sammaiah Guguloth</h1>");
});
