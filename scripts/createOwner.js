require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../src/models/User');

const createOwner = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    const ownerEmail = 'owner@admin.com';
    const ownerUsername = 'admin';
    const ownerPassword = 'admin123';

    const existingOwner = await User.findOne({
      $or: [{ email: ownerEmail }, { username: ownerUsername }, { role: 'owner' }]
    });

    if (existingOwner) {
      if (existingOwner.role === 'owner') {
        console.log('Owner already exists!');
        console.log('Email:', existingOwner.email);
        console.log('Username:', existingOwner.username);
        console.log('Role:', existingOwner.role);
        process.exit(0);
      } else {
        existingOwner.role = 'owner';
        existingOwner.email = ownerEmail;
        existingOwner.username = ownerUsername;
        existingOwner.password = ownerPassword;
        await existingOwner.save();
        console.log('Existing user promoted to owner!');
        console.log('Email:', ownerEmail);
        console.log('Username:', ownerUsername);
        console.log('Password:', ownerPassword);
        process.exit(0);
      }
    }

    const owner = await User.create({
      username: ownerUsername,
      email: ownerEmail,
      password: ownerPassword,
      role: 'owner'
    });

    console.log('✅ Owner user created successfully!');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('Email:', ownerEmail);
    console.log('Username:', ownerUsername);
    console.log('Password:', ownerPassword);
    console.log('Role: owner');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('You can now login with these credentials!');

    process.exit(0);
  } catch (error) {
    console.error('Error creating owner:', error);
    process.exit(1);
  }
};

createOwner();

