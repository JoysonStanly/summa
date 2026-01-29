import { motion } from 'framer-motion';

interface ProgressIndicatorProps {
    current: number;
    total: number;
}

const ProgressIndicator = ({ current, total }: ProgressIndicatorProps) => {
    const percentage = ((current + 1) / total) * 100;

    return (
        <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs">
                <span className="text-gray-400">
                    Question <span className="text-white font-semibold">{current + 1}</span> of {total}
                </span>
                <span className="text-gray-400">{Math.round(percentage)}%</span>
            </div>

            <div className="h-1.5 bg-[#1a1a1a] rounded-full overflow-hidden">
                <motion.div
                    className="h-full bg-gradient-to-r from-[#FF6D00] to-[#ff8534]"
                    initial={{ width: 0 }}
                    animate={{ width: `${percentage}%` }}
                    transition={{ duration: 0.5, ease: 'easeOut' }}
                />
            </div>
        </div>
    );
};

export default ProgressIndicator;
