import { useState, type FC } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, ChevronUp } from 'lucide-react';
import type { SectionProps } from './types';

const Section: FC<SectionProps> = ({ title, children, isCollapsed = false }) => {
  const [collapsed, setCollapsed] = useState(isCollapsed);

  return (
    <div className="mb-6 border border-[#2a2a2a] rounded-lg overflow-hidden">
      <motion.button
        className="w-full flex items-center justify-between p-4 bg-[#1a1a1a] text-left"
        onClick={() => setCollapsed(!collapsed)}
        whileHover={{ backgroundColor: 'rgba(42, 42, 42, 0.5)' }}
      >
        <h3 className="text-lg font-medium">{title}</h3>
        <span>
          {collapsed ? (
            <ChevronDown size={20} className="text-[#9ca3af]" />
          ) : (
            <ChevronUp size={20} className="text-[#9ca3af]" />
          )}
        </span>
      </motion.button>

      <AnimatePresence>
        {!collapsed && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className="p-4 bg-[#0f0f0f]">{children}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Section;
