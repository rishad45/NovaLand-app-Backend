const express = require('express');

const router = express.Router();

// controller
const emailControler = require('../Controllers/emailController');

router.post('/sendWelcome', emailControler.sendWelcomeEmail);

router.post('/sendOtp', emailControler.sendOTP);

module.exports = router;
