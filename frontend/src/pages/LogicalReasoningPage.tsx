import React, { useState } from 'react';
import { RotateCcw } from 'lucide-react';
import { useParams } from 'react-router-dom';
import UnifiedSidebar from '../components/navigation/UnifiedSidebar';
import { logicalReasoningCategories } from '../data/logicalReasoningData';

const LogicalReasoningPage: React.FC = () => {
  const { categoryId, subCategoryId } = useParams<{ categoryId: string; subCategoryId: string }>();
  
  // Find current category and subcategory
  const currentCategory = logicalReasoningCategories.find(cat => cat.id === categoryId) || logicalReasoningCategories[0];
  const currentSubCategory = currentCategory.subCategories.find(sub => sub.id === subCategoryId) || currentCategory.subCategories[0];
  const questions = currentSubCategory?.questions || [];
  
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, string>>({});
  const [currentQuestion, setCurrentQuestion] = useState<number>(1);

  const handleSelectAnswer = (questionId: number, optionId: string) => {
    setSelectedAnswers(prev => ({
      ...prev,
      [questionId]: optionId
    }));
  };

  const handleResetAll = () => {
    setSelectedAnswers({});
    setCurrentQuestion(1);
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
          title="Logical Reasoning"
          categories={logicalReasoningCategories}
          searchPlaceholder="Search Logical Topics..."
          basePath="/logical-reasoning"
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
    <div className="flex h-screen bg-gradient-to-br from-[#0a0a0a] via-background to-[#0f0f0f]">
      {/* Left Sidebar */}
      <UnifiedSidebar
        title="Logical Reasoning"
        categories={logicalReasoningCategories}
        searchPlaceholder="Search Logical Topics..."
        basePath="/logical-reasoning"
      />

      {/* Main Content */}
      <div className="flex flex-1 h-full overflow-hidden transition-all duration-300">
        {/* Center Panel - Questions Section */}
        <div className="flex-1 h-screen overflow-y-auto scrollbar-none bg-gradient-to-b from-transparent to-[#0a0a0a]/50">
          {/* Header */}
          <div className="px-8 py-6 bg-gradient-to-r from-[#13171C] to-[#161A20] border-b border-[#676A6D]/30 shadow-xl">
            <div className="flex items-center gap-3 text-sm">
              <span className="px-3 py-1.5 rounded-md bg-[#EA763F]/10 border border-[#EA763F]/20 text-[#EA763F] font-medium">
                {currentCategory.name}
              </span>
              <svg className="w-4 h-4 text-[#676A6D]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
              <h2 className="text-lg font-semibold text-white">{currentSubCategory.name}</h2>
            </div>
          </div>

          {/* Questions Container */}
          <div className="px-8 py-8 space-y-8">
            {questions.map((question) => (
              <div key={question.id} id={`question-${question.id}`} className="bg-gradient-to-br from-[#13171C] to-[#161A20] rounded-xl overflow-hidden border border-[#676A6D]/20 hover:border-[#EA763F]/30 transition-all duration-300 shadow-lg hover:shadow-[#EA763F]/10">
                {/* Divider */}
                <div className="h-1.5 bg-gradient-to-r from-transparent via-[#EA763F] to-transparent shadow-lg"></div>

                {/* Question Content */}
                <div className="p-8">
                  {/* Question Text */}
                  <div className="flex items-start gap-4 mb-8">
                    <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-gradient-to-br from-[#EA763F] to-[#d9651f] flex items-center justify-center font-bold text-white shadow-lg shadow-[#EA763F]/20">
                      {question.id}
                    </div>
                    <p className="flex-1 text-base leading-relaxed text-white font-medium pt-2">
                      {question.question}
                    </p>
                  </div>

                  {/* Options Grid */}
                  <div className="space-y-4 pl-14">
                    <div className="grid grid-cols-2 gap-4">
                      {question.options.slice(0, 2).map((option) => (
                        <div
                          key={option.id}
                          onClick={() => handleSelectAnswer(question.id, option.id)}
                          className={`flex items-center gap-4 p-5 rounded-xl cursor-pointer transition-all duration-200 group ${
                            selectedAnswers[question.id] === option.id
                              ? 'bg-gradient-to-r from-[#EA763F]/20 to-[#EA763F]/10 border-2 border-[#EA763F] shadow-lg shadow-[#EA763F]/20 scale-[1.02]'
                              : 'bg-[#0a0a0a] border-2 border-[#676A6D]/20 hover:border-[#EA763F]/40 hover:bg-[#13171C]'
                          }`}
                        >
                          <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-all ${
                            selectedAnswers[question.id] === option.id
                              ? 'border-[#EA763F] shadow-lg shadow-[#EA763F]/50'
                              : 'border-[#676A6D] group-hover:border-[#EA763F]/60'
                          }`}>
                            {selectedAnswers[question.id] === option.id && (
                              <div className="w-3.5 h-3.5 rounded-full bg-[#EA763F] animate-pulse"></div>
                            )}
                          </div>
                          <span className={`text-sm leading-relaxed ${
                            selectedAnswers[question.id] === option.id
                              ? 'text-white font-semibold'
                              : 'text-gray-300 group-hover:text-white'
                          }`}>{option.text}</span>
                        </div>
                      ))}
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      {question.options.slice(2, 4).map((option) => (
                        <div
                          key={option.id}
                          onClick={() => handleSelectAnswer(question.id, option.id)}
                          className={`flex items-center gap-4 p-5 rounded-xl cursor-pointer transition-all duration-200 group ${
                            selectedAnswers[question.id] === option.id
                              ? 'bg-gradient-to-r from-[#EA763F]/20 to-[#EA763F]/10 border-2 border-[#EA763F] shadow-lg shadow-[#EA763F]/20 scale-[1.02]'
                              : 'bg-[#0a0a0a] border-2 border-[#676A6D]/20 hover:border-[#EA763F]/40 hover:bg-[#13171C]'
                          }`}
                        >
                          <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-all ${
                            selectedAnswers[question.id] === option.id
                              ? 'border-[#EA763F] shadow-lg shadow-[#EA763F]/50'
                              : 'border-[#676A6D] group-hover:border-[#EA763F]/60'
                          }`}>
                            {selectedAnswers[question.id] === option.id && (
                              <div className="w-3.5 h-3.5 rounded-full bg-[#EA763F] animate-pulse"></div>
                            )}
                          </div>
                          <span className={`text-sm leading-relaxed ${
                            selectedAnswers[question.id] === option.id
                              ? 'text-white font-semibold'
                              : 'text-gray-300 group-hover:text-white'
                          }`}>{option.text}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Panel - Overview Sidebar */}
        <div className="w-80 h-screen overflow-y-auto scrollbar-none bg-gradient-to-b from-[#13171C] to-[#0a0a0a] border-l border-[#676A6D]/30">
          <div className="p-6 space-y-8">
            {/* Overview Header */}
            <div className="pb-4 border-b border-[#676A6D]/30">
              <div className="flex items-center gap-3">
                <svg className="w-6 h-6 text-[#EA763F]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
                <h3 className="text-xl font-bold text-white">Overview</h3>
              </div>
            </div>

            {/* Answer Summary */}
            <div className="space-y-5">
              <div className="flex items-center justify-between">
                <h4 className="text-base font-semibold text-white">Answer Summary</h4>
                <button
                  onClick={handleResetAll}
                  className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-[#676A6D] hover:text-white hover:bg-red-500/10 border border-transparent hover:border-red-500/30 transition-all"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Reset</span>
                </button>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-3">
                <div className="flex flex-col items-center p-5 rounded-xl bg-gradient-to-br from-green-500/10 to-green-500/5 border border-green-500/20 hover:border-green-500/40 transition-all shadow-lg">
                  <div className="text-3xl font-bold text-green-400 mb-1">{stats.correct}</div>
                  <div className="text-xs text-[#676A6D] font-medium uppercase tracking-wider">Correct</div>
                </div>
                <div className="flex flex-col items-center p-5 rounded-xl bg-gradient-to-br from-red-500/10 to-red-500/5 border border-red-500/20 hover:border-red-500/40 transition-all shadow-lg">
                  <div className="text-3xl font-bold text-red-400 mb-1">{stats.wrong}</div>
                  <div className="text-xs text-[#676A6D] font-medium uppercase tracking-wider">Wrong</div>
                </div>
                <div className="flex flex-col items-center p-5 rounded-xl bg-gradient-to-br from-gray-500/10 to-gray-500/5 border border-gray-500/20 hover:border-gray-500/40 transition-all shadow-lg">
                  <div className="text-3xl font-bold text-gray-400 mb-1">{stats.unvisited}</div>
                  <div className="text-xs text-[#676A6D] font-medium uppercase tracking-wider">Unvisited</div>
                </div>
              </div>
            </div>

            {/* Question Palette */}
            <div className="space-y-5">
              <h4 className="text-base font-semibold text-white flex items-center gap-2">
                <svg className="w-5 h-5 text-[#EA763F]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" />
                </svg>
                Question Palette
              </h4>
              <div className="grid grid-cols-5 gap-2.5">
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
                      className={`w-12 h-12 rounded-xl font-bold transition-all duration-200 ${
                        currentQuestion === question.id
                          ? 'ring-2 ring-[#EA763F] ring-offset-2 ring-offset-[#13171C] scale-110'
                          : ''
                      } ${
                        status === 'correct'
                          ? 'bg-gradient-to-br from-green-500 to-green-600 text-white shadow-lg shadow-green-500/30 hover:shadow-green-500/50'
                          : status === 'incorrect'
                          ? 'bg-gradient-to-br from-red-500 to-red-600 text-white shadow-lg shadow-red-500/30 hover:shadow-red-500/50'
                          : status === 'attempted'
                          ? 'bg-gradient-to-br from-[#EA763F] to-[#d9651f] text-white shadow-lg shadow-[#EA763F]/30 hover:shadow-[#EA763F]/50'
                          : 'bg-[#0a0a0a] text-[#676A6D] border-2 border-[#676A6D]/20 hover:border-[#EA763F]/40 hover:text-white hover:bg-[#13171C]'
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

export default LogicalReasoningPage;
