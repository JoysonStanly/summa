import { type FC } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import PreviousSessionCard from './PreviousSessionCard';
import { type Session } from "../data/sessions";

interface PreviousSessionsProps {
  sessions: Session[];
}

const PreviousSessions: FC<PreviousSessionsProps> = ({ sessions }) => {
  return (
    <motion.div 
      className="bg-[#111111] border border-[#2a2a2a] rounded-lg p-3 sm:p-4"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <h3 className="text-base sm:text-lg font-medium mb-3 sm:mb-4">Previous Sessions</h3>
      
      <div className="space-y-1">
        {sessions.map(session => (
          <PreviousSessionCard key={session._id || session.id} session={session} />
        ))}
      </div>
      
      {sessions.length > 0 && (
        <div className="mt-3 sm:mt-4 flex justify-center">
          <button className="py-2 px-3 sm:px-4 border border-orange-500 text-orange-500 rounded-lg text-xs sm:text-sm flex items-center gap-1 hover:bg-orange-500/10 transition-colors">
            View More <ArrowRight size={14} className="sm:w-4 sm:h-4" />
          </button>
        </div>
      )}
    </motion.div>
  );
};

export default PreviousSessions;
