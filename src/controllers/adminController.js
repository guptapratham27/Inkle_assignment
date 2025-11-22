const User = require('../models/User');
const Post = require('../models/Post');
const Like = require('../models/Like');
const Activity = require('../models/Activity');
const { logActivity } = require('../utils/activityLogger');
const { ACTIVITY_TYPES, ROLES } = require('../utils/constants');

const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    const adminId = req.user._id;

    if (adminId.toString() === id) {
      return res.status(400).json({ error: 'Cannot delete yourself' });
    }

    const targetUser = await User.findById(id);
    if (!targetUser) {
      return res.status(404).json({ error: 'User not found' });
    }

    if (targetUser.role === ROLES.OWNER) {
      return res.status(403).json({ error: 'Cannot delete owner' });
    }

    if (req.user.role === ROLES.ADMIN && targetUser.role === ROLES.ADMIN) {
      return res.status(403).json({ error: 'Admins cannot delete other admins' });
    }

    await User.findByIdAndDelete(id);
    await logActivity(adminId, ACTIVITY_TYPES.USER_DELETED, id, null);

    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

const deletePost = async (req, res) => {
  try {
    const { id } = req.params;
    const adminId = req.user._id;

    const post = await Post.findById(id);
    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }

    post.deletedAt = new Date();
    await post.save();
    await logActivity(adminId, ACTIVITY_TYPES.POST_DELETED, post.author, post._id);

    res.json({ message: 'Post deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

const deleteLike = async (req, res) => {
  try {
    const { id } = req.params;
    const like = await Like.findById(id);
    
    if (!like || like.deletedAt) {
      return res.status(404).json({ error: 'Like not found' });
    }

    like.deletedAt = new Date();
    await like.save();

    res.json({ message: 'Like deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

const createAdmin = async (req, res) => {
  try {
    const { userId } = req.body;

    if (req.user.role !== ROLES.OWNER) {
      return res.status(403).json({ error: 'Only owner can create admins' });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    if (user.role === ROLES.ADMIN) {
      return res.status(400).json({ error: 'User is already an admin' });
    }

    user.role = ROLES.ADMIN;
    await user.save();

    res.json({ message: 'Admin created successfully', user });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

const deleteAdmin = async (req, res) => {
  try {
    const { id } = req.params;

    if (req.user.role !== ROLES.OWNER) {
      return res.status(403).json({ error: 'Only owner can delete admins' });
    }

    const admin = await User.findById(id);
    if (!admin) {
      return res.status(404).json({ error: 'User not found' });
    }

    if (admin.role !== ROLES.ADMIN) {
      return res.status(400).json({ error: 'User is not an admin' });
    }

    admin.role = ROLES.USER;
    await admin.save();

    res.json({ message: 'Admin deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

module.exports = {
  deleteUser,
  deletePost,
  deleteLike,
  createAdmin,
  deleteAdmin
};

