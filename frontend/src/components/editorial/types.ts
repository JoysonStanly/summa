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

// Editorial types
export type SolutionType = 'brute' | 'better' | 'optimal';

export interface EditorialSection {
  title: string;
  content: string | ReactNode;
  isCollapsed?: boolean;
  solutionType?: SolutionType;
}

export interface DryRunImage {
  id: string;
  src: string;
  alt?: string;
}

export interface EditorialProps {
  title: string;
  subtitle?: string;
  videoUrl?: string;
  videoThumbnail?: string;
  sections: EditorialSection[];
  dryRunImages?: DryRunImage[];
  solutions: Record<string, string>;
  timeComplexity: string;
  spaceComplexity: string;
  solutionTypes?: SolutionType[]; // New: array of available solution types
  showStudyView?: boolean;
  onStudyViewChange?: (show: boolean) => void;
}

export interface CodeTabsProps {
  solutions: Record<string, string>;
  activeLanguage: string;
  onLanguageChange: (language: string) => void;
}

export interface SectionProps {
  title: string;
  children: ReactNode;
  isCollapsed?: boolean;
}

export interface ImageCarouselProps {
  images: DryRunImage[];
}