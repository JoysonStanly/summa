import { FC } from 'react';
import { ThemeToggle } from '../ui/common';
import { AuthButtons } from '../auth/AuthButtons';

interface TopBarProps {
  day?: number;
  progress?: number;
  streak?: number;
  coins?: number;
}

const TopBar: FC<TopBarProps> = ({ day = 1, progress = 0, streak = 0, coins = 0 }) => {
  return (
    <div className="flex items-center justify-between py-4 px-4">
      <div className="flex items-center gap-4">
        {/* Day counter */}
        <div className="flex flex-col">
          <span className="text-sm text-gray-400">Day {day}</span>
          <span className="text-xs text-gray-500">Problem {day}/945</span>
        </div>
        
        {/* Progress bar */}
        <div className="relative w-72 h-2 bg-[#333] rounded-full overflow-hidden">
          <div 
            className="absolute left-0 top-0 h-full bg-gradient-to-r from-orange-500 to-amber-400"
            style={{ width: `${progress}%` }}
          />
        </div>
        <span className="text-xs text-gray-400">{progress}%</span>
      </div>
      
      <div className="flex items-center gap-4">
        {/* Auth Buttons */}
        <AuthButtons />
        
        {/* Day streak */}
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-full bg-yellow-500 flex items-center justify-center">
            <span className="text-xs">🔥</span>
          </div>
          <div className="flex flex-col">
            <span className="text-sm text-gray-400">Day {streak}</span>
            <span className="text-xs text-gray-500">20 Aug 2025</span>
          </div>
        </div>
        
        {/* Coins */}
        <div className="flex items-center gap-1">
          <span className="text-lg font-bold">{coins}</span>
          <div className="w-6 h-6 rounded-full bg-yellow-500 flex items-center justify-center">
            <span className="text-xs">🪙</span>
          </div>
        </div>
        
        {/* Theme Toggle */}
        <ThemeToggle />
      </div>
    </div>
  );
};

export default TopBar;
