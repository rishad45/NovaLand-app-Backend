const notificationModel = require('../Models/notificationModel');

module.exports = {
  getAllNotifications: async (payload) => {
    try {
      return await notificationModel.find(
        { userId: payload.id },
        { notifications: 1 },
      ).sort({ time: -1 });
    } catch (error) {
      return error;
    }
  },
};
