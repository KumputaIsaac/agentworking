const router = require("express").Router();
const bcrypt = require("bcrypt");
const User = require("../models/user");
const House = require("../models/house");
// const joi = require("joi");
const nodemailer = require("nodemailer");
const {
  uservalidation,
  generateAlphanumeric,
} = require("./controllers/user/user.validation");
const { equal } = require("joi");
const Otp = require("../models/otp");

// register a user
router.post("/register", async (req, res) => {
  try {
    // use joi to chceck if input is correct
    const { error, value } = uservalidation.validate(req.body);
    if (error) {
      throw error.details[0].message;
    }

    // check if user exist in the database
    const existingUser = await User.findOne({
      email: req.body.email,
    }).lean(true);

    if (existingUser) {
      throw "User Already Exists";
    }

    // verify the email
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

    // store otp
    const storeotp = await Otp.create({
      email: req.body.email,
      otp: userotp,
    });

    if (!storeotp) {
      throw "Could not store otp";
    }

    // generate a new password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);

    const newUser = await User.create({
      username: req.body.username,
      email: req.body.email,
      password: hashedPassword,
    });

    if (!newUser) {
      throw "Error Creating User";
    }

    return res.status(200).json("user has been created");
  } catch (error) {
    return res.status(400).json(error);
  }
});

// verify otp
router.post("/verify-otp", async (req, res) => {
  try {
    // get otp from db

    const dbotp = await Otp.findOne({
      email: req.body.email,
    });
    console.log(dbotp);
    // get otp from body
    const otpfrombody = req.body.otp;
    // if thtey re equal, let email to be valid
    if (dbotp.otp != otpfrombody) {
      throw "otp does not match";
    }

    const currentTime = new Date().toISOString();
    if (currentTime > dbotp.expiredAt) {
      console.log("expired");
    }
    // check if otp is not expired
  } catch (error) {}
});

// login
router.post("/login", async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });

    if (!user) {
      throw "user not found";
    }
    const validPassword = await bcrypt.compare(
      req.body.password,
      user.password
    );

    if (!validPassword) {
      throw "wrong username or password, come, you be hacker?";
    }
    res.status(200).json(user);
  } catch (error) {
    res.status(400).json(error);
  }
});

//admin delete all users and post
router.delete("/admindelete", async (req, res) => {
  try {
    if (!req.body.isAdmin) {
      throw "not an admin";
    }
    console.log("here");
    await User.deleteMany({});
    await House.deleteMany({});
    await Otp.deleteMany({});
    return res.status(201).json("cleared all database");
  } catch (error) {
    res.status(500).json(error);
  }
});

module.exports = router;
