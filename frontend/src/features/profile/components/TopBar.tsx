import { Sun, ChevronDown, LayoutDashboard } from 'lucide-react';
import { Link } from 'react-router-dom';

const TopBar: React.FC = () => {
  return (
    <header className="grid grid-cols-3 items-center bg-[#111111] px-5 py-2.5 border-b border-[#2a2a2a] shadow-md">
      {/* Left side - Logo and brand name */}
      <div className="flex items-center">
        <Link to="/" className="transition-opacity duration-200 cursor-pointer hover:opacity-80">
          <div className="mr-2 text-lg font-bold text-white">
            <span className="px-2 mr-2 text-black bg-white rounded">StudyIO</span>
          </div>
        </Link>
      </div>
      
      {/* Center - Dashboard button */}
      <div className="flex items-center justify-center">
        <Link to="/home">
          <button className="group flex items-center gap-2 bg-[#1a1a1a] hover:bg-[#252525] text-white text-sm px-5 py-2 rounded-lg font-medium transition-all duration-200 border border-[#3a3a3a] hover:border-orange-500/50 hover:shadow-[0_0_12px_rgba(249,115,22,0.15)]">
            <LayoutDashboard size={16} className="text-orange-500 transition-colors group-hover:text-orange-400" />
            <span>Dashboard</span>
          </button>
        </Link>
      </div>
      
      {/* Right side - Dark mode toggle */}
      <div className="flex items-center justify-end">
        <button className="p-2 text-gray-400 transition-colors duration-200 rounded-lg hover:text-yellow-400 hover:bg-[#1a1a1a]">
          <Sun size={20} />
        </button>
      </div>
    </header>
  );
};

export default TopBar;
