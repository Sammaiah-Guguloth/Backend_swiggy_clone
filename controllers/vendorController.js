const Vendor = require("../models/Vendor");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const dotenv = require("dotenv");

dotenv.config();

const vendorRegister = async (req, res) => {
  const { username, email, password } = req.body;
  try {
    const vendorEmail = await Vendor.findOne({ email });
    if (vendorEmail) {
      return res.status(400).json({
        status: false,
        messsage: "Vendor already registered with this email",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newVendor = new Vendor({
      username,
      email,
      password: hashedPassword,
    });
    await newVendor.save();

    res.status(201).json({
      success: true,
      message: "Vendor registered successfully",
    });

    console.log("Vendor registered successfully");
  } catch (error) {
    console.log("Error while registering vendor", error);
    res.status(500).json({
      success: false,
      error,
      message: "Internal server error",
    });
  }
};

const vendorLogin = async (req, res) => {
  const { email, password } = req.body;
  try {
    const vendor = await Vendor.findOne({ email });
    if (!vendor) {
      return res.status(401).json({
        success: false,
        message: "Vendor not registered",
      });
    }
    if (!(await bcrypt.compare(password, vendor.password))) {
      return res.status(401).json({
        success: false,
        message: "wrong password",
      });
    }

    // creating the jwt
    const token = jwt.sign({ vendorId: vendor._id }, process.env.JWT_SECRET, {
      expiresIn: "2h",
    });

    res.status(200).json({
      success: true,
      token,
      message: "Vendor logged in successfully",
    });
  } catch (error) {
    console.log("Error while vendor login : ", error);
    res.status(500).json({
      success: false,
      error,
      messsae: "Internal server error",
    });
  }
};

const getAllVendors = async (req, res) => {
  try {
    const vendors = await Vendor.find().populate("firm");
    res.status(200).json({
      success: true,
      vendors,
    });
  } catch (error) {
    console.log("Error while getting all vendors : ", error);
    res.status(500).json({
      success: false,
      message: "couldn't get all vendors",
    });
  }
};

const getVendorById = async (req, res) => {
  const vendorId = req.params.id;
  try {
    const vendor = await Vendor.findById(vendorId).populate("firm");

    if (!vendor) {
      return res.status(404).json({
        success: false,
        message: "Vendor not found",
      });
    }

    res.status(200).json({
      success: true,
      vendor,
    });
  } catch (error) {
    console.log("Error while getting vendor by id : ", error);
    res.status(500).json({
      success: false,
      message: "coundn't get vendor by id",
    });
  }
};

module.exports = { vendorRegister, vendorLogin, getAllVendors, getVendorById };
