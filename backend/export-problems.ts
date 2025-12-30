import mongoose from 'mongoose';
import Problem from './src/models/Problem';
import { connectDB } from './src/config/database';
import { exportAllProblemsToFiles } from './src/utils/problemExporter';

/**
 * Script to export all problems from database to JSON files
 * Usage: npm run export-problems
 */

const exportProblems = async () => {
  try {
    // Connect to database
    await connectDB();
    console.log('✅ Connected to database');

    // Fetch all problems
    const problems = await Problem.find({});
    console.log(`📊 Found ${problems.length} problems in database\n`);

    if (problems.length === 0) {
      console.log('⚠️  No problems to export');
      process.exit(0);
    }

    // Export to files
    await exportAllProblemsToFiles(problems);

    console.log('\n✅ Export completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Export failed:', error);
    process.exit(1);
  }
};

// Run the export
exportProblems();
