import { useState, type FC } from 'react';
import { motion } from 'framer-motion';

interface EditorialTabsProps {
  tabs: Array<{ id: string; label: string }>;
  activeTab: string;
  onTabChange: (tabId: string) => void;
}

const EditorialTabs: FC<EditorialTabsProps> = ({ tabs, activeTab, onTabChange }) => {
  return (
    <div className="flex border-b border-[#2a2a2a] mb-6">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => onTabChange(tab.id)}
          className={`relative px-6 py-3 text-sm transition-colors ${
            activeTab === tab.id ? 'text-white' : 'text-[#9ca3af] hover:text-white'
          }`}
        >
          {tab.label}
          {activeTab === tab.id && (
            <motion.div
              className="absolute bottom-0 left-0 right-0 h-0.5 bg-white"
              layoutId="activeTab"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
            />
          )}
        </button>
      ))}
    </div>
  );
};

export default EditorialTabs;
