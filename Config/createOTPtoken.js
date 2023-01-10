const jwt = require('jsonwebtoken');

const createOTPtoken = (payload) => jwt.sign({
  email: payload,
}, process.env.JWT_OTP_SECRET, {
  expiresIn: '5m',
});

module.exports = createOTPtoken;
