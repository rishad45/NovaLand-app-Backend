const mongoose = require('mongoose');

const communitySchema = mongoose.Schema({
  name: {
    type: String,
    unique: true,
    index: true,
  },
  admin: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'users',
  },
  category: {
    type: String,
  },
  privacy: {
    type: String,
    enum: ['Private', 'Public'],
  },
  users: [
    {
      userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users',
      },
      pending: {
        type: Boolean,
        default: false,
      },
      banned: {
        type: Boolean,
        default: false,
      },
      joinedDate: {
        type: Date,
        default: Date.now(),
      },
    },
  ],
  posts: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'posts',
  }],
  profilePicture: {
    type: String,
  },
  coverPicture: String,
}, { timestamps: true });

const communityModel = mongoose.model('Communities', communitySchema);
module.exports = communityModel;
