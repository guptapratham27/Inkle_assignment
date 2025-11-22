const Post = require('../models/Post');
const Block = require('../models/Block');
const { logActivity } = require('../utils/activityLogger');
const { ACTIVITY_TYPES } = require('../utils/constants');

const createPost = async (req, res) => {
  try {
    if (!req.user || !req.user._id) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    const { content } = req.body;
    const authorId = req.user._id;
    
    const post = await Post.create({ author: authorId, content });
    
    const populatedPost = await Post.findById(post._id).populate('author', 'username email');
    await logActivity(authorId, ACTIVITY_TYPES.POST_CREATED, null, post._id);

    res.status(201).json({ 
      message: 'Post created successfully', 
      post: populatedPost 
    });
  } catch (error) {
    console.error('Error creating post:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

const getPosts = async (req, res) => {
  try {
    const userId = req.user._id;
    
    const blockedUsers = await Block.find({ blocker: userId }).select('blocked');
    const blockedUserIds = blockedUsers.map(b => b.blocked.toString());

    const query = {
      deletedAt: null,
      author: { $nin: blockedUserIds }
    };

    const posts = await Post.find(query)
      .populate('author', 'username')
      .sort({ createdAt: -1 })
      .limit(50);

    res.json({ posts });
  } catch (error) {
    console.error('Error fetching posts:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

const deletePost = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user._id;
    const userRole = req.user.role;

    const post = await Post.findById(id);
    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }

    const isAuthor = post.author.toString() === userId.toString();
    const isAdminOrOwner = ['admin', 'owner'].includes(userRole);

    if (!isAuthor && !isAdminOrOwner) {
      return res.status(403).json({ error: 'Permission denied' });
    }

    post.deletedAt = new Date();
    await post.save();

    if (isAdminOrOwner && !isAuthor) {
      await logActivity(userId, ACTIVITY_TYPES.POST_DELETED, post.author, post._id);
    }

    res.json({ message: 'Post deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

module.exports = { createPost, getPosts, deletePost };

