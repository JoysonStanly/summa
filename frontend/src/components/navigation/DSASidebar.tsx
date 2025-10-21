import { useState, useEffect } from 'react';
import { Home, User, Database, SortDesc, Hash, Network, Layers, ChevronDown, ChevronRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { Link, useLocation } from 'react-router-dom';

interface DSASidebarProps {
  activeTopicId?: string;
  activeProblemId?: string;
}

interface DSATopic {
  id: string;
  name: string;
  icon: JSX.Element;
  problems: {
    id: string;
    name: string;
  }[];
}

// DSA Topics data
const dsaTopics: DSATopic[] = [
  {
    id: 'arrays',
    name: 'Arrays',
    icon: <Database size={16} />,
    problems: [
      { id: 'linear-search', name: 'Linear Search' },
      { id: 'largest-element', name: 'Largest Element' },
      { id: 'second-largest', name: 'Second Largest Element' }
    ]
  },
  {
    id: 'sorting',
    name: 'Sorting',
    icon: <SortDesc size={16} />,
    problems: [
      { id: 'bubble-sort', name: 'Bubble Sort' },
      { id: 'selection-sort', name: 'Selection Sort' },
      { id: 'insertion-sort', name: 'Insertion Sort' }
    ]
  },
  {
    id: 'hashing',
    name: 'Hashing',
    icon: <Hash size={16} />,
    problems: [
      { id: 'frequency-count', name: 'Frequency Count' },
      { id: 'union-intersection', name: 'Union & Intersection' },
      { id: 'count-distinct', name: 'Count Distinct Elements' }
    ]
  },
  {
    id: 'dynamic-programming',
    name: 'Dynamic Programming',
    icon: <Layers size={16} />,
    problems: [
      { id: 'fibonacci', name: 'Fibonacci Number' },
      { id: 'knapsack', name: 'Knapsack Problem' },
      { id: 'lcs', name: 'Longest Common Subsequence' }
    ]
  }
];

const DSASidebar = ({ activeTopicId, activeProblemId }: DSASidebarProps) => {
  const location = useLocation();
  const [expandedTopics, setExpandedTopics] = useState<Record<string, boolean>>({});
  
  // Toggle topic expansion
  const toggleTopic = (topicId: string) => {
    setExpandedTopics({
      ...expandedTopics,
      [topicId]: !expandedTopics[topicId]
    });
  };

  // Auto-expand the active topic
  useEffect(() => {
    if (activeTopicId && !expandedTopics[activeTopicId]) {
      setExpandedTopics(prev => ({
        ...prev,
        [activeTopicId]: true
      }));
    }
  }, [activeTopicId]);

  return (
    <motion.aside 
      initial={{ x: -100, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      className="fixed left-0 top-0 h-full w-[250px] bg-[#1a1a1a] flex flex-col py-6 border-r border-[#2a2a2a] z-10 overflow-y-auto"
    >
      {/* Logo and Home Link */}
      <div className="flex items-center gap-3 px-4 mb-8">
        <Link to="/" className="flex items-center gap-2 text-gray-400 hover:text-white">
          <Home size={18} />
          <span>Back to Home</span>
        </Link>
      </div>

      {/* DSA Header */}
      <div className="px-4 mb-4">
        <h2 className="flex items-center gap-2 text-xl font-bold">
          <Network size={20} />
          <span>DSA</span>
        </h2>
      </div>

      {/* DSA Topics Navigation */}
      <div className="flex-1 px-2">
        <h3 className="px-2 mb-2 text-xs font-bold text-gray-500 uppercase">Topics</h3>
        
        {dsaTopics.map(topic => (
          <div key={topic.id} className="mb-1">
            <div 
              className={`flex items-center justify-between px-2 py-1.5 text-sm rounded-md cursor-pointer ${
                topic.id === activeTopicId ? 'bg-[#333] text-white' : 'text-gray-300 hover:bg-[#222]'
              }`}
              onClick={() => toggleTopic(topic.id)}
            >
              <div className="flex items-center gap-2">
                <span>{topic.icon}</span>
                <span>{topic.name}</span>
              </div>
              {expandedTopics[topic.id] ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
            </div>
            
            {expandedTopics[topic.id] && (
              <div className="mt-1 ml-6 space-y-1">
                {topic.problems.map(problem => (
                  <Link
                    key={problem.id}
                    to={`/dsa/${topic.id}/${problem.id}`}
                    className={`block px-2 py-1 text-xs rounded-md ${
                      activeProblemId === problem.id ? 'bg-blue-900 text-white' : 'text-gray-400 hover:text-white'
                    }`}
                  >
                    {problem.name}
                  </Link>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* User Profile */}
      <div className="mt-auto px-4 pt-4 border-t border-[#2a2a2a]">
        <div className="flex items-center gap-3">
          <div className="relative flex items-center justify-center w-8 h-8 overflow-hidden bg-gray-700 rounded-full">
            <User size={16} />
          </div>
          <div className="text-sm">User Profile</div>
        </div>
      </div>
    </motion.aside>
  );
};

export default DSASidebar;
