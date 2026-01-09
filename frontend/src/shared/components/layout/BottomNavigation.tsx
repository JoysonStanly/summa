import { type FC } from 'react';
import { Home, Book, Trophy, User } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';

interface BottomNavigationProps {
  activePage?: 'home' | 'sessions' | 'rankings' | 'profile';
}

const BottomNavigation: FC<BottomNavigationProps> = ({ activePage }) => {
  const location = useLocation();
  const path = location.pathname;

  // Determine active page based on URL path
  const isHome = path === '/' || path === '/home';
  const isSessions = path === '/sessions';
  const isRankings = path === '/rankings';
  const isProfile = path.includes('/profile') || path.includes('/plus');

  const navItems = [
    { icon: Home, label: 'Home', to: '/home', active: isHome },
    { icon: Book, label: 'Sessions', to: '/sessions', active: isSessions },
    { icon: Trophy, label: 'Rankings', to: '/rankings', active: isRankings },
    { icon: User, label: 'Profile', to: '/profile', active: isProfile },
  ];

  return (
    <motion.nav
      initial={{ y: 100 }}
      animate={{ y: 0 }}
      className="fixed bottom-0 left-0 right-0 z-50 lg:hidden bg-[#1a1a1a] border-t border-[#2a2a2a] safe-area-inset-bottom"
    >
      <div className="relative flex items-center justify-around h-16 px-2">
        {/* Active indicator background */}
        {navItems.map((item, index) => (
          item.active && (
            <motion.div
              key="active-indicator"
              layoutId="bottom-nav-indicator"
              className="absolute top-0 h-1 bg-orange-500 rounded-b-full"
              style={{
                width: '48px',
                left: `calc(${index * 25}% + ${index === 0 ? '12.5%' : index === 1 ? '12.5%' : index === 2 ? '12.5%' : '12.5%'} - 24px)`,
              }}
              transition={{ type: 'spring', stiffness: 380, damping: 30 }}
            />
          )
        ))}

        {navItems.map((item) => (
          <Link
            key={item.label}
            to={item.to}
            className="relative flex flex-col items-center justify-center flex-1 h-full gap-1 group"
          >
            {/* Icon */}
            <item.icon
              size={22}
              className={`transition-colors ${
                item.active ? 'text-orange-500' : 'text-gray-400 group-hover:text-white'
              }`}
            />

            {/* Label */}
            <span
              className={`text-xs font-medium transition-colors ${
                item.active ? 'text-orange-500' : 'text-gray-400 group-hover:text-white'
              }`}
            >
              {item.label}
            </span>
          </Link>
        ))}
      </div>
    </motion.nav>
  );
};

export default BottomNavigation;
