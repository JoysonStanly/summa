import { motion } from 'framer-motion';
import { Check } from 'lucide-react';

interface CodeLineDisplayProps {
    codeLine: string;
    isAnswered: boolean;
}

const CodeLineDisplay = ({ codeLine, isAnswered }: CodeLineDisplayProps) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="relative"
        >
            <div
                className={`p-2 rounded-lg font-mono text-xs transition-all duration-300 ${isAnswered
                    ? 'bg-gradient-to-r from-[#FF6D00]/20 to-[#FF6D00]/10 border-2 border-[#FF6D00]'
                    : 'bg-[#1a1a1a] border border-[#2a2a2a]'
                    }`}
            >
                <div className="flex items-center gap-3">
                    {isAnswered && (
                        <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ type: 'spring', stiffness: 200 }}
                        >
                            <Check className="w-4 h-4 text-[#FF6D00]" />
                        </motion.div>
                    )}
                    <code className="text-gray-200">{codeLine}</code>
                </div>
            </div>
        </motion.div>
    );
};

export default CodeLineDisplay;
