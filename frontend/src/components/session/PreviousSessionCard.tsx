import { type FC } from 'react';
import { Calendar, Clock } from 'lucide-react';
import { type Session } from '../../data/sessions';
import { formatDate } from '../../utils/dateUtils';

interface PreviousSessionCardProps {
  session: Session;
}

const PreviousSessionCard: FC<PreviousSessionCardProps> = ({ session }) => {
  const { title, date, timeRange, thumbnailUrl } = session;
  
  return (
    <div className="flex gap-3 p-3 rounded-lg hover:bg-[#1a1a1a] transition-colors">
      {/* Thumbnail */}
      <div className="w-16 h-16 flex-shrink-0 rounded-md bg-gray-800 overflow-hidden">
        {thumbnailUrl ? (
          <img src={thumbnailUrl} alt={title} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full bg-gray-800 flex items-center justify-center text-gray-600">
            <Calendar size={24} />
          </div>
        )}
      </div>
      
      {/* Content */}
      <div className="flex flex-col">
        <h4 className="font-medium text-sm line-clamp-2">{title}</h4>
        <div className="flex items-center mt-1 text-xs text-[#9ca3af]">
          <Calendar size={12} className="mr-1" />
          <span className="mr-3">{formatDate(new Date(date))}</span>
          <Clock size={12} className="mr-1" />
          <span>{timeRange}</span>
        </div>
      </div>
    </div>
  );
};

export default PreviousSessionCard;
