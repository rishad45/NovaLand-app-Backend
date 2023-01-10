const express = require('express');

const router = express.Router();

const verifyAuth = require('../Middlewares/verifyAuth');
const chatController = require('../Controllers/chatsController');

router.post('/getAllChats', verifyAuth, chatController.fetchChat);

router.post('/sendChat', verifyAuth, chatController.sendChat);
module.exports = router;
