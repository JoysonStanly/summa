import { type FC, useState, useRef, useEffect } from 'react';
import { Home, Book, Trophy, User, Brain, Settings, Bug, ListChecks, Bell, BellOff, LogOut, ChevronRight, ShieldCheck } from 'lucide-react';
import { motion } from 'framer-motion';
import { Link, useLocation } from 'react-router-dom';

interface SidebarProps {
  activePage?: 'home' | 'sessions' | 'rankings' | 'dsa' | 'progress' | 'aptitude';
  activeTopicId?: string;
  activeProblemId?: string;
}

const Sidebar: FC<SidebarProps> = ({ activePage }) => {
  const location = useLocation();
  const path = location.pathname;
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const notificationRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
      if (notificationRef.current && !notificationRef.current.contains(event.target as Node)) {
        setIsNotificationOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);
  
  // Determine active page based on URL path
  const isHome = path === '/' || path === '/home';
  const isSessions = path === '/sessions';
  const isRankings = path === '/rankings';
  const isDSA = path.includes('/dsa');
  const isAdmin = path.includes('/admin');
  
  return (
    <motion.aside 
      initial={{ x: -100, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      className="fixed left-0 top-0 h-full w-20 bg-[#1a1a1a] flex flex-col items-center py-6 border-r border-[#2a2a2a] z-50"
    >
      {/* Logo */}
      <div className="mb-12">
        <div className="px-2 py-3 text-xs font-extrabold text-black bg-white border border-gray-200 shadow-lg rounded-xl shadow-white/20">
          StudyIO
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex flex-col flex-1 gap-6">
        <NavItem icon={<Home size={20} />} label="Home" to="/home" active={isHome} />
        <NavItem icon={<Book size={20} />} label="Sessions" to="/sessions" active={isSessions} />
        <NavItem icon={<Trophy size={20} />} label="Rankings" to="/rankings" active={isRankings} />
        
        {/* Divider */}
        <div className="w-12 h-[1px] bg-[#2a2a2a] mx-auto" />
        
        {/* Admin */}
        <NavItem icon={<ShieldCheck size={20} />} label="Admin" to="/admin" active={isAdmin} />
        
      </nav>

      {/* User Profile */}
      <div className="relative mt-auto mb-6" ref={dropdownRef}>
        <div 
          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          className="relative flex items-center justify-center w-10 h-10 overflow-hidden transition-colors bg-gray-700 rounded-full cursor-pointer hover:bg-gray-600"
          title="Profile"
        >
          <User size={20} className="text-white" />
        </div>

        {/* Dropdown Menu */}
        {isDropdownOpen && (
          <>
            {/* Backdrop */}
            <div className="fixed inset-0 bg-black/60 z-[9998]" onClick={() => setIsDropdownOpen(false)} />
            
            <div className="absolute left-full ml-6 bottom-0 w-72 bg-[#1a1a1a] border border-[#2a2a2a] shadow-2xl rounded-lg overflow-hidden z-[9999]">
            {/* User Info Header */}
            <div className="flex items-center gap-3 px-3 py-3 border-b border-[#2a2a2a] bg-[#111]">
              <div className="relative flex items-center justify-center w-10 h-10 overflow-hidden rounded-full bg-gradient-to-br from-gray-600 to-gray-800">
                <User size={20} className="text-white" />
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-medium text-white">Joy</span>
                <span className="text-xs text-gray-400">joysonstanley3@gmail.com</span>
              </div>
            </div>

            {/* Menu Items */}
            <div className="py-1">
              <Link 
                to="/profile" 
                className="flex items-center justify-between w-full gap-2 px-3 py-2 text-sm text-white transition-all cursor-pointer hover:bg-[#2a2a2a] hover:translate-x-1"
                onClick={() => setIsDropdownOpen(false)}
              >
                <div className="flex items-center gap-2">
                  <User size={16} />
                  <span>My Profile</span>
                </div>
                <ChevronRight size={16} className="text-gray-400" />
              </Link>

              <Link 
                to="/plus/account" 
                className="flex items-center justify-between w-full gap-2 px-3 py-2 text-sm text-white transition-all cursor-pointer hover:bg-[#2a2a2a] hover:translate-x-1"
                onClick={() => setIsDropdownOpen(false)}
              >
                <div className="flex items-center gap-2">
                  <Settings size={16} />
                  <span>Account</span>
                </div>
                <ChevronRight size={16} className="text-gray-400" />
              </Link>

              <Link 
                to="/plus/buganizer" 
                className="flex items-center justify-between w-full gap-2 px-3 py-2 text-sm text-white transition-all cursor-pointer hover:bg-[#2a2a2a] hover:translate-x-1"
                onClick={() => setIsDropdownOpen(false)}
              >
                <div className="flex items-center gap-2">
                  <Bug size={16} />
                  <span>Buganizer</span>
                </div>
                <ChevronRight size={16} className="text-gray-400" />
              </Link>

              <Link 
                to="/plus/sessions" 
                className="flex items-center justify-between w-full gap-2 px-3 py-2 text-sm text-white transition-all cursor-pointer hover:bg-[#2a2a2a] hover:translate-x-1"
                onClick={() => setIsDropdownOpen(false)}
              >
                <div className="flex items-center gap-2">
                  <ListChecks size={16} />
                  <span>Sessions</span>
                </div>
                <ChevronRight size={16} className="text-gray-400" />
              </Link>

              {/* Notification with nested dropdown */}
              <div className="relative" ref={notificationRef}>
                <button 
                  onClick={(e) => { 
                    e.stopPropagation(); 
                    setIsNotificationOpen(!isNotificationOpen); 
                  }} 
                  className="flex items-center justify-between w-full gap-2 px-3 py-2 text-sm text-white transition-all cursor-pointer hover:bg-[#2a2a2a] hover:translate-x-1"
                >
                  <div className="flex items-center gap-2">
                    <Bell size={16} />
                    <span>Notification</span>
                  </div>
                  <ChevronRight size={16} className="text-gray-400" />
                </button>

                {isNotificationOpen && (
                  <div className="absolute left-full ml-2 -bottom-16 w-72 rounded-lg bg-[#1a1a1a] border border-[#2a2a2a] shadow-2xl z-[10000]" onClick={(e) => e.stopPropagation()}>
                    <div className="h-[310px] overflow-y-auto scrollbar-none">
                      <div className="flex flex-col items-center justify-center h-full p-6">
                        <BellOff className="w-12 h-12 mb-4 text-zinc-500" strokeWidth={1.5} />
                        <p className="mb-1 text-sm font-medium text-white">No notifications yet</p>
                        <p className="text-xs text-center text-zinc-400">We'll notify you when something arrives</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Divider */}
              <div className="my-1 border-t border-[#2a2a2a]"></div>

              {/* Logout */}
              <button 
                className="flex items-center justify-between w-full gap-2 px-3 py-2 text-sm text-red-400 transition-all cursor-pointer hover:bg-red-500/10 hover:translate-x-1"
                onClick={() => {
                  setIsDropdownOpen(false);
                  // Add logout logic here
                  console.log('Logout clicked');
                }}
              >
                <div className="flex items-center gap-2">
                  <LogOut size={16} />
                  <span>Logout</span>
                </div>
                <ChevronRight size={16} className="text-red-400/60" />
              </button>
            </div>
          </div>
          </>
        )}
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
