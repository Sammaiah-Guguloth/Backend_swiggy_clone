const mongoose = require("mongoose");

const vendorSchema = mongoose.Schema({
  username: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    trim: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  firm: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Firm",
    },
  ],
});

const Vendor = mongoose.model("Vendor", vendorSchema);

module.exports = Vendor;
