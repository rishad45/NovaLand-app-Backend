const userModel = require('../Models/userModel') 
module.exports = {
    checkUsername : async(payload) => {
        try{
            return await userModel.findOne({userName : payload}) 
        }catch(err){
            return 
        }
    },
    checkEmail : async(payload) => {
        try{
            return await userModel.findOne({email : payload})
        }catch(err){
            return 
        }
    }
}