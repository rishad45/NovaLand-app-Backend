const jwt = require('jsonwebtoken');

const createRefreshToken = (payload) => {
  console.log(2);
  return jwt.sign({
    // eslint-disable-next-line no-underscore-dangle
    id: payload._id,
    userName: payload.userName,
    email: payload.email,
  }, process.env.JWT_REFRESH_SECRET, {
    expiresIn: '1d',
  });
};

module.exports = createRefreshToken;
