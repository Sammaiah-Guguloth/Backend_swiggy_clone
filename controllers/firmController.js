const Vendor = require("../models/Vendor");
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

const addFirm = async (req, res) => {
  const { firmName, area, category, region, offer } = req.body;
  console.log("req body : ", req.body);
  console.log("file : ", req.file);
  const file = req.file ? req.file.filename : undefined;
  console.log("filename : ", file);
  try {
    const vendor = await Vendor.findById(req.vendorId);
    if (!vendor) {
      return res.status(404).json({
        success: false,
        message: "Vendor not found ",
      });
    }

    if (vendor.firm.length > 0) {
      return res.status(400).json({
        success: false,
        message: "vendor can have only one firm",
      });
    }

    const newFirm = new Firm({
      firmName,
      area,
      category,
      region,
      offer,
      image: file,
    });
    newFirm.vendor.push(vendor._id);

    const savedFirm = await newFirm.save();
    vendor.firm.push(savedFirm._id);

    await vendor.save();

    res.status(200).json({
      success: true,
      message: "Firm added successfully",
      firmId: savedFirm._id,
    });
  } catch (error) {
    console.log("error while adding the firm : ", error);
    return res.status(500).json({
      success: false,
      message: "coudn't add the firm",
    });
  }
};

const deleteFirmById = async (req, res) => {
  const firmId = req.params.firmId;
  try {
    const deletedFirm = await Firm.findByIdAndDelete(firmId);
    if (!deletedFirm) {
      return res.status(404).json({
        success: false,
        message: "Firm not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Firm deleted successfully",
    });
  } catch (error) {
    console.log("Error while deleting the firm : ", error);
    res.status(500).json({
      sucess: false,
      message: "coudn't delete the firm",
    });
  }
};

module.exports = { addFirm: [upload.single("image"), addFirm], deleteFirmById };
