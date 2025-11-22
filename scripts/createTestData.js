require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../src/models/User');
const Post = require('../src/models/Post');

const createTestData = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Create test users
    const testUsers = [
      { username: 'alice', email: 'alice@test.com', password: 'test123' },
      { username: 'bob', email: 'bob@test.com', password: 'test123' },
      { username: 'charlie', email: 'charlie@test.com', password: 'test123' }
    ];

    console.log('Creating test users...');
    const createdUsers = [];
    for (const userData of testUsers) {
      const existingUser = await User.findOne({ 
        $or: [{ email: userData.email }, { username: userData.username }] 
      });
      
      if (existingUser) {
        console.log(`User ${userData.username} already exists, skipping...`);
        createdUsers.push(existingUser);
      } else {
        const user = await User.create(userData);
        createdUsers.push(user);
        console.log(`✅ Created user: ${userData.username}`);
      }
    }

    // Create test posts for each user
    console.log('\nCreating test posts...');
    for (const user of createdUsers) {
      const existingPosts = await Post.find({ author: user._id });
      if (existingPosts.length > 0) {
        console.log(`User ${user.username} already has posts, skipping...`);
        continue;
      }

      const posts = [
        { content: `Hello! This is a post from ${user.username}.` },
        { content: `Another post by ${user.username} - testing the social feed!` },
        { content: `${user.username} here - this is my third post.` }
      ];

      for (const postData of posts) {
        await Post.create({ author: user._id, content: postData.content });
      }
      console.log(`✅ Created 3 posts for ${user.username}`);
    }

    console.log('\n✅ Test data created successfully!');
    console.log('\nTest Users:');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    testUsers.forEach(user => {
      console.log(`Username: ${user.username}`);
      console.log(`Email: ${user.email}`);
      console.log(`Password: ${user.password}`);
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    });
    console.log('\nYou can now login with any of these accounts to see posts from different users!');

    process.exit(0);
  } catch (error) {
    console.error('Error creating test data:', error);
    process.exit(1);
  }
};

createTestData();

