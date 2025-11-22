const User = require('../models/User');
const Block = require('../models/Block');

const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    res.json({ user });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json({ user });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

const blockUser = async (req, res) => {
  try {
    const { id } = req.params;
    const blockerId = req.user._id;

    if (blockerId.toString() === id.toString()) {
      return res.status(400).json({ error: 'Cannot block yourself' });
    }

    const targetUser = await User.findById(id);
    if (!targetUser) {
      return res.status(404).json({ error: 'User not found' });
    }

    const existingBlock = await Block.findOne({ blocker: blockerId, blocked: id });
    if (existingBlock) {
      return res.status(400).json({ error: 'User already blocked' });
    }

    await Block.create({ blocker: blockerId, blocked: id });
    res.json({ message: 'User blocked successfully' });
  } catch (error) {
    console.error('Error blocking user:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

const unblockUser = async (req, res) => {
  try {
    const { id } = req.params;
    const blockerId = req.user._id;

    const block = await Block.findOneAndDelete({ blocker: blockerId, blocked: id });
    if (!block) {
      return res.status(404).json({ error: 'User not blocked' });
    }

    res.json({ message: 'User unblocked successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

module.exports = { getProfile, getUserById, blockUser, unblockUser };

