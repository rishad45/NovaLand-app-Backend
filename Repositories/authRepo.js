// models
const userModel = require('../Models/userModel')

module.exports = {
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
    }
}