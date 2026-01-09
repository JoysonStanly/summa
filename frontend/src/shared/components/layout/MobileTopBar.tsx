import { type FC, useState } from 'react';
import { Menu, X, Home, Book, Trophy, User, Settings, Bug, ListChecks, LogOut, ShieldCheck } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/features/auth/stores/AuthContext';
import { Code2 } from 'lucide-react';

interface MobileTopBarProps {
  showLogo?: boolean;
  showTabs?: boolean;
  activeTab?: 'home' | 'streak' | 'daily-planner';
  onTabChange?: (tab: 'home' | 'streak' | 'daily-planner') => void;
}

const MobileTopBar: FC<MobileTopBarProps> = ({ showLogo = true, showTabs = true, activeTab = 'home', onTabChange }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [currentTab, setCurrentTab] = useState<'home' | 'streak' | 'daily-planner'>(activeTab);
  const { user, logout, isAuthenticated } = useAuth();
  const location = useLocation();
  const path = location.pathname;

  const isAdmin = user?.role === 'admin';

  const tabs = [
    { id: 'home' as const, label: 'Home' },
    { id: 'streak' as const, label: 'Streak' },
    { id: 'daily-planner' as const, label: 'Daily Planner' },
  ];

  const handleTabClick = (tabId: 'home' | 'streak' | 'daily-planner') => {
    setCurrentTab(tabId);
    onTabChange?.(tabId);
  };

  const menuItems = [
    { icon: Home, label: 'Home', to: '/home' },
    { icon: Book, label: 'Sessions', to: '/sessions' },
    { icon: Trophy, label: 'Rankings', to: '/rankings' },
    { icon: User, label: 'Profile', to: '/profile' },
    { icon: Settings, label: 'Account', to: 'a/ccount' },
    { icon: Bug, label: 'Buganizer', to: '/buganizer' },
    { icon: ListChecks, label: 'Sessions', to: '/sessions' },
  ];

  if (isAdmin) {
    menuItems.push({ icon: ShieldCheck, label: 'Admin', to: '/admin' });
  }

  return (
    <>
      {/* Mobile Top Bar - Fixed at top */}
      <div className="fixed top-0 left-0 right-0 z-50 w-full lg:hidden bg-[#1a1a1a] border-b border-[#2a2a2a]">
        {/* Top Section: Logo + Hamburger */}
        <div className="flex items-center justify-between w-full px-4 py-3 border-b border-[#2a2a2a]">
          {/* Logo */}
          {showLogo && (
            <Link to="/home" className="flex items-center">
              <div className="flex items-center gap-2">
                <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-gradient-to-br from-orange-500 to-red-500">
                  <Code2 className="w-5 h-5 text-white" />
                </div>
                <span className="text-lg font-bold text-white">StudyIO</span>
              </div>
            </Link>
          )}

          {/* Hamburger Menu Button */}
          <button
            className="flex items-center justify-center w-8 h-8 transition-colors rounded-md hover:bg-zinc-800"
            aria-label="Open menu"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <Menu className="w-5 h-5 text-zinc-400" />
          </button>
        </div>

        {/* Tabs Section: Streak, Daily Planner */}
        {showTabs && (
        <div className="flex justify-center px-3 py-2" role="tablist" aria-label="Mobile panel selector">
          <div className="inline-flex items-center gap-1 bg-[#1a1a1a] rounded-full p-0.5 border border-[#2a2a2a]">
            {tabs.map((tab) => {
              const isActive = currentTab === tab.id;
              
              return (
                <div key={tab.id} className="relative">
                  {/* Background wrapper */}
                  <div className="relative">
                    {/* Animated background for active tab */}
                    {isActive && (
                      <motion.div
                        layoutId="mobile-tab-background"
                        className="absolute inset-0 rounded-full"
                        style={{
                          background: 'linear-gradient(135deg, rgba(249, 115, 22, 0.25), rgba(234, 88, 12, 0.15))',
                          transform: 'none',
                          transformOrigin: '50% 50% 0px',
                        }}
                        transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                      />
                    )}

                    {/* Tab Button */}
                    <button
                      role="tab"
                      aria-selected={isActive}
                      aria-controls={`${tab.id}-panel`}
                      tabIndex={isActive ? 0 : -1}
                      onClick={() => handleTabClick(tab.id)}
                      className={`
                        relative px-4 py-1.5 rounded-full font-medium text-xs transition-all overflow-hidden whitespace-nowrap
                        ${isActive 
                          ? 'text-white bg-gradient-to-br from-orange-500/30 to-orange-600/20 backdrop-blur-sm shadow-lg shadow-orange-500/20' 
                          : 'text-gray-400 hover:text-gray-300'
                        }
                      `}
                      style={isActive ? { 
                        '--glass-mask-angle': '170deg',
                        boxShadow: 'inset 0 1px 0 0 rgba(249, 115, 22, 0.3), 0 2px 4px 0 rgba(249, 115, 22, 0.3)',
                      } as React.CSSProperties : {}}
                    >
                      <span className="relative z-10">{tab.label}</span>
                      {isActive && (
                        <div 
                          className="absolute inset-0 opacity-50"
                          style={{
                            background: 'linear-gradient(var(--glass-mask-angle, 170deg), rgba(249, 115, 22, 0.3) 0%, transparent 50%)',
                          }}
                        />
                      )}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
        )}
      </div>

      {/* Mobile Menu Drawer */}
      <AnimatePresence>
        {isMenuOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMenuOpen(false)}
              className="fixed inset-0 z-[60] bg-black/60 lg:hidden"
            />

            {/* Drawer */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'tween', duration: 0.3 }}
              className="fixed top-0 right-0 bottom-0 z-[70] w-[280px] bg-[#1a1a1a] border-l border-[#2a2a2a] lg:hidden"
            >
              {/* Drawer Header */}
              <div className="flex items-center justify-between px-4 py-4 border-b border-[#2a2a2a]">
                <h2 className="text-lg font-semibold text-white">Menu</h2>
                <button
                  onClick={() => setIsMenuOpen(false)}
                  className="flex items-center justify-center w-8 h-8 transition-colors rounded-md hover:bg-zinc-800"
                  aria-label="Close menu"
                >
                  <X className="w-5 h-5 text-zinc-400" />
                </button>
              </div>

              {/* User Info */}
              {isAuthenticated() && user && (
                <div className="px-4 py-4 border-b border-[#2a2a2a]">
                  <div className="flex items-center gap-3">
                    <div className="flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-br from-gray-600 to-gray-800">
                      {user.avatar ? (
                        <img src={user.avatar} alt={user.name} className="object-cover w-full h-full rounded-full" />
                      ) : (
                        <User size={20} className="text-white" />
                      )}
                    </div>
                    <div className="flex flex-col">
                      <span className="text-sm font-medium text-white">{user.name}</span>
                      <span className="text-xs text-gray-400">{user.email}</span>
                      {isAdmin && <span className="text-[10px] text-orange-500 uppercase font-bold mt-0.5">Admin</span>}
                    </div>
                  </div>
                </div>
              )}

              {/* Menu Items */}
              <div className="flex flex-col py-2 overflow-y-auto" style={{ maxHeight: 'calc(100vh - 200px)' }}>
                {menuItems.map((item) => {
                  const isActive = path === item.to || (item.to !== '/home' && path.startsWith(item.to));
                  return (
                    <Link
                      key={item.label}
                      to={item.to}
                      onClick={() => setIsMenuOpen(false)}
                      className={`flex items-center gap-3 px-4 py-3 transition-colors ${
                        isActive
                          ? 'bg-zinc-800/80 text-white border-l-2 border-orange-500'
                          : 'text-gray-400 hover:text-white hover:bg-zinc-800/50'
                      }`}
                    >
                      <item.icon size={20} />
                      <span className="text-sm font-medium">{item.label}</span>
                    </Link>
                  );
                })}
              </div>

              {/* Logout Button */}
              {isAuthenticated() && (
                <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-[#2a2a2a] bg-[#1a1a1a]">
                  <button
                    onClick={() => {
                      setIsMenuOpen(false);
                      logout();
                    }}
                    className="flex items-center justify-center w-full gap-2 px-4 py-3 text-sm font-medium text-red-400 transition-colors rounded-lg hover:bg-red-500/10"
                  >
                    <LogOut size={18} />
                    <span>Logout</span>
                  </button>
                </div>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default MobileTopBar;
