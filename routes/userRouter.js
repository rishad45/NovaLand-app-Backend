const express = require('express')
const router = express.Router()


const multer = require('multer') 
const storage = multer.memoryStorage() 
const upload = multer({storage}) 


// controllers
const authController = require('../Controllers/authController') 
const userController = require('../Controllers/userController')
const communityController = require('../Controllers/communityController') 
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

router.post('/community-info',verifyAuth,userController.getCommunityInfoById) 

router.post('/update-profilePicture',verifyAuth,userController.updateProfilePicture)

router.post('/create-post',upload.single('image'),verifyAuth,communityController.createPost)     

router.post('/get-communityPost-images',verifyAuth,communityController.getCommunityPostImages)   

router.post('/leave-community',verifyAuth, communityController.leaveCommunity)  

router.post('/get-posts-ofUser', verifyAuth, userController.postsInHome)  

router.post('/like-post', verifyAuth, userController.likePost) 

router.post('/unlike-post', verifyAuth, userController.unlikePost)

router.post('/delete-post', verifyAuth, userController.deletePost) 

router.post('/add-a-comment',verifyAuth,userController.addAComment)  

router.post('/get-comments-of-post', verifyAuth, communityController.getPostComments)

router.post('/delete-this-comment', verifyAuth, userController.deleteComment) 

router.post('/report-this-comment',verifyAuth, userController.reportComment) 

router.get('/report-contents',userController.reportContents)



module.exports = router 