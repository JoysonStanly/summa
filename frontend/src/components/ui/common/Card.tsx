import { ReactNode } from 'react';
import { motion } from 'framer-motion';

interface CardProps {
  children: ReactNode;
  className?: string;
  animate?: boolean;
  onClick?: () => void;
  hoverEffect?: boolean;
}

export const Card = ({ 
  children, 
  className = '', 
  animate = true, 
  onClick,
  hoverEffect = true 
}: CardProps) => {
  const baseClass = `
    bg-[#1a1a1a] rounded-lg overflow-hidden ${className}
    ${hoverEffect ? 'hover:shadow-lg hover:shadow-orange-900/10 transition-shadow' : ''}
    ${onClick ? 'cursor-pointer' : ''}
  `;
  
  if (!animate) {
    return (
      <div className={baseClass} onClick={onClick}>
        {children}
      </div>
    );
  }
  
  return (
    <motion.div 
      className={baseClass}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      onClick={onClick}
      whileHover={hoverEffect ? { scale: 1.01 } : undefined}
    >
      {children}
    </motion.div>
  );
};

export default Card;