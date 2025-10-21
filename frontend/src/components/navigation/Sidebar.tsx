import { type FC } from 'react';
import { Home, Book, Trophy, User, Network } from 'lucide-react';
import { motion } from 'framer-motion';
import { Link, useLocation } from 'react-router-dom';

interface SidebarProps {
  activePage?: 'home' | 'sessions' | 'rankings' | 'dsa' | 'progress';
  activeTopicId?: string;
  activeProblemId?: string;
}

const Sidebar: FC<SidebarProps> = ({ activePage }) => {
  const location = useLocation();
  const path = location.pathname;
  
  // Determine active page based on URL path
  const isHome = path === '/';
  const isSessions = path === '/sessions';
  const isRankings = path === '/rankings';
  const isDSA = path.includes('/dsa');
  return (
    <motion.aside 
      initial={{ x: -100, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      className="fixed left-0 top-0 h-full w-20 bg-[#1a1a1a] flex flex-col items-center py-6 border-r border-[#2a2a2a] z-10"
    >
      {/* Logo */}
      <div className="mb-12">
        <h1 className="text-xl font-bold">TUF</h1>
      </div>

      {/* Navigation */}
      <nav className="flex flex-col flex-1 gap-6">
        <NavItem icon={<Home size={20} />} label="Home" to="/" active={isHome} />
        <NavItem icon={<Book size={20} />} label="Sessions" to="/sessions" active={isSessions} />
        <NavItem icon={<Trophy size={20} />} label="Rankings" to="/rankings" active={isRankings} />
      </nav>

      {/* User Profile */}
      <div className="mt-auto mb-6">
        <Link to="/profile" title="Profile">
          <div className="relative flex items-center justify-center w-10 h-10 overflow-hidden bg-gray-700 rounded-full cursor-pointer hover:bg-gray-600">
            <User size={20} />
          </div>
        </Link>
      </div>
    </motion.aside>
  );
};

interface NavItemProps {
  icon: React.ReactNode;
  label: string;
  to: string;
  active?: boolean;
}

const NavItem: FC<NavItemProps> = ({ icon, label, to, active }) => {
  return (
    <div className="relative flex flex-col items-center w-full">
      {active && (
        <motion.div 
          layoutId="nav-indicator"
          className="absolute left-0 w-1 h-8 bg-white rounded-r-full"
        />
      )}
      <Link to={to}>
        <div 
          className={`w-12 h-12 rounded-xl flex items-center justify-center relative ${
            active ? 'text-white bg-[#111]' : 'text-[#9ca3af] hover:text-white'
          }`}
          title={label}
        >
          {icon}
        </div>
      </Link>
    </div>
  );
};

export default Sidebar;
