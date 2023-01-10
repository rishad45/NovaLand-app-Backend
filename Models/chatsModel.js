const mongoose = require('mongoose');

const chatsSchema = mongoose.Schema({
  senderId: {
    type: mongoose.Types.ObjectId,
    ref: 'users',
  },
  receiverId: {
    type: mongoose.Types.ObjectId,
    ref: 'communities',
  },
  message: {
    type: String,
  },
}, { timestamps: true });

const chatsModel = mongoose.model('chats', chatsSchema);

module.exports = chatsModel;
