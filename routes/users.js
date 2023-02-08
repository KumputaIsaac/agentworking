const router = require("express").Router();
const User = require("../models/user.js");
const bcrypt = require("bcrypt");
const { hashedPassword } = require("./controllers/user/utils.js");
const {
  validatenewpassword,
} = require("./controllers/user/user.validation.js");

// get a user
router.get("/", async (req, res) => {
  try {
    const userId = req.query.userId;
    const username = req.query.username;

    const user = userId
      ? await User.findById(userId)
      : await User.findOne({ username: username });

    if (!user) {
      throw " user does not exist";
    }

    return res.status(200).json(user);
  } catch (error) {
    return res.status(400).json(error);
  }
});

// update a user
router.put("/:id", async (req, res) => {
  try {
    if (req.body.userId !== req.params.id || !req.body.isAdmin) {
      throw "unauthorized to update user";
    }

    // change password
    if (req.body.password) {
      validatenewpassword.validate(req.body.password);
      req.body.password = await hashedPassword(req.body.password);
    }

    // update user
    const user = await User.findByIdAndUpdate(req.params.id, {
      $set: req.body,
    });

    if (!user) {
      throw "no user";
    }

    return res.status(200).json("account has been updated");
  } catch (error) {
    res.status(500).json(error);
  }
});

// delete a user
router.delete("/:id", async (req, res) => {
  try {
    if (req.body.userId !== req.params.id || !req.body.isAdmin) {
      throw "unauthorized to delete this account";
    }

    const user = await User.findByIdAndDelete(req.params.id);

    if (!user) {
      throw "user does not exist";
    }
  } catch (error) {
    return res.status(403).json(error);
  }
});

module.exports = router;
