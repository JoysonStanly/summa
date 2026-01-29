import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Lightbulb, Lock } from 'lucide-react';

interface MCQQuestionProps {
    question: string;
    options: string[];
    correctIndex: number;
    hint: string;
    isLocked: boolean;
    onCorrectAnswer: () => void;
}

const MCQQuestion = ({
    question,
    options,
    correctIndex,
    hint,
    isLocked,
    onCorrectAnswer,
}: MCQQuestionProps) => {
    const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
    const [showHint, setShowHint] = useState(false);
    const [hasAnswered, setHasAnswered] = useState(false);

    const handleOptionClick = (index: number) => {
        if (isLocked || hasAnswered) return;

        setSelectedIndex(index);
        setHasAnswered(true);

        if (index === correctIndex) {
            // Correct answer
            setTimeout(() => {
                onCorrectAnswer();
            }, 800);
        } else {
            // Wrong answer - show hint
            setTimeout(() => {
                setShowHint(true);
            }, 500);
        }
    };

    const handleRetry = () => {
        setSelectedIndex(null);
        setHasAnswered(false);
        setShowHint(false);
    };

    const getOptionStyle = (index: number) => {
        if (!hasAnswered || selectedIndex === null) {
            return 'bg-[#1a1a1a] border-[#2a2a2a] hover:border-[#FF6D00] hover:bg-[#1f1f1f]';
        }

        // Highlight selected option
        if (index === selectedIndex) {
            return index === correctIndex
                ? 'bg-green-900/20 border-green-500 text-green-400'
                : 'bg-red-900/20 border-red-500 text-red-400';
        }

        // Keep correct answer hidden if selected index was wrong
        return 'bg-[#1a1a1a] border-[#2a2a2a] opacity-50';
    };

    if (isLocked) {
        return (
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="p-6 rounded-lg bg-[#1a1a1a] border border-[#2a2a2a] relative"
            >
                <div className="flex items-center gap-3 text-gray-400">
                    <Lock className="w-5 h-5" />
                    <span className="text-sm">Question locked - Answer the previous question first</span>
                </div>
            </motion.div>
        );
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-3"
        >
            {/* Question Text */}
            <div className="p-3 rounded-lg bg-[#1a1a1a] border border-[#2a2a2a]">
                <h3 className="text-base font-semibold text-white">{question}</h3>
            </div>

            {/* Options */}
            <div className="grid gap-2">
                {options.map((option, index) => (
                    <motion.button
                        key={index}
                        onClick={() => handleOptionClick(index)}
                        disabled={hasAnswered}
                        className={`p-3 rounded-lg border-2 text-left transition-all duration-200 ${getOptionStyle(
                            index
                        )} ${hasAnswered ? 'cursor-not-allowed' : 'cursor-pointer'}`}
                        whileHover={!hasAnswered ? { scale: 1.01 } : {}}
                        whileTap={!hasAnswered ? { scale: 0.99 } : {}}
                    >
                        <div className="flex items-center gap-3">
                            <div
                                className={`w-5 h-5 rounded-full border-2 flex items-center justify-center text-[10px] font-semibold flex-shrink-0 ${index === selectedIndex && hasAnswered
                                    ? index === correctIndex
                                        ? 'bg-green-500 border-green-500 text-white'
                                        : 'bg-red-500 border-red-500 text-white'
                                    : 'border-gray-500 text-gray-400'
                                    }`}
                            >
                                {String.fromCharCode(65 + index)}
                            </div>
                            <span className="flex-1 text-sm">{option}</span>
                        </div>
                    </motion.button>
                ))}
            </div>

            {/* Hint Section */}
            <AnimatePresence>
                {showHint && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="overflow-hidden"
                    >
                        <div className="p-4 rounded-lg bg-amber-900/20 border border-amber-700/30">
                            <div className="flex items-start gap-3">
                                <Lightbulb className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
                                <div className="flex-1">
                                    <h4 className="text-amber-400 font-semibold mb-1">Hint</h4>
                                    <p className="text-gray-300 text-sm">{hint}</p>
                                    <button
                                        onClick={handleRetry}
                                        className="mt-3 px-4 py-2 bg-[#FF6D00] hover:bg-[#ff7a1a] text-white rounded-md text-sm font-medium transition-colors"
                                    >
                                        Try Again
                                    </button>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
};

export default MCQQuestion;
