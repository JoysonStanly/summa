import { type FC } from 'react';
import { motion } from 'framer-motion';
import { Calendar, Laptop } from 'lucide-react';
import { type Session } from "../data/sessions";

interface UpcomingSessionsProps {
  sessions: Session[];
}

const UpcomingSessions: FC<UpcomingSessionsProps> = ({ sessions }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="w-full"
    >
      <h2 className="text-xl font-bold mb-4">Upcoming Sessions</h2>
      
      {sessions.length === 0 ? (
        <NoSessionsPlaceholder />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {sessions.map(session => (
            <SessionCard key={session.id} session={session} />
          ))}
        </div>
      )}
    </motion.div>
  );
};

const NoSessionsPlaceholder: FC = () => {
  return (
    <motion.div 
      className="flex flex-col items-center justify-center bg-[#111111] border border-[#2a2a2a] rounded-lg p-8 text-center"
      initial={{ scale: 0.95, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ delay: 0.2 }}
    >
      <div className="w-20 h-20 flex items-center justify-center bg-[#1a1a1a] rounded-full mb-4">
        <Laptop size={32} className="text-gray-400" />
      </div>
      <h3 className="text-lg font-medium mb-2">No sessions available...</h3>
      <p className="text-sm text-[#9ca3af]">No Upcoming Sessions</p>
    </motion.div>
  );
};

interface SessionCardProps {
  session: Session;
}

const SessionCard: FC<SessionCardProps> = ({ session }) => {
  const { title, date, timeRange, instructor, thumbnailUrl, category, isLive } = session;
  
  return (
    <motion.div 
      className="bg-[#111111] border border-[#2a2a2a] rounded-lg overflow-hidden"
      whileHover={{ scale: 1.02, boxShadow: '0 4px 20px rgba(0,0,0,0.3)' }}
    >
      {/* Thumbnail */}
      <div className="relative w-full h-32 bg-gray-800">
        {thumbnailUrl ? (
          <img src={thumbnailUrl} alt={title} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <Calendar size={40} className="text-gray-600" />
          </div>
        )}
        
        {isLive && (
          <div className="absolute top-2 right-2 bg-red-600 text-white text-xs px-2 py-1 rounded-full">
            LIVE
          </div>
        )}
        
        <div className="absolute bottom-2 left-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
          {category}
        </div>
      </div>
      
      {/* Content */}
      <div className="p-4">
        <h3 className="font-medium text-base mb-1">{title}</h3>
        <p className="text-sm text-[#9ca3af] mb-2">{instructor}</p>
        
        <div className="flex items-center justify-between text-xs text-[#9ca3af]">
          <div className="flex items-center">
            <Calendar size={12} className="mr-1" />
            <span>{new Date(date).toLocaleDateString()}</span>
          </div>
          <span>{timeRange}</span>
        </div>
      </div>
    </motion.div>
  );
};

export default UpcomingSessions;
