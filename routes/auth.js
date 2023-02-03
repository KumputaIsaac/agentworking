const router = require("express").Router();
const bcrypt = require("bcrypt");
const User = require("../models/user");
const House = require("../models/house");
const joi = require("joi");

const uservalidation = joi.object({
  username: joi.string().alphanum().min(3).max(25).trim(true).required(),
  email: joi.string().email().trim(true).required(),
  password: joi.string().min(8).trim(true).required(),
});

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

// login
router.post("/login", async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });

    if (!user) {
      res.status(404).send("user not found");
    } else {
      const validPassword = await bcrypt.compare(
        req.body.password,
        user.password
      );
      if (!validPassword) {
        res.status(404).json("wrong password");
      } else {
        res.status(200).json(user);
      }
    }
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
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
    return res.status(201).json("cleared all database");
  } catch (error) {
    res.status(500).json(error);
  }
});

module.exports = router;
