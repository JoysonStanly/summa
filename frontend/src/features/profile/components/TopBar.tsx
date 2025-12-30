import { Sun, ChevronDown } from 'lucide-react';
import { Link } from 'react-router-dom';

const TopBar: React.FC = () => {
  return (
    <header className="flex items-center justify-between bg-[#111111] px-5 py-2.5 border-b border-[#2a2a2a] shadow-md">
      {/* Left side - Logo and brand name */}
      <div className="flex items-center">
        <Link to="/" className="cursor-pointer hover:opacity-80 transition-opacity duration-200">
          <div className="mr-2 text-lg font-bold text-white">
            <span className="px-2 mr-2 text-black bg-white rounded">StudyIO</span>
          </div>
        </Link>
      </div>
      
      {/* Right side - buttons and profile */}
      <div className="flex items-center space-x-5">
        {/* Dashboard button */}
        <button className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white text-sm px-6 py-2 rounded-lg font-semibold transition-all duration-200 hover:shadow-lg hover:scale-105 min-w-[120px]">
          Dashboard
        </button>
        
        {/* Dark mode toggle */}
        <div className="text-gray-400 cursor-pointer hover:text-gray-200 transition-colors duration-200">
          <Sun size={19} />
        </div>
        
        {/* User avatar with link to profile */}
        <Link to="/profile">
          <div className="flex items-center justify-center w-9 h-9 overflow-hidden bg-gray-700 rounded-full cursor-pointer hover:ring-2 hover:ring-gray-500 transition-all duration-200">
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
