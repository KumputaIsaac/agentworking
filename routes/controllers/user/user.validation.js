const joi = require("joi");

const uservalidation = joi.object({
  username: joi.string().alphanum().min(3).max(25).trim(true).required(),
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

const now = () => {
  console.log("now");
};

module.exports.uservalidation = uservalidation;
module.exports.generateAlphanumeric = generateAlphanumeric;
module.exports.now = now;
