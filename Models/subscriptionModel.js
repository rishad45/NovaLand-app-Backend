const mongoose = require('mongoose');

const { Schema } = mongoose;
const Subscription = new Schema({
  endpoint: String,
  expirationTime: Number,
  keys: {
    p256dh: String,
    auth: String,
  },
});
module.exports = mongoose.model('subscription', Subscription);
