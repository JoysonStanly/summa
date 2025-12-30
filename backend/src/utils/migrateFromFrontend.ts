import mongoose from 'mongoose';
import Problem from '../models/Problem';
import User from '../models/User';
import { connectDB } from '../config/database';

// Frontend data structure (copied from your frontend)
interface FrontendProblem {
  id: string;
  topicId: string;
  title: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  coins: number;
  description: string;
  examples: Array<{
    input: string;
    output: string;
    explanation?: string;
  }>;
  constraints: Array<{ text: string }>;
  defaultCode: Record<string, string>;
  testCases: Array<{
    id: string;
    input: string[];
    output: string;
  }>;
}

// Your existing problems data
const frontendProblems: FrontendProblem[] = [
  {
    id: 'linear-search',
    topicId: 'arrays',
    title: 'Linear Search',
    difficulty: 'Easy',
    coins: 100,
    description: `Given an array of integers nums and an integer target, find the smallest index (0 based indexing) where the target appears in the array. If the target is not found in the array, return -1.`,
    examples: [
      {
        input: 'nums = [2, 3, 4, 5, 3], target = 3',
        output: '1',
        explanation: 'The first occurence of 3 in nums is at index 1'
      },
      {
        input: 'nums = [2, -4, 4, 0, 10], target = 6',
        output: '-1',
        explanation: 'The value 6 does not occur in the array, hence output is -1'
      },
      {
        input: 'nums = [1, 3, 5, -4, 1], target = 1',
        output: '0'
      }
    ],
    constraints: [
      { text: '1 <= nums.length <= 10^5' },
      { text: '-10^3 <= nums[i] <= 10^4' },
      { text: '-10^3 <= target <= 10^4' },
    ],
    defaultCode: {
      java: `class Solution {
  public int linearSearch(int[] nums, int target) {
    int n = nums.length;
    
    for (int i=0; i<n; i++) {
      if (nums[i]==target) {
        return i;
      }
    }
    
    return -1;
  }
}`,
      python: `def linear_search(nums, target):
    for i in range(len(nums)):
        if nums[i] == target:
            return i
    return -1`,
      javascript: `/**
 * @param {number[]} nums
 * @param {number} target
 * @return {number}
 */
function linearSearch(nums, target) {
    for (let i = 0; i < nums.length; i++) {
        if (nums[i] === target) {
            return i;
        }
    }
    return -1;
}`,
      typescript: `function linearSearch(nums: number[], target: number): number {
    for (let i = 0; i < nums.length; i++) {
        if (nums[i] === target) {
            return i;
        }
    }
    return -1;
}`,
      cpp: `class Solution {
public:
    int linearSearch(vector<int>& nums, int target) {
        int n = nums.size();
        
        for (int i = 0; i < n; i++) {
            if (nums[i] == target) {
                return i;
            }
        }
        
        return -1;
    }
};`
    },
    testCases: [
      {
        id: '1',
        input: ['[2, 3, 4, 5, 3]', '3'],
        output: '1'
      },
      {
        id: '2',
        input: ['[2, -4, 4, 0, 10]', '6'],
        output: '-1'
      },
      {
        id: '3',
        input: ['[1, 3, 5, -4, 1]', '1'],
        output: '0'
      }
    ]
  },
  {
    id: 'largest-element',
    topicId: 'arrays',
    title: 'Largest Element',
    difficulty: 'Easy',
    coins: 100,
    description: `Given an array of integers nums, find the largest element in the array.`,
    examples: [
      {
        input: 'nums = [2, 3, 4, 5, 3]',
        output: '5',
        explanation: '5 is the largest element in the array'
      },
      {
        input: 'nums = [2, -4, 4, 0, 10]',
        output: '10'
      }
    ],
    constraints: [
      { text: '1 <= nums.length <= 10^5' },
      { text: '-10^3 <= nums[i] <= 10^4' }
    ],
    defaultCode: {
      java: `class Solution {
  public int findLargest(int[] nums) {
    // Your code here
  }
}`,
      python: `def find_largest(nums):
    # Your code here
    pass`,
      typescript: `function findLargest(nums: number[]): number {
    // Your code here
}`
    },
    testCases: [
      {
        id: '1',
        input: ['[2, 3, 4, 5, 3]'],
        output: '5'
      },
      {
        id: '2',
        input: ['[2, -4, 4, 0, 10]'],
        output: '10'
      }
    ]
  }
];

// Convert frontend problem to backend format
const convertProblem = (frontendProblem: FrontendProblem) => {
  return {
    title: frontendProblem.title,
    slug: frontendProblem.id, // Use the frontend ID as slug
    statement: frontendProblem.description,
    difficulty: frontendProblem.difficulty.toLowerCase() as 'easy' | 'medium' | 'hard',
    category: frontendProblem.topicId,
    tags: [frontendProblem.topicId, frontendProblem.difficulty.toLowerCase()],
    testCases: frontendProblem.testCases.map(tc => ({
      input: tc.input,
      output: tc.output,
      hidden: false,
    })),
    constraints: frontendProblem.constraints.map(c => c.text),
    hints: [], // Add hints if you have them
    starterCode: {
      javascript: frontendProblem.defaultCode.javascript || '',
      python: frontendProblem.defaultCode.python || '',
      cpp: frontendProblem.defaultCode.cpp || '',
      java: frontendProblem.defaultCode.java || '',
    },
    submissionCount: 0,
    acceptanceRate: 0,
  };
};

// Sample users (minimal set)
const sampleUsers = [
  {
    name: 'Admin User',
    email: 'admin@studyio.com',
    password: 'admin123',
    role: 'admin',
  },
  {
    name: 'Test Student',
    email: 'student@example.com',
    password: 'password123',
    role: 'student',
  },
];

export const migrateFromFrontend = async () => {
  try {
    console.log('🔄 Starting migration from frontend data...');

    // Connect to database
    await connectDB();

    // Clear existing data
    console.log('🗑️  Clearing existing data...');
    await Problem.deleteMany({});
    await User.deleteMany({});

    // Convert and insert problems
    console.log('📚 Migrating problems...');
    const backendProblems = frontendProblems.map(convertProblem);
    const createdProblems = await Problem.insertMany(backendProblems);
    console.log(`✅ Migrated ${createdProblems.length} problems`);

    // Create sample users
    console.log('👥 Creating sample users...');
    const createdUsers = await User.insertMany(sampleUsers);
    console.log(`✅ Created ${createdUsers.length} users`);

    console.log('🎉 Migration completed successfully!');
    console.log('\n📋 Sample accounts:');
    console.log('Admin: admin@studyio.com / admin123');
    console.log('Student: student@example.com / password123');
    
    console.log('\n📚 Migrated problems:');
    createdProblems.forEach(p => console.log(`  - ${p.title} (${p.slug})`));

    process.exit(0);
  } catch (error) {
    console.error('❌ Migration failed:', error);
    process.exit(1);
  }
};

// Run migration if called directly
if (require.main === module) {
  migrateFromFrontend();
}