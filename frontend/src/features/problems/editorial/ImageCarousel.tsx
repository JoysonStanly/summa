import { useState, useEffect, useRef, type FC } from 'react';
import { ChevronLeft, ChevronRight, Play, Pause, ExternalLink, Maximize2 } from 'lucide-react';
import type { ImageCarouselProps } from './types';

const ImageCarousel: FC<ImageCarouselProps> = ({ images }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMaximized, setIsMaximized] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  
  const goToPrevious = () => {
    setCurrentIndex((prevIndex) => (prevIndex === 0 ? images.length - 1 : prevIndex - 1));
  };
  
  const goToNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex === images.length - 1 ? 0 : prevIndex + 1));
  };

  const togglePlay = () => {
    setIsPlaying(!isPlaying);
  };

  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = images[currentIndex].src;
    link.download = `image-${currentIndex + 1}.png`;
    link.click();
  };

  useEffect(() => {
    if (isPlaying) {
      intervalRef.current = setInterval(() => {
        goToNext();
      }, 2000);
    } else if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isPlaying, currentIndex]);
  
  if (!images.length) {
    return null;
  }
  
  return (
    <div className="image-carousel-container mb-6">
      <div className="relative bg-zinc-900/30 border border-zinc-800 rounded-lg overflow-hidden">
        {/* Main Image Display */}
        <div className="carousel-image flex items-center justify-center w-full p-8" style={{ minHeight: '400px' }}>
          <img 
            src={images[currentIndex].src} 
            alt={images[currentIndex].alt || `Image ${currentIndex + 1}`} 
            className="max-w-full max-h-[500px] object-contain"
          />
        </div>
        
        {/* Navigation Arrows on Image */}
        {images.length > 1 && (
          <>
            <button 
              onClick={goToPrevious}
              className="absolute left-2 top-1/2 -translate-y-1/2 w-6 h-6 flex items-center justify-center rounded-full bg-black/60 hover:bg-black/80 transition-colors"
              aria-label="Previous"
            >
              <ChevronLeft size={14} className="text-white" />
            </button>
            <button 
              onClick={goToNext}
              className="absolute right-2 top-1/2 -translate-y-1/2 w-6 h-6 flex items-center justify-center rounded-full bg-black/60 hover:bg-black/80 transition-colors"
              aria-label="Next"
            >
              <ChevronRight size={14} className="text-white" />
            </button>
          </>
        )}

        {/* Control Bar at Bottom */}
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
          <div className="flex items-center justify-between">
            {/* Left: Navigation Controls */}
            <div className="flex items-center gap-2">
              <button
                onClick={goToPrevious}
                disabled={images.length <= 1}
                className="p-1.5 rounded bg-zinc-800/50 hover:bg-zinc-700/50 text-zinc-300 hover:text-white transition-colors disabled:opacity-30"
              >
                <ChevronLeft size={16} />
              </button>
              <span className="text-sm text-zinc-300 min-w-[50px] text-center">
                {currentIndex + 1}/{images.length}
              </span>
              <button
                onClick={goToNext}
                disabled={images.length <= 1}
                className="p-1.5 rounded bg-zinc-800/50 hover:bg-zinc-700/50 text-zinc-300 hover:text-white transition-colors disabled:opacity-30"
              >
                <ChevronRight size={16} />
              </button>
            </div>

            {/* Right: Action Buttons */}
            <div className="flex items-center gap-2">
              <button
                onClick={togglePlay}
                disabled={images.length <= 1}
                className="p-1.5 rounded bg-zinc-800/50 hover:bg-zinc-700/50 text-zinc-300 hover:text-white transition-colors disabled:opacity-30"
                title={isPlaying ? 'Pause' : 'Play'}
              >
                {isPlaying ? <Pause size={16} /> : <Play size={16} />}
              </button>
              <button
                onClick={handleDownload}
                className="p-1.5 rounded bg-zinc-800/50 hover:bg-zinc-700/50 text-zinc-300 hover:text-white transition-colors"
                title="Download"
              >
                <ExternalLink size={16} />
              </button>
              <button
                onClick={() => setIsMaximized(!isMaximized)}
                className="p-1.5 rounded bg-zinc-800/50 hover:bg-zinc-700/50 text-zinc-300 hover:text-white transition-colors"
                title="Maximize"
              >
                <Maximize2 size={16} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImageCarousel;
