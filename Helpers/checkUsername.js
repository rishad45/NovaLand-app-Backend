const userModel = require('../Models/userModel');

const checkUsername = async (username) => {
  try {
    const info = await userModel.findOne({ userName: username }, { _id: 0, userName: 1 });
    console.log('info', info);
    if (info) return false;
    return true;
  } catch (error) {
    return error;
  }
};

module.exports = checkUsername;
