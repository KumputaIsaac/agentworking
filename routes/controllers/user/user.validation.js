const joi = require("joi");

const validation = joi.object({
  username: joi.string().alphanum().min(3).max(25).trim(true).required(),
  email: joi.string().email().trim(true).required(),
  password: joi.string().min(8).trim(true).required(),
});

const userValidation = async (req, res, next) => {
  const payload = {
    userName: req.body.userName,
    email: req.body.email,
    password: req.body.password,
  };

  const { error } = validation.validate(payload);
  if (error) {
    res.status(406);
    return res.json(
      errorFunction(true, `Error in User Data : ${error.message}`)
    );
  } else {
    next();
  }
};
module.exports = userValidation;
