const nodemailer = require("nodemailer");
const joi = require("joi");

const uservalidation = joi.object({
  username: joi.string().alphanum().min(3).max(25).trim(true).required(),
  email: joi.string().email().trim(true).required(),
  password: joi.string().min(8).trim(true).required(),
});

const validatenewpassword = joi.object({
  newpassword: joi.string().min(8).trim(true).required(),
});

const loginvalidation = joi.object({
  email: joi.string().email().trim(true).required(),
  password: joi.string().min(8).trim(true).required(),
});

function generateAlphanumeric() {
  let result = "";
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  for (let i = 0; i < 6; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
}

const sendingotp = () => {
  // create otp
  const userotp = generateAlphanumeric();
  // send otp

  let mailTransporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.user,
      pass: process.env.pass,
    },
  });

  let mailDetails = {
    from: "Agent App",
    to: "kumputaisaac@gmail.com",
    subject: "Verify your Email",
    subject: "Email verification Agent App",
    html: `<p>You requested for email verification, your otp is
        <b> ${userotp} </b> link</a> to verify your email address</p>`,
  };

  mailTransporter.sendMail(mailDetails, function (err, data) {
    if (err) {
      throw "Error Occurs in sending email";
    } else {
      throw "Email sent successfully";
    }
  });

  return userotp;
};

module.exports.uservalidation = uservalidation;
module.exports.validatenewpassword = validatenewpassword;
module.exports.loginvalidation = loginvalidation;
module.exports.generateAlphanumeric = generateAlphanumeric;
module.exports.sendingotp = sendingotp;
