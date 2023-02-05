const bcrypt = require("bcrypt");

const expiredAt = () => {
  var date = new Date();
  date.setMinutes(date.getMinutes() + 5);

  // now you can get the string
  var isodate = date.toISOString();
  return isodate;
};

const hashedPassword = async (password) => {
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);
  return hashedPassword;
};

module.exports.expiredAt = expiredAt;
module.exports.hashedPassword = hashedPassword;
