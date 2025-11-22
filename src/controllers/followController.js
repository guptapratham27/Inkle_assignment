const Follow = require('../models/Follow');
const User = require('../models/User');
const { logActivity } = require('../utils/activityLogger');
const { ACTIVITY_TYPES } = require('../utils/constants');

const followUser = async (req, res) => {
  try {
    const { id } = req.params;
    const followerId = req.user._id;

    if (followerId.toString() === id) {
      return res.status(400).json({ error: 'Cannot follow yourself' });
    }

    const targetUser = await User.findById(id);
    if (!targetUser) {
      return res.status(404).json({ error: 'User not found' });
    }

    const existingFollow = await Follow.findOne({ follower: followerId, following: id });
    if (existingFollow) {
      return res.status(400).json({ error: 'Already following this user' });
    }

    await Follow.create({ follower: followerId, following: id });
    await logActivity(followerId, ACTIVITY_TYPES.USER_FOLLOWED, id, null);

    res.status(201).json({ message: 'User followed successfully' });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ error: 'Already following this user' });
    }
    res.status(500).json({ error: 'Server error' });
  }
};

const unfollowUser = async (req, res) => {
  try {
    const { id } = req.params;
    const followerId = req.user._id;

    const follow = await Follow.findOneAndDelete({ follower: followerId, following: id });
    if (!follow) {
      return res.status(404).json({ error: 'Not following this user' });
    }

    res.json({ message: 'User unfollowed successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

module.exports = { followUser, unfollowUser };

