const { execSync } = require('child_process');
const path = require('path');

console.log('🌱 Running database seeder...');

try {
  // Compile TypeScript and run seeder
  execSync('npx ts-node src/utils/seedDatabase.ts', {
    cwd: __dirname,
    stdio: 'inherit'
  });
} catch (error) {
  console.error('❌ Failed to run seeder:', error.message);
  process.exit(1);
}