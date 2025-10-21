import { type FC } from 'react';
import { Play } from 'lucide-react';
import { motion } from 'framer-motion';

interface VideoCardProps {
  title: string;
  subtitle?: string;
  thumbnailUrl?: string;
  videoUrl?: string;
}

const VideoCard: FC<VideoCardProps> = ({ title, subtitle, thumbnailUrl, videoUrl }) => {
  const handleVideoClick = () => {
    if (videoUrl) {
      window.open(videoUrl, '_blank');
    }
  };

  return (
    <motion.div 
      className="mb-6 cursor-pointer"
      whileHover={{ scale: 1.01 }}
      onClick={handleVideoClick}
    >
      <div className="relative w-full h-64 rounded-lg overflow-hidden bg-[#1a1a1a] mb-3">
        {thumbnailUrl ? (
          <img 
            src={thumbnailUrl} 
            alt={title} 
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-[#111] to-[#222] flex items-center justify-center">
            <span className="text-[#555] font-medium text-lg">Video Preview</span>
          </div>
        )}
        
        {/* Play button overlay */}
        <div className="absolute inset-0 flex items-center justify-center bg-black/30 opacity-0 hover:opacity-100 transition-opacity">
          <div className="w-16 h-16 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center">
            <Play size={30} className="text-white ml-1" />
          </div>
        </div>
      </div>
      
      <h2 className="text-xl font-medium mb-1">{title}</h2>
      {subtitle && <p className="text-[#9ca3af] text-sm">{subtitle}</p>}
    </motion.div>
  );
};

export default VideoCard;
