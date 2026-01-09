import { useState } from "react";
import { ChevronLeft, ChevronRight, ExternalLink } from "lucide-react";
import { type Slide } from "../data/subjects";

interface SlideViewerProps {
  slides: Slide[];
}

const SlideViewer = ({ slides }: SlideViewerProps) => {
  const [currentSlide, setCurrentSlide] = useState(0);

  if (!slides || slides.length === 0) {
    return (
      <div className="flex items-center justify-center h-64 bg-gray-800 rounded-lg">
        <p className="text-gray-400">No slides available for this topic.</p>
      </div>
    );
  }

  const goToPrevious = () => {
    setCurrentSlide(prev => (prev > 0 ? prev - 1 : slides.length - 1));
  };

  const goToNext = () => {
    setCurrentSlide(prev => (prev < slides.length - 1 ? prev + 1 : 0));
  };

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
  };

  const slide = slides[currentSlide];

  return (
    <div className="space-y-4">
      {/* Slide Content */}
      <div className="bg-gray-800 rounded-lg p-6 min-h-[400px]">
        <div className="space-y-4">
          <h3 className="text-xl font-bold text-white">{slide.title}</h3>
          
          {slide.imageUrl && (
            <div className="bg-gray-700 rounded-lg p-4 flex items-center justify-center">
              <div className="text-center space-y-2">
                <div className="w-full h-48 bg-gray-600 rounded-lg flex items-center justify-center">
                  <ExternalLink className="w-8 h-8 text-gray-400" />
                </div>
                <p className="text-gray-400 text-sm">Slide Image: {slide.title}</p>
              </div>
            </div>
          )}
          
          <div className="prose prose-invert max-w-none">
            <p className="text-gray-300 leading-relaxed">{slide.content}</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex items-center justify-between">
        <button
          onClick={goToPrevious}
          className="flex items-center gap-2 px-4 py-2 bg-gray-800 text-gray-400 rounded-lg hover:text-white transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
          <span className="text-sm">Previous</span>
        </button>

        {/* Pagination */}
        <div className="flex items-center gap-3">
          <span className="text-gray-400 text-sm">
            {currentSlide + 1}/{slides.length}
          </span>
          <div className="flex gap-1">
            {slides.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`w-2 h-2 rounded-full transition-colors ${
                  index === currentSlide ? 'bg-orange-500' : 'bg-gray-600 hover:bg-gray-500'
                }`}
              />
            ))}
          </div>
        </div>

        <button
          onClick={goToNext}
          className="flex items-center gap-2 px-4 py-2 bg-gray-800 text-gray-400 rounded-lg hover:text-white transition-colors"
        >
          <span className="text-sm">Next</span>
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

export default SlideViewer;
