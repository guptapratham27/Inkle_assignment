require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../src/models/User');
const Post = require('../src/models/Post');
const Like = require('../src/models/Like');
const Follow = require('../src/models/Follow');
const Activity = require('../src/models/Activity');
const Block = require('../src/models/Block');

const removeTestData = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    const testUsernames = ['alice', 'bob', 'charlie'];
    const testEmails = ['alice@test.com', 'bob@test.com', 'charlie@test.com'];

    console.log('Removing test users and their data...');

    for (const username of testUsernames) {
      const user = await User.findOne({ username });
      if (user) {
        const userId = user._id;
        
        // Delete user's posts
        await Post.deleteMany({ author: userId });
        console.log(`✅ Deleted posts for ${username}`);
        
        // Delete user's likes
        await Like.deleteMany({ user: userId });
        console.log(`✅ Deleted likes for ${username}`);
        
        // Delete follow relationships
        await Follow.deleteMany({ $or: [{ follower: userId }, { following: userId }] });
        console.log(`✅ Deleted follow relationships for ${username}`);
        
        // Delete blocks involving this user
        await Block.deleteMany({ $or: [{ blocker: userId }, { blocked: userId }] });
        console.log(`✅ Deleted blocks for ${username}`);
        
        // Delete activities
        await Activity.deleteMany({ actor: userId });
        console.log(`✅ Deleted activities for ${username}`);
        
        // Delete the user
        await User.findByIdAndDelete(userId);
        console.log(`✅ Deleted user: ${username}`);
      }
    }

    // Also remove testuser if it exists
    const testUser = await User.findOne({ username: 'testuser' });
    if (testUser) {
      const userId = testUser._id;
      await Post.deleteMany({ author: userId });
      await Like.deleteMany({ user: userId });
      await Follow.deleteMany({ $or: [{ follower: userId }, { following: userId }] });
      await Block.deleteMany({ $or: [{ blocker: userId }, { blocked: userId }] });
      await Activity.deleteMany({ actor: userId });
      await User.findByIdAndDelete(userId);
      console.log(`✅ Deleted testuser`);
    }

    console.log('\n✅ All test data removed successfully!');
    console.log('Remaining users: pratham007, kashish1212, admin (owner)');

    process.exit(0);
  } catch (error) {
    console.error('Error removing test data:', error);
    process.exit(1);
  }
};

removeTestData();

