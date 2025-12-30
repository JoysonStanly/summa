import dotenv from 'dotenv';
import Problem from '../models/Problem';
import User from '../models/User';
import { connectDB } from '../config/database';

// Load environment variables
dotenv.config();

const sampleProblems = [
  {
    title: 'Linear Search',
    slug: 'linear-search',
    statement: `
      <p>Given an array of integers and a target value, implement linear search to find the index of the target value.</p>
      <p>If the target is not found, return -1.</p>
      
      <h3>Example 1:</h3>
      <pre>
      Input: arr = [2, 3, 4, 10, 40], target = 10
      Output: 3
      Explanation: 10 is present at index 3
      </pre>
      
      <h3>Example 2:</h3>
      <pre>
      Input: arr = [2, 3, 4, 10, 40], target = 5
      Output: -1
      Explanation: 5 is not present in the array
      </pre>
    `,
    difficulty: 'easy' as const,
    category: 'Array',
    tags: ['array', 'searching', 'linear-search'],
    testCases: [
      {
        input: ['[2, 3, 4, 10, 40]', '10'],
        output: '3',
        hidden: false,
      },
      {
        input: ['[2, 3, 4, 10, 40]', '5'],
        output: '-1',
        hidden: false,
      },
      {
        input: ['[1]', '1'],
        output: '0',
        hidden: true,
      },
      {
        input: ['[]', '1'],
        output: '-1',
        hidden: true,
      },
    ],
    constraints: [
      '0 <= arr.length <= 10^4',
      '-10^4 <= arr[i], target <= 10^4',
    ],
    hints: [
      'Iterate through the array from left to right',
      'Compare each element with the target',
      'Return the index when found, -1 if not found',
    ],
    starterCode: {
      javascript: `function linearSearch(arr, target) {
    // Your code here
    
}`,
      python: `def linear_search(arr, target):
    # Your code here
    pass`,
      cpp: `#include <vector>
using namespace std;

int linearSearch(vector<int>& arr, int target) {
    // Your code here
    
}`,
      java: `public class Solution {
    public int linearSearch(int[] arr, int target) {
        // Your code here
        
    }
}`,
    },
  },
  {
    title: 'Binary Search',
    slug: 'binary-search',
    statement: `
      <p>Given a sorted array of integers and a target value, implement binary search to find the index of the target value.</p>
      <p>If the target is not found, return -1.</p>
      
      <h3>Example 1:</h3>
      <pre>
      Input: arr = [1, 3, 5, 7, 9, 11], target = 7
      Output: 3
      Explanation: 7 is present at index 3
      </pre>
      
      <h3>Example 2:</h3>
      <pre>
      Input: arr = [1, 3, 5, 7, 9, 11], target = 4
      Output: -1
      Explanation: 4 is not present in the array
      </pre>
    `,
    difficulty: 'medium' as const,
    category: 'Array',
    tags: ['array', 'searching', 'binary-search'],
    testCases: [
      {
        input: ['[1, 3, 5, 7, 9, 11]', '7'],
        output: '3',
        hidden: false,
      },
      {
        input: ['[1, 3, 5, 7, 9, 11]', '4'],
        output: '-1',
        hidden: false,
      },
      {
        input: ['[1, 2, 3, 4, 5]', '1'],
        output: '0',
        hidden: true,
      },
      {
        input: ['[1, 2, 3, 4, 5]', '5'],
        output: '4',
        hidden: true,
      },
    ],
    constraints: [
      '0 <= arr.length <= 10^4',
      'arr is sorted in ascending order',
      '-10^4 <= arr[i], target <= 10^4',
    ],
    hints: [
      'Use two pointers: left and right',
      'Calculate middle index and compare with target',
      'Eliminate half of the search space in each iteration',
    ],
    starterCode: {
      javascript: `function binarySearch(arr, target) {
    // Your code here
    
}`,
      python: `def binary_search(arr, target):
    # Your code here
    pass`,
      cpp: `#include <vector>
using namespace std;

int binarySearch(vector<int>& arr, int target) {
    // Your code here
    
}`,
      java: `public class Solution {
    public int binarySearch(int[] arr, int target) {
        // Your code here
        
    }
}`,
    },
  },
  {
    title: 'Two Sum',
    slug: 'two-sum',
    statement: `
      <p>Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.</p>
      <p>You may assume that each input would have exactly one solution, and you may not use the same element twice.</p>
      <p>You can return the answer in any order.</p>
      
      <h3>Example 1:</h3>
      <pre>
      Input: nums = [2,7,11,15], target = 9
      Output: [0,1]
      Explanation: Because nums[0] + nums[1] == 9, we return [0, 1].
      </pre>
      
      <h3>Example 2:</h3>
      <pre>
      Input: nums = [3,2,4], target = 6
      Output: [1,2]
      </pre>
    `,
    difficulty: 'easy' as const,
    category: 'Array',
    tags: ['array', 'hash-table', 'two-pointers'],
    testCases: [
      {
        input: ['[2,7,11,15]', '9'],
        output: '[0,1]',
        hidden: false,
      },
      {
        input: ['[3,2,4]', '6'],
        output: '[1,2]',
        hidden: false,
      },
      {
        input: ['[3,3]', '6'],
        output: '[0,1]',
        hidden: true,
      },
    ],
    constraints: [
      '2 <= nums.length <= 10^4',
      '-10^9 <= nums[i] <= 10^9',
      '-10^9 <= target <= 10^9',
      'Only one valid answer exists.',
    ],
    hints: [
      'Use a hash map to store numbers and their indices',
      'For each number, check if target - number exists in the hash map',
      'Return the indices when found',
    ],
    starterCode: {
      javascript: `function twoSum(nums, target) {
    // Your code here
    
}`,
      python: `def two_sum(nums, target):
    # Your code here
    pass`,
      cpp: `#include <vector>
#include <unordered_map>
using namespace std;

vector<int> twoSum(vector<int>& nums, int target) {
    // Your code here
    
}`,
      java: `import java.util.*;

public class Solution {
    public int[] twoSum(int[] nums, int target) {
        // Your code here
        
    }
}`,
    },
  },
];

const sampleUsers = [
  {
    name: 'Admin User',
    email: 'admin@studyio.com',
    password: 'admin123',
    role: 'admin',
  },
  {
    name: 'John Doe',
    email: 'john@example.com',
    password: 'password123',
    role: 'student',
  },
  {
    name: 'Jane Smith',
    email: 'jane@example.com',
    password: 'password123',
    role: 'instructor',
  },
];

export const seedDatabase = async () => {
  try {
    console.log('🌱 Starting database seeding...');

    // Connect to database
    await connectDB();

    // Clear existing data
    console.log('🗑️  Clearing existing data...');
    await Problem.deleteMany({});
    await User.deleteMany({});

    // Seed problems
    console.log('📚 Seeding problems...');
    const createdProblems = await Problem.insertMany(sampleProblems);
    console.log(`✅ Created ${createdProblems.length} problems`);

    // Seed users
    console.log('👥 Seeding users...');
    const createdUsers = await User.insertMany(sampleUsers);
    console.log(`✅ Created ${createdUsers.length} users`);

    console.log('🎉 Database seeding completed successfully!');
    console.log('\n📋 Sample accounts:');
    console.log('Admin: admin@studyio.com / admin123');
    console.log('Student: john@example.com / password123');
    console.log('Instructor: jane@example.com / password123');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
};

// Run seeder if called directly
if (require.main === module) {
  seedDatabase();
}