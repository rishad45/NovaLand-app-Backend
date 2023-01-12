const express = require('express');

const router = express.Router();

const multer = require('multer');

const storage = multer.memoryStorage();
const upload = multer({ storage });

// controllers
const authController = require('../Controllers/authController');
const userController = require('../Controllers/userController');
const communityController = require('../Controllers/communityController');
const notificationsController = require('../Controllers/notificationController');
// middlewares
const verifyAuth = require('../Middlewares/verifyAuth');

// ........... authentication based api's 🔒🗝️...........

router.post('/userSignup', authController.userSignup);

router.post('/login', authController.userLogin);

router.post('/refresh', authController.refresh);

router.post('/logout', verifyAuth, authController.logout);

router.post('/signup-google', authController.googleSignup);

router.post('/login-with-google', authController.userLoginwithGoogle);

router.post('/verifyToken', authController.verifyToken);

router.post('/changePassword', authController.changePassword);
// router.post('/get-user',verifyAuth,userController.getuser)

router.post('/verifyAuth', verifyAuth, authController.verifyAuth);

// user based api s...........👤👤👤......................................

router.post('/get-user-info', verifyAuth, userController.getUserInfo);

router.post('/get-userProfile', verifyAuth, userController.getUserProfilepic);

router.post('/edit-user-profile', verifyAuth, userController.editUserProfile);

router.post('/search', verifyAuth, userController.search);

// ........👩‍👩‍👧‍👧👩‍👩‍👧‍👧👩‍👩‍👧‍👧.... community based api's........👩‍👩‍👧‍👧👩‍👩‍👧‍👧👩‍👩‍👧‍👧.............

router.post('/create-community', verifyAuth, userController.createCommunity);

router.get('/get-all-communities', verifyAuth, userController.getAllCommunities);

router.get('/get-user-communities', verifyAuth, userController.getUserCommunities);

router.get('/get-recommended-communities', verifyAuth, userController.getRecommendedCommunities);

router.post('/joinInCommunity', verifyAuth, userController.joinInCommunity);

router.post('/community-info', verifyAuth, userController.getCommunityInfoById);

router.post('/update-profilePicture', upload.single('image'), verifyAuth, communityController.uploadProfile);

router.post('/create-post', upload.single('image'), verifyAuth, communityController.createPost);

router.post('/get-communityPost-images', verifyAuth, communityController.getCommunityPostImages);

router.post('/get-community-posts', verifyAuth, communityController.getCommunityPosts);

router.post('/leave-community', verifyAuth, communityController.leaveCommunity);

router.post('/get-posts-ofUser', verifyAuth, userController.postsInHome);

router.post('/like-post', verifyAuth, userController.likePost);

router.post('/unlike-post', verifyAuth, userController.unlikePost);

router.post('/save-post', verifyAuth, userController.savePost);

router.post('/isSaved', verifyAuth, userController.isPostSaved);

router.post('/unsave-post', verifyAuth, userController.unsavePost);

router.post('/delete-post', verifyAuth, userController.deletePost);

router.post('/add-a-comment', verifyAuth, userController.addAComment);

router.post('/get-comments-of-post', verifyAuth, communityController.getPostComments);

router.post('/like-this-comment', verifyAuth, userController.likeComment);

router.post('/unlike-this-comment', verifyAuth, userController.unlikeComment);

router.post('/delete-this-comment', verifyAuth, userController.deleteComment);

router.post('/report-this-comment', verifyAuth, userController.reportComment);

router.post('/report-this-post', verifyAuth, userController.reportPost);

router.get('/report-contents', userController.reportContents);

// notifications router
router.post('/get-user-notifications', verifyAuth, notificationsController.getAllNotifications);

router.post('/send-notification', verifyAuth, notificationsController.sendNotification);

router.post('/subscribe', authController.subscribe);

module.exports = router;
