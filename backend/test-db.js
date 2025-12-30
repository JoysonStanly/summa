const mongoose = require('mongoose');
require('dotenv').config();

async function testDatabase() {
  try {
    console.log('🔍 Testing database connection...');
    
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Database connected successfully');
    
    // Test collections
    const collections = await mongoose.connection.db.listCollections().toArray();
    console.log(`📊 Found ${collections.length} collections:`, collections.map(c => c.name));
    
    // Check if we have problems
    const Problem = mongoose.model('Problem', new mongoose.Schema({}, { strict: false }));
    const problemCount = await Problem.countDocuments();
    console.log(`📚 Problems in database: ${problemCount}`);
    
    if (problemCount === 0) {
      console.log('⚠️  No problems found. Run "npm run seed" to populate the database.');
    } else {
      const problems = await Problem.find({}, 'title slug').limit(5);
      console.log('📋 Sample problems:');
      problems.forEach(p => console.log(`  - ${p.title} (${p.slug})`));
    }
    
    // Check if we have users
    const User = mongoose.model('User', new mongoose.Schema({}, { strict: false }));
    const userCount = await User.countDocuments();
    console.log(`👥 Users in database: ${userCount}`);
    
    await mongoose.disconnect();
    console.log('✅ Database test completed');
    
  } catch (error) {
    console.error('❌ Database test failed:', error.message);
    process.exit(1);
  }
}

testDatabase();