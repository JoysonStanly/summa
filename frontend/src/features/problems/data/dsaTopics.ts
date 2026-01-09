// DSA Topics and Subtopics Structure

export interface DSASubtopic {
  id: string;
  name: string;
  description?: string;
  problems?: Array<{ id: string; name: string }>;
}

export interface DSATopic {
  id: string;
  name: string;
  icon?: string;
  subtopics: DSASubtopic[];
}

export const dsaTopics: DSATopic[] = [
  {
    id: 'arrays',
    name: 'Arrays',
    subtopics: [
      { 
        id: 'fundamentals', 
        name: 'Fundamentals', 
        description: 'Basic array operations and concepts',
        problems: [
          { id: 'linear-search', name: 'Linear Search' },
          { id: 'largest-element', name: 'Largest Element' },
          { id: 'reverse-array', name: 'Reverse an Array' },
          { id: 'find-minimum', name: 'Find Minimum Element' },
          { id: 'count-frequency', name: 'Count Element Frequency' },
          { id: 'sum-of-array', name: 'Sum of Array Elements' },
          { id: 'second-largest-element', name: 'Second Largest Element' },
          { id: 'check-array-sorted', name: 'Check if Array is Sorted' },
          { id: 'maximum-consecutive-ones', name: 'Maximum Consecutive Ones' },
          { id: 'left-rotate-array-one', name: 'Left Rotate Array by One' },
          { id: 'left-rotate-array-k', name: 'Left Rotate Array by K Places' },
        ]
      },
      { 
        id: 'logic-building', 
        name: 'Logic Building', 
        description: 'Build problem-solving logic',
        problems: [
          { id: 'move-zeros-end', name: 'Move Zeros to End' },
          { id: 'remove-duplicates-sorted', name: 'Remove Duplicates from Sorted Array' },
          { id: 'find-missing-number', name: 'Find Missing Number' },
          { id: 'union-sorted-arrays', name: 'Union of Two Sorted Arrays' },
          { id: 'intersection-arrays', name: 'Intersection of Two Arrays' },
          { id: 'single-number', name: 'Single Number' },
        ]
      },
    ]
  },
  {
    id: 'binary-search',
    name: 'Binary Search',
    subtopics: [
      { id: 'fundamentals', name: 'Fundamentals', description: 'Binary search basics' },
      { id: 'logic-building', name: 'Logic Building', description: 'Advanced binary search patterns' },
    ]
  },
  {
    id: 'sorting',
    name: 'Sorting',
    subtopics: [
      { id: 'fundamentals', name: 'Fundamentals', description: 'Basic sorting algorithms' },
      { id: 'logic-building', name: 'Logic Building', description: 'Advanced sorting techniques' },
    ]
  },
  {
    id: 'strings',
    name: 'Strings',
    subtopics: [
      { id: 'fundamentals', name: 'Fundamentals', description: 'Basic string operations' },
      { id: 'logic-building', name: 'Logic Building', description: 'String pattern matching and manipulation' },
    ]
  },
  {
    id: 'recursion',
    name: 'Recursion',
    subtopics: [
      { id: 'fundamentals', name: 'Fundamentals', description: 'Recursion basics' },
      { id: 'logic-building', name: 'Logic Building', description: 'Advanced recursion patterns' },
    ]
  },
  {
    id: 'hashing',
    name: 'Hashing',
    subtopics: [
      { id: 'fundamentals', name: 'Fundamentals', description: 'Hash tables and maps' },
      { id: 'logic-building', name: 'Logic Building', description: 'Hash-based problem solving' },
    ]
  },
  {
    id: 'linked-list',
    name: 'Linked List',
    subtopics: [
      { id: 'fundamentals', name: 'Fundamentals', description: 'Singly and doubly linked lists' },
      { id: 'logic-building', name: 'Logic Building', description: 'Advanced linked list problems' },
    ]
  },
  {
    id: 'stack',
    name: 'Stack',
    subtopics: [
      { id: 'fundamentals', name: 'Fundamentals', description: 'Stack basics and implementation' },
      { id: 'logic-building', name: 'Logic Building', description: 'Stack-based problem solving' },
    ]
  },
  {
    id: 'queue',
    name: 'Queue',
    subtopics: [
      { id: 'fundamentals', name: 'Fundamentals', description: 'Queue basics and implementation' },
      { id: 'logic-building', name: 'Logic Building', description: 'Queue-based problem solving' },
    ]
  },
  {
    id: 'trees',
    name: 'Trees',
    subtopics: [
      { id: 'fundamentals', name: 'Fundamentals', description: 'Binary tree basics' },
      { id: 'logic-building', name: 'Logic Building', description: 'Tree traversals and patterns' },
    ]
  },
  {
    id: 'binary-search-tree',
    name: 'Binary Search Tree',
    subtopics: [
      { id: 'fundamentals', name: 'Fundamentals', description: 'BST operations' },
      { id: 'logic-building', name: 'Logic Building', description: 'Advanced BST problems' },
    ]
  },
  {
    id: 'heap',
    name: 'Heap',
    subtopics: [
      { id: 'fundamentals', name: 'Fundamentals', description: 'Min heap and max heap' },
      { id: 'logic-building', name: 'Logic Building', description: 'Heap-based algorithms' },
    ]
  },
  {
    id: 'graph',
    name: 'Graph',
    subtopics: [
      { id: 'fundamentals', name: 'Fundamentals', description: 'Graph representations and traversals' },
      { id: 'logic-building', name: 'Logic Building', description: 'Graph algorithms and patterns' },
    ]
  },
  {
    id: 'dynamic-programming',
    name: 'Dynamic Programming',
    subtopics: [
      { id: 'fundamentals', name: 'Fundamentals', description: 'DP basics and patterns' },
      { id: 'logic-building', name: 'Logic Building', description: 'Advanced DP problems' },
    ]
  },
  {
    id: 'greedy',
    name: 'Greedy',
    subtopics: [
      { id: 'logic-building', name: 'Logic Building', description: 'Greedy algorithm patterns' },
    ]
  },
  {
    id: 'backtracking',
    name: 'Backtracking',
    subtopics: [
      { id: 'logic-building', name: 'Logic Building', description: 'Backtracking patterns and techniques' },
    ]
  }
];

// Helper function to get subtopics for a topic
export const getSubtopicsForTopic = (topicId: string): DSASubtopic[] => {
  const topic = dsaTopics.find(t => t.id === topicId);
  return topic?.subtopics || [];
};

// Helper function to get topic name
export const getTopicName = (topicId: string): string => {
  const topic = dsaTopics.find(t => t.id === topicId);
  return topic?.name || topicId;
};

// Helper function to get subtopic name
export const getSubtopicName = (topicId: string, subtopicId: string): string => {
  const topic = dsaTopics.find(t => t.id === topicId);
  const subtopic = topic?.subtopics.find(s => s.id === subtopicId);
  return subtopic?.name || subtopicId;
};
