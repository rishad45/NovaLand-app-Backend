//Repositories
const userRepo = require('../Repositories/userRepo')
const authRepo = require('../Repositories/authRepo')
//modules
const bcrypt = require('bcrypt') 

module.exports = {
    userSignup: async (req, res) => {
        console.log(req.body)
        const isUserExist = await userRepo.checkUsername(req.body.userName)
        const isEmailExist = await userRepo.checkEmail(req.body.email)
        if (isUserExist) {
            res.status(200).send({ message: 'Username is already been taken', success: false })
        } else if (isEmailExist) {
            res.status(200).send({ message: "Email has already been taken", success: false })
        } else {
            const{password} = req.body
            req.body.password = await bcrypt.hash(password,10) 
            
            await authRepo.createAccount(req.body).then(() => {
                res.status(200).send({ message: "user created succesfully", success: true }) 
            }) 
        }
    }
}