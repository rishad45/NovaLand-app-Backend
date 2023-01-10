// models
const { v4: uuidv4 } = require('uuid');
const userModel = require('../Models/userModel');

module.exports = {
  // create a user account
  createAccount: async ({ userName, email, password }) => {
    try {
      return await userModel.create({
        userName,
        email,
        password,
      });
    } catch (err) {
      return err;
    }
  },
  // google signup
  createAccountWithgoogle: async (payload) => {
    try {
      return await userModel.create({
        userName: `${payload.given_name}-${uuidv4()}`,
        email: payload?.email,
        google: true,
      });
    } catch (error) {
      console.log(error);
      return error;
    }
  },

};
