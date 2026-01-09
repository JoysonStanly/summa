import React, { useState, useEffect } from 'react';
import { RotateCcw } from 'lucide-react';
import { useParams } from 'react-router-dom';
import UnifiedSidebar from "@/shared/components/layout/UnifiedSidebar";
import { mockTestCategories } from '../data/mockTestData';
import { quizService } from '../services/quizService';

const MockTestPage: React.FC = () => {
  const { categoryId, subCategoryId } = useParams<{ categoryId: string; subCategoryId: string }>();
  const [loading, setLoading] = useState(false);
  
  // Fetch quizzes from API on mount
  useEffect(() => {
    const fetchQuizzes = async () => {
      try {
        setLoading(true);
        await quizService.getQuizzes('mock-test');
      } catch (error) {
        console.log('Using static quiz data');
      } finally {
        setLoading(false);
      }
    };
    fetchQuizzes();
  }, []);
  
  // Find current category and subcategory
  const currentCategory = mockTestCategories.find(cat => cat.id === categoryId) || mockTestCategories[0];
  const currentSubCategory = currentCategory.subCategories.find(sub => sub.id === subCategoryId) || currentCategory.subCategories[0];
  const questions = currentSubCategory?.questions || [];
  
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, string>>({});
  const [currentQuestion, setCurrentQuestion] = useState<number>(1);
  const [revealedAnswers, setRevealedAnswers] = useState<Record<number, boolean>>({});
  const [showSolution, setShowSolution] = useState<Record<number, boolean>>({});

  const handleSelectAnswer = (questionId: number, optionId: string) => {
    if (revealedAnswers[questionId]) return;
    setSelectedAnswers(prev => ({
      ...prev,
      [questionId]: optionId
    }));
    setRevealedAnswers(prev => ({
      ...prev,
      [questionId]: true
    }));
  };

  const handleResetAll = () => {
    setSelectedAnswers({});
    setCurrentQuestion(1);
    setRevealedAnswers({});
    setShowSolution({});
  };

  const getQuestionStatus = (questionId: number): 'unvisited' | 'attempted' | 'correct' | 'incorrect' => {
    if (!selectedAnswers[questionId]) return 'unvisited';
    const question = questions.find(q => q.id === questionId);
    if (question?.correctAnswer === selectedAnswers[questionId]) return 'correct';
    return 'incorrect';
  };

  const stats = {
    correct: Object.entries(selectedAnswers).filter(([qId, answer]) => {
      const question = questions.find(q => q.id === parseInt(qId));
      return question?.correctAnswer === answer;
    }).length,
    wrong: Object.entries(selectedAnswers).filter(([qId, answer]) => {
      const question = questions.find(q => q.id === parseInt(qId));
      return question?.correctAnswer !== answer;
    }).length,
    unvisited: questions.length - Object.keys(selectedAnswers).length
  };

  if (!currentSubCategory || questions.length === 0) {
    return (
      <div className="flex h-screen bg-background">
        <UnifiedSidebar
          title="Mock Tests"
          categories={mockTestCategories}
          searchPlaceholder="Search Mock Tests..."
          basePath="/mock-test"
        />
        <div className="flex-1 flex items-center justify-center transition-all duration-300">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-white mb-2">No Questions Available</h2>
            <p className="text-grayText">Please select a topic from the sidebar</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-background">
      {/* Left Sidebar */}
      <UnifiedSidebar
        title="Mock Tests"
        categories={mockTestCategories}
        searchPlaceholder="Search Mock Tests..."
        basePath="/mock-test"
      />

      {/* Main Content */}
      <div className="flex flex-1 h-full overflow-hidden transition-all duration-300">
        {/* Center Panel - Questions Section */}
        <div className="flex-1 h-screen overflow-y-auto scrollbar-none bg-background">
          {/* Header */}
          <div className="px-6 py-4 bg-[#13171C]/60 backdrop-blur-sm border-b border-[#676A6D]/20">
            <div className="flex items-center gap-2 text-sm">
              <span className="px-2.5 py-1 rounded-md bg-[#EA763F]/10 border border-[#EA763F]/20 text-[#EA763F] font-medium text-xs">
                {currentCategory.name}
              </span>
              <svg className="w-3.5 h-3.5 text-[#676A6D]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
              <h2 className="text-base font-semibold text-white">{currentSubCategory.name}</h2>
            </div>
          </div>

          {/* Questions Container */}
          <div className="px-6 py-5 space-y-5 max-w-5xl mx-auto">
            {questions.map((question) => (
              <div key={question.id} id={`question-${question.id}`} className="bg-[#13171C]/40 backdrop-blur-sm rounded-lg overflow-hidden border border-[#676A6D]/20 hover:border-[#EA763F]/40 transition-all duration-200">
                {/* Divider */}
                <div className="h-0.5 bg-gradient-to-r from-transparent via-[#EA763F] to-transparent"></div>

                {/* Question Content */}
                <div className="p-5">
                  {/* Question Text */}
                  <div className="flex items-start gap-3 mb-5">
                    <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-gradient-to-br from-[#EA763F] to-[#d9651f] flex items-center justify-center font-bold text-white text-sm shadow-md">
                      {question.id}
                    </div>
                    <p className="flex-1 text-sm leading-relaxed text-white font-medium pt-1">
                      {question.question}
                    </p>
                  </div>

                  {/* Options Grid */}
                  <div className="space-y-3 pl-11">
                    <div className="grid grid-cols-2 gap-3">
                      {question.options.slice(0, 2).map((option) => {
                        const isRevealed = revealedAnswers[question.id];
                        const isSelected = selectedAnswers[question.id] === option.id;
                        const isCorrect = question.correctAnswer === option.id;
                        const isIncorrect = isRevealed && isSelected && !isCorrect;
                        
                        return (
                        <div
                          key={option.id}
                          onClick={() => handleSelectAnswer(question.id, option.id)}
                          className={`flex items-center gap-3 p-3.5 rounded-lg transition-all duration-200 group ${
                            isRevealed
                              ? isCorrect
                                ? 'bg-green-500/15 border border-green-500 cursor-not-allowed'
                                : isIncorrect
                                ? 'bg-red-500/15 border border-red-500 cursor-not-allowed'
                                : 'bg-[#0a0a0a]/40 border border-[#676A6D]/20 cursor-not-allowed opacity-60'
                              : isSelected
                              ? 'bg-[#EA763F]/15 border border-[#EA763F] shadow-md cursor-pointer'
                              : 'bg-[#0a0a0a]/60 border border-[#676A6D]/20 hover:border-[#EA763F]/40 hover:bg-[#13171C]/80 cursor-pointer'
                          }`}
                          style={isRevealed ? { cursor: 'not-allowed' } : {}}
                        >
                          <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-all ${
                            isRevealed
                              ? isCorrect
                                ? 'border-green-500'
                                : isIncorrect
                                ? 'border-red-500'
                                : 'border-[#676A6D]'
                              : isSelected
                              ? 'border-[#EA763F] shadow-md shadow-[#EA763F]/50'
                              : 'border-[#676A6D] group-hover:border-[#EA763F]/60'
                          }`}>
                            {(isSelected || (isRevealed && isCorrect)) && (
                              <div className={`w-3 h-3 rounded-full ${
                                isRevealed
                                  ? isCorrect
                                    ? 'bg-green-500'
                                    : 'bg-red-500'
                                  : 'bg-[#EA763F]'
                              }`}></div>
                            )}
                          </div>
                          <span className={`text-sm leading-relaxed ${
                            isRevealed
                              ? isCorrect
                                ? 'text-green-400 font-medium'
                                : isIncorrect
                                ? 'text-red-400 font-medium'
                                : 'text-gray-400'
                              : isSelected
                              ? 'text-white font-medium'
                              : 'text-gray-300 group-hover:text-white'
                          }`}>{option.text}</span>
                        </div>
                        );
                      })}
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      {question.options.slice(2, 4).map((option) => {
                        const isRevealed = revealedAnswers[question.id];
                        const isSelected = selectedAnswers[question.id] === option.id;
                        const isCorrect = question.correctAnswer === option.id;
                        const isIncorrect = isRevealed && isSelected && !isCorrect;
                        
                        return (
                        <div
                          key={option.id}
                          onClick={() => handleSelectAnswer(question.id, option.id)}
                          className={`flex items-center gap-3 p-3.5 rounded-lg transition-all duration-200 group ${
                            isRevealed
                              ? isCorrect
                                ? 'bg-green-500/15 border border-green-500 cursor-not-allowed'
                                : isIncorrect
                                ? 'bg-red-500/15 border border-red-500 cursor-not-allowed'
                                : 'bg-[#0a0a0a]/40 border border-[#676A6D]/20 cursor-not-allowed opacity-60'
                              : isSelected
                              ? 'bg-[#EA763F]/15 border border-[#EA763F] shadow-md cursor-pointer'
                              : 'bg-[#0a0a0a]/60 border border-[#676A6D]/20 hover:border-[#EA763F]/40 hover:bg-[#13171C]/80 cursor-pointer'
                          }`}
                          style={isRevealed ? { cursor: 'not-allowed' } : {}}
                        >
                          <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-all ${
                            isRevealed
                              ? isCorrect
                                ? 'border-green-500'
                                : isIncorrect
                                ? 'border-red-500'
                                : 'border-[#676A6D]'
                              : isSelected
                              ? 'border-[#EA763F] shadow-md shadow-[#EA763F]/50'
                              : 'border-[#676A6D] group-hover:border-[#EA763F]/60'
                          }`}>
                            {(isSelected || (isRevealed && isCorrect)) && (
                              <div className={`w-3 h-3 rounded-full ${
                                isRevealed
                                  ? isCorrect
                                    ? 'bg-green-500'
                                    : 'bg-red-500'
                                  : 'bg-[#EA763F]'
                              }`}></div>
                            )}
                          </div>
                          <span className={`text-sm leading-relaxed ${
                            isRevealed
                              ? isCorrect
                                ? 'text-green-400 font-medium'
                                : isIncorrect
                                ? 'text-red-400 font-medium'
                                : 'text-gray-400'
                              : isSelected
                              ? 'text-white font-medium'
                              : 'text-gray-300 group-hover:text-white'
                          }`}>{option.text}</span>
                        </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Answer Feedback */}
                  {revealedAnswers[question.id] && (
                    <div className="mt-5 pt-5 border-t border-[#676A6D]/20 pl-11">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-green-400">Correct Answer:</span>
                          <span className="text-sm font-medium text-green-400">
                            {question.options.find(opt => opt.id === question.correctAnswer)?.text}
                          </span>
                        </div>
                        <button
                          onClick={() => setShowSolution(prev => ({ ...prev, [question.id]: !prev[question.id] }))}
                          className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#EA763F]/10 border border-[#EA763F]/30 text-[#EA763F] hover:bg-[#EA763F]/20 transition-all text-sm"
                        >
                          <span>{showSolution[question.id] ? 'Hide' : 'Show'} Solution</span>
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            {showSolution[question.id] ? (
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 18.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                            ) : (
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                            )}
                          </svg>
                        </button>
                      </div>
                      {showSolution[question.id] && (
                        <div className="mt-4">
                          <div className="p-4 rounded-lg bg-[#13171C]/60 backdrop-blur-sm border border-[#676A6D]/20">
                            <div className="text-sm text-gray-300 leading-relaxed">
                              <p>{question.explanation || 'Solution explanation will be displayed here.'}</p>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Panel - Overview Sidebar */}
        <div className="w-72 h-screen overflow-y-auto scrollbar-none bg-[#13171C]/40 backdrop-blur-sm border-l border-[#676A6D]/20">
          <div className="p-5 space-y-6">
            {/* Overview Header */}
            <div className="pb-3 border-b border-[#676A6D]/20">
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 text-[#EA763F]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
                <h3 className="text-lg font-bold text-white">Overview</h3>
              </div>
            </div>

            {/* Answer Summary */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-semibold text-white">Answer Summary</h4>
                <button
                  onClick={handleResetAll}
                  className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs text-[#676A6D] hover:text-white hover:bg-red-500/10 border border-transparent hover:border-red-500/30 transition-all"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>Reset</span>
                </button>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-2">
                <div className="flex flex-col items-center p-3 rounded-lg bg-green-500/10 border border-green-500/20 hover:border-green-500/40 transition-all">
                  <div className="text-2xl font-bold text-green-400 mb-0.5">{stats.correct}</div>
                  <div className="text-[10px] text-[#676A6D] font-medium uppercase tracking-wider">Correct</div>
                </div>
                <div className="flex flex-col items-center p-3 rounded-lg bg-red-500/10 border border-red-500/20 hover:border-red-500/40 transition-all">
                  <div className="text-2xl font-bold text-red-400 mb-0.5">{stats.wrong}</div>
                  <div className="text-[10px] text-[#676A6D] font-medium uppercase tracking-wider">Wrong</div>
                </div>
                <div className="flex flex-col items-center p-3 rounded-lg bg-gray-500/10 border border-gray-500/20 hover:border-gray-500/40 transition-all">
                  <div className="text-2xl font-bold text-gray-400 mb-0.5">{stats.unvisited}</div>
                  <div className="text-[10px] text-[#676A6D] font-medium uppercase tracking-wider">Unvisited</div>
                </div>
              </div>
            </div>

            {/* Question Palette */}
            <div className="space-y-4">
              <h4 className="text-sm font-semibold text-white flex items-center gap-2">
                <svg className="w-4 h-4 text-[#EA763F]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" />
                </svg>
                Question Palette
              </h4>
              <div className="grid grid-cols-5 gap-2">
                {questions.map((question) => {
                  const status = getQuestionStatus(question.id);
                  return (
                    <button
                      key={question.id}
                      onClick={() => {
                        const element = document.getElementById(`question-${question.id}`);
                        element?.scrollIntoView({ behavior: 'smooth', block: 'center' });
                        setCurrentQuestion(question.id);
                      }}
                      className={`w-10 h-10 rounded-lg font-semibold text-sm transition-all duration-200 ${
                        currentQuestion === question.id
                          ? 'ring-2 ring-[#EA763F] ring-offset-1 ring-offset-[#13171C]'
                          : ''
                      } ${
                        status === 'correct'
                          ? 'bg-green-500 text-white shadow-md hover:shadow-green-500/50'
                          : status === 'incorrect'
                          ? 'bg-red-500 text-white shadow-md hover:shadow-red-500/50'
                          : status === 'attempted'
                          ? 'bg-[#EA763F] text-white shadow-md hover:shadow-[#EA763F]/50'
                          : 'bg-[#0a0a0a]/60 text-[#676A6D] border border-[#676A6D]/20 hover:border-[#EA763F]/40 hover:text-white hover:bg-[#13171C]/80'
                      }`}
                    >
                      {question.id}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MockTestPage;
