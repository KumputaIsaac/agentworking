const router = require("express").Router();
const bcrypt = require("bcrypt");
const User = require("../models/user");
const House = require("../models/house");
const { expiredAt } = require("./controllers/user/utils");
const {
  uservalidation,
  sendingotp,
} = require("./controllers/user/user.validation");

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

    // send otp to the email

    const userotp = sendingotp();

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

    // get otp from body
    const otpfrombody = req.body.otp;
    // if thtey re equal,
    if (dbotp.otp != otpfrombody) {
      throw "otp does not match";
    }

    // check if otp is not expired
    const currentTime = new Date().toISOString();
    if (currentTime > dbotp.expiredAt) {
      // resend otp
      const userotp = sendingotp();

      // change otp in the db

      const dbotp = await Otp.findOne({
        email: req.body.email,
      });

      const updatethis = await dbotp.updateOne({
        $set: { otp: userotp, expiredAt: expiredAt() },
      });

      if (!updatethis) {
        throw "could not update otp database";
      }

      return res
        .status(201)
        .json("Otp expired, a new one has been sent to your email");
    }

    //  let email to be valid
    const existingUser = await User.findOne({
      email: req.body.email,
    });

    await existingUser.updateOne({ $set: { validemail: true } });
    return res.status(200).json("the user has been validated");
  } catch (error) {
    return res.status(400).json(error);
  }
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
