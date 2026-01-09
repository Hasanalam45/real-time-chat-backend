/**
 * User Seed Script
 * Populates database with sample users for development/testing
 * Usage: node src/seeds/user.seed.js
 */

import dotenv from 'dotenv';
import { connectDb } from '../lib/database.js';
import User from '../models/user.model.js';
import { hashPassword } from '../services/auth.service.js';

dotenv.config();

const seedUsers = [
  // Female Users
  {
    email: 'emma.thompson@example.com',
    fullname: 'Emma Thompson',
    password: '123456',
    profilePic: 'https://randomuser.me/api/portraits/women/1.jpg',
  },
  {
    email: 'olivia.miller@example.com',
    fullname: 'Olivia Miller',
    password: '123456',
    profilePic: 'https://randomuser.me/api/portraits/women/2.jpg',
  },
  {
    email: 'sophia.davis@example.com',
    fullname: 'Sophia Davis',
    password: '123456',
    profilePic: 'https://randomuser.me/api/portraits/women/3.jpg',
  },
  {
    email: 'ava.wilson@example.com',
    fullname: 'Ava Wilson',
    password: '123456',
    profilePic: 'https://randomuser.me/api/portraits/women/4.jpg',
  },
  {
    email: 'isabella.brown@example.com',
    fullname: 'Isabella Brown',
    password: '123456',
    profilePic: 'https://randomuser.me/api/portraits/women/5.jpg',
  },
  {
    email: 'mia.johnson@example.com',
    fullname: 'Mia Johnson',
    password: '123456',
    profilePic: 'https://randomuser.me/api/portraits/women/6.jpg',
  },
  {
    email: 'charlotte.williams@example.com',
    fullname: 'Charlotte Williams',
    password: '123456',
    profilePic: 'https://randomuser.me/api/portraits/women/7.jpg',
  },
  {
    email: 'amelia.garcia@example.com',
    fullname: 'Amelia Garcia',
    password: '123456',
    profilePic: 'https://randomuser.me/api/portraits/women/8.jpg',
  },

  // Male Users
  {
    email: 'james.anderson@example.com',
    fullname: 'James Anderson',
    password: '123456',
    profilePic: 'https://randomuser.me/api/portraits/men/1.jpg',
  },
  {
    email: 'william.clark@example.com',
    fullname: 'William Clark',
    password: '123456',
    profilePic: 'https://randomuser.me/api/portraits/men/2.jpg',
  },
  {
    email: 'benjamin.taylor@example.com',
    fullname: 'Benjamin Taylor',
    password: '123456',
    profilePic: 'https://randomuser.me/api/portraits/men/3.jpg',
  },
  {
    email: 'lucas.moore@example.com',
    fullname: 'Lucas Moore',
    password: '123456',
    profilePic: 'https://randomuser.me/api/portraits/men/4.jpg',
  },
  {
    email: 'henry.jackson@example.com',
    fullname: 'Henry Jackson',
    password: '123456',
    profilePic: 'https://randomuser.me/api/portraits/men/5.jpg',
  },
  {
    email: 'alexander.martin@example.com',
    fullname: 'Alexander Martin',
    password: '123456',
    profilePic: 'https://randomuser.me/api/portraits/men/6.jpg',
  },
  {
    email: 'daniel.rodriguez@example.com',
    fullname: 'Daniel Rodriguez',
    password: '123456',
    profilePic: 'https://randomuser.me/api/portraits/men/7.jpg',
  },
];

/**
 * Seed the database with sample users
 */
const seedDatabase = async () => {
  try {
    console.log('🌱 Starting database seeding...');

    // Connect to database
    await connectDb();

    // Clear existing users (optional - remove if you want to keep existing data)
    // await User.deleteMany({});

    // Hash passwords before inserting
    const usersWithHashedPasswords = await Promise.all(
      seedUsers.map(async (user) => ({
        ...user,
        password: await hashPassword(user.password),
      }))
    );

    // Insert users
    await User.insertMany(usersWithHashedPasswords);

    console.log(`✅ Database seeded successfully with ${seedUsers.length} users`);
    console.log('📝 All users have password: 123456');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding database:', error.message);
    if (error.code === 11000) {
      console.error('⚠️  Some users may already exist in the database');
    }
    process.exit(1);
  }
};

// Run seed if executed directly
seedDatabase();
