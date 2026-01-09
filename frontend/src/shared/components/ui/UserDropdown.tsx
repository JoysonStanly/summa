import { useState, useRef, useEffect, type ReactNode } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  User, 
  ChevronDown, 
  ChevronRight,
  LogOut, 
  Settings, 
  Bug, 
  ListChecks,
  Bell,
  BellOff,
  ShieldCheck,
  type LucideIcon
} from 'lucide-react';

interface UserDropdownProps {
  user: {
    name?: string;
    email?: string;
    avatar?: string;
    role?: string;
  } | null;
  onLogout: () => void;
  position?: 'bottom-right' | 'bottom-left' | 'right' | 'left';
  showChevron?: boolean;
  avatarSize?: 'sm' | 'md' | 'lg';
  variant?: 'navbar' | 'sidebar';
  customTrigger?: ReactNode;
  isOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
}

// Animated menu item component
const MenuItem = ({ 
  icon: Icon, 
  label, 
  to, 
  onClick,
  variant = 'default'
}: { 
  icon: LucideIcon; 
  label: string; 
  to?: string;
  onClick?: () => void;
  variant?: 'default' | 'danger';
}) => {
  const baseClasses = "flex items-center gap-3 w-full px-4 py-2.5 text-sm transition-all hover:translate-x-1";
  const variantClasses = variant === 'danger' 
    ? "text-red-500 hover:bg-red-500/10 hover:text-red-400" 
    : "text-white hover:bg-white/10";

  if (to) {
    return (
      <Link to={to} className={`${baseClasses} ${variantClasses}`} onClick={onClick}>
        <Icon size={16} className={variant === 'danger' ? '' : 'text-gray-400'} />
        <span>{label}</span>
      </Link>
    );
  }

  return (
    <button onClick={onClick} className={`${baseClasses} ${variantClasses}`}>
      <Icon size={16} className={variant === 'danger' ? '' : 'text-gray-400'} />
      <span>{label}</span>
    </button>
  );
};

const UserDropdown = ({ 
  user, 
  onLogout, 
  position = 'bottom-right',
  showChevron = true,
  avatarSize = 'md',
  customTrigger,
  isOpen: controlledIsOpen,
  onOpenChange
}: UserDropdownProps) => {
  const [internalIsOpen, setInternalIsOpen] = useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const notificationRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  // Support both controlled and uncontrolled mode
  const isOpen = controlledIsOpen !== undefined ? controlledIsOpen : internalIsOpen;
  const setIsOpen = (open: boolean) => {
    if (onOpenChange) {
      onOpenChange(open);
    } else {
      setInternalIsOpen(open);
    }
  };

  const isAdmin = user?.role === 'admin';
  const userName = user?.name || 'User';
  const userEmail = user?.email || '';
  const userAvatar = user?.avatar;

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setIsNotificationOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const avatarSizeClasses = {
    sm: 'w-7 h-7',
    md: 'w-9 h-9',
    lg: 'w-10 h-10'
  };

  const positionClasses = {
    'bottom-right': 'right-0 top-full mt-2',
    'bottom-left': 'left-0 top-full mt-2',
    'right': 'left-full ml-6 bottom-[-10px]',
    'left': 'right-full mr-6 bottom-[-10px]'
  };

  const handleClose = () => {
    setIsOpen(false);
    setIsNotificationOpen(false);
  };

  const handleLogout = () => {
    onLogout();
    handleClose();
    navigate('/');
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Trigger Button - use custom trigger if provided */}
      {customTrigger ? (
        <div onClick={() => setIsOpen(!isOpen)} className="cursor-pointer">
          {customTrigger}
        </div>
      ) : (
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="relative flex items-center gap-2 rounded-full cursor-pointer transition-all hover:ring-2 hover:ring-orange-500/50 p-0.5"
        >
          <div className={`relative ${avatarSizeClasses[avatarSize]} bg-gradient-to-br from-orange-500 to-red-500 rounded-full flex items-center justify-center overflow-hidden`}>
            {userAvatar ? (
              <img src={userAvatar} alt={userName} className="w-full h-full object-cover" />
            ) : (
              <User className="w-5 h-5 text-white" />
            )}
          </div>
          {showChevron && (
            <ChevronDown className={`w-4 h-4 text-white/70 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
          )}
        </button>
      )}

      {/* Dropdown Menu */}
      {isOpen && (
        <div className={`absolute ${positionClasses[position]} w-72 backdrop-blur-md bg-zinc-900/95 border border-white/10 shadow-xl ring-1 ring-white/10 rounded-xl overflow-visible z-50 animate-in fade-in zoom-in-95`}>
          {/* User Info Header */}
          <div className="flex items-center gap-3 px-4 py-3 border-b border-white/10">
            <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-red-500 rounded-full flex items-center justify-center overflow-hidden flex-shrink-0">
              {userAvatar ? (
                <img src={userAvatar} alt={userName} className="w-full h-full object-cover" />
              ) : (
                <User className="w-5 h-5 text-white" />
              )}
            </div>
            <div className="flex flex-col min-w-0">
              <span className="text-sm font-medium text-white truncate">{userName}</span>
              <span className="text-xs text-gray-400 truncate">{userEmail}</span>
              {isAdmin && (
                <span className="text-[10px] text-orange-500 uppercase font-bold mt-0.5">Admin</span>
              )}
            </div>
          </div>

          {/* Menu Items */}
          <div className="py-1">
            <MenuItem icon={User} label="My Profile" to={`/profile/${userName}`} onClick={handleClose} />
            {isAdmin && (
              <MenuItem icon={ShieldCheck} label="Admin Dashboard" to="/admin" onClick={handleClose} />
            )}
            <MenuItem icon={Settings} label="Account" to="/account" onClick={handleClose} />
            <MenuItem icon={Bug} label="Buganizer" to="/buganizer" onClick={handleClose} />
            <MenuItem icon={ListChecks} label="Sessions" to="/plus/sessions" onClick={handleClose} />

            {/* Notification Item with Sub-dropdown */}
            <div className="relative" ref={notificationRef}>
              <button 
                onClick={(e) => { e.stopPropagation(); setIsNotificationOpen(!isNotificationOpen); }} 
                className="flex items-center justify-between w-full gap-2 px-4 py-2.5 text-sm text-white transition-all cursor-pointer hover:bg-white/10 hover:translate-x-1"
              >
                <div className="flex items-center gap-3">
                  <Bell size={16} className="text-gray-400" />
                  <span>Notifications</span>
                </div>
                <ChevronRight size={16} className="text-gray-400" />
              </button>

              {/* Notification Sub-dropdown */}
              {isNotificationOpen && (
                <div 
                  className="absolute left-full ml-2 top-0 w-72 rounded-xl backdrop-blur-md bg-zinc-900/95 border border-white/10 shadow-xl ring-1 ring-white/10 z-[200]" 
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="h-[280px] overflow-y-auto scrollbar-none">
                    <div className="flex flex-col items-center justify-center h-full p-6">
                      <BellOff className="w-12 h-12 mb-4 text-zinc-500" strokeWidth={1.5} />
                      <p className="mb-1 text-sm font-medium text-white">No notifications yet</p>
                      <p className="text-xs text-center text-zinc-400">We'll notify you when something arrives</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Divider */}
          <div className="h-px bg-white/10"></div>

          {/* Logout */}
          <div className="py-1">
            <button 
              onClick={handleLogout} 
              className="relative flex items-center w-full gap-3 px-4 py-2.5 overflow-hidden text-red-500 transition-all duration-300 group hover:text-red-400"
            >
              <span className="absolute inset-0 transition-transform duration-700 ease-out -translate-x-full bg-gradient-to-r from-transparent via-red-500/20 to-transparent group-hover:translate-x-full" />
              <LogOut size={16} className="relative z-10 transition-all duration-300 ease-out group-hover:scale-110 group-hover:-rotate-6" />
              <span className="relative z-10 text-sm font-medium transition-all duration-300 ease-out group-hover:translate-x-1">Logout</span>
              <span className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 shadow-[inset_0_0_20px_rgba(239,68,68,0.3)] pointer-events-none rounded-lg" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserDropdown;
