const chatRepo = require('../Repositories/chatRepo');

module.exports = {
  fetchChat: async (req, res) => {
    try {
      console.log('bdy', req.body);
      await chatRepo.getAllChat(req.body).then((result) => {
        console.log('rslt', result);
        res.status(200).send({ chats: result });
      });
    } catch (error) {
      return res.status(500);
    }
    return null;
  },

  sendChat: async (req, res) => {
    try {
      await chatRepo.createChat(req.body).then((reslt) => {
        console.log(reslt);
        return res.status(200);
      });
    } catch (error) {
      return res.status(500);
    }
    return null;
  },
};
