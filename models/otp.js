const mongoose = require("mongoose");

var date = new Date();
date.setMinutes(date.getMinutes() + 5);

// now you can get the string
var isodate = date.toISOString();

const OtpSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    max: 50,
    unique: true,
  },

  otp: {
    type: String,
    required: true,
  },
  createdAt: {
    type: String,
    default: new Date().toISOString(),
  },
  expiredAt: {
    type: String,
    default: isodate,
  },
});

module.exports = mongoose.model("otp", OtpSchema);
