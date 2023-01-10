const mongoose = require('mongoose');

const notificationSchema = mongoose.Schema({
  userId: {
    type: mongoose.Types.ObjectId,
    ref: 'users',
  },
  notifications: [
    {
      time: {
        type: Date,
        default: Date.now,
      },
      message: {
        type: String,
        required: true,
      },
    },
  ],
});

const notificationModel = mongoose.model('notifications', notificationSchema);

module.exports = notificationModel;
