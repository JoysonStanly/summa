// NOTE: This file is deprecated and kept only for reference. 
// Please use DSASidebar.tsx for DSA pages and Sidebar.tsx for other pages.

import { useState } from 'react';
import { Home, Book, Trophy, User, Database, SortDesc, Hash, Network, Layers, ChevronDown, ChevronRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { Link, useLocation } from 'react-router-dom';

interface SidebarProps {
  activePage?: 'home' | 'sessions' | 'rankings' | 'dsa';
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

const EnhancedSidebar = ({ activePage, activeTopicId, activeProblemId }: SidebarProps) => {
  const location = useLocation();
  const path = location.pathname;
  const [expandedTopics, setExpandedTopics] = useState<Record<string, boolean>>({});
  
  // Check if we're on a DSA page
  const isDSA = path.includes('/dsa');
  
  // Toggle topic expansion
  const toggleTopic = (topicId: string) => {
    setExpandedTopics({
      ...expandedTopics,
      [topicId]: !expandedTopics[topicId]
    });
  };

  // Determine active page based on URL path
  const isHome = path === '/';
  const isSessions = path === '/sessions';
  const isRankings = path === '/rankings';
  
  return (
    <motion.aside 
      initial={{ x: -100, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      className="fixed left-0 top-0 h-full w-20 bg-[#1a1a1a] flex flex-col items-center py-6 border-r border-[#2a2a2a] z-10"
    >
      {/* Logo */}
      <div className="mb-12">
        <h1 className="text-xl font-bold">TUF</h1>
      </div>

      {/* Main Navigation */}
      <nav className="flex-1 flex flex-col gap-6">
        <NavItem icon={<Home size={20} />} label="Home" to="/" active={isHome} />
        <NavItem icon={<Book size={20} />} label="Sessions" to="/sessions" active={isSessions} />
        <NavItem icon={<Trophy size={20} />} label="Rankings" to="/rankings" active={isRankings} />
        <NavItem icon={<Network size={20} />} label="DSA" to="/dsa" active={isDSA} />
        
        {/* DSA Topics - Only visible when on DSA pages */}
        {isDSA && (
          <div className="mt-4 w-[200px] absolute left-20 top-32 bg-[#1a1a1a] border border-[#2a2a2a] rounded-md p-2 shadow-lg">
            <h3 className="text-xs uppercase text-gray-500 font-bold mb-2 px-2">DSA Topics</h3>
            
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
                  <div className="ml-6 mt-1 space-y-1">
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
        )}
      </nav>

      {/* User Profile */}
      <div className="mt-auto mb-6">
        <div className="relative w-10 h-10 rounded-full bg-gray-700 overflow-hidden flex items-center justify-center">
          <User size={20} />
        </div>
      </div>
    </motion.aside>
  );
};

interface NavItemProps {
  icon: React.ReactNode;
  label: string;
  to: string;
  active?: boolean;
}

const NavItem = ({ icon, label, to, active }: NavItemProps) => {
  return (
    <div className="relative w-full flex flex-col items-center">
      {active && (
        <motion.div 
          layoutId="nav-indicator"
          className="absolute left-0 w-1 h-8 bg-white rounded-r-full"
        />
      )}
      <Link to={to}>
        <div 
          className={`w-12 h-12 rounded-xl flex items-center justify-center relative ${
            active ? 'text-white bg-[#111]' : 'text-[#9ca3af] hover:text-white'
          }`}
          title={label}
        >
          {icon}
        </div>
      </Link>
    </div>
  );
};

export default EnhancedSidebar;
