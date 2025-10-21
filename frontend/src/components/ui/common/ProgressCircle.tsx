import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';

interface ProgressCircleProps {
  progress: number; // 0 to 100
  size?: number;
  strokeWidth?: number;
  circleColor?: string;
  progressColor?: string;
  textColor?: string;
  animate?: boolean;
  showPercentage?: boolean;
  label?: string;
  className?: string;
}

const ProgressCircle = ({
  progress,
  size = 100,
  strokeWidth = 8,
  circleColor = '#2a2a2a',
  progressColor = '#ff7000',
  textColor = 'white',
  animate = true,
  showPercentage = true,
  label,
  className = ''
}: ProgressCircleProps) => {
  const [animatedProgress, setAnimatedProgress] = useState(0);
  const previousProgress = useRef(0);
  
  // Calculate circle values
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (animatedProgress / 100) * circumference;
  
  // Animate progress value
  useEffect(() => {
    if (!animate) {
      setAnimatedProgress(progress);
      return;
    }

    previousProgress.current = animatedProgress;
    
    const animationDuration = 1000; // 1 second
    const startTime = Date.now();
    
    const animateProgress = () => {
      const elapsed = Date.now() - startTime;
      const nextProgress = previousProgress.current + 
        ((progress - previousProgress.current) * 
          Math.min(elapsed / animationDuration, 1));
      
      setAnimatedProgress(nextProgress);
      
      if (elapsed < animationDuration) {
        requestAnimationFrame(animateProgress);
      } else {
        setAnimatedProgress(progress);
      }
    };
    
    requestAnimationFrame(animateProgress);
  }, [progress, animate, animatedProgress]);
  
  return (
    <div className={`inline-flex flex-col items-center ${className}`}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        {/* Background circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="transparent"
          stroke={circleColor}
          strokeWidth={strokeWidth}
        />
        
        {/* Progress circle */}
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="transparent"
          stroke={progressColor}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
        />
        
        {/* Percentage text */}
        {showPercentage && (
          <text
            x="50%"
            y="50%"
            textAnchor="middle"
            dy=".3em"
            fill={textColor}
            fontSize={`${size / 5}px`}
            fontWeight="bold"
          >
            {Math.round(animatedProgress)}%
          </text>
        )}
      </svg>
      
      {/* Optional label */}
      {label && (
        <div className="mt-2 text-center text-sm text-gray-300">{label}</div>
      )}
    </div>
  );
};

export default ProgressCircle;