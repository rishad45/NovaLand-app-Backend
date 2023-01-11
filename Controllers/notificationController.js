const notificationsRepo = require('../Repositories/notificationRepo');

module.exports = {
  getAllNotifications: async (req, res) => {
    try {
      await notificationsRepo.getAllNotifications(req.body).then((result) => {
        console.log(result);
        return res.status(200).send({ message: 'notifications fetched', success: true, notifications: result[0].notifications });
      });
    } catch (error) {
      return res.status(500);
    }
    return null;
  },

  sendNotification: async (req, res) => {
    try {
      console.log('bdf', req.body);
      await notificationsRepo.sendNotification(req.body)
        .then((result) => res.status(200).send({ message: 'notification send', result }));
    } catch (error) {
      return res.status(500);
    }
    return null;
  },
};
