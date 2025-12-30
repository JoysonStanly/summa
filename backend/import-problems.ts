import mongoose from 'mongoose';
import fs from 'fs';
import path from 'path';
import Problem from './src/models/Problem';
import { connectDB } from './src/config/database';

/**
 * Script to import problems from JSON files into the database
 * Usage: npm run import-problems
 */

const PROBLEMS_DIR = path.join(__dirname, 'data/problems');

const importProblems = async () => {
  try {
    // Connect to database
    await connectDB();
    console.log('✅ Connected to database');

    if (!fs.existsSync(PROBLEMS_DIR)) {
      console.error('❌ Problems directory not found:', PROBLEMS_DIR);
      process.exit(1);
    }

    const files = fs.readdirSync(PROBLEMS_DIR).filter((file) => file.endsWith('.json'));

    if (files.length === 0) {
      console.log('⚠️  No problem files found');
      process.exit(0);
    }

    console.log(`📂 Found ${files.length} problem files\n`);

    let totalImported = 0;
    let totalUpdated = 0;
    let totalErrors = 0;

    for (const file of files) {
      const filePath = path.join(PROBLEMS_DIR, file);
      const category = file.replace('.json', '');

      console.log(`\n📄 Processing: ${file} (Category: ${category})`);

      const fileContent = fs.readFileSync(filePath, 'utf-8');
      const problems = JSON.parse(fileContent);

      for (const problemData of problems) {
        try {
          // Check if problem already exists by slug or _id
          const existingProblem = await Problem.findOne({
            $or: [{ slug: problemData.slug }, { _id: problemData._id }],
          });

          if (existingProblem) {
            // Update existing problem
            await Problem.findByIdAndUpdate(existingProblem._id, problemData, {
              new: true,
              runValidators: true,
            });
            console.log(`  ✅ Updated: ${problemData.title}`);
            totalUpdated++;
          } else {
            // Create new problem
            await Problem.create(problemData);
            console.log(`  ✅ Imported: ${problemData.title}`);
            totalImported++;
          }
        } catch (error: any) {
          console.error(`  ❌ Error with "${problemData.title}":`, error.message);
          totalErrors++;
        }
      }
    }

    console.log('\n' + '='.repeat(50));
    console.log('📊 Import Summary:');
    console.log(`  • New problems imported: ${totalImported}`);
    console.log(`  • Problems updated: ${totalUpdated}`);
    console.log(`  • Errors: ${totalErrors}`);
    console.log('='.repeat(50) + '\n');

    process.exit(0);
  } catch (error) {
    console.error('❌ Import failed:', error);
    process.exit(1);
  }
};

// Run the import
importProblems();
