// types.ts
import { ReactNode } from 'react';

export interface MenuItem {
  id: string;
  title: string;
  icon?: ReactNode;
  isCompleted?: boolean;
  isActive?: boolean;
  children?: MenuItem[];
  href?: string;
}

export interface SidebarProps {
  isCollapsed?: boolean;
  onToggle?: () => void;
  menuItems?: MenuItem[];
  searchValue?: string;
  onSearchChange?: (value: string) => void;
  activeTab?: 'basic' | 'advanced';
  onTabChange?: (tab: 'basic' | 'advanced') => void;
  userName?: string;
  userAvatar?: string;
  onMenuItemClick?: (itemId: string) => void;
  onBookmarkClick?: (itemId: string) => void;
  className?: string;
  theme?: 'light' | 'dark';
}

export type TabType = 'basic' | 'advanced';

export interface NavigationItem {
  id: string;
  icon: ReactNode;
  label?: string;
  isActive?: boolean;
  onClick?: () => void;
}