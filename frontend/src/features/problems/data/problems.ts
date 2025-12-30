import type { Example, Constraint } from '../types/problem';

interface Problem {
  id: string;
  topicId: string;
  subcategory: string;
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
  // ============= ARRAYS - FUNDAMENTALS =============
  {
    id: 'linear-search',
    topicId: 'arrays',
    subcategory: 'fundamentals',
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
    subcategory: 'fundamentals',
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
  },
  
  // ============= ARRAYS - FUNDAMENTALS (continued) =============
  {
    id: 'second-largest-element',
    topicId: 'arrays',
    subcategory: 'fundamentals',
    title: 'Second Largest Element',
    difficulty: 'Easy',
    coins: 100,
    description: 'Find the second largest element in an array.',
    examples: [{ input: 'nums = [1, 2, 4, 7, 7, 5]', output: '5', explanation: 'Second largest is 5' }],
    constraints: [{ text: '2 <= nums.length <= 10^5' }],
    defaultCode: { java: 'class Solution {\n  public int secondLargest(int[] nums) {\n    // Your code here\n  }\n}', python: 'def second_largest(nums):\n    # Your code here\n    pass', javascript: 'function secondLargest(nums) {\n    // Your code here\n}', typescript: 'function secondLargest(nums: number[]): number {\n    // Your code here\n}', cpp: 'class Solution {\npublic:\n    int secondLargest(vector<int>& nums) {\n        // Your code here\n    }\n};' },
    testCases: [{ id: '1', input: ['[1, 2, 4, 7, 7, 5]'], output: '5' }]
  },
  {
    id: 'check-array-sorted',
    topicId: 'arrays',
    subcategory: 'fundamentals',
    title: 'Check if Array is Sorted',
    difficulty: 'Easy',
    coins: 100,
    description: 'Check if an array is sorted in non-decreasing order.',
    examples: [{ input: 'nums = [1, 2, 3, 4, 5]', output: 'true' }],
    constraints: [{ text: '1 <= nums.length <= 10^5' }],
    defaultCode: { java: 'class Solution {\n  public boolean isSorted(int[] nums) {\n    // Your code here\n  }\n}', python: 'def is_sorted(nums):\n    # Your code here\n    pass', javascript: 'function isSorted(nums) {\n    // Your code here\n}', typescript: 'function isSorted(nums: number[]): boolean {\n    // Your code here\n}', cpp: 'class Solution {\npublic:\n    bool isSorted(vector<int>& nums) {\n        // Your code here\n    }\n};' },
    testCases: [{ id: '1', input: ['[1, 2, 3, 4, 5]'], output: 'true' }]
  },
  {
    id: 'maximum-consecutive-ones',
    topicId: 'arrays',
    subcategory: 'fundamentals',
    title: 'Maximum Consecutive Ones',
    difficulty: 'Easy',
    coins: 100,
    description: 'Find the maximum number of consecutive 1s in a binary array.',
    examples: [{ input: 'nums = [1, 1, 0, 1, 1, 1]', output: '3' }],
    constraints: [{ text: '1 <= nums.length <= 10^5' }],
    defaultCode: { java: 'class Solution {\n  public int maxConsecutiveOnes(int[] nums) {\n    // Your code here\n  }\n}', python: 'def max_consecutive_ones(nums):\n    # Your code here\n    pass', javascript: 'function maxConsecutiveOnes(nums) {\n    // Your code here\n}', typescript: 'function maxConsecutiveOnes(nums: number[]): number {\n    // Your code here\n}', cpp: 'class Solution {\npublic:\n    int maxConsecutiveOnes(vector<int>& nums) {\n        // Your code here\n    }\n};' },
    testCases: [{ id: '1', input: ['[1, 1, 0, 1, 1, 1]'], output: '3' }]
  },
  {
    id: 'left-rotate-array-one',
    topicId: 'arrays',
    subcategory: 'fundamentals',
    title: 'Left Rotate Array by One',
    difficulty: 'Easy',
    coins: 100,
    description: 'Rotate an array to the left by one position.',
    examples: [{ input: 'nums = [1, 2, 3, 4, 5]', output: '[2, 3, 4, 5, 1]' }],
    constraints: [{ text: '1 <= nums.length <= 10^5' }],
    defaultCode: { java: 'class Solution {\n  public void leftRotateByOne(int[] nums) {\n    // Your code here\n  }\n}', python: 'def left_rotate_by_one(nums):\n    # Your code here\n    pass', javascript: 'function leftRotateByOne(nums) {\n    // Your code here\n}', typescript: 'function leftRotateByOne(nums: number[]): void {\n    // Your code here\n}', cpp: 'class Solution {\npublic:\n    void leftRotateByOne(vector<int>& nums) {\n        // Your code here\n    }\n};' },
    testCases: [{ id: '1', input: ['[1, 2, 3, 4, 5]'], output: '[2, 3, 4, 5, 1]' }]
  },
  {
    id: 'left-rotate-array-k',
    topicId: 'arrays',
    subcategory: 'fundamentals',
    title: 'Left Rotate Array by K Places',
    difficulty: 'Medium',
    coins: 150,
    description: 'Rotate an array to the left by k positions.',
    examples: [{ input: 'nums = [1, 2, 3, 4, 5], k = 2', output: '[3, 4, 5, 1, 2]' }],
    constraints: [{ text: '1 <= nums.length <= 10^5' }],
    defaultCode: { java: 'class Solution {\n  public void leftRotateByK(int[] nums, int k) {\n    // Your code here\n  }\n}', python: 'def left_rotate_by_k(nums, k):\n    # Your code here\n    pass', javascript: 'function leftRotateByK(nums, k) {\n    // Your code here\n}', typescript: 'function leftRotateByK(nums: number[], k: number): void {\n    // Your code here\n}', cpp: 'class Solution {\npublic:\n    void leftRotateByK(vector<int>& nums, int k) {\n        // Your code here\n    }\n};' },
    testCases: [{ id: '1', input: ['[1, 2, 3, 4, 5]', '2'], output: '[3, 4, 5, 1, 2]' }]
  },

  // ============= ARRAYS - LOGIC BUILDING =============
  {
    id: 'move-zeros-end',
    topicId: 'arrays',
    subcategory: 'logic-building',
    title: 'Move Zeros to End',
    difficulty: 'Easy',
    coins: 100,
    description: 'Move all zeros to the end while maintaining relative order of non-zero elements.',
    examples: [{ input: 'nums = [0, 1, 0, 3, 12]', output: '[1, 3, 12, 0, 0]' }],
    constraints: [{ text: '1 <= nums.length <= 10^4' }],
    defaultCode: { java: 'class Solution {\n  public void moveZeros(int[] nums) {\n    // Your code here\n  }\n}', python: 'def move_zeros(nums):\n    # Your code here\n    pass', javascript: 'function moveZeros(nums) {\n    // Your code here\n}', typescript: 'function moveZeros(nums: number[]): void {\n    // Your code here\n}', cpp: 'class Solution {\npublic:\n    void moveZeros(vector<int>& nums) {\n        // Your code here\n    }\n};' },
    testCases: [{ id: '1', input: ['[0, 1, 0, 3, 12]'], output: '[1, 3, 12, 0, 0]' }]
  },
  {
    id: 'remove-duplicates-sorted',
    topicId: 'arrays',
    subcategory: 'logic-building',
    title: 'Remove Duplicates from Sorted Array',
    difficulty: 'Easy',
    coins: 100,
    description: 'Remove duplicates from a sorted array in-place.',
    examples: [{ input: 'nums = [1, 1, 2, 2, 3]', output: '[1, 2, 3]' }],
    constraints: [{ text: '1 <= nums.length <= 3 * 10^4' }],
    defaultCode: { java: 'class Solution {\n  public int removeDuplicates(int[] nums) {\n    // Your code here\n  }\n}', python: 'def remove_duplicates(nums):\n    # Your code here\n    pass', javascript: 'function removeDuplicates(nums) {\n    // Your code here\n}', typescript: 'function removeDuplicates(nums: number[]): number {\n    // Your code here\n}', cpp: 'class Solution {\npublic:\n    int removeDuplicates(vector<int>& nums) {\n        // Your code here\n    }\n};' },
    testCases: [{ id: '1', input: ['[1, 1, 2, 2, 3]'], output: '3' }]
  },
  {
    id: 'find-missing-number',
    topicId: 'arrays',
    subcategory: 'logic-building',
    title: 'Find Missing Number',
    difficulty: 'Easy',
    coins: 100,
    description: 'Find the missing number in an array containing n distinct numbers from 0 to n.',
    examples: [{ input: 'nums = [3, 0, 1]', output: '2' }],
    constraints: [{ text: 'n == nums.length' }],
    defaultCode: { java: 'class Solution {\n  public int missingNumber(int[] nums) {\n    // Your code here\n  }\n}', python: 'def missing_number(nums):\n    # Your code here\n    pass', javascript: 'function missingNumber(nums) {\n    // Your code here\n}', typescript: 'function missingNumber(nums: number[]): number {\n    // Your code here\n}', cpp: 'class Solution {\npublic:\n    int missingNumber(vector<int>& nums) {\n        // Your code here\n    }\n};' },
    testCases: [{ id: '1', input: ['[3, 0, 1]'], output: '2' }]
  },
  {
    id: 'union-sorted-arrays',
    topicId: 'arrays',
    subcategory: 'logic-building',
    title: 'Union of Two Sorted Arrays',
    difficulty: 'Easy',
    coins: 100,
    description: 'Find the union of two sorted arrays.',
    examples: [{ input: 'arr1 = [1, 2, 3], arr2 = [2, 3, 4]', output: '[1, 2, 3, 4]' }],
    constraints: [{ text: '1 <= arr1.length, arr2.length <= 10^5' }],
    defaultCode: { java: 'class Solution {\n  public List<Integer> union(int[] arr1, int[] arr2) {\n    // Your code here\n  }\n}', python: 'def union(arr1, arr2):\n    # Your code here\n    pass', javascript: 'function union(arr1, arr2) {\n    // Your code here\n}', typescript: 'function union(arr1: number[], arr2: number[]): number[] {\n    // Your code here\n}', cpp: 'class Solution {\npublic:\n    vector<int> unionArrays(vector<int>& arr1, vector<int>& arr2) {\n        // Your code here\n    }\n};' },
    testCases: [{ id: '1', input: ['[1, 2, 3]', '[2, 3, 4]'], output: '[1, 2, 3, 4]' }]
  },
  {
    id: 'intersection-arrays',
    topicId: 'arrays',
    subcategory: 'logic-building',
    title: 'Intersection of Two Arrays',
    difficulty: 'Easy',
    coins: 100,
    description: 'Find the intersection of two arrays.',
    examples: [{ input: 'nums1 = [1, 2, 2, 1], nums2 = [2, 2]', output: '[2]' }],
    constraints: [{ text: '1 <= nums1.length, nums2.length <= 1000' }],
    defaultCode: { java: 'class Solution {\n  public int[] intersection(int[] nums1, int[] nums2) {\n    // Your code here\n  }\n}', python: 'def intersection(nums1, nums2):\n    # Your code here\n    pass', javascript: 'function intersection(nums1, nums2) {\n    // Your code here\n}', typescript: 'function intersection(nums1: number[], nums2: number[]): number[] {\n    // Your code here\n}', cpp: 'class Solution {\npublic:\n    vector<int> intersection(vector<int>& nums1, vector<int>& nums2) {\n        // Your code here\n    }\n};' },
    testCases: [{ id: '1', input: ['[1, 2, 2, 1]', '[2, 2]'], output: '[2]' }]
  },
  {
    id: 'single-number',
    topicId: 'arrays',
    subcategory: 'logic-building',
    title: 'Single Number',
    difficulty: 'Easy',
    coins: 100,
    description: 'Find the number that appears only once in an array where every other number appears twice.',
    examples: [{ input: 'nums = [2, 2, 1]', output: '1' }],
    constraints: [{ text: '1 <= nums.length <= 3 * 10^4' }],
    defaultCode: { java: 'class Solution {\n  public int singleNumber(int[] nums) {\n    // Your code here\n  }\n}', python: 'def single_number(nums):\n    # Your code here\n    pass', javascript: 'function singleNumber(nums) {\n    // Your code here\n}', typescript: 'function singleNumber(nums: number[]): number {\n    // Your code here\n}', cpp: 'class Solution {\npublic:\n    int singleNumber(vector<int>& nums) {\n        // Your code here\n    }\n};' },
    testCases: [{ id: '1', input: ['[2, 2, 1]'], output: '1' }]
  },

  // ============= BINARY SEARCH - FUNDAMENTALS =============
  {
    id: 'binary-search',
    topicId: 'binary-search',
    subcategory: 'fundamentals',
    title: 'Binary Search',
    difficulty: 'Easy',
    coins: 100,
    description: 'Implement binary search in a sorted array.',
    examples: [{ input: 'nums = [-1, 0, 3, 5, 9, 12], target = 9', output: '4' }],
    constraints: [{ text: '1 <= nums.length <= 10^4' }],
    defaultCode: { java: 'class Solution {\n  public int binarySearch(int[] nums, int target) {\n    // Your code here\n  }\n}', python: 'def binary_search(nums, target):\n    # Your code here\n    pass', javascript: 'function binarySearch(nums, target) {\n    // Your code here\n}', typescript: 'function binarySearch(nums: number[], target: number): number {\n    // Your code here\n}', cpp: 'class Solution {\npublic:\n    int binarySearch(vector<int>& nums, int target) {\n        // Your code here\n    }\n};' },
    testCases: [{ id: '1', input: ['[-1, 0, 3, 5, 9, 12]', '9'], output: '4' }]
  },
  {
    id: 'first-last-occurrence',
    topicId: 'binary-search',
    subcategory: 'fundamentals',
    title: 'First and Last Occurrence',
    difficulty: 'Medium',
    coins: 150,
    description: 'Find first and last position of element in sorted array.',
    examples: [{ input: 'nums = [5, 7, 7, 8, 8, 10], target = 8', output: '[3, 4]' }],
    constraints: [{ text: '0 <= nums.length <= 10^5' }],
    defaultCode: { java: 'class Solution {\n  public int[] searchRange(int[] nums, int target) {\n    // Your code here\n  }\n}', python: 'def search_range(nums, target):\n    # Your code here\n    pass', javascript: 'function searchRange(nums, target) {\n    // Your code here\n}', typescript: 'function searchRange(nums: number[], target: number): number[] {\n    // Your code here\n}', cpp: 'class Solution {\npublic:\n    vector<int> searchRange(vector<int>& nums, int target) {\n        // Your code here\n    }\n};' },
    testCases: [{ id: '1', input: ['[5, 7, 7, 8, 8, 10]', '8'], output: '[3, 4]' }]
  },
  {
    id: 'count-occurrences',
    topicId: 'binary-search',
    subcategory: 'fundamentals',
    title: 'Count Occurrences',
    difficulty: 'Easy',
    coins: 100,
    description: 'Count occurrences of a number in a sorted array.',
    examples: [{ input: 'nums = [1, 1, 2, 2, 2, 2, 3], target = 2', output: '4' }],
    constraints: [{ text: '1 <= nums.length <= 10^5' }],
    defaultCode: { java: 'class Solution {\n  public int countOccurrences(int[] nums, int target) {\n    // Your code here\n  }\n}', python: 'def count_occurrences(nums, target):\n    # Your code here\n    pass', javascript: 'function countOccurrences(nums, target) {\n    // Your code here\n}', typescript: 'function countOccurrences(nums: number[], target: number): number {\n    // Your code here\n}', cpp: 'class Solution {\npublic:\n    int countOccurrences(vector<int>& nums, int target) {\n        // Your code here\n    }\n};' },
    testCases: [{ id: '1', input: ['[1, 1, 2, 2, 2, 2, 3]', '2'], output: '4' }]
  },
  {
    id: 'search-insert-position',
    topicId: 'binary-search',
    subcategory: 'fundamentals',
    title: 'Search Insert Position',
    difficulty: 'Easy',
    coins: 100,
    description: 'Find the index where target should be inserted in sorted array.',
    examples: [{ input: 'nums = [1, 3, 5, 6], target = 5', output: '2' }],
    constraints: [{ text: '1 <= nums.length <= 10^4' }],
    defaultCode: { java: 'class Solution {\n  public int searchInsert(int[] nums, int target) {\n    // Your code here\n  }\n}', python: 'def search_insert(nums, target):\n    # Your code here\n    pass', javascript: 'function searchInsert(nums, target) {\n    // Your code here\n}', typescript: 'function searchInsert(nums: number[], target: number): number {\n    // Your code here\n}', cpp: 'class Solution {\npublic:\n    int searchInsert(vector<int>& nums, int target) {\n        // Your code here\n    }\n};' },
    testCases: [{ id: '1', input: ['[1, 3, 5, 6]', '5'], output: '2' }]
  }
];

export const getProblem = (topicId: string, problemId: string): Problem | undefined => {
  return problems.find(p => p.topicId === topicId && p.id === problemId);
};

export const getProblems = (topicId: string): Problem[] => {
  return problems.filter(p => p.topicId === topicId);
};
