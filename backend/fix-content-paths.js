const { MongoClient } = require('mongodb');
require('dotenv').config();

async function fixContentPaths() {
  const client = new MongoClient(process.env.MONGODB_URI || 'mongodb://localhost:27017/studyio');
  
  try {
    console.log('🔧 Connecting to database...');
    await client.connect();
    
    const db = client.db();
    const problems = db.collection('problems');
    
    // Find problems without contentPath
    const problemsToFix = await problems.find({
      $or: [
        { contentPath: { $exists: false } },
        { contentPath: null },
        { contentPath: '' }
      ]
    }).toArray();
    
    console.log(`📚 Found ${problemsToFix.length} problems without contentPath`);
    
    // Update each problem
    for (const problem of problemsToFix) {
      const contentPath = `backend/data/problems/${problem.slug}.json`;
      
      await problems.updateOne(
        { _id: problem._id },
        { $set: { contentPath } }
      );
      
      console.log(`✅ Updated ${problem.title} -> ${contentPath}`);
    }
    
    console.log('🎉 All problems updated successfully!');
    
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  } finally {
    await client.close();
  }
}

fixContentPaths();
