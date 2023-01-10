const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
  userName: {
    type: String,
    required: true,
    index: true,
    unique: true,
  },
  email: {
    type: String,
    index: true,
    required: true,
    unique: true,
  },
  google: {
    type: Boolean,
    default: false,
  },
  password: {
    type: String,
  },
  communities: [
    {
      id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'communities',
      },
      joinedAt: {
        type: Date,
        default: Date.now(),
      },
    },
  ],
  requestedCommunities: [
    {
      id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'communities',
      },
      requestedAt: {
        type: Date,
        default: Date.now(),
      },
    },
  ],
  followers: [
    {
      id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users',
      },
      followedAt: {
        type: Date,
        default: Date.now(),
      },
    },
  ],
  following: [
    {
      id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users',
      },
      followedAt: {
        type: Date,
        default: Date.now(),
      },
    },
  ],
  pendingUserRequests: [
    {
      id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users',
      },
      requestedAt: {
        type: Date,
        default: Date.now(),
      },
    },
  ],
  myCommunities: [
    {
      id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'communities',
      },
      createdDate: {
        type: Date,
        default: Date.now(),
      },
    },
  ],
  savedPosts: [
    {
      type: mongoose.Types.ObjectId,
      ref: 'posts',
    },
  ],
  bio: {
    type: String,
  },
  profilePicture: String,
  coverPicture: String,
  myChats: [
    {
      type: mongoose.Types.ObjectId,
      ref: 'communities',
    },
  ],
}, { timestamps: true });

const userModel = mongoose.model('Users', userSchema);
module.exports = userModel;
