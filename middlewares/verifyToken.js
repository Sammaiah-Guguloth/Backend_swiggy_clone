const Vendor = require("../models/Vendor");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");

dotenv.config();

const verifyToken = async (req, res, next) => {
  const token = req.headers.token;
  console.log("token : ", token);
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const vendor = await Vendor.findById(decoded.vendorId);
    if (!vendor) {
      return res.status(401).json({
        success: false,
        message: "Invalid token",
      });
    }

    req.vendorId = vendor._id;

    next();
  } catch (error) {
    console.log("Error while verifying vendor token ", error);
    res.status(500).json({
      success: false,
      message: "Internal server error, coudn't verify token ",
    });
  }
};

module.exports = verifyToken;
