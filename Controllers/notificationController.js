const notificationsRepo = require('../Repositories/notificationRepo');

module.exports = {
  getAllNotifications: async (req, res) => {
    try {
      await notificationsRepo.getAllNotifications(req.body).then((result) => res.status(200).send({ message: 'notifications fetched', success: true, notifications: result }));
    } catch (error) {
      return res.status(500);
    }
    return null;
  },
};
