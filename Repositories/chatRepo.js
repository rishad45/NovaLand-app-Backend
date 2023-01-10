const { default: mongoose } = require('mongoose');
const chatsModel = require('../Models/chatsModel');

module.exports = {
  getAllChat: async (payload) => {
    console.log(1);
    try {
      const rs = await chatsModel.aggregate(
        [
          {
            $match: {
              receiverId: mongoose.Types.ObjectId(payload.receiverId),
            },
          },
          {
            $project: {
              senderId: 1,
              receiverId: 1,
              _id: 1,
              createdAt: 1,
              message: 1,
              ownedBycurrentUser: {
                $cond: {
                  if: {
                    $eq: [
                      '$senderId', mongoose.Types.ObjectId(payload.id),
                    ],
                  },
                  then: true,
                  else: false,
                },
              },
            },
          }, {
            $lookup: {
              from: 'users',
              localField: 'senderId',
              foreignField: '_id',
              as: 'user',
            },
          }, {
            $unwind: {
              path: '$user',
            },
          }, {
            $project: {
              senderId: 1,
              receiverId: 1,
              _id: 1,
              createdAt: 1,
              message: 1,
              ownedBycurrentUser: 1,
              'user.userName': 1,
              'user.profilePicture': 1,
              'user._id': 1,
            },
          },
        ],
      );
      console.log('rv', rs);
      return rs;
    } catch (error) {
      console.log(error);
      return error;
    }
  },

  createChat: async (payload) => {
    try {
      return await chatsModel.create({
        senderId: payload.id,
        receiverId: payload.receiver,
        message: payload.message,
      });
    } catch (error) {
      return error;
    }
  },
};
