import { type FC, useState, useRef, useEffect, useContext } from 'react';
import { Home, Book, Trophy, User, Brain, Settings, Bug, ListChecks, Bell, BellOff, LogOut, ChevronRight, ShieldCheck, Loader, Check } from 'lucide-react';
import { motion } from 'framer-motion';
import { Link, useLocation } from 'react-router-dom';
import { AuthContext } from '@/features/auth/stores/AuthContext';

interface Notification {
  _id: string;
  userId: string;
  type: string;
  title: string;
  message: string;
  read: boolean;
  createdAt: string;
}

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
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isLoadingNotifications, setIsLoadingNotifications] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const notificationRef = useRef<HTMLDivElement>(null);
  const { user, logout } = useContext(AuthContext);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
      // Don't close notification on outside click - it's a modal now
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Fetch notifications when dropdown is opened
  const fetchNotifications = async () => {
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
  };

  // Mark notification as read and delete
  const handleDeleteNotification = async (notificationId: string) => {
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
      setNotifications(notifications.filter(n => n._id !== notificationId));
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  // Count unread notifications
  const unreadCount = notifications.filter(n => !n.read).length;
  const hasUnread = unreadCount > 0;
  
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
      className="fixed left-0 top-0 h-full w-20 bg-[#1a1a1a] hidden lg:flex flex-col items-center py-6 border-r border-[#2a2a2a] z-50"
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
        
      
        
        {/* Admin - Only visible to admin users */}
        {user?.role === 'admin' && (
          <NavItem icon={<ShieldCheck size={20} />} label="Admin" to="/admin" active={isAdmin} />
        )}
        
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
                {user?.avatar ? (
                  <img src={user.avatar} alt={user.name} className="object-cover w-full h-full" />
                ) : (
                  <User size={20} className="text-white" />
                )}
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-medium text-white">{user?.name || 'User'}</span>
                <span className="text-xs text-gray-400">{user?.email || 'No email'}</span>
                {user?.role === 'admin' && <span className="text-[10px] text-orange-500 uppercase font-bold mt-0.5">Admin</span>}
              </div>
            </div>

            {/* Menu Items */}
            <div className="py-1">
              <Link 
                to={`/profile/${user?.name || 'User'}`}
                target="_blank"
                rel="noopener noreferrer"
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
                to="/account" 
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
                to="/buganizer" 
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
                    if (!isNotificationOpen) {
                      fetchNotifications();
                    }
                    setIsNotificationOpen(!isNotificationOpen); 
                  }} 
                  className="flex items-center justify-between w-full gap-2 px-3 py-2 text-sm text-white transition-all cursor-pointer hover:bg-[#2a2a2a] hover:translate-x-1 relative"
                >
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
                      className="fixed w-80 rounded-lg bg-[#1a1a1a] border border-[#2a2a2a] shadow-2xl z-[9999] max-h-screen"
                      style={{
                        top: '405px',
                        right: '900px',
                        height: '315px',
                        left : '380px'
                      }}
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

              {/* Divider */}
              <div className="my-1 border-t border-[#2a2a2a]"></div>

              {/* Logout */}
              <button 
                className="flex items-center justify-between w-full gap-2 px-3 py-2 text-sm text-red-400 transition-all cursor-pointer hover:bg-red-500/10 hover:translate-x-1"
                onClick={() => {
                  setIsDropdownOpen(false);
                  logout();
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
