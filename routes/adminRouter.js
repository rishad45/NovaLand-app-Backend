const express = require('express');

const router = express.Router();

// controllers
const adminController = require('../Controllers/adminController');
// const { verifyAuth } = require('../Controllers/authController');

router.post('/create-admin', adminController.createAdmin);
router.post('/login', adminController.login);
router.post('/get-data-forHome', adminController.contentForHome);
router.post('/get-all-users', adminController.getAllUsers);
router.post('/get-all-admins', adminController.getAllAdmins);
router.post('/get-all-communities', adminController.getAllCommunities);
router.post('/get-all-blockedUsers', adminController.getAllBlockedUsers);
router.post('/get-all-blockedAdmins', adminController.getAllBlockedAdmins);
router.post('/get-top-posts', adminController.getTopPosts);
router.post('/get-all-reportedPosts', adminController.getAllFlaggedPosts);
// editing routes
router.post('/block-user', adminController.blockUser);
router.post('/block-admin', adminController.blockAdmin);
router.post('/unblock-user', adminController.unblockUser);
router.post('/unblock-admin', adminController.unblockAdmin);
router.post('/delete-post', adminController.deletePost);

module.exports = router;
