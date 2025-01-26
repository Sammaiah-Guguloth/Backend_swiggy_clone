const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  productName: {
    type: String,
    required: true,
    trim: true,
  },
  price: {
    type: String,
    required: true,
  },
  category: {
    type: [
      {
        type: String,
        enum: ["veg", "nog-veg"],
      },
    ],
  },
  bestseller: {
    type: Boolean,
  },
  description: {
    type: String,
  },
  firm: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Firm",
    required: true,
  },
});

const Product = mongoose.model("Product", productSchema);

module.exports = Product;
