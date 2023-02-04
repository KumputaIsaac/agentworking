const mongoose = require("mongoose");
const { expiredAt } = require("../routes/controllers/user/utils");

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
    default: expiredAt(),
  },
});

module.exports = mongoose.model("otp", OtpSchema);
