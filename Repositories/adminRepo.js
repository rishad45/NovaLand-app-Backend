const adminModel = require('../Models/adminsModel');
const userModel = require('../Models/userModel');
const postModel = require('../Models/postModel');
const communityModel = require('../Models/communityModel');

module.exports = {
  createAdmin: async ({
    name, email, password, superAdmin = false, profilePicture = '',
  }) => {
    try {
      return await adminModel.create({
        name,
        email,
        password,
        superAdmin,
        profilePicture,
      });
    } catch (error) {
      console.log(error);
      return error;
    }
  },

  login: async (payload) => {
    try {
      return await adminModel.find({ email: payload.email });
    } catch (error) {
      return error;
    }
  },

  getAllusers: async () => {
    try {
      return await userModel.find({
        blocked: false,
      }, {
        userName: 1, email: 1, id: '$_id', _id: 0,
      }).lean();
    } catch (error) {
      return error;
    }
  },

  getAllAdmins: async () => {
    try {
      return await adminModel.find({ blocked: false }, {
        name: 1, email: 1, id: '$_id', _id: 0, superAdmin: 1,
      }).lean();
    } catch (error) {
      return error;
    }
  },

  getAllCommunities: async () => {
    try {
      return await communityModel.aggregate(
        [
          {
            $addFields: {
              totalPosts: {
                $size: '$posts',
              },
            },
          }, {
            $project: {
              totalPosts: 1,
              name: 1,
              admin: 1,
              users: {
                $size: '$users',
              },
              id: '$_id',
              _id: 0,
            },
          },
        ],
      );
    } catch (error) {
      return error;
    }
  },

  blockUser: async (payload) => {
    try {
      return await userModel.updateOne(
        { _id: payload },
        { $set: { blocked: true } },
        { upsert: true },
      );
    } catch (error) {
      return error;
    }
  },

  blockAdmin: async (payload) => {
    try {
      return await adminModel.updateOne(
        { _id: payload },
        { $set: { blocked: true } },
        { upsert: true },
      );
    } catch (error) {
      return error;
    }
  },

  unblockAdmin: async (payload) => {
    try {
      return await adminModel.updateOne(
        { _id: payload },
        { $set: { blocked: false } },
      );
    } catch (error) {
      return error;
    }
  },

  unblockUser: async (payload) => {
    try {
      return await userModel.updateOne(
        { _id: payload },
        { $set: { blocked: false } },
      );
    } catch (error) {
      return error;
    }
  },

  getAllBlockedAdmins: async () => {
    try {
      return await adminModel.find({ blocked: true }, {
        name: 1, email: 1, id: '$_id', _id: 0,
      });
    } catch (error) {
      return error;
    }
  },

  getAllBlockedUsers: async () => {
    try {
      return await userModel.find(
        { blocked: true },
        {
          userName: 1, email: 1, id: '$_id', _id: 0,
        },
      );
    } catch (error) {
      return error;
    }
  },

  getAllFlaggedPosts: async () => {
    try {
      return await postModel.aggregate(
        [
          {
            $match: {
              'reported.status': true,
              deleted: false,
            },
          }, {
            $project: {
              userId: 1,
              communityId: 1,
              image: 1,
              reported: 1,
            },
          }, {
            $addFields: {
              count: {
                $size: '$reported.reportedBy',
              },
            },
          },
          {
            $project: {
              userId: 1,
              communityId: 1,
              count: 1,
              reason: '$reported.reason',
              id: '$_id',
              _id: 0,
            },
          },
        ],
      );
    } catch (error) {
      return error;
    }
  },

  getTopPosts: async () => {
    try {
      return await postModel.aggregate(
        [
          {
            $addFields: {
              totalLikes: {
                $size: '$likedBy',
              },
            },
          }, {
            $sort: {
              totalLikes: -1,
            },
          }, {
            $limit: 10,
          }, {
            $lookup: {
              from: 'comments',
              localField: '_id',
              foreignField: 'postId',
              as: 'comments',
            },
          }, {
            $project: {
              totalLikes: 1,
              id: '$_id',
              _id: 0,
              communityId: 1,
              userId: 1,
              comments: {
                $size: '$comments',
              },
            },
          }, {
            $sort: {
              totalLikes: -1,
              comments: -1,
            },
          },
        ],
      );
    } catch (error) {
      return error;
    }
  },

  deletePost: async (payload) => {
    try {
      return await postModel.updateOne(
        { _id: payload },
        { $set: { deleted: true } },
      );
    } catch (error) {
      return error;
    }
  },

  getTotalPosts: async () => {
    try {
      return await postModel.count();
    } catch (error) {
      return error;
    }
  },

  getTotalUsers: async () => {
    try {
      return await userModel.count();
    } catch (error) {
      return error;
    }
  },

  getTotalCommunities: async () => {
    try {
      return await communityModel.count();
    } catch (error) {
      return error;
    }
  },
};
