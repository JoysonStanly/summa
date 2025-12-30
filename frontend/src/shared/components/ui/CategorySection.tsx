import { type ReactNode } from 'react';
import { motion } from 'framer-motion';

interface SubjectCardProps {
  title: string;
  icon: ReactNode;
  metadata: {
    label: string;
    value: string;
  }[];
}

const SubjectCard = ({ title, icon, metadata }: SubjectCardProps) => {
  return (
    <motion.div 
      className="bg-[#1a1a1a] border border-[#2a2a2a] hover:border-blue-500/30 rounded-lg p-5 flex flex-col h-full"
      whileHover={{ scale: 1.03, boxShadow: '0 8px 20px rgba(0,0,0,0.3)' }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex items-start gap-5">
        <div className="w-14 h-14 flex items-center justify-center rounded-lg overflow-hidden shadow-lg">
          {icon}
        </div>
        <div className="flex-1">
          <h3 className="font-semibold text-lg">{title}</h3>
          <div className="flex items-center flex-wrap gap-x-4 gap-y-2 mt-3">
            {metadata.map((item, index) => (
              <div key={index} className="flex items-center text-xs gap-1 bg-[#252525] px-2 py-1 rounded-full">
                <span className="font-medium">{item.value}</span>
                <span className="text-gray-400">{item.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
      <button className="w-full mt-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors font-medium">
        Start Learning
      </button>
    </motion.div>
  );
};

interface CategorySectionProps {
  title: string;
  viewAllLink?: string;
  children: ReactNode;
}

const CategorySection = ({ title, viewAllLink, children }: CategorySectionProps) => {
  return (
    <section className="mb-16">
      <div className="flex items-center justify-between mb-6 border-b border-gray-800 pb-2">
        <h2 className="text-2xl font-semibold">{title}</h2>
        {viewAllLink && (
          <a href={viewAllLink} className="text-sm text-blue-400 hover:text-blue-300 flex items-center">
            View All
            <span className="ml-1">→</span>
          </a>
        )}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {children}
      </div>
    </section>
  );
};

export { CategorySection, SubjectCard };
