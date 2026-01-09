import { type FC } from 'react';
import { Calendar, Clock } from 'lucide-react';
import { type Session } from "../data/sessions";
import { formatDate } from "@/shared/utils/dateUtils";

interface PreviousSessionCardProps {
  session: Session;
}

const PreviousSessionCard: FC<PreviousSessionCardProps> = ({ session }) => {
  // Handle timeRange from API (stored as "14:00 - 16:00") or from session data
  const timeRange = (session as any).timeRange || `${(session as any).startTime || ''} - ${(session as any).endTime || ''}`;
  const { title, date, thumbnailUrl } = session as any;
  
  return (
    <div className="flex gap-2 sm:gap-3 p-2 sm:p-3 rounded-lg hover:bg-[#1a1a1a] transition-colors cursor-pointer">
      {/* Thumbnail */}
      <div className="w-14 h-14 sm:w-16 sm:h-16 flex-shrink-0 rounded-md bg-gray-800 overflow-hidden">
        {thumbnailUrl ? (
          <img src={thumbnailUrl} alt={title} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full bg-gray-800 flex items-center justify-center text-gray-600">
            <Calendar size={20} className="sm:w-6 sm:h-6" />
          </div>
        )}
      </div>
      
      {/* Content */}
      <div className="flex flex-col min-w-0 flex-1">
        <h4 className="font-medium text-xs sm:text-sm line-clamp-2 mb-1">{title}</h4>
        <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-0 text-xs text-[#9ca3af]">
          <div className="flex items-center">
            <Calendar size={10} className="sm:w-3 sm:h-3 mr-1" />
            <span className="sm:mr-3">{formatDate(new Date(date))}</span>
          </div>
          <div className="flex items-center">
            <Clock size={10} className="sm:w-3 sm:h-3 mr-1" />
            <span className="truncate">{timeRange}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PreviousSessionCard;
