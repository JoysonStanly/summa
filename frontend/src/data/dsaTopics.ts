// DSA Topics and Subtopics Structure

export interface DSASubtopic {
  id: string;
  name: string;
  description?: string;
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
      { id: 'fundamentals', name: 'Fundamentals', description: 'Basic array operations and concepts' },
      { id: 'logic-building', name: 'Logic Building', description: 'Build problem-solving logic' },
      { id: 'faqs-easy', name: 'FAQs (Easy)', description: 'Frequently asked easy problems' },
      { id: 'faqs-medium', name: 'FAQs (Medium)', description: 'Frequently asked medium problems' },
      { id: 'faqs-hard', name: 'FAQs (Hard)', description: 'Frequently asked hard problems' },
    ]
  },
  {
    id: 'strings',
    name: 'Strings',
    subtopics: [
      { id: 'fundamentals', name: 'Fundamentals', description: 'Basic string operations' },
      { id: 'pattern-matching', name: 'Pattern Matching', description: 'String pattern algorithms' },
      { id: 'faqs-easy', name: 'FAQs (Easy)' },
      { id: 'faqs-medium', name: 'FAQs (Medium)' },
      { id: 'faqs-hard', name: 'FAQs (Hard)' },
    ]
  },
  {
    id: 'linked-lists',
    name: 'Linked Lists',
    subtopics: [
      { id: 'fundamentals', name: 'Fundamentals', description: 'Singly and doubly linked lists' },
      { id: 'logic-building', name: 'Logic Building' },
      { id: 'faqs-easy', name: 'FAQs (Easy)' },
      { id: 'faqs-medium', name: 'FAQs (Medium)' },
      { id: 'faqs-hard', name: 'FAQs (Hard)' },
    ]
  },
  {
    id: 'stacks',
    name: 'Stacks & Queues',
    subtopics: [
      { id: 'fundamentals', name: 'Fundamentals', description: 'Stack and queue basics' },
      { id: 'implementation', name: 'Implementation', description: 'Various implementations' },
      { id: 'faqs-easy', name: 'FAQs (Easy)' },
      { id: 'faqs-medium', name: 'FAQs (Medium)' },
      { id: 'faqs-hard', name: 'FAQs (Hard)' },
    ]
  },
  {
    id: 'trees',
    name: 'Trees',
    subtopics: [
      { id: 'fundamentals', name: 'Fundamentals', description: 'Binary trees basics' },
      { id: 'binary-search-tree', name: 'Binary Search Tree', description: 'BST operations' },
      { id: 'traversals', name: 'Traversals', description: 'Tree traversal techniques' },
      { id: 'faqs-easy', name: 'FAQs (Easy)' },
      { id: 'faqs-medium', name: 'FAQs (Medium)' },
      { id: 'faqs-hard', name: 'FAQs (Hard)' },
    ]
  },
  {
    id: 'graphs',
    name: 'Graphs',
    subtopics: [
      { id: 'fundamentals', name: 'Fundamentals', description: 'Graph representations' },
      { id: 'traversals', name: 'Traversals', description: 'BFS and DFS' },
      { id: 'shortest-path', name: 'Shortest Path', description: 'Dijkstra, Bellman-Ford' },
      { id: 'faqs-easy', name: 'FAQs (Easy)' },
      { id: 'faqs-medium', name: 'FAQs (Medium)' },
      { id: 'faqs-hard', name: 'FAQs (Hard)' },
    ]
  },
  {
    id: 'dynamic-programming',
    name: 'Dynamic Programming',
    subtopics: [
      { id: 'fundamentals', name: 'Fundamentals', description: 'DP basics and patterns' },
      { id: '1d-dp', name: '1D DP', description: 'Single dimension problems' },
      { id: '2d-dp', name: '2D DP', description: 'Two dimension problems' },
      { id: 'faqs-easy', name: 'FAQs (Easy)' },
      { id: 'faqs-medium', name: 'FAQs (Medium)' },
      { id: 'faqs-hard', name: 'FAQs (Hard)' },
    ]
  },
  {
    id: 'sorting',
    name: 'Sorting',
    subtopics: [
      { id: 'fundamentals', name: 'Fundamentals', description: 'Basic sorting algorithms' },
      { id: 'advanced', name: 'Advanced Sorting', description: 'Merge sort, Quick sort' },
      { id: 'faqs-easy', name: 'FAQs (Easy)' },
      { id: 'faqs-medium', name: 'FAQs (Medium)' },
    ]
  },
  {
    id: 'searching',
    name: 'Searching',
    subtopics: [
      { id: 'fundamentals', name: 'Fundamentals', description: 'Linear and binary search' },
      { id: 'binary-search-variants', name: 'Binary Search Variants', description: 'Advanced binary search' },
      { id: 'faqs-easy', name: 'FAQs (Easy)' },
      { id: 'faqs-medium', name: 'FAQs (Medium)' },
    ]
  },
  {
    id: 'heaps',
    name: 'Heaps',
    subtopics: [
      { id: 'fundamentals', name: 'Fundamentals', description: 'Min heap and max heap' },
      { id: 'priority-queue', name: 'Priority Queue', description: 'Heap applications' },
      { id: 'faqs-easy', name: 'FAQs (Easy)' },
      { id: 'faqs-medium', name: 'FAQs (Medium)' },
      { id: 'faqs-hard', name: 'FAQs (Hard)' },
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
