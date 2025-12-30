import { useState } from 'react';
import type { Question } from '../../data/quizData';
import { CheckCircle, XCircle, ChevronUp } from 'lucide-react';

interface QuestionCardProps {
  question: Question;
  questionNumber: number;
}

export const QuestionCard = ({ question, questionNumber }: QuestionCardProps) => {
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);
  
  const handleOptionSelect = (optionText: string) => {
    if (selectedOption === null) {
      setSelectedOption(optionText);
      setShowExplanation(true); // Auto-show explanation when an option is selected
    }
  };

  const correctOption = question.options.find(opt => opt.isCorrect)?.text;
  
  return (
    <div className="mb-12">
      {/* Question */}
      <div className="mb-6">
        <h3 className="text-white text-lg font-normal">
          {questionNumber}. {question.question}
        </h3>
      </div>

      {/* Options Grid */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        {question.options.map((option, index) => {
          const isSelected = selectedOption === option.text;
          const isCorrect = option.isCorrect;
          
          let optionClass = "py-3 px-4 rounded-lg border border-gray-700 flex items-center";
          
          if (isSelected) {
            optionClass += isCorrect 
              ? " bg-green-900/20 border-green-600" 
              : " bg-red-900/20 border-red-600";
          } else if (selectedOption !== null && isCorrect) {
            // Highlight correct answer when user selected wrong
            optionClass += " bg-green-900/20 border-green-600";
          }

          return (
            <button
              key={index}
              className={optionClass}
              onClick={() => handleOptionSelect(option.text)}
              disabled={selectedOption !== null}
            >
              {isSelected ? (
                isCorrect ? (
                  <CheckCircle size={20} className="text-green-500 mr-2" />
                ) : (
                  <XCircle size={20} className="text-red-500 mr-2" />
                )
              ) : selectedOption !== null && isCorrect ? (
                <CheckCircle size={20} className="text-green-500 mr-2" />
              ) : (
                <div className="w-5 h-5 border border-gray-500 rounded-full mr-2"></div>
              )}
              <span className="text-white">{option.text}</span>
            </button>
          );
        })}
      </div>

      {/* Answer Result */}
      {selectedOption !== null && (
        <div className="mb-4">
          <div className="flex items-center">
            <span className="text-gray-300 mr-2">Correct Answer:</span>
            <span className="text-green-500">{correctOption}</span>
          </div>
          {selectedOption !== correctOption && (
            <div className="flex items-center mt-1">
              <span className="text-gray-300 mr-2">Your Answer:</span>
              <span className="text-red-500">{selectedOption}</span>
            </div>
          )}
        </div>
      )}

      {/* Explanation */}
      {selectedOption !== null && (
        <div className="border border-orange-500 rounded-lg overflow-hidden">
          <div 
            className="flex justify-between items-center bg-orange-900/10 text-orange-500 px-4 py-2 cursor-pointer"
            onClick={() => setShowExplanation(!showExplanation)}
          >
            <span className="font-medium">
              {showExplanation ? "Hide Explanation" : "Show Explanation"}
            </span>
            <ChevronUp 
              size={18} 
              className={`transition-transform ${showExplanation ? '' : 'rotate-180'}`}
            />
          </div>
          
          {showExplanation && (
            <div className="p-4 text-white">
              {question.explanation}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
