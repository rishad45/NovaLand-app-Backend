const express = require('express')
const router = express.Router()

// controllers
const authController = require('../Controllers/authController') 
const userController = require('../Controllers/userController')


router.post('/userSignup',authController.userSignup) 


module.exports = router