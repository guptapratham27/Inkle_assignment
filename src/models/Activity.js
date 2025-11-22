const mongoose = require('mongoose');

const activitySchema = new mongoose.Schema({
  actor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  targetUser: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  targetPost: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Post'
  },
  action: {
    type: String,
    enum: ['post_created', 'post_liked', 'user_followed', 'user_deleted', 'post_deleted'],
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

activitySchema.index({ createdAt: -1 });
activitySchema.index({ actor: 1 });

module.exports = mongoose.model('Activity', activitySchema);

