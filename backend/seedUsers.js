/**
 * Seed Demo Users for Testing
 */

const mongoose = require('mongoose');
const User = require('./models/User');
require('dotenv').config();

async function seedUsers() {
  try {
    console.log('🔌 Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB\n');

    // Clear existing users
    console.log('🗑️  Clearing existing users...');
    await User.deleteMany({});
    console.log('✅ Cleared old users\n');

    // Create demo users
    console.log('👤 Creating demo users...');
    
    const demoUsers = [
      {
        name: 'Demo User',
        email: 'demo@replaylab.com',
        password: 'demo123',
        organization: 'API ReplayLab',
        role: 'user'
      },
      {
        name: 'Admin User',
        email: 'admin@replaylab.com',
        password: 'admin123',
        organization: 'API ReplayLab',
        role: 'admin'
      },
      {
        name: 'John Developer',
        email: 'john@company.com',
        password: 'test123',
        organization: 'Tech Company',
        role: 'user'
      }
    ];

    // Use create() instead of insertMany() to trigger password hashing middleware
    const users = [];
    for (const userData of demoUsers) {
      const user = await User.create(userData);
      users.push(user);
    }
    console.log(`✅ Created ${users.length} demo users with hashed passwords\n`);

    // Display credentials
    console.log('═══════════════════════════════════════');
    console.log('🎉 DEMO USERS CREATED!');
    console.log('═══════════════════════════════════════');
    console.log('\n📧 Demo User Credentials:\n');
    console.log('Email: demo@replaylab.com');
    console.log('Password: demo123\n');
    console.log('Email: admin@replaylab.com');
    console.log('Password: admin123\n');
    console.log('Email: john@company.com');
    console.log('Password: test123\n');
    console.log('═══════════════════════════════════════\n');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding users:', error);
    process.exit(1);
  }
}

seedUsers();
