import { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface ResponsiveSidebarProps {
  children: React.ReactNode;
  isOpen?: boolean;
  onToggle?: () => void;
  width?: string;
  showToggleButton?: boolean;
}

const ResponsiveSidebar = ({
  children,
  isOpen: externalIsOpen,
  onToggle: externalOnToggle,
  width = '280px',
  showToggleButton = true,
}: ResponsiveSidebarProps) => {
  // If external control is provided, use it. Otherwise, manage state internally
  const [internalIsOpen, setInternalIsOpen] = useState(true);
  const isOpen = externalIsOpen !== undefined ? externalIsOpen : internalIsOpen;
  const onToggle = externalOnToggle || (() => setInternalIsOpen(!internalIsOpen));
  
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  
  return (
    <>
      {/* Toggle button (visible on mobile or when showToggleButton is true) */}
      {(isMobile || showToggleButton) && (
        <button 
          className={`
            fixed z-50 p-2 bg-[#1a1a1a] text-white rounded-md shadow-lg
            ${isMobile ? 'top-4 left-4' : 'top-4 left-4'}
            transition-all duration-300
            ${isOpen && !isMobile ? 'left-[calc(280px-16px)]' : ''}
          `}
          onClick={onToggle}
          aria-label={isOpen ? 'Close sidebar' : 'Open sidebar'}
        >
          {isOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      )}
      
      {/* Sidebar */}
      <div
        className={`
          fixed top-0 left-0 h-full z-40
          transition-transform duration-300 ease-in-out
          ${!isOpen ? 'transform -translate-x-full' : 'transform translate-x-0'}
        `}
        style={{ width }}
      >
        <div className="h-full overflow-y-auto bg-[#121212] border-r border-gray-800">
          {children}
        </div>
      </div>
      
      {/* Backdrop (only on mobile) */}
      <AnimatePresence>
        {isMobile && isOpen && (
          <motion.div
            className="fixed inset-0 z-30 bg-black bg-opacity-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onToggle}
          />
        )}
      </AnimatePresence>
      
      {/* Main content padding to account for sidebar when open */}
      <div
        className={`transition-all duration-300 ${isOpen && !isMobile ? 'pl-[280px]' : ''}`}
        style={{ width: isOpen && !isMobile ? `calc(100% - ${width})` : '100%' }}
      >
        {/* This is where your main content would go */}
      </div>
    </>
  );
};

export default ResponsiveSidebar;