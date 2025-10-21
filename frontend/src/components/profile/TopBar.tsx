import { Sun, ChevronDown } from 'lucide-react';
import { Link } from 'react-router-dom';

const TopBar: React.FC = () => {
  return (
    <header className="flex items-center justify-between bg-[#111111] px-4 py-2 border-b border-[#2a2a2a]">
      {/* Left side - Logo and brand name */}
      <div className="flex items-center">
        <Link to="/" className="cursor-pointer hover:opacity-80">
          <div className="mr-2 text-lg font-bold text-white">
            <span className="px-1 mr-1 text-black bg-white">TUF</span>
            <span>takeUforward</span>
          </div>
        </Link>
      </div>
      
      {/* Right side - buttons and profile */}
      <div className="flex items-center space-x-4">
        {/* Plus Dashboard button */}
        <button className="bg-[#b08d57] text-white text-xs px-4 py-1 rounded-md font-medium">
          Plus Dashboard
        </button>
        
        {/* Resources dropdown */}
        <div className="flex items-center text-sm">
          <span>Resources</span>
          <ChevronDown size={14} />
        </div>
        
        {/* Dark mode toggle */}
        <div className="text-gray-400">
          <Sun size={18} />
        </div>
        
        {/* User avatar with link to profile */}
        <Link to="/profile">
          <div className="flex items-center justify-center w-8 h-8 overflow-hidden bg-gray-700 rounded-full cursor-pointer">
            <img 
              src="/images/avatar-placeholder.jpg" 
              alt="User avatar" 
              className="object-cover w-full h-full"
              onError={(e) => {
                // Fallback if image doesn't load
                (e.target as HTMLImageElement).style.display = 'none';
                (e.target as HTMLElement).parentElement!.textContent = 'J';
              }}
            />
          </div>
        </Link>
      </div>
    </header>
  );
};

export default TopBar;
