const { default: mongoose } = require('mongoose');
const communityModel = require('../Models/communityModel');
const postModel = require('../Models/postModel');
const userModel = require('../Models/userModel');

const checkUsername = require('../Helpers/checkUsername');

module.exports = {
  checkUsername: async (payload) => {
    try {
      return await userModel.findOne({ userName: payload });
    } catch (err) {
      return err;
    }
  },
  checkEmail: async (payload) => {
    try {
      return await userModel.findOne({ email: payload });
    } catch (err) {
      return err;
    }
  },
  getuser: async (email) => {
    try {
      return userModel.findOne({ email });
    } catch (error) {
      return error;
    }
  },
  // for getting posts in home
  getPostsForHome: async (payload) => {
    try {
      return await communityModel.aggregate(
        [
          {
            $match: {
              users: {
                $elemMatch: {
                  userId: mongoose.Types.ObjectId(payload.id),
                },
              },
            },
          }, {
            $addFields: {
              user: mongoose.Types.ObjectId(payload.id),
            },
          }, {
            $lookup: {
              from: 'users',
              localField: 'user',
              foreignField: '_id',
              as: 'userDetails',
            },
          },
          {
            $project: {
              posts: 1,
              name: 1,
              user: 1,
              userDetails: 1,
            },
          }, {
            $lookup: {
              from: 'posts',
              localField: 'posts',
              foreignField: '_id',
              as: 'post',
            },
          }, {
            $project: {
              post: 1,
              name: 1,
              user: 1,
              _id: 0,
              userDetails: 1,
            },
          }, {
            $unwind: {
              path: '$post',
            },
          }, {
            $match: {
              'post.deleted': false,
            },
          },
          {
            $addFields:
                        {
                          liked: {
                            $cond: [
                              {
                                $in: [mongoose.Types.ObjectId(payload.id), '$post.likedBy'],
                              }, true, false,
                            ],
                          },
                        },
          }, {
            $addFields: {
              totalLikes: {
                $size: '$post.likedBy',
              },
            },
          }, {
            $lookup: {
              from: 'communities',
              localField: 'post.communityId',
              foreignField: '_id',
              as: 'communityDetails',
            },
          }, {
            $unwind: {
              path: '$userDetails',
            },
          },
          {
            $addFields: {
              saved: {
                $cond: [
                  {
                    $in: ['$post._id', '$userDetails.savedPosts'],
                  }, true, false,
                ],
              },
            },
          }, {
            $project: {
              user: 0,
              userDetails: 0,
            },
          },
          {
            $sort: {
              'post.createdAt': -1,
            },
          },
        ],
      );
    } catch (error) {
      console.log('error ', error);
      return error;
    }
  },

  getUserCommunityNumbers: async (payload) => {
    try {
      return await communityModel.aggregate(
        [
          {
            $match: {
              users: {
                $elemMatch: {
                  userId: mongoose.Types.ObjectId(payload),
                },
              },
            },
          }, {
            $group: {
              _id: null,
              total: {
                $sum: 1,
              },
            },
          }, {
            $project: {
              _id: 0,
            },
          },
        ],
      );
    } catch (error) {
      return error;
    }
  },

  getUserPostCount: async (payload) => {
    try {
      return postModel.find({ userId: payload }).count();
    } catch (error) {
      return error;
    }
  },

  updateProfile: async (id, key, isCover) => {
    try {
      if (isCover) {
        return await userModel.updateOne(
          { _id: id },
          { $set: { coverPicture: key } },
          { upsert: true },
        );
      }
      return await userModel.updateOne(
        { _id: id },
        { $set: { profilePicture: key } },
        { upsert: true },
      );
    } catch (error) {
      return error;
    }
  },
  getProfile: async (payload) => {
    try {
      return await userModel.findOne({ _id: payload }, { profilePicture: 1, _id: 0 });
    } catch (error) {
      return error;
    }
  },

  // eslint-disable-next-line consistent-return
  editUsername: async (newname, id) => {
    try {
      let errorMsg = '';
      // eslint-disable-next-line consistent-return
      await checkUsername(newname).then(async (result) => {
        console.log('is username valid', result);
        if (result) {
          // eslint-disable-next-line consistent-return
          await userModel.updateOne({ _id: id }, { $set: { userName: newname } }).then((res) => {
            if (res.modifiedCount === 1) return errorMsg;
          });
        } else {
          errorMsg = 'userName Exists';
          return errorMsg;
        }
      });
    } catch (error) {
      return error;
    }
  },
  // eslint-disable-next-line consistent-return
  editUserBio: async (newBio, id) => {
    try {
      let errorMsg = '';
      await userModel.updateOne(
        { _id: id },
        { $set: { bio: newBio } },
        { upsert: true },
      ).then((res) => {
        if (res.modifiedCount === 1) return errorMsg;
        errorMsg = 'error updating bio';
        return errorMsg;
      });
    } catch (error) {
      return error;
    }
  },

  // change password
  changePassword: async (payload) => {
    try {
      return await userModel.updateOne(
        { email: payload.email },
        { $set: { password: payload.newPassword } },
      );
    } catch (error) {
      console.log(error);
      return error;
    }
  },
};
