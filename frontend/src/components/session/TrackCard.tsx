import { type FC } from 'react';
import { motion } from 'framer-motion';
import { BookOpen, Award, Box } from 'lucide-react';
import { ProgressCircle } from '../ui';

interface TrackCardProps {
  title: string;
  color: string;
  topics?: { count: number; label: string };
  contests?: { count: number; label: string };
  problems?: { count: number; label: string };
  modules?: { count: number; label: string };
  chapters?: { count: number; label: string };
  quizzes?: { count: number; label: string };
  progress: number;
  icon?: React.ReactNode;
}

const TrackCard: FC<TrackCardProps> = ({
  title,
  color,
  topics,
  contests,
  problems,
  modules,
  chapters,
  quizzes,
  progress,
  icon
}) => {
  // Define gradient based on color
  const getGradient = () => {
    const gradients: Record<string, string> = {
      teal: 'from-teal-900 to-teal-700',
      cyan: 'from-cyan-900 to-cyan-700',
      purple: 'from-purple-900 to-purple-700',
      blue: 'from-blue-900 to-blue-700',
      pink: 'from-pink-900 to-pink-700',
      red: 'from-red-900 to-red-700',
    };

    return gradients[color] || 'from-gray-900 to-gray-700';
  };

  return (
    <motion.div 
      className={`relative bg-gradient-to-br ${getGradient()} rounded-lg overflow-hidden p-5 h-full border border-white/10`}
      whileHover={{ scale: 1.03, boxShadow: '0 8px 25px rgba(0,0,0,0.5)' }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      {/* Background pattern for visual interest */}
      <div className="absolute inset-0 opacity-10">
        <svg width="100%" height="100%" className="text-white">
          <pattern id="pattern-circles" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
            <circle id="pattern-circle" cx="10" cy="10" r="1" fill="currentColor" />
          </pattern>
          <rect x="0" y="0" width="100%" height="100%" fill="url(#pattern-circles)" />
        </svg>
      </div>
      
      <div className="absolute top-4 right-4">
        <ProgressCircle 
          percentage={progress} 
          color={progress > 0 ? "white" : "transparent"} 
        />
      </div>
      
      {/* Content */}
      <div className="flex flex-col h-full relative z-10">
        <h3 className="font-semibold text-xl mb-7">{title}</h3>
        
        <div className="flex flex-col gap-3 mt-auto">
          {/* Topic count */}
          {topics && (
            <div className="flex items-center gap-2.5 text-sm">
              <BookOpen size={16} className="text-white/80" />
              <span className="font-medium mr-1">{topics.count}+</span>
              <span className="text-white/70">{topics.label}</span>
            </div>
          )}
          
          {/* Contest count */}
          {contests && (
            <div className="flex items-center gap-2.5 text-sm">
              <Award size={16} className="text-white/80" />
              <span className="font-medium mr-1">{contests.count}+</span>
              <span className="text-white/70">{contests.label}</span>
            </div>
          )}
          
          {/* Problems count */}
          {problems && (
            <div className="flex items-center gap-2.5 text-sm">
              <Box size={16} className="text-white/80" />
              <span className="font-medium mr-1">{problems.count}+</span>
              <span className="text-white/70">{problems.label}</span>
            </div>
          )}
          
          {/* Modules count */}
          {modules && (
            <div className="flex items-center gap-2.5 text-sm">
              <BookOpen size={16} className="text-white/80" />
              <span className="font-medium mr-1">{modules.count}+</span>
              <span className="text-white/70">{modules.label}</span>
            </div>
          )}
          
          {/* Chapters count */}
          {chapters && (
            <div className="flex items-center gap-2.5 text-sm">
              <BookOpen size={16} className="text-white/80" />
              <span className="font-medium mr-1">{chapters.count}+</span>
              <span className="text-white/70">{chapters.label}</span>
            </div>
          )}
          
          {/* Quizzes count */}
          {quizzes && (
            <div className="flex items-center gap-2.5 text-sm">
              <Award size={16} className="text-white/80" />
              <span className="font-medium mr-1">{quizzes.count}+</span>
              <span className="text-white/70">{quizzes.label}</span>
            </div>
          )}
        </div>
        
        {/* Button to indicate interactivity */}
        <button className="w-full mt-5 py-2.5 bg-white/10 hover:bg-white/20 text-sm font-medium rounded-md transition-colors">
          Continue
        </button>
        
        {/* Card Icon */}
        {icon && (
          <div className="absolute bottom-5 right-5 opacity-15 text-white">
            {icon}
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default TrackCard;
