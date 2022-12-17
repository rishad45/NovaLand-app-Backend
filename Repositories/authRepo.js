// models
const userModel = require('../Models/userModel')

module.exports = {
    // create a user account
    createAccount: async ({ userName, email, password }) => {
        try {
            return await userModel.create({
                userName,
                email,
                password
            })
        }catch(err){
            return
        }
    },

    // check login credentials
    // validateLogin : async({userName,password}) => {

    // }

}