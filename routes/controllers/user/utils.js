const expiredAt = () => {
  var date = new Date();
  date.setMinutes(date.getMinutes() + 5);

  // now you can get the string
  var isodate = date.toISOString();
  return isodate;
};

module.exports.expiredAt = expiredAt;
