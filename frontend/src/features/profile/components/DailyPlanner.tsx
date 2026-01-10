import { useState, useMemo, useRef, useEffect, useCallback } from 'react';
import { Calendar, ChevronDown, ChevronLeft, ChevronRight, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useToast } from '@shared/hooks/ToastContext';

// ============================================================================
// TYPES
// ============================================================================
interface Task {
  id: string;
  title: string;
  date: Date;
  status: 'ongoing' | 'completed' | 'missed';
  createdAt: Date;
}

interface DailyPlannerProps {
  onExpandChange?: (expanded: boolean) => void;
  defaultExpanded?: boolean;
}

type TabType = 'ongoing' | 'completed' | 'missed';

// ============================================================================
// UTILITIES
// ============================================================================
const formatDate = (date: Date, format: string): string => {
  const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  const shortMonths = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  
  const day = date.getDate();
  const month = date.getMonth();
  const year = date.getFullYear();
  
  const getOrdinal = (n: number) => {
    const s = ['th', 'st', 'nd', 'rd'];
    const v = n % 100;
    return n + (s[(v - 20) % 10] || s[v] || s[0]);
  };

  switch (format) {
    case 'MMMM do, yyyy':
      return `${months[month]} ${getOrdinal(day)}, ${year}`;
    case 'MMM d, yyyy':
      return `${shortMonths[month]} ${day}, ${year}`;
    case 'MMM d':
      return `${shortMonths[month]} ${day}`;
    default:
      return date.toLocaleDateString();
  }
};

const isSameDay = (d1: Date, d2: Date): boolean => {
  return d1.getDate() === d2.getDate() && 
         d1.getMonth() === d2.getMonth() && 
         d1.getFullYear() === d2.getFullYear();
};

const isToday = (date: Date): boolean => isSameDay(date, new Date());

const isPastDate = (date: Date): boolean => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const compareDate = new Date(date);
  compareDate.setHours(0, 0, 0, 0);
  return compareDate < today;
};

// Local Storage helpers
const STORAGE_KEY = 'studyio_daily_tasks';

const loadTasks = (): Task[] => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      return parsed.map((t: Task) => ({
        ...t,
        date: new Date(t.date),
        createdAt: new Date(t.createdAt)
      }));
    }
  } catch (e) {
    console.error('Failed to load tasks:', e);
  }
  return [];
};

const saveTasks = (tasks: Task[]) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
  } catch (e) {
    console.error('Failed to save tasks:', e);
  }
};

// ============================================================================
// ICONS
// ============================================================================
const ClipboardCheckIcon = () => (
  <svg width="100%" height="100%" viewBox="0 0 29 29" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M8.32666 17.8509H12.4072M8.32666 13.0908H17.8468M16.0618 2.38062H10.1117C9.87728 2.38062 9.64516 2.42679 9.42859 2.51649C9.21202 2.6062 9.01524 2.73768 8.84948 2.90344C8.68373 3.06919 8.55224 3.26597 8.46254 3.48254C8.37283 3.69911 8.32666 3.93123 8.32666 4.16565C8.32666 4.40006 8.37283 4.63218 8.46254 4.84875C8.55224 5.06532 8.68373 5.2621 8.84948 5.42785C9.01524 5.59361 9.21202 5.72509 9.42859 5.8148C9.64516 5.90451 9.87728 5.95068 10.1117 5.95068H16.0618C16.2962 5.95068 16.5283 5.90451 16.7449 5.8148C16.9615 5.72509 17.1582 5.59361 17.324 5.42785C17.4898 5.2621 17.6212 5.06532 17.7109 4.84875C17.8007 4.63218 17.8468 4.40006 17.8468 4.16565C17.8468 3.93123 17.8007 3.69911 17.7109 3.48254C17.6212 3.26597 17.4898 3.06919 17.324 2.90344C17.1582 2.73768 16.9615 2.6062 16.7449 2.51649C16.5283 2.42679 16.2962 2.38062 16.0618 2.38062Z" />
    <path d="M22.6079 16.0662V11.2859C22.6079 7.91931 22.6079 6.23662 21.5619 5.19059C20.8003 4.42898 19.6971 4.22192 17.849 4.16598M14.2766 26.1814H10.7065C7.34115 26.1814 5.65727 26.1814 4.61243 25.1342C3.56641 24.0893 3.56641 22.4066 3.56641 19.0412V11.2847C3.56641 7.91812 3.56641 6.23543 4.61243 5.1894C5.37524 4.42779 6.47839 4.22073 8.32649 4.16479M16.6578 23.8013C16.6578 23.8013 17.8478 23.8013 19.0379 26.1814C19.0379 26.1814 21.6273 20.2313 24.988 19.0412" />
  </svg>
);

// Plus/Close Icon (rotatable with smooth transition)
const PlusIcon = ({ isOpen = false }: { isOpen?: boolean; rotated?: boolean }) => (
  <motion.div
    animate={{ rotate: isOpen ? 135 : 0 }}
    transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
  >
    <svg width="100%" height="100%" viewBox="0 0 23 23" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="5" y="10.8708" width="13" height="1.25806" rx="0.629032" fill="currentColor" fillOpacity="0.9" />
      <rect x="10.8706" y="18" width="13" height="1.25806" rx="0.629032" transform="rotate(-90 10.8706 18)" fill="currentColor" fillOpacity="0.9" />
    </svg>
  </motion.div>
);

// Calendar Icon for task date
const CalendarIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" viewBox="0 0 16 16" fill="none">
    <path d="M2 7.08333H14M11.3333 1.75V4.41667M4.66667 1.75V4.41667M11.3333 3.08333H4.66667C3.95942 3.08333 3.28115 3.36428 2.78105 3.86438C2.28095 4.36448 2 5.04276 2 5.75V11.5833C2 12.2906 2.28095 12.9689 2.78105 13.469C3.28115 13.969 3.95942 14.25 4.66667 14.25H11.3333C12.0406 14.25 12.7189 13.969 13.219 13.469C13.719 12.9689 14 12.2906 14 11.5833V5.75C14 5.04276 13.719 4.36448 13.219 3.86438C12.7189 3.36428 12.0406 3.08333 11.3333 3.08333Z" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

// Delete Icon
const DeleteIcon = () => (
  <svg width="100%" height="100%" viewBox="0 0 19 19" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M6.02932 15.8332C5.67729 15.8332 5.37619 15.7079 5.12603 15.4572C4.87586 15.2065 4.75051 14.9059 4.74999 14.5555V4.74988H4.35415C4.24174 4.74988 4.14779 4.71188 4.07232 4.63588C3.99685 4.55988 3.95885 4.46567 3.95832 4.35326C3.95779 4.24084 3.99579 4.1469 4.07232 4.07142C4.14885 3.99595 4.24279 3.95822 4.35415 3.95822H7.12498C7.12498 3.79461 7.18568 3.65211 7.30707 3.53072C7.42846 3.40933 7.57096 3.34863 7.73457 3.34863H11.2654C11.429 3.34863 11.5715 3.40933 11.6929 3.53072C11.8143 3.65211 11.875 3.79461 11.875 3.95822H14.6458C14.7582 3.95822 14.8522 3.99622 14.9277 4.07222C15.0031 4.14822 15.0411 4.24242 15.0417 4.35484C15.0422 4.46726 15.0042 4.5612 14.9277 4.63667C14.8511 4.71215 14.7572 4.74988 14.6458 4.74988H14.25V14.5547C14.25 14.9062 14.1246 15.207 13.8739 15.4572C13.6232 15.7073 13.3224 15.8327 12.9714 15.8332H6.02932ZM8.16048 13.4582C8.2729 13.4582 8.36711 13.4202 8.44311 13.3442C8.51911 13.2682 8.55685 13.1743 8.55632 13.0624V6.72905C8.55632 6.61663 8.51832 6.52269 8.44232 6.44722C8.36632 6.37174 8.27211 6.33374 8.15969 6.33322C8.04728 6.33269 7.95333 6.37069 7.87786 6.44722C7.80239 6.52374 7.76465 6.61769 7.76465 6.72905V13.0624C7.76465 13.1748 7.80265 13.2687 7.87865 13.3442C7.95465 13.4202 8.0486 13.4582 8.16048 13.4582ZM10.8403 13.4582C10.9527 13.4582 11.0466 13.4202 11.1221 13.3442C11.1976 13.2682 11.2353 13.1743 11.2353 13.0624V6.72905C11.2353 6.61663 11.1973 6.52269 11.1213 6.44722C11.0453 6.37122 10.9514 6.33322 10.8395 6.33322C10.7271 6.33322 10.6329 6.37122 10.5569 6.44722C10.4809 6.52322 10.4431 6.61716 10.4437 6.72905V13.0624C10.4437 13.1748 10.4817 13.2687 10.5577 13.3442C10.6337 13.4197 10.7279 13.4577 10.8403 13.4582Z" fill="#EF2400" />
  </svg>
);

// ============================================================================
// DATE PICKER COMPONENT
// ============================================================================
interface DatePickerProps {
  selectedDate: Date;
  onSelect: (date: Date) => void;
}

const DatePicker = ({ selectedDate, onSelect }: DatePickerProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [viewDate, setViewDate] = useState(selectedDate);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    setViewDate(selectedDate);
  }, [selectedDate]);

  const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  
  const getDaysInMonth = (date: Date) => new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  const getFirstDayOfMonth = (date: Date) => new Date(date.getFullYear(), date.getMonth(), 1).getDay();

  const handleDateClick = (day: number) => {
    const newDate = new Date(viewDate.getFullYear(), viewDate.getMonth(), day);
    onSelect(newDate);
    setIsOpen(false);
  };

  const renderDays = () => {
    const days = [];
    const daysInMonth = getDaysInMonth(viewDate);
    const firstDay = getFirstDayOfMonth(viewDate);
    
    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`empty-${i}`} className="w-9 h-9" />);
    }
    
    for (let day = 1; day <= daysInMonth; day++) {
      const currentDate = new Date(viewDate.getFullYear(), viewDate.getMonth(), day);
      const isSelected = isSameDay(selectedDate, currentDate);
      const isTodayDate = isToday(currentDate);
      
      days.push(
        <button
          key={day}
          type="button"
          onClick={() => handleDateClick(day)}
          className={`w-9 h-9 rounded-lg text-xs font-medium transition-all duration-200 flex items-center justify-center
            ${isSelected 
              ? 'bg-orange-500 text-white shadow-lg shadow-orange-500/40 scale-105' 
              : isTodayDate 
                ? 'bg-orange-500/20 text-orange-400 font-semibold ring-1 ring-orange-500/40' 
                : 'hover:bg-white/10 text-gray-400 hover:text-white'}`}
        >
          {day}
        </button>
      );
    }
    return days;
  };

  return (
    <div className="relative" ref={ref}>
      <button 
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#1a1a1a] border border-[#282828] hover:border-orange-500/30 text-gray-400 hover:text-gray-300 transition-all duration-200 cursor-pointer"
        aria-label="Select date"
      >
        <Calendar className="w-3.5 h-3.5 text-orange-400" />
        <span className="text-xs font-medium">
          {formatDate(selectedDate, 'MMM d, yyyy')}
        </span>
        <ChevronDown className={`w-3 h-3 text-gray-500 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
      </button>
      
      {isOpen && (
        <div className="absolute top-full left-0 mt-2 z-[9999] bg-[#141414] border border-[#2a2a2a] rounded-2xl shadow-2xl shadow-black/50 p-5 min-w-[300px] backdrop-blur-xl">
          {/* Month Navigation */}
          <div className="flex items-center justify-between mb-5 pb-3 border-b border-[#2a2a2a]">
            <button 
              type="button"
              onClick={() => setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() - 1, 1))}
              className="w-8 h-8 rounded-lg bg-white/5 hover:bg-orange-500/20 text-gray-400 hover:text-orange-400 transition-all duration-200 flex items-center justify-center"
              aria-label="Previous month"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="text-sm font-semibold text-white tracking-wide">
              {months[viewDate.getMonth()]} {viewDate.getFullYear()}
            </span>
            <button 
              type="button"
              onClick={() => setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() + 1, 1))}
              className="w-8 h-8 rounded-lg bg-white/5 hover:bg-orange-500/20 text-gray-400 hover:text-orange-400 transition-all duration-200 flex items-center justify-center"
              aria-label="Next month"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
          
          {/* Weekday Headers */}
          <div className="grid grid-cols-7 gap-1.5 mb-3">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day, i) => (
              <div key={i} className="w-9 h-7 flex items-center justify-center text-[10px] text-gray-500 font-semibold uppercase tracking-wider">
                {day}
              </div>
            ))}
          </div>
          
          {/* Calendar Grid */}
          <div className="grid grid-cols-7 gap-1.5 p-2 bg-[#0d0d0d] rounded-xl border border-[#1f1f1f]">
            {renderDays()}
          </div>
          
          {/* Today Button */}
          <div className="mt-4 pt-3 border-t border-[#2a2a2a]">
            <button
              type="button"
              onClick={() => { onSelect(new Date()); setIsOpen(false); }}
              className="w-full py-2.5 text-xs font-semibold text-orange-400 hover:text-white bg-orange-500/10 hover:bg-orange-500 rounded-xl transition-all duration-200"
            >
              Select Today
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

// ============================================================================
// TASK ITEM COMPONENT
// ============================================================================
interface TaskItemProps {
  task: Task;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
}

const TaskItem = ({ task, onToggle, onDelete }: TaskItemProps) => {
  const isCompleted = task.status === 'completed';
  const isMissed = task.status === 'missed';
  
  const formatTaskDate = (date: Date) => {
    const d = date.getDate().toString().padStart(2, '0');
    const m = (date.getMonth() + 1).toString().padStart(2, '0');
    const y = date.getFullYear();
    return `${d}/${m}/${y}`;
  };
  
  return (
    <div 
      className="rounded-lg p-3"
      style={{ 
        backgroundColor: isMissed ? 'rgba(239, 68, 68, 0.1)' : isCompleted ? 'rgba(34, 197, 94, 0.1)' : 'rgba(234, 118, 63, 0.1)'
      }}
    >
      {/* Task Grid Layout */}
      <div className="grid gap-2" style={{ gridTemplateColumns: '4px 1fr auto', gridTemplateRows: 'auto auto auto', gridTemplateAreas: '"bar title delete" "bar date delete" "bar buttons buttons"' }}>
        {/* Status Bar */}
        <div 
          className="w-1 rounded-full self-stretch"
          style={{ 
            gridArea: 'bar',
            backgroundColor: isMissed ? '#EF4444' : isCompleted ? '#22C55E' : '#EA763F'
          }}
        />
        
        {/* Title */}
        <div style={{ gridArea: 'title' }}>
          <p className={`text-sm font-semibold ${isCompleted ? 'text-gray-400 line-through' : 'text-white'}`}>
            {task.title}
          </p>
        </div>
        
        {/* Delete Button */}
        <div style={{ gridArea: 'delete' }} className="w-5 h-5 opacity-60 hover:opacity-100 hover:scale-110 transition-all duration-200">
          <button type="button" onClick={() => onDelete(task.id)} aria-label="Delete task">
            <DeleteIcon />
          </button>
        </div>
        
        {/* Date */}
        <div style={{ gridArea: 'date' }} className="flex items-center gap-1.5 text-gray-400">
          <span className="w-3.5 h-3.5">
            <CalendarIcon />
          </span>
          <p className="text-[11px]">{formatTaskDate(task.date)}</p>
        </div>
        
        {/* Action Buttons */}
        <div style={{ gridArea: 'buttons' }} className="mt-2">
          {!isCompleted && !isMissed && (
            <button
              type="button"
              onClick={() => onToggle(task.id)}
              className="flex items-center gap-1.5 px-2 py-1 rounded-md bg-white/5 hover:bg-white/10 transition-all"
            >
              <span className="w-2.5 h-2.5 rounded-full border border-green-500 flex items-center justify-center">
                <div className="w-full h-full bg-transparent" />
              </span>
              <span className="text-[10px] text-white/80">Completed</span>
            </button>
          )}
          {isCompleted && (
            <button
              type="button"
              onClick={() => onToggle(task.id)}
              className="flex items-center gap-1.5 px-2 py-1 rounded-md bg-green-500/20 transition-all"
            >
              <span className="w-2.5 h-2.5 rounded-full bg-green-500 flex items-center justify-center">
                <Check className="w-2 h-2 text-white" strokeWidth={3} />
              </span>
              <span className="text-[10px] text-green-400">Completed</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

// ============================================================================
// EMPTY STATE COMPONENT
// ============================================================================
const EmptyState = ({ type }: { type: TabType }) => {
  const messages = {
    ongoing: { title: 'Plan your daily tasks here', subtitle: 'Track, manage, and complete accordingly' },
    completed: { title: 'No completed tasks', subtitle: 'Complete tasks will appear here' },
    missed: { title: 'No missed tasks', subtitle: 'Great job staying on track!' }
  };
  
  return (
    <div className="flex flex-col items-center justify-center py-12 px-4">
      <div className="w-16 h-16 rounded-2xl bg-orange-500/10 flex items-center justify-center mb-4 text-orange-400">
        <div className="w-8 h-8">
          <ClipboardCheckIcon />
        </div>
      </div>
      <p className="text-sm font-medium text-white mb-1">{messages[type].title}</p>
      <p className="text-xs text-gray-500">{messages[type].subtitle}</p>
    </div>
  );
};

// ============================================================================
// MAIN COMPONENT
// ============================================================================
const DailyPlanner = ({ onExpandChange, defaultExpanded = false }: DailyPlannerProps) => {
  const { success } = useToast();
  const [isExpanded, setIsExpanded] = useState(defaultExpanded); // Use prop for initial state
  const [isInputOpen, setIsInputOpen] = useState(false); // Title input open/closed
  const [activeTab, setActiveTab] = useState<TabType>('ongoing');
  const [taskTitle, setTaskTitle] = useState('');
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [tasks, setTasks] = useState<Task[]>(() => loadTasks());
  const inputRef = useRef<HTMLTextAreaElement>(null);

  // Save tasks to localStorage whenever they change
  useEffect(() => {
    saveTasks(tasks);
  }, [tasks]);

  // Check for missed tasks on mount and daily
  useEffect(() => {
    const checkMissedTasks = () => {
      setTasks(prevTasks => 
        prevTasks.map(task => {
          if (task.status === 'ongoing' && isPastDate(task.date) && !isToday(task.date)) {
            return { ...task, status: 'missed' as const };
          }
          return task;
        })
      );
    };
    
    checkMissedTasks();
    const interval = setInterval(checkMissedTasks, 60000);
    return () => clearInterval(interval);
  }, []);

  const handleToggle = useCallback(() => {
    const newState = !isExpanded;
    setIsExpanded(newState);
    onExpandChange?.(newState);
    // Close input when collapsing
    if (!newState) {
      setIsInputOpen(false);
    }
  }, [isExpanded, onExpandChange]);

  const handleInputToggle = useCallback(() => {
    const newState = !isInputOpen;
    setIsInputOpen(newState);
    // Focus input when opening
    if (newState) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isInputOpen]);

  const handleAddTask = useCallback(() => {
    if (!taskTitle.trim()) return;
    
    const newTask: Task = {
      id: `task_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      title: taskTitle.trim(),
      date: selectedDate,
      status: 'ongoing',
      createdAt: new Date()
    };
    
    setTasks(prev => [newTask, ...prev]);
    setTaskTitle('');
    setSelectedDate(new Date());
    success('Task added successfully');
  }, [taskTitle, selectedDate, success]);

  const handleToggleTask = useCallback((id: string) => {
    setTasks(prev => {
      const task = prev.find(t => t.id === id);
      if (task) {
        const newStatus = task.status === 'completed' ? 'ongoing' : 'completed';
        setTimeout(() => success(newStatus === 'completed' ? 'Task completed!' : 'Task marked as ongoing'), 0);
        return prev.map(t => t.id === id ? { ...t, status: newStatus } : t);
      }
      return prev;
    });
  }, [success]);

  const handleDeleteTask = useCallback((id: string) => {
    setTasks(prev => prev.filter(t => t.id !== id));
    success('Task deleted successfully');
  }, [success]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleAddTask();
    }
  };

  const taskCounts = useMemo(() => ({
    ongoing: tasks.filter(t => t.status === 'ongoing').length,
    completed: tasks.filter(t => t.status === 'completed').length,
    missed: tasks.filter(t => t.status === 'missed').length
  }), [tasks]);

  const filteredTasks = useMemo(() => 
    tasks.filter(t => t.status === activeTab).sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime()), 
    [tasks, activeTab]
  );

  const tabs: { key: TabType; label: string; count: number }[] = [
    { key: 'ongoing', label: 'Ongoing', count: taskCounts.ongoing },
    { key: 'completed', label: 'Completed', count: taskCounts.completed },
    { key: 'missed', label: 'Missed', count: taskCounts.missed }
  ];

  // Expand/Collapse icon SVG
  const ExpandIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" viewBox="0 0 15 15" fill="none">
      <path fillRule="evenodd" clipRule="evenodd" d="M6.28781 9.375L9.375 6.28781C9.46039 6.1994 9.50763 6.081 9.50657 5.95809C9.5055 5.83519 9.4562 5.71762 9.36929 5.63071C9.28238 5.5438 9.16481 5.4945 9.04191 5.49343C8.919 5.49237 8.80059 5.53961 8.71219 5.625L5.625 8.71219C5.58023 8.75543 5.54452 8.80715 5.51995 8.86434C5.49539 8.92153 5.48245 8.98304 5.48191 9.04528C5.48137 9.10752 5.49323 9.16925 5.5168 9.22685C5.54037 9.28446 5.57518 9.3368 5.61919 9.38081C5.6632 9.42482 5.71554 9.45963 5.77315 9.4832C5.83075 9.50677 5.89248 9.51863 5.95472 9.51809C6.01696 9.51755 6.07847 9.50461 6.13566 9.48005C6.19285 9.45548 6.24457 9.41977 6.28781 9.375ZM3.75 8.90625C3.75 8.78193 3.79939 8.6627 3.88729 8.57479C3.9752 8.48689 4.09443 8.4375 4.21875 8.4375C4.34307 8.4375 4.4623 8.48689 4.55021 8.57479C4.63811 8.6627 4.6875 8.78193 4.6875 8.90625V9.84375C4.6875 9.96807 4.73689 10.0873 4.82479 10.1752C4.9127 10.2631 5.03193 10.3125 5.15625 10.3125H6.09375C6.21807 10.3125 6.3373 10.3619 6.42521 10.4498C6.51311 10.5377 6.5625 10.6569 6.5625 10.7812C6.5625 10.9056 6.51311 11.0248 6.42521 11.1127C6.3373 11.2006 6.21807 11.25 6.09375 11.25H5.15625C4.78329 11.25 4.4256 11.1018 4.16188 10.8381C3.89816 10.5744 3.75 10.2167 3.75 9.84375V8.90625ZM11.25 6.09375C11.25 6.21807 11.2006 6.3373 11.1127 6.42521C11.0248 6.51311 10.9056 6.5625 10.7812 6.5625C10.6569 6.5625 10.5377 6.51311 10.4498 6.42521C10.3619 6.3373 10.3125 6.21807 10.3125 6.09375V5.15625C10.3125 5.03193 10.2631 4.9127 10.1752 4.82479C10.0873 4.73689 9.96807 4.6875 9.84375 4.6875H8.90625C8.78193 4.6875 8.6627 4.63811 8.57479 4.55021C8.48689 4.4623 8.4375 4.34307 8.4375 4.21875C8.4375 4.09443 8.48689 3.9752 8.57479 3.88729C8.6627 3.79939 8.78193 3.75 8.90625 3.75H9.84375C10.2167 3.75 10.5744 3.89816 10.8381 4.16188C11.1018 4.4256 11.25 4.78329 11.25 5.15625V6.09375Z" fill="currentColor" fillOpacity="1" />
    </svg>
  );

  // Collapsed state - minimal header only
  if (!isExpanded) {
    return (
      <div className="w-full p-1">
        <div className="bg-[#141414] border border-[#2a2a2a] rounded-lg py-3 px-4 flex items-center justify-center relative">
          {/* Center - Heading with count */}
          <div className="flex items-center gap-2">
            <span className="text-[13px] font-medium text-white">Daily Planner</span>
            <span className="text-[0.6rem] flex justify-center items-center w-4 h-4 bg-orange-500/60 rounded-full text-white font-medium">
              {taskCounts.ongoing}
            </span>
          </div>
          
          {/* Right - Expand Button (absolute positioned) */}
          <button
            type="button"
            onClick={handleToggle}
            className="absolute right-4 w-6 h-6 p-1 rounded-full text-orange-400/60 hover:text-orange-500 bg-orange-500/10 hover:bg-orange-500/40 transition-all duration-300 cursor-pointer"
            aria-label="Expand Daily Planner"
          >
            <ExpandIcon />
          </button>
        </div>
      </div>
    );
  }

  // Expanded state - full planner
  return (
    <div className="w-full h-full p-2">
      <div className="h-full flex flex-col bg-[#141414] border border-[#2a2a2a] rounded-xl p-4">
        {/* Header with Toggle Buttons */}
        <div className="flex items-center justify-center relative mb-3 flex-shrink-0 px-1">
          {/* Center - Title with count */}
          <div className="flex items-center gap-2">
            <span className="text-[13px] font-medium text-white">Daily Planner</span>
            <span className="text-[0.6rem] flex justify-center items-center w-4 h-4 bg-orange-500/60 rounded-full text-white font-medium">
              {taskCounts.ongoing}
            </span>
          </div>
          
          {/* Right - Buttons (absolute positioned) */}
          <div className="absolute right-1 flex items-center gap-2">
            {/* Plus Button - Toggle Input */}
            <button
              type="button"
              onClick={handleInputToggle}
              className="w-7 h-7 p-1.5 rounded-full bg-orange-500/20 hover:bg-orange-500/40 text-orange-400 hover:text-orange-300 transition-all duration-300 cursor-pointer"
              aria-label={isInputOpen ? "Close task input" : "Add new task"}
            >
              <PlusIcon isOpen={isInputOpen} />
            </button>
            
            {/* Collapse Button */}
            <button
              type="button"
              onClick={handleToggle}
              className="w-6 h-6 p-1 rounded-full bg-white/5 hover:bg-white/10 text-white/50 hover:text-white/80 transition-all duration-300 cursor-pointer"
              aria-label="Collapse Daily Planner"
            >
              <PlusIcon isOpen={true} />
            </button>
          </div>
        </div>

        {/* Animated Task Input Area - Only visible when isInputOpen */}
        <AnimatePresence>
          {isInputOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
              className="flex-shrink-0"
            >
              <div className="px-1 mb-4">
                <textarea
                  ref={inputRef}
                  value={taskTitle}
                  onChange={(e) => setTaskTitle(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="What do you want to accomplish?"
                  rows={2}
                  className="w-full bg-[#141414] border border-[#282828] rounded-lg px-3 py-2.5 text-sm text-white placeholder:text-gray-500 focus:outline-none focus:border-orange-500/50 resize-none transition-all duration-200"
                />
                <div className="flex items-center justify-between mt-2">
                  <DatePicker selectedDate={selectedDate} onSelect={setSelectedDate} />
                  <button
                    type="button"
                    onClick={() => {
                      handleAddTask();
                      setIsInputOpen(false);
                    }}
                    disabled={!taskTitle.trim()}
                    className="px-4 py-1.5 text-xs font-medium rounded-lg bg-orange-500 text-white hover:bg-orange-600 disabled:bg-gray-700 disabled:text-gray-500 disabled:cursor-not-allowed transition-all duration-200"
                  >
                    Add Task
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Tab Navigation */}
        <div className="flex items-center gap-1 p-1.5 mb-3 flex-shrink-0 bg-[#141414] border border-[#1f1f1f] rounded-xl" role="tablist" aria-label="Task type selector">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              type="button"
              role="tab"
              aria-selected={activeTab === tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`relative flex-1 text-xs font-medium px-3 py-2 rounded-lg cursor-pointer transition-all duration-200 ${
                activeTab === tab.key 
                  ? 'text-orange-500' 
                  : 'text-gray-500 hover:text-gray-400'
              }`}
            >
              {activeTab === tab.key && (
                <motion.div 
                  layoutId="activeTab"
                  className="absolute inset-0 h-full w-full rounded-lg bg-orange-500/15 border border-orange-500/30"
                  transition={{ duration: 0.2 }}
                />
              )}
              <span className="relative z-10">{tab.label} ({tab.count})</span>
            </button>
          ))}
        </div>

        {/* Task List */}
        <div className="flex-1 min-h-0 overflow-hidden relative">
          <div className="h-full overflow-y-auto px-1 py-2 space-y-3 scrollbar-none">
            {filteredTasks.length === 0 ? (
              <EmptyState type={activeTab} />
            ) : (
              filteredTasks.map(task => (
                <TaskItem 
                  key={task.id} 
                  task={task} 
                  onToggle={handleToggleTask} 
                  onDelete={handleDeleteTask} 
                />
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DailyPlanner;
