import { useState } from "react";
import { Play, Heart, ChevronLeft, ChevronRight, Check } from "lucide-react";

interface VideoPlayerProps {
  title: string;
  videoUrl?: string;
  isCompleted?: boolean;
  onMarkComplete: (completed: boolean) => void;
  onPrevious?: () => void;
  onNext?: () => void;
  hasPrevious?: boolean;
  hasNext?: boolean;
}

const VideoPlayer = ({
  title,
  isCompleted = false,
  onMarkComplete,
  onPrevious,
  onNext,
  hasPrevious = false,
  hasNext = false,
}: VideoPlayerProps) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [likes, setLikes] = useState(171);

  const handlePlay = () => {
    setIsPlaying(true);
    // Here you would typically initialize the actual video player
  };

  const handleLike = () => {
    setIsLiked(!isLiked);
    setLikes(prev => isLiked ? prev - 1 : prev + 1);
  };

  const handleMarkComplete = () => {
    onMarkComplete(!isCompleted);
  };

  return (
    <div className="space-y-6">
      {/* Title */}
      <h1 className="text-3xl font-bold text-white">{title}</h1>

      {/* Video Player */}
      <div className="relative bg-black rounded-lg overflow-hidden aspect-video">
        {!isPlaying ? (
          <div className="flex items-center justify-center h-full">
            <button
              onClick={handlePlay}
              className="w-20 h-20 bg-blue-500 rounded-full flex items-center justify-center hover:bg-blue-600 transition-colors"
            >
              <Play className="w-8 h-8 text-white ml-1" fill="white" />
            </button>
          </div>
        ) : (
          <div className="w-full h-full bg-gray-900 flex items-center justify-center">
            <p className="text-white">Video Player Would Be Here</p>
            {/* In a real implementation, you'd embed an actual video player here */}
          </div>
        )}
      </div>

      {/* Mark as Completed Toggle */}
      <div className="flex items-center justify-end">
        <button
          onClick={handleMarkComplete}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
            isCompleted
              ? 'bg-green-500/20 text-green-400 border border-green-500'
              : 'bg-orange-500/20 text-orange-400 border border-orange-500'
          }`}
        >
          <Check className="w-4 h-4" />
          <span className="text-sm font-medium">
            {isCompleted ? 'Completed' : 'Mark as Completed'}
          </span>
        </button>
      </div>

      {/* Controls */}
      <div className="flex items-center justify-between">
        {/* Like Button */}
        <button
          onClick={handleLike}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
            isLiked
              ? 'bg-red-500/20 text-red-400'
              : 'bg-gray-800 text-gray-400 hover:text-white'
          }`}
        >
          <Heart className={`w-5 h-5 ${isLiked ? 'fill-current' : ''}`} />
          <span className="text-sm">{likes}</span>
        </button>

        {/* Navigation */}
        <div className="flex items-center gap-2">
          <button
            onClick={onPrevious}
            disabled={!hasPrevious}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
              hasPrevious
                ? 'bg-gray-800 text-gray-400 hover:text-white'
                : 'bg-gray-800/50 text-gray-600 cursor-not-allowed'
            }`}
          >
            <ChevronLeft className="w-4 h-4" />
            <span className="text-sm">Previous</span>
          </button>

          <button
            onClick={onNext}
            disabled={!hasNext}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
              hasNext
                ? 'bg-gray-800 text-gray-400 hover:text-white'
                : 'bg-gray-800/50 text-gray-600 cursor-not-allowed'
            }`}
          >
            <span className="text-sm">Next</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default VideoPlayer;
