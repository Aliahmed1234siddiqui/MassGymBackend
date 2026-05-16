const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');
const User = require('./models/User'); // adjust path to your User model

dotenv.config();

const seedAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');

    // Check if admin already exists
    const existingAdmin = await User.findOne({ email: 'aliahmedsiddiqui48@gmail.com' });
    if (existingAdmin) {
      console.log('Admin already exists');
      process.exit(0);
    }

   

    // Create admin
    const admin = await User.create({
      name: 'Super Admin',
      email: 'aliahmedsiddiqui48@gmail.com',
      password: 'ali12345',
      role: 'admin',
    });

    console.log('Admin created:', admin.email);
    process.exit(0);
  } catch (err) {
    console.error('Error:', err.message);
    process.exit(1);
  }
};

seedAdmin();