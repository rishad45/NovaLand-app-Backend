const notificationModel = require('../Models/notificationModel');

module.exports = {
  getAllNotifications: async (payload) => {
    console.log('apyyy', payload);
    try {
      return await notificationModel.find(
        { userId: payload.id },
        { notifications: 1 },
      ).sort({ 'notifications.time': 1 });
    } catch (error) {
      return error;
    }
  },

  sendNotification: async (payload) => {
    try {
      console.log('pay1', payload);
      const message = {
        message: payload.message,
        time: Date.now(),
      };
      return await notificationModel.updateOne(
        { userId: payload.userId },
        { $push: { notifications: message } },
        { upsert: true },
      );
    } catch (error) {
      console.log('err', error);
      return error;
    }
  },
};
