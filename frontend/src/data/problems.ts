import type { Example, Constraint } from '../types/problem';

interface Problem {
  id: string;
  topicId: string;
  title: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  coins: number;
  description: string;
  examples: Example[];
  constraints: Constraint[];
  defaultCode: Record<string, string>;
  testCases: {
    id: string;
    input: string[];
    output: string;
  }[];
}

export const problems: Problem[] = [
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

export const getProblem = (topicId: string, problemId: string): Problem | undefined => {
  return problems.find(p => p.topicId === topicId && p.id === problemId);
};

export const getProblems = (topicId: string): Problem[] => {
  return problems.filter(p => p.topicId === topicId);
};
