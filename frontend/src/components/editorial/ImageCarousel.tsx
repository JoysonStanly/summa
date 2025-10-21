import { useState, type FC } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import type { ImageCarouselProps } from './types';

const ImageCarousel: FC<ImageCarouselProps> = ({ images }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  
  const goToPrevious = () => {
    setCurrentIndex((prevIndex) => (prevIndex === 0 ? images.length - 1 : prevIndex - 1));
  };
  
  const goToNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex === images.length - 1 ? 0 : prevIndex + 1));
  };
  
  if (!images.length) {
    return null;
  }
  
  return (
    <div className="relative mb-6">
      <div className="relative bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="w-full flex items-center justify-center p-4"
          >
            <img 
              src={images[currentIndex].src} 
              alt={images[currentIndex].alt || `Dry run step ${currentIndex + 1}`} 
              className="max-w-full max-h-[400px] object-contain"
            />
          </motion.div>
        </AnimatePresence>
        
        {/* Navigation buttons */}
        {images.length > 1 && (
          <>
            <button 
              onClick={goToPrevious}
              className="absolute left-2 top-1/2 -translate-y-1/2 w-10 h-10 flex items-center justify-center rounded-full bg-black/40 hover:bg-black/60 transition-colors"
              aria-label="Previous image"
            >
              <ChevronLeft size={24} className="text-white" />
            </button>
            <button 
              onClick={goToNext}
              className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 flex items-center justify-center rounded-full bg-black/40 hover:bg-black/60 transition-colors"
              aria-label="Next image"
            >
              <ChevronRight size={24} className="text-white" />
            </button>
          </>
        )}
      </div>
      
      {/* Image counter */}
      <div className="mt-2 flex justify-center">
        <span className="text-sm text-[#9ca3af]">
          {currentIndex + 1} / {images.length}
        </span>
      </div>
    </div>
  );
};

export default ImageCarousel;
