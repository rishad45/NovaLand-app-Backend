const mongoose = require('mongoose');

const savedSchema = mongoose.Schema({
  userId: {
    type: mongoose.Types.ObjectId,
    ref: 'users',
  },
  playLists: [
    {
      name: String,
      saves: [
        {
          type: mongoose.Types.ObjectId,
          ref: 'posts',
        },
      ],
    },
  ],
  saved: [
    {
      type: mongoose.Types.ObjectId,
      ref: 'posts',
    },
  ],
}, { timestamps: true });

const saveModel = mongoose.model('savedposts', savedSchema);
module.exports = saveModel;
