/* eslint-disable no-underscore-dangle */
const jwt = require('jsonwebtoken');

const createAccessToken = (payload) => {
  console.log('we have to check her', payload);
  return jwt.sign(
    {
      id: payload._id,
      userName: payload.userName,
      email: payload.email,
    },
    process.env.JWT_ACCESS_SECRET,
    {
      expiresIn: '1h',
    },
  );
};

module.exports = createAccessToken;
