const Like = require('../models/Like');
const Post = require('../models/Post');
const Block = require('../models/Block');
const { logActivity } = require('../utils/activityLogger');
const { ACTIVITY_TYPES } = require('../utils/constants');

const likePost = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user._id;

    const post = await Post.findById(id);
    if (!post || post.deletedAt) {
      return res.status(404).json({ error: 'Post not found' });
    }

    const isBlocked = await Block.findOne({
      blocker: userId,
      blocked: post.author
    });
    if (isBlocked) {
      return res.status(403).json({ error: 'Cannot like post from blocked user' });
    }

    const existingLike = await Like.findOne({ user: userId, post: id, deletedAt: null });
    if (existingLike) {
      return res.status(400).json({ error: 'Post already liked' });
    }

    const like = await Like.create({ user: userId, post: id });
    await logActivity(userId, ACTIVITY_TYPES.POST_LIKED, post.author, post._id);

    res.status(201).json({ message: 'Post liked successfully', like });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ error: 'Post already liked' });
    }
    res.status(500).json({ error: 'Server error' });
  }
};

const unlikePost = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user._id;

    const like = await Like.findOne({ user: userId, post: id, deletedAt: null });
    if (!like) {
      return res.status(404).json({ error: 'Like not found' });
    }

    like.deletedAt = new Date();
    await like.save();

    res.json({ message: 'Post unliked successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

module.exports = { likePost, unlikePost };

