const router = require("express").Router();
const bcrypt = require("bcrypt");
const User = require("../models/user");

var validateEmail = function (email) {
  var re = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
  return re.test(email);
};

// register a user
router.post("/register", async (req, res) => {
  try {
    const existingUser = await User.findOne({
      email: req.body.email,
    }).lean(true);
    if (existingUser) {
      res.status(403);
      return res.json(errorFunction(true, "User Already Exists"));
    } else {
      // generate a new password
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(req.body.password, salt);
      const newUser = await User.create({
        userName: req.body.userName,
        email: req.body.email,
        password: hashedPassword,
      });
      if (newUser) {
        res.status(201);
        return res.json(errorFunction(false, "User Created", newUser));
      } else {
        res.status(403);
        return res.json(errorFunction(true, "Error Creating User"));
      }
    }
  } catch (error) {
    res.status(400);
    console.log(error);
    return res.json(errorFunction(true, "Error Adding user"));
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

    // !user && res.status(404).send("user not found");

    // !validPassword &&
    // res.status(200).json(user);
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
});

module.exports = router;
