const crypto = require("crypto");

exports.generateOtp = () => {
  return crypto.randomInt(100000, 999999).toString();
};