import React, { useState, useRef, useEffect, useMemo, useCallback, useContext } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { AuthContext } from '@features/auth/stores/AuthContext';
import { User, Settings, Bug, ListChecks, Bell, BellOff, LogOut, ChevronRight, FileText, Navigation, Home, ShieldCheck, Check, Loader, type LucideIcon } from 'lucide-react';
import { motion } from 'framer-motion';

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

interface AnimatedNavItemProps {
  icon: LucideIcon | React.ComponentType<{ className?: string }>;
  label?: string;
  to: string;
  isActive?: boolean;
  iconRotation?: 'left' | 'right' | 'none';
  className?: string;
}

interface SubItem {
  id: string;
  name: string;
  isCompleted?: boolean;
  problems?: { id: string; name: string; isCompleted?: boolean }[]; // Support problems inside subtopics
}

interface Category {
  id: string;
  name: string;
  subCategories?: SubItem[];
  topics?: SubItem[];
  problems?: { id: string; name: string; isCompleted?: boolean }[];
}

interface Notification {
  _id: string;
  userId: string;
  type: string;
  title: string;
  message: string;
  read: boolean;
  createdAt: string;
}

interface UnifiedSidebarProps {
  title: string;
  categories: Category[];
  searchPlaceholder?: string;
  basePath: string;
  isActive?: (categoryId: string, subItemId: string) => boolean;
  showTabs?: boolean;
  tabOptions?: { basic: string; advanced: string };
  userName?: string;
  userAvatar?: string;
  theme?: 'light' | 'dark';
  showSearch?: boolean;
  showTitle?: boolean;
  showModuleCalendar?: boolean;
  hideRoadmap?: boolean;
}

// ============================================================================
// MEMOIZED SUB-COMPONENTS
// ============================================================================

// Sidebar Item Component with Framer Motion
interface SidebarItemProps {
  to: string;
  icon: React.ReactNode;
  label: string;
  active?: boolean;
  hoveredItem: string | null;
  onHoverChange: (label: string | null) => void;
}

const SidebarItem: React.FC<SidebarItemProps> = React.memo(({ to, icon, label, active = false, hoveredItem, onHoverChange }) => {
  const isHovered = hoveredItem === label;
  const shouldShowContent = isHovered || (active && hoveredItem === null);

  return (
    <Link to={to} className="flex-1">
      <motion.div
        layout
        initial={false}
        animate={{
          backgroundColor: active ? 'rgba(24, 24, 27, 0.9)' : 'transparent',
          borderColor: shouldShowContent ? 'rgb(63, 63, 70)' : 'transparent',
          borderWidth: 1,
        }}
        whileHover={{
          backgroundColor: 'rgba(24, 24, 27, 0.7)',
        }}
        onHoverStart={() => onHoverChange(label)}
        onHoverEnd={() => onHoverChange(null)}
        transition={{ duration: 0.2 }}
        className="flex items-center h-8 overflow-hidden rounded-md cursor-pointer"
        style={{ borderStyle: 'solid' }}
      >
        {/* Icon */}
        <div className="flex items-center justify-center flex-shrink-0 w-8 h-8">
          <motion.div 
            className={`${active ? 'text-white' : 'text-zinc-400'}`}
            whileHover={{ color: '#ffffff' }}
            transition={{ duration: 0.2 }}
          >
            {icon}
          </motion.div>
        </div>

        {/* Text with animation */}
        <motion.span
          initial={{ opacity: 0, width: 0 }}
          animate={{
            opacity: shouldShowContent ? 1 : 0,
            width: shouldShowContent ? 'auto' : 0,
          }}
          transition={{ duration: 0.3, ease: 'easeOut' }}
          className="pr-2 overflow-hidden text-sm font-medium text-white whitespace-nowrap"
        >
          {label}
        </motion.span>
      </motion.div>
    </Link>
  );
});

SidebarItem.displayName = 'SidebarItem';

const AnimatedNavItem: React.FC<AnimatedNavItemProps> = React.memo(({ 
  icon: Icon, 
  label, 
  to, 
  isActive = false,
  iconRotation = 'right',
  className = ''
}) => {
  return (
    <Link
      to={to}
      className={`group relative flex items-center gap-2 px-3 py-2 rounded-lg overflow-hidden transition-all duration-300 ${
        isActive 
          ? 'bg-zinc-800/80 text-white' 
          : 'text-zinc-400 hover:text-white hover:bg-zinc-800/50'
      } ${className}`}
    >
      <span className="absolute inset-0 bg-gradient-to-r from-transparent via-[#EA763F]/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-out" />
      
      <Icon className={`relative z-10 w-4 h-4 transition-all duration-300 ease-out group-hover:scale-110 ${
        iconRotation === 'right' ? 'group-hover:rotate-6' : 
        iconRotation === 'left' ? 'group-hover:-rotate-6' : ''
      }`} />
      
      {label && (
        <span className="relative z-10 text-sm font-medium transition-all duration-300 ease-out group-hover:translate-x-1">
          {label}
        </span>
      )}
      
      <span className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 shadow-[inset_0_0_20px_rgba(234,118,63,0.3)] pointer-events-none rounded-lg" />
    </Link>
  );
});

AnimatedNavItem.displayName = 'AnimatedNavItem';

const CheckIcon = React.memo<{ isActive: boolean }>(({ isActive }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="26" height="23" viewBox="0 0 21 21" fill="none">
    <circle cx="10.1123" cy="10.6123" r="8" fill={isActive ? "#EA763F" : "#22c55e"} />
    <path d="M9.30338 11.9387L7.68508 10.3204C7.54709 10.1824 7.37146 10.1134 7.15819 10.1134C6.94493 10.1134 6.7693 10.1824 6.63131 10.3204C6.49331 10.4584 6.42432 10.634 6.42432 10.8473C6.42432 11.0605 6.49331 11.2362 6.63131 11.3742L8.77649 13.5194C8.92703 13.6699 9.10266 13.7452 9.30338 13.7452C9.5041 13.7452 9.67973 13.6699 9.83027 13.5194L14.083 9.26662C14.221 9.12863 14.29 8.953 14.29 8.73974C14.29 8.52647 14.221 8.35085 14.083 8.21285C13.945 8.07486 13.7694 8.00586 13.5561 8.00586C13.3428 8.00586 13.1672 8.07486 13.0292 8.21285L11.1663 10.0758L9.30338 11.9387Z" fill="white" />
  </svg>
));

CheckIcon.displayName = 'CheckIcon';

const FolderIcon = React.memo(() => (
  <svg width="25" height="25" viewBox="0 0 25 25" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
    <path d="M20.3623 7.3623H12.3626L9.76199 5.4123C9.50197 5.21829 9.18642 5.11311 8.86199 5.1123H3.8623C3.46448 5.1123 3.08295 5.27034 2.80164 5.55164C2.52034 5.83295 2.3623 6.21448 2.3623 6.6123V19.3623C2.3623 19.7601 2.52034 20.1417 2.80164 20.423C3.08295 20.7043 3.46448 20.8623 3.8623 20.8623H20.3623C20.7601 20.8623 21.1417 20.7043 21.423 20.423C21.7043 20.1417 21.8623 19.7601 21.8623 19.3623V8.8623C21.8623 8.46448 21.7043 8.08295 21.423 7.80165C21.1417 7.52034 20.7601 7.3623 20.3623 7.3623ZM3.8623 6.6123H8.86199L10.8626 8.1123L8.86199 9.61231H3.8623V6.6123ZM20.3623 19.3623H3.8623V11.1123H8.86199C9.18642 11.1115 9.50197 11.0063 9.76199 10.8123L12.3626 8.8623H20.3623V19.3623Z" fill="currentColor" />
  </svg>
));

FolderIcon.displayName = 'FolderIcon';

// ============================================================================
// MAIN COMPONENT
// ============================================================================

const UnifiedSidebar: React.FC<UnifiedSidebarProps> = ({
  title,
  categories,
  searchPlaceholder = 'Search...',
  basePath,
  isActive: customIsActive,
  showTabs = false,
  tabOptions = { basic: 'Basic', advanced: 'Advanced' },
  userName = 'User',
  userAvatar = '/images/avatar-placeholder.svg',
  theme = 'dark',
  showSearch = true,
  showTitle = true,
  showModuleCalendar = false,
  hideRoadmap = false
}) => {
  const { user, logout } = useContext(AuthContext);
  const location = useLocation();
  const navigate = useNavigate();

  // Use user data from context if available, otherwise fallback to props
  const displayUserName = user?.name || userName;
  const displayUserEmail = user?.email || 'No email';
  const displayUserAvatar = user?.avatar || userAvatar;
  const isAdmin = user?.role === 'admin';
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [activeTab, setActiveTab] = useState<'basic' | 'advanced'>('advanced');
  const [expandedCategories, setExpandedCategories] = useState<Record<string, boolean>>(() => {
    return categories.length > 0 ? { [categories[0].id]: true } : {};
  });
  const [expandedSubCategories, setExpandedSubCategories] = useState<Record<string, boolean>>(() => {
    // Auto-expand the first subcategory of the first category by default
    if (categories.length > 0 && categories[0].subCategories && categories[0].subCategories.length > 0) {
      const firstCategory = categories[0];
      const firstSubCategory = firstCategory.subCategories[0];
      return { [`${firstCategory.id}:${firstSubCategory.id}`]: true };
    }
    return {};
  });
  const [searchValue, setSearchValue] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isLoadingNotifications, setIsLoadingNotifications] = useState(false);
  const [hoveredNavItem, setHoveredNavItem] = useState<string | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const notificationRef = useRef<HTMLDivElement>(null);

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

  const toggleCategory = useCallback((categoryId: string) => {
    setExpandedCategories(prev => ({
      ...prev,
      [categoryId]: !prev[categoryId]
    }));
  }, []);

  const toggleSubCategory = useCallback((subCategoryKey: string) => {
    setExpandedSubCategories(prev => ({
      ...prev,
      [subCategoryKey]: !prev[subCategoryKey]
    }));
  }, []);

  const handleToggle = useCallback(() => {
    setIsCollapsed(prev => !prev);
  }, []);

  // Fetch notifications when dropdown is opened
  const fetchNotifications = useCallback(async () => {
    if (isNotificationOpen) return; // Already fetching or visible
    
    try {
      setIsLoadingNotifications(true);
      const token = localStorage.getItem('token');
      const response = await fetch('/api/v1/notifications', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setNotifications(data.data || []);
      }
    } catch (error) {
      console.error('Error fetching notifications:', error);
      setNotifications([]);
    } finally {
      setIsLoadingNotifications(false);
    }
  }, [isNotificationOpen]);

  // Mark notification as read and delete
  const handleDeleteNotification = useCallback(async (notificationId: string) => {
    try {
      const token = localStorage.getItem('token');
      // Mark as read by updating the notification
      await fetch(`/api/v1/notifications/${notificationId}/read`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      // Remove from UI
      setNotifications(prev => prev.filter(n => n._id !== notificationId));
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  }, []);

  // Count unread notifications
  const unreadCount = notifications.filter(n => !n.read).length;
  const hasUnread = unreadCount > 0;

  const defaultIsActive = useCallback((categoryId: string, subItemId: string) => {
    return location.pathname === `${basePath}/${categoryId}/${subItemId}`;
  }, [location.pathname, basePath]);

  const isActive = customIsActive || defaultIsActive;

  const firstTrackLink = useMemo(() => {
    if (categories.length === 0) return '/dsa/arrays/linear-search?tab=problem';
    const firstCategory = categories[0];
    const firstItem = firstCategory.subCategories?.[0] || firstCategory.topics?.[0];
    return firstItem 
      ? `${basePath}/${firstCategory.id}/${firstItem.id}`
      : basePath;
  }, [categories, basePath]);

  const isTrackActive = useMemo(() => {
    return location.pathname.startsWith(basePath) && 
           !location.pathname.includes('/roadmap') && 
           !location.pathname.includes('/notes');
  }, [location.pathname, basePath]);

  const isRoadmapActive = useMemo(() => {
    return location.pathname.includes('/roadmap');
  }, [location.pathname]);

  return (
    <div className="relative hidden h-screen transition-all duration-300 font-dmSans md:flex">
      <div 
        className={`flex flex-col border-r border-[#1f1f1f] transition-all duration-300 ${
          theme === 'dark' ? 'dark:bg-[#0f0f0f] bg-[#0f0f0f]' : 'bg-[#F4F6F8]'
        } ${isCollapsed ? 'w-[60px] items-center' : 'w-[250px]'} p-4`}
        style={{ marginLeft: '0px' }}
      >
        <div className={`flex pb-3 mb-2 transition-all duration-300 ${isCollapsed ? 'justify-center' : 'justify-start'}`}>
          <img
            src="/images/logo.png"
            alt="StudyIO Logo"
            className={`object-contain cursor-pointer mix-blend-lighten hover:scale-105 transition-all ${isCollapsed ? 'w-16 h-16' : 'w-14 h-14'}`}
            style={{ filter: 'brightness(1.2) contrast(1.1)' }}
            onClick={() => navigate('/home')}
          />
        </div>

        {!isCollapsed && showModuleCalendar && (
          <div className="mb-4 space-y-2">
            <Link 
              to="/dsa/roadmap/view"
              className={`flex items-center gap-3 px-3 py-2 rounded-lg cursor-pointer transition-all duration-300 group ${
                location.pathname === '/dsa/roadmap/view'
                  ? 'bg-zinc-800/50 text-white hover:bg-zinc-800/80' 
                  : 'text-zinc-400 hover:bg-zinc-800/50 hover:text-white'
              }`}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="transition-all duration-300 group-hover:scale-110">
                <rect width="7" height="7" x="3" y="3" rx="1"/>
                <rect width="7" height="7" x="14" y="3" rx="1"/>
                <rect width="7" height="7" x="14" y="14" rx="1"/>
                <rect width="7" height="7" x="3" y="14" rx="1"/>
              </svg>
              <span className={`text-sm font-medium ${
                location.pathname === '/dsa/roadmap/view' ? 'text-white' : ''
              }`}>Module</span>
            </Link>
            <Link 
              to="/dsa/roadmap/calendar"
              className={`flex items-center gap-3 px-3 py-2 rounded-lg cursor-pointer transition-all duration-300 group ${
                location.pathname === '/dsa/roadmap/calendar'
                  ? 'bg-zinc-800/50 text-white hover:bg-zinc-800/80' 
                  : 'text-zinc-400 hover:bg-zinc-800/50 hover:text-white'
              }`}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="transition-all duration-300 group-hover:scale-110">
                <rect width="18" height="18" x="3" y="4" rx="2" ry="2"/>
                <line x1="16" x2="16" y1="2" y2="6"/>
                <line x1="8" x2="8" y1="2" y2="6"/>
                <line x1="3" x2="21" y1="10" y2="10"/>
              </svg>
              <span className={`text-sm font-medium ${
                location.pathname === '/dsa/roadmap/calendar' ? 'text-white' : ''
              }`}>Calendar</span>
            </Link>
          </div>
        )}

        {!isCollapsed && showSearch && (
          <div className="relative flex items-center mb-3">
            <div className="relative w-full group">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                className="absolute transform -translate-y-1/2 lucide lucide-search left-3 top-1/2 text-new_tertiary"
              >
                <circle cx="11" cy="11" r="8" />
                <path d="m21 21-4.3-4.3" />
              </svg>
              <input
                type="text"
                className={`w-full py-1.5 pl-10 pr-8 rounded-md border-none outline-none focus:ring-1 focus:ring-gray-600 transition-shadow duration-200 ${
                  theme === 'dark' 
                    ? 'dark:bg-[#161A20] bg-[#161A20] dark:text-white text-white' 
                    : 'bg-[#e2e7eb] text-black'
                }`}
                placeholder={searchPlaceholder}
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
              />
            </div>
          </div>
        )}

        {!isCollapsed && showTabs && (
          <div className={`flex justify-between mb-6 rounded-lg text-[15px] px-1 ${
            theme === 'dark' 
              ? 'dark:bg-[#161A20] bg-[#161A20]' 
              : 'bg-gradient-to-r from-[#FACC15]/[0.08] to-[#EA763F]/[0.12]'
          }`}>
            <button
              className={`relative py-1 px-4 m-1 rounded-lg p-2 ${
                activeTab === 'basic'
                  ? theme === 'dark'
                    ? 'dark:text-white text-white dark:bg-[#020612] bg-[#020612]'
                    : 'bg-[#F4F6F8] text-[#121212]'
                  : 'text-[#676A6D]'
              }`}
              onClick={() => setActiveTab('basic')}
            >
              {tabOptions.basic}
            </button>
            <button
              className={`relative py-1 px-4 m-1 rounded-lg p-2 ${
                activeTab === 'advanced'
                  ? theme === 'dark'
                    ? 'dark:text-white text-white dark:bg-[#020612] bg-[#020612]'
                    : 'bg-[#F4F6F8] text-[#121212]'
                  : 'text-[#676A6D]'
              }`}
              onClick={() => setActiveTab('advanced')}
            >
              {activeTab === 'advanced' && (
                <div className={`absolute inset-0 border-[1.5px] rounded-lg p-1 ${
                  theme === 'dark' ? 'border-[#676A6D]' : 'border-[#ADADAD]'
                }`} />
              )}
              {tabOptions.advanced}
            </button>
          </div>
        )}

        {!isCollapsed && !showTabs && showTitle && (
          <div className="flex justify-center mb-6 rounded-lg text-[15px] px-1 dark:bg-[#161A20] bg-[#161A20]">
            <div className="relative py-1 px-8 m-1 rounded-lg p-2 dark:text-white text-white dark:bg-[#020612] bg-[#020612] whitespace-nowrap">
              {title}
              <div className="absolute inset-0 border-[1.5px] rounded-lg p-1 border-[#676A6D]" />
            </div>
          </div>
        )}

        <div className={`flex flex-col pr-1 -mr-2 overflow-y-auto text-sm font-normal custom-scrollbar ${isCollapsed ? 'items-center space-y-4 mt-12' : 'space-y-6'}`}>
          {isCollapsed ? (
            <div className="flex flex-col items-center space-y-4">
              <div 
                className="group relative flex flex-col items-center justify-center gap-1 w-12 h-12 rounded-lg overflow-hidden cursor-pointer text-[#676A6D] hover:text-white transition-all duration-300" 
                title="Home"
                onClick={() => navigate('/')}
              >
                <span className="absolute inset-0 bg-gradient-to-b from-transparent via-[#EA763F]/20 to-transparent -translate-y-full group-hover:translate-y-full transition-transform duration-700 ease-out" />
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="relative z-10 transition-all duration-300 ease-out group-hover:scale-110 group-hover:rotate-6">
                  <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
                  <polyline points="9 22 9 12 15 12 15 22"/>
                </svg>
                <span className="relative z-10 text-[8px] font-medium transition-all duration-300 ease-out group-hover:translate-y-0.5">Home</span>
                <span className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 shadow-[inset_0_0_15px_rgba(234,118,63,0.3)] pointer-events-none rounded-lg" />
              </div>
              <div 
                className="group relative flex flex-col items-center justify-center gap-1 w-12 h-12 rounded-lg bg-[#13171C] border-l-2 border-[#EA763F] cursor-pointer overflow-hidden transition-all duration-300" 
                title={title}
                onClick={handleToggle}
              >
                <span className="absolute inset-0 bg-gradient-to-b from-transparent via-[#EA763F]/20 to-transparent -translate-y-full group-hover:translate-y-full transition-transform duration-700 ease-out" />
                <div className="relative z-10 transition-all duration-300 ease-out group-hover:scale-105 group-hover:-rotate-3">
                  <FolderIcon />
                </div>
                <span className="relative z-10 text-[8px] text-white font-medium transition-all duration-300 ease-out group-hover:translate-y-0.5">Track</span>
                <span className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 shadow-[inset_0_0_15px_rgba(234,118,63,0.4)] pointer-events-none rounded-lg" />
              </div>
            </div>
          ) : (
            categories.map((category) => {
              const subItems = category.subCategories || category.topics || [];
              
              return (
                <div key={category.id} className="mr-2">
                  <div
                    className={`flex items-center cursor-pointer dark:hover:text-white hover:text-black group ${
                      expandedCategories[category.id]
                        ? theme === 'dark' ? 'dark:text-white text-white' : 'text-black'
                        : 'text-[#676A6D]'
                    }`}
                    onClick={() => toggleCategory(category.id)}
                  >
                    <span className="mr-2">
                      <FolderIcon />
                    </span>
                    <span className="w-full break-words group-hover:font-medium">
                      {category.name}
                    </span>
                  </div>

                  {/* Category-level problems - Display with checkmark icons */}
                  {expandedCategories[category.id] && category.problems && category.problems.length > 0 && (
                    <div className="mt-2 ml-1 space-y-2">
                      {category.problems.map((problem) => (
                        <Link
                          key={problem.id}
                          to={`${basePath}/${category.id}/${problem.id}`}
                          className={`flex cursor-pointer py-2 pl-3 rounded-md ${
                            isActive(category.id, problem.id)
                              ? theme === 'dark'
                                ? 'text-white dark:bg-[#13171C] bg-[#13171C] border-l-2 border-[#EA763F]'
                                : 'text-white bg-gradient-to-r from-[#FACC15]/[0.05] to-[#EA763F]/[0.09] border-l-2 border-[#EA763F]'
                              : 'text-[#676A6D]'
                          } hover:text-white hover:bg-[#1a1a1a]`}
                        >
                          <span className="mr-2">
                            <CheckIcon isActive={problem.isCompleted || false} />
                          </span>
                          <div className="flex items-start w-full">
                            <span className={`text-[14px] break-words w-full ${
                              theme === 'dark' ? 'dark:text-white text-white' : 'text-black'
                            }`}>
                              {problem.name}
                            </span>
                          </div>
                        </Link>
                      ))}
                    </div>
                  )}

                  {expandedCategories[category.id] && subItems.length > 0 && (
                    <div className="mt-4 ml-1 space-y-4">
                      {subItems.map((subItem) => {
                        const subCategoryKey = `${category.id}:${subItem.id}`;
                        const hasProblems = subItem.problems && subItem.problems.length > 0;
                        
                        return (
                          <div key={subItem.id}>
                            {/* Subtopic Header - Show folder icon, expandable */}
                            <div
                              onClick={() => {
                                console.log('Toggling subcategory:', subCategoryKey, 'hasProblems:', hasProblems);
                                toggleSubCategory(subCategoryKey);
                              }}
                              className={`flex items-center justify-between cursor-pointer py-2 pl-3 rounded-md transition-colors ${
                                expandedSubCategories[subCategoryKey]
                                  ? 'text-white bg-[#1a1a1a]'
                                  : 'text-[#676A6D]'
                              } hover:text-white hover:bg-[#1a1a1a]`}
                            >
                              <div className="flex items-center">
                                <span className="mr-2">
                                  <FolderIcon />
                                </span>
                                <span className="text-[14px] break-words">
                                  {subItem.name}
                                </span>
                              </div>
                              {hasProblems && (
                                <ChevronRight 
                                  size={16} 
                                  className={`transition-transform ${
                                    expandedSubCategories[subCategoryKey] ? 'rotate-90' : ''
                                  }`}
                                />
                              )}
                            </div>

                            {/* Problems under this subtopic - Show with check icons */}
                            {hasProblems && expandedSubCategories[subCategoryKey] && (
                              <div className="mt-2 ml-6 space-y-2">
                                {subItem.problems!.map((problem) => (
                                  <Link
                                    key={problem.id}
                                    to={`${basePath}/${category.id}/${subItem.id}/${problem.id}`}
                                    className={`flex cursor-pointer py-2 pl-3 ${
                                      isActive(category.id, problem.id)
                                        ? theme === 'dark'
                                          ? 'text-white dark:bg-[#13171C] bg-[#13171C] border-l-2 border-[#EA763F]'
                                          : 'text-white bg-gradient-to-r from-[#FACC15]/[0.05] to-[#EA763F]/[0.09] border-l-2 border-[#EA763F]'
                                        : 'text-[#676A6D]'
                                    } hover:text-white`}
                                  >
                                    <span className="mr-2">
                                      <CheckIcon isActive={problem.isCompleted || false} />
                                    </span>
                                    <div className="flex items-start w-full">
                                      <span className={`text-[13px] break-words w-full ${
                                        theme === 'dark' ? 'dark:text-white text-white' : 'text-black'
                                      }`}>
                                        {problem.name}
                                      </span>
                                    </div>
                                  </Link>
                                ))}
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>

        {!isCollapsed && (
          <div className="flex-shrink-0 mt-auto mb-3">
            <div className="flex items-center h-12 gap-1 px-3 border rounded-lg bg-zinc-900/50 border-zinc-800">
              <SidebarItem
                to="/home"
                icon={<Home className="w-4 h-4" />}
                label="Home"
                active={location.pathname === '/home'}
                hoveredItem={hoveredNavItem}
                onHoverChange={setHoveredNavItem}
              />

              <SidebarItem
                to={firstTrackLink}
                icon={<FileText className="w-4 h-4" />}
                label="Track"
                active={isTrackActive}
                hoveredItem={hoveredNavItem}
                onHoverChange={setHoveredNavItem}
              />

              {!hideRoadmap && (
                <SidebarItem
                  to="/dsa/roadmap"
                  icon={<Navigation className="w-4 h-4" />}
                  label="Roadmap"
                  active={isRoadmapActive}
                  hoveredItem={hoveredNavItem}
                  onHoverChange={setHoveredNavItem}
                />
              )}
            </div>
          </div>
        )}

        <div ref={dropdownRef} className={`relative ${isCollapsed ? 'mt-auto' : ''}`}>
          <div 
            className={`flex items-center rounded-lg cursor-pointer py-1 border border-zinc-800 ${isCollapsed ? '' : 'mt-2'} ${
              theme === 'dark' ? 'hover:bg-[#13171C]' : 'hover:bg-gradient-to-r from-[#FACC15]/[0.08] to-[#EA763F]/[0.12]'
            } ${isCollapsed ? 'justify-center w-10' : 'w-[215px]'}`}
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          >
            <div className={`${isCollapsed ? '' : 'pl-2'}`}>
              <img src={displayUserAvatar} className="object-cover w-5 h-5 rounded-full" alt="User avatar" />
            </div>
            {!isCollapsed && (
              <>
                <div className="pl-2">
                  <div className={`text-sm ${theme === 'dark' ? 'dark:text-white text-white' : 'text-black'}`}>{displayUserName}</div>
                </div>
                <div className="pr-2 ml-auto">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-[#ADADAD] scale-90">
                    <path d="m9 18 6-6-6-6" />
                  </svg>
                </div>
              </>
            )}
          </div>

          {isDropdownOpen && (
            <div className={`absolute ${isCollapsed ? 'left-16' : 'left-full ml-6'} bottom-[-10px] w-72 backdrop-blur-md bg-zinc-900/90 border border-white/10 shadow-xl ring-1 ring-white/10 rounded-md overflow-visible z-50 animate-in fade-in zoom-in-95 slide-in-from-left-2`}>
              <div className="flex items-center gap-3 px-2 py-3 border-b border-white/10">
                <img src={displayUserAvatar} className="object-cover rounded-full size-8" alt="avatar" />
                <div className="flex flex-col">
                  <span className="text-sm text-white">{displayUserName}</span>
                  <span className="text-xs text-gray-400">{displayUserEmail}</span>
                  {isAdmin && <span className="text-[10px] text-orange-500 uppercase font-bold mt-0.5">Admin</span>}
                </div>
              </div>

              <div className="py-1">
                <AnimatedNavItem icon={User} label="My Profile" to={`/profile/${displayUserName}`} iconRotation="right" />
                {isAdmin && (
                  <AnimatedNavItem icon={ShieldCheck} label="Admin Dashboard" to="/admin" iconRotation="none" />
                )}
                <AnimatedNavItem icon={Settings} label="Account" to="/account" iconRotation="left" />
                <AnimatedNavItem icon={Bug} label="Buganizer" to="/buganizer" iconRotation="right" />
                <AnimatedNavItem icon={ListChecks} label="Sessions" to="/sessions" iconRotation="none" />

                <div className="relative" ref={notificationRef}>
                  <button onClick={(e) => { 
                    e.stopPropagation(); 
                    if (!isNotificationOpen) {
                      fetchNotifications();
                    }
                    setIsNotificationOpen(!isNotificationOpen); 
                  }} className="relative flex items-center justify-between w-full gap-2 px-3 py-2 text-sm text-white transition-all cursor-pointer hover:bg-white/10 hover:translate-x-1">
                    <div className="flex items-center gap-2">
                      <div className="relative">
                        <Bell size={16} />
                        {hasUnread && (
                          <div className="absolute top-0 right-0 w-2 h-2 transform translate-x-1 -translate-y-1 bg-red-500 rounded-full"></div>
                        )}
                      </div>
                      <span>Notification</span>
                    </div>
                    <ChevronRight size={16} className="text-gray-400" />
                  </button>

                  {isNotificationOpen && (
                    <>
                      {/* Backdrop */}
                      <div 
                        className="fixed inset-0 z-[9998]" 
                        onClick={() => setIsNotificationOpen(false)} 
                      />
                      
                      {/* Notification Popup */}
                      <div 
                        className="absolute left-full ml-2 w-80 rounded-lg bg-[#1a1a1a] border border-[#2a2a2a] shadow-2xl z-[9999] h-[400px] -top-96"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <div className="flex flex-col h-full">
                          {/* Header */}
                          <div className="px-4 py-3 border-b border-[#2a2a2a] flex items-center justify-between bg-[#111] rounded-t-lg">
                            <h3 className="font-semibold text-white">Notifications</h3>
                            <button 
                              onClick={() => setIsNotificationOpen(false)}
                              className="text-gray-400 transition-colors hover:text-white"
                            >
                              ✕
                            </button>
                          </div>
                          
                          {/* Content */}
                          <div className="flex-1 overflow-y-auto scrollbar-none">
                            {isLoadingNotifications ? (
                              <div className="flex items-center justify-center h-32">
                                <Loader size={20} className="text-orange-500 animate-spin" />
                              </div>
                            ) : notifications.length === 0 ? (
                              <div className="flex flex-col items-center justify-center h-32 p-6">
                                <BellOff className="w-8 h-8 mb-2 text-zinc-500" strokeWidth={1.5} />
                                <p className="text-xs font-medium text-center text-white">No notifications</p>
                              </div>
                            ) : (
                              <div className="divide-y divide-[#2a2a2a]">
                                {notifications.map((notif) => (
                                  <div 
                                    key={notif._id}
                                    className={`p-3 transition-all ${notif.read ? 'opacity-60' : ''}`}
                                  >
                                    <div className="flex items-start gap-2">
                                      <div className={`mt-0.5 flex-shrink-0 ${notif.read ? 'text-zinc-500' : 'text-orange-500'}`}>
                                        <Bell size={14} />
                                      </div>
                                      <div className="flex-1 min-w-0">
                                        <p className="text-xs font-semibold text-white truncate">{notif.title}</p>
                                        <p className="text-[11px] text-zinc-400 mt-0.5 line-clamp-2">{notif.message}</p>
                                        <p className="text-[9px] text-zinc-500 mt-1">
                                          {new Date(notif.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} {new Date(notif.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                        </p>
                                      </div>
                                      <button
                                        onClick={() => handleDeleteNotification(notif._id)}
                                        className="flex-shrink-0 p-1 text-green-400 transition-colors rounded hover:bg-green-500/10"
                                        title="Mark as read"
                                      >
                                        <Check size={14} />
                                      </button>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </div>

              <div className="h-px my-1 bg-white/10"></div>

              <div className="py-1">
                <button onClick={logout} className="relative flex items-center w-full gap-2 px-3 py-2 overflow-hidden text-red-500 transition-all duration-300 rounded-lg group hover:text-red-400">
                  <span className="absolute inset-0 transition-transform duration-700 ease-out -translate-x-full bg-gradient-to-r from-transparent via-red-500/20 to-transparent group-hover:translate-x-full" />
                  <LogOut size={16} className="relative z-10 transition-all duration-300 ease-out group-hover:scale-110 group-hover:-rotate-6" />
                  <span className="relative z-10 text-sm font-medium transition-all duration-300 ease-out group-hover:translate-x-1">Logout</span>
                  <span className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 shadow-[inset_0_0_20px_rgba(239,68,68,0.3)] pointer-events-none rounded-lg" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      <button 
        className="absolute z-[60] transition-all duration-300 group" 
        style={{ left: isCollapsed ? '16px' : '210px', top: isCollapsed ? '75px' : '24px' }}
        onClick={handleToggle}
        title={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
      >
        <div className="relative flex items-center justify-center w-8 h-8 rounded-md bg-gradient-to-br from-[#1a1a1a] to-[#0a0a0a] border border-[#2a2a2a] group-hover:border-[#EA763F] transition-all duration-200 shadow-lg group-hover:shadow-[#EA763F]/20">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#EA763F" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className={`transition-all duration-300 group-hover:scale-110 ${isCollapsed ? 'rotate-180' : ''}`}>
            <path d="m15 18-6-6 6-6" />
          </svg>
        </div>
      </button>
    </div>
  );
};

export default UnifiedSidebar;
