const Product = require("../models/Product");
const Firm = require("../models/Firm");
const multer = require("multer");
const path = require("path");

// configuring the multer middleware
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/"); // Destination folder where the uploaded images will be stored
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname)); // Generating a unique filename
  },
});

const upload = multer({ storage: storage });

const addProduct = async (req, res) => {
  const { productName, price, description, category, bestseller } = req.body;

  console.log("image file : ", req.file);

  const image = req.file ? req.file.filename : undefined;
  const firmId = req.params.firmId;

  console.log("filename : ", image);

  const firm = await Firm.findById(firmId);
  if (!firm) {
    return res.status(404).json({ success: fasle, message: "Firm not found" });
  }

  try {
    const newProduct = new Product({
      productName,
      price,
      description,
      category,
      bestseller,
      image,
      firm: firmId,
    });

    await newProduct.save();
    firm.products.push(newProduct._id);
    await firm.save();

    res.status(200).json({
      success: true,
      message: "product added successfully",
    });
  } catch (error) {
    console.log("error whlile adding product", error);
    res.status(500).json({
      success: false,
      message: "Error while adding product",
    });
  }
};

const getProductsByFirm = async (req, res) => {
  const firmId = req.params.firmId;
  try {
    const firm = await Firm.findById(firmId);
    if (!firm) {
      return res.status(404).json({
        success: false,
        message: "Firm not found , Invalid firm id",
      });
    }

    const firmName = firm.firmName;
    const products = await Product.find({ firm: firmId });
    res.status(200).json({
      success: true,
      restaurantName: firmName,
      products,
    });
  } catch (error) {
    console.log("Error while getting product");
    res.status(500).json({
      success: false,
      message: "coudn't get product",
      error,
    });
  }
};

const deleteProductById = async (req, res) => {
  const productId = req.params.productId;
  try {
    const deletedProduct = await Product.findByIdAndDelete(productId);
    if (!deletedProduct) {
      return res.status(404).json({
        success: false,
        message: "Product not found , Invalid product id",
      });
    }

    res.status(200).json({
      success: true,
      message: "Product deleted successfully",
      deletedProduct,
    });
  } catch (error) {
    console.log("Error while deleting product : ", error);
    res.status(500).json({
      success: false,
      message: "Couldn't delete product",
      error: error.message,
    });
  }
};

module.exports = {
  addProduct: [upload.single("image"), addProduct],
  getProductsByFirm,
  deleteProductById,
};
