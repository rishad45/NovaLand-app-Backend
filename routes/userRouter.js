const express = require('express')
const router = express.Router()

// controllers
const authController = require('../Controllers/authController') 
const userController = require('../Controllers/userController')

// middlewares
const verifyAuth = require('../Middlewares/verifyAuth') 


//........... authentication based api's ...........

router.post('/userSignup',authController.userSignup) 

router.post('/login',authController.userLogin)

router.post('/refresh',authController.refresh) 

// router.post('/get-user',verifyAuth,userController.getuser) 

router.post('/verifyAuth',verifyAuth,authController.verifyAuth) 

//............ community based api's..........................
router.post('/create-community',verifyAuth,userController.createCommunity)  

router.get('/get-all-communities', verifyAuth, userController.getAllCommunities) 

router.get('/get-user-communities', verifyAuth, userController.getUserCommunities) 

router.get('/get-recommended-communities', verifyAuth, userController.getRecommendedCommunities) 

router.post('/joinInCommunity',verifyAuth,userController.joinInCommunity) 




module.exports = router