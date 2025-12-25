import { type FC } from 'react';
import type { ReactElement } from 'react';
import { Badge, Medal, Award, Zap, Star } from 'lucide-react';

interface AchievementProps {
  badges: string[];
  className?: string;
}

const badgeIcons: Record<string, ReactElement> = {
  'Top Contributor': <Star size={14} className="text-yellow-500" />,
  'DSA Expert': <Zap size={14} className="text-blue-500" />,
  'Contest Winner': <Trophy size={14} className="text-green-500" />,
  'Algorithm Master': <Brain size={14} className="text-purple-500" />,
  '100 Day Streak': <Flame size={14} className="text-orange-500" />,
  'Dynamic Programming Pro': <Code size={14} className="text-cyan-500" />,
  'Graph Theory Expert': <Network size={14} className="text-indigo-500" />,
  'Tree Specialist': <GitBranch size={14} className="text-green-500" />,
  'Hard Problem Solver': <CheckCircle size={14} className="text-red-500" />,
  'SQL Expert': <Database size={14} className="text-blue-500" />,
  'Database Master': <Server size={14} className="text-blue-500" />,
  'Recursion Master': <RefreshCcw size={14} className="text-purple-500" />,
  'Backtracking Pro': <ArrowLeftRight size={14} className="text-indigo-500" />,
  'Array Specialist': <AlignLeft size={14} className="text-teal-500" />,
  'String Algorithms Expert': <Quote size={14} className="text-amber-500" />,
  'Greedy Algorithms Pro': <Target size={14} className="text-red-500" />,
  'Binary Search Expert': <Search size={14} className="text-sky-500" />,
  'OS Concepts Master': <Cpu size={14} className="text-slate-500" />,
  'Networking Expert': <Wifi size={14} className="text-blue-500" />,
  'DP Challenge Winner': <Medal size={14} className="text-yellow-500" />,
  'Graph Contest Champion': <Award size={14} className="text-amber-500" />,
  'Hash Table Expert': <Hash size={14} className="text-indigo-500" />,
  'Stack & Queue Master': <Layers size={14} className="text-orange-500" />,
  'Linked List Pro': <Link size={14} className="text-teal-500" />,
  'Tree Traversal Expert': <GitMerge size={14} className="text-green-500" />,
};

const Achievements: FC<AchievementProps> = ({ badges, className = '' }) => {
  return (
    <div className={`flex flex-wrap gap-2 ${className}`}>
      {badges.map((badge, index) => (
        <div 
          key={index}
          className="flex items-center gap-1.5 px-2 py-1 bg-[#252525] rounded-full text-xs"
        >
          {badgeIcons[badge] || <Badge size={14} />}
          <span>{badge}</span>
        </div>
      ))}
    </div>
  );
};

export default Achievements;

// Import missing icons
import { 
  Trophy, Flame, Code, Network, GitBranch, 
  CheckCircle, Database, Server, RefreshCcw,
  ArrowLeftRight, AlignLeft, Quote, Target, 
  Search, Cpu, Wifi, Hash, Layers, Link, 
  GitMerge, Brain 
} from 'lucide-react';
