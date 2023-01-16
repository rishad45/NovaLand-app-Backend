const chatRepo = require('../Repositories/chatRepo');

const getSignedUrl = require('../Config/s3').getImagesBykeys;

module.exports = {
  fetchChat: async (req, res) => {
    try {
      console.log('bdy', req.body);
      const result = await chatRepo.getAllChat(req.body);
      console.log('rslt', result);
      const promises = [];
      for (let i = 0; i < result.length; i += 1) {
        promises.push(getSignedUrl(result[i].user.profilePicture));
      }
      const images = await Promise.all(promises);
      for (let i = 0; i < images.length; i += 1) {
        result[i].image = images[i];
      }
      res.status(200).send({ chats: result });
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
