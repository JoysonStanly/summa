import User from '../models/User';
import { connectDB } from '../config/database';
import dotenv from 'dotenv';

dotenv.config();

const createAdmin = async () => {
  try {
    // Get credentials from command line arguments
    const args = process.argv.slice(2);
    const email = args[0];
    const password = args[1];
    const name = args[2] || 'Admin User';

    if (!email || !password) {
      console.log('❌ Please provide email and password');
      console.log('Usage: npm run create-admin <email> <password> [name]');
      process.exit(1);
    }

    console.log('🔄 Creating admin user...');

    // Connect to database
    await connectDB();

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      console.log('⚠️  User with this email already exists');
      process.exit(1);
    }

    // Create admin user
    const adminUser = await User.create({
      name,
      email,
      password,
      role: 'admin',
      coins: 1000, // Give some starter coins
      preferences: {
        theme: 'dark',
        notifications: true
      }
    });

    console.log('✅ Admin user created successfully!');
    console.log(`👤 Name: ${adminUser.name}`);
    console.log(`📧 Email: ${adminUser.email}`);
    console.log(`🔑 Password: ${password}`);
    console.log(`🛡️  Role: ${adminUser.role}`);

    process.exit(0);
  } catch (error) {
    console.error('❌ Error creating admin user:', error);
    process.exit(1);
  }
};

// Run if called directly
if (require.main === module) {
  createAdmin();
}
