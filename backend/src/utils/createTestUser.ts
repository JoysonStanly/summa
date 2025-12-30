import User from '../models/User';
import { connectDB } from '../config/database';

export const createTestUser = async () => {
  try {
    console.log('🔄 Creating test user...');

    // Connect to database
    await connectDB();

    // Check if test user already exists
    const existingUser = await User.findOne({ email: 'test@example.com' });
    if (existingUser) {
      console.log('✅ Test user already exists');
      console.log('📧 Email: test@example.com');
      console.log('� Passlword: password123');
      return;
    }

    // Create test user
    const testUser = await User.create({
      name: 'Test User',
      email: 'test@example.com',
      password: 'password123',
      role: 'student',
    });

    console.log('✅ Test user created successfully!');
    console.log('📧 Email: test@example.com');
    console.log('� Passw:ord: password123');
    console.log('� Role:o student');
    console.log('🆔 ID:', testUser._id);

    process.exit(0);
  } catch (error) {
    console.error('❌ Error creating test user:', error);
    process.exit(1);
  }
};

// Run if called directly
if (require.main === module) {
  createTestUser();
}