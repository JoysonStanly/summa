import { useEffect, useState } from 'react';

interface LoadingBarProps {
  isLoading: boolean;
  duration?: number;
}

const LoadingBar = ({ isLoading, duration = 5000 }: LoadingBarProps) => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    console.log('LoadingBar isLoading:', isLoading);
    if (!isLoading) {
      setProgress(0);
      return;
    }

    // Animate progress from 0 to 90% over the duration
    const startTime = Date.now();
    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const newProgress = Math.min((elapsed / duration) * 90, 90);
      setProgress(newProgress);

      if (elapsed >= duration) {
        clearInterval(interval);
        // Complete to 100% quickly
        setProgress(100);
      }
    }, 20);

    return () => clearInterval(interval);
  }, [isLoading, duration]);

  console.log('LoadingBar render - progress:', progress, 'isLoading:', isLoading);

  if (!isLoading && progress === 0) return null;

  return (
    <div className="absolute top-0 left-0 right-0 h-1 bg-[#1a1a1a] z-[100] overflow-hidden">
      <div
        className="h-full transition-all duration-100 ease-linear bg-gradient-to-r from-orange-400 via-orange-500 to-red-500"
        style={{
          width: `${progress}%`,
          boxShadow: '0 0 20px rgba(255, 109, 0, 1), 0 0 40px rgba(255, 109, 0, 0.6)'
        }}
      />
    </div>
  );
};

export default LoadingBar;
