import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Lightbulb, Trophy, RotateCcw, ChevronLeft, ChevronRight } from 'lucide-react';
import type { ThinkFirstQuestion } from '../../types/thinkFirstTypes';
import CodeLineDisplay from './CodeLineDisplay';
import MCQQuestion from './MCQQuestion';
import ProgressIndicator from './ProgressIndicator';
import CodeTabs from '../../editorial/CodeTabs';

interface ThinkFirstInteractiveProps {
    questions: ThinkFirstQuestion[];
    problemTitle?: string;
}

const ThinkFirstInteractive = ({ questions, problemTitle }: ThinkFirstInteractiveProps) => {
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [answeredQuestions, setAnsweredQuestions] = useState<Set<number>>(new Set());
    const [isComplete, setIsComplete] = useState(false);
    const [activeLanguage, setActiveLanguage] = useState('cpp');

    const currentQuestion = questions[currentQuestionIndex];
    const isCurrentAnswered = answeredQuestions.has(currentQuestion?.id);

    useEffect(() => {
        // Check if all questions are answered
        if (answeredQuestions.size === questions.length) {
            setIsComplete(true);
        }
    }, [answeredQuestions, questions.length]);

    const handleCorrectAnswer = () => {
        // Mark current question as answered
        setAnsweredQuestions((prev) => new Set(prev).add(currentQuestion.id));

        // Move to next question after a short delay
        setTimeout(() => {
            if (currentQuestionIndex < questions.length - 1) {
                setCurrentQuestionIndex((prev) => prev + 1);
            }
        }, 1000);
    };

    const handleReset = () => {
        setCurrentQuestionIndex(0);
        setAnsweredQuestions(new Set());
        setIsComplete(false);
    };

    // Build progressive code for CodeTabs
    const buildProgressiveSolutions = () => {
        // Define skeleton templates for each language
        const skeletons = {
            java: `import java.util.*;

class Solution {
  // Linear Search Function
  public int linearSearch(int[] nums, int target) {
    
  }
}`,
            cpp: `#include <vector>
using namespace std;

class Solution {
public:
  // Linear Search Function
  int linearSearch(vector<int>& nums, int target) {
    
  }
};`,
            python: `class Solution:
    # Linear Search Function
    def linearSearch(self, nums: list[int], target: int) -> int:
        pass`,
            javascript: `class Solution {
  // Linear Search Function
  linearSearch(nums, target) {
    
  }
}`
        };

        // Build answered code lines
        const answeredLines: string[] = [];
        questions.forEach((q) => {
            if (answeredQuestions.has(q.id)) {
                answeredLines.push(q.codeLine);
            }
        });

        // If no questions answered, return skeleton
        if (answeredLines.length === 0) {
            return skeletons;
        }

        // Build progressive code by inserting answered lines into skeleton
        const buildCodeForLanguage = (skeleton: string, indent: string) => {
            const lines = skeleton.split('\n');
            const functionBodyIndex = lines.findIndex(line =>
                line.includes('linearSearch') || line.includes('def linearSearch')
            ) + 1;

            // Insert answered lines after function signature
            const beforeFunction = lines.slice(0, functionBodyIndex + 1);
            const afterFunction = lines.slice(functionBodyIndex + 1);

            const indentedAnsweredLines = answeredLines.map(line => indent + line);

            return [...beforeFunction, ...indentedAnsweredLines, ...afterFunction].join('\n');
        };

        // Return solutions for all languages with progressive code
        return {
            java: buildCodeForLanguage(skeletons.java, '    '),
            cpp: buildCodeForLanguage(skeletons.cpp, '    '),
            python: buildCodeForLanguage(skeletons.python, '        '),
            javascript: buildCodeForLanguage(skeletons.javascript, '    '),
        };
    };

    // Show completion screen
    if (isComplete) {
        return (
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex items-center justify-center min-h-[500px] p-8"
            >
                <div className="text-center max-w-md">
                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: 'spring', stiffness: 200, delay: 0.2 }}
                    >
                        <Trophy className="w-20 h-20 mx-auto mb-6 text-[#FF6D00]" />
                    </motion.div>

                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="text-3xl font-bold text-white mb-3"
                    >
                        Congratulations! 🎉
                    </motion.h2>

                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                        className="text-xl text-gray-300 mb-6"
                    >
                        ✔ You understood {problemTitle || 'the'} logic
                    </motion.p>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5 }}
                        className="space-y-3"
                    >
                        <div className="p-4 rounded-lg bg-[#1a1a1a] border border-[#2a2a2a]">
                            <p className="text-gray-300 text-sm leading-relaxed">
                                You've successfully answered all {questions.length} questions and understood the core
                                concepts. Now you're ready to implement the solution!
                            </p>
                        </div>

                        <button
                            onClick={handleReset}
                            className="flex items-center gap-2 mx-auto px-6 py-3 bg-[#FF6D00] hover:bg-[#ff7a1a] text-white rounded-lg font-medium transition-colors"
                        >
                            <RotateCcw className="w-4 h-4" />
                            Review Again
                        </button>
                    </motion.div>
                </div>
            </motion.div>
        );
    }

    // Show empty state if no questions
    if (!questions || questions.length === 0) {
        return (
            <div className="flex items-center justify-center h-full p-8 text-center">
                <div>
                    <Lightbulb className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                    <h2 className="mb-2 text-xl font-semibold text-gray-400">No Questions Available</h2>
                    <p className="text-gray-500">
                        Think First questions haven't been added for this problem yet.
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="p-4 space-y-4 max-w-4xl mx-auto">
            {/* Progress Indicator */}
            <ProgressIndicator current={currentQuestionIndex} total={questions.length} />

            {/* Code Line Display */}
            <AnimatePresence mode="wait">
                <CodeLineDisplay
                    key={currentQuestion.id}
                    codeLine={currentQuestion.codeLine}
                    isAnswered={isCurrentAnswered}
                />
            </AnimatePresence>

            {/* MCQ Question */}
            <AnimatePresence mode="wait">
                <MCQQuestion
                    key={currentQuestion.id}
                    question={currentQuestion.question}
                    options={currentQuestion.options}
                    correctIndex={currentQuestion.correctIndex}
                    hint={currentQuestion.hint}
                    isLocked={false}
                    onCorrectAnswer={handleCorrectAnswer}
                />
            </AnimatePresence>

            {/* Navigation Buttons */}
            <div className="flex items-center justify-between gap-4 pt-2">
                <button
                    onClick={() => setCurrentQuestionIndex((prev) => Math.max(0, prev - 1))}
                    disabled={currentQuestionIndex === 0}
                    className="flex items-center gap-1 px-4 py-2 text-sm font-medium text-gray-400 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                >
                    <ChevronLeft className="w-4 h-4" />
                    Previous
                </button>

                <button
                    onClick={() => setCurrentQuestionIndex((prev) => Math.min(questions.length - 1, prev + 1))}
                    disabled={currentQuestionIndex === questions.length - 1 || !answeredQuestions.has(currentQuestion.id)}
                    className="flex items-center gap-1 px-4 py-2 text-sm font-medium text-white bg-[#FF6D00] hover:bg-[#ff7a1a] rounded-lg disabled:opacity-30 disabled:cursor-not-allowed transition-colors shadow-lg shadow-[#FF6D00]/10"
                >
                    Next
                    <ChevronRight className="w-4 h-4" />
                </button>
            </div>

            {/* Understood Code Lines - Using CodeTabs */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-6 pt-4 border-t border-[#2a2a2a]"
            >
                <div className="flex items-center gap-2 mb-3">
                    <h3 className="text-lg font-bold text-white">Understood Code Lines</h3>
                    <span className="text-xs text-gray-500 bg-[#1a1a1a] px-2 py-1 rounded">
                        {answeredQuestions.size}/{questions.length} lines • {Math.round((answeredQuestions.size / questions.length) * 100)}% Complete
                    </span>
                </div>

                <CodeTabs
                    solutions={buildProgressiveSolutions()}
                    activeLanguage={activeLanguage}
                    onLanguageChange={setActiveLanguage}
                />
            </motion.div>
        </div>
    );
};

export default ThinkFirstInteractive;
