import { useState, useEffect, useContext } from 'react';
import { motion } from 'framer-motion';
import { Flame } from 'lucide-react';
import { AuthContext } from '@/features/auth/stores/AuthContext';

const daysOfWeek = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];

interface CalendarWidgetProps {
  userId?: string;
  refreshTrigger?: number; // Add trigger to force refresh
}

const CalendarWidget = ({ userId, refreshTrigger }: CalendarWidgetProps) => {
  const { user } = useContext(AuthContext);
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  const [streakData, setStreakData] = useState<{
    streakDays: Set<string>; // Format: 'YYYY-MM-DD'
    currentStreak: number;
    maxStreak: number;
  }>({
    streakDays: new Set(),
    currentStreak: 0,
    maxStreak: 0
  });

  // Fetch user's streak data
  useEffect(() => {
    console.log('[CalendarWidget] useEffect triggered:', { userId, userIdFromContext: user?.id, refreshTrigger });
    
    const fetchStreakData = async () => {
      const targetUserId = userId || user?.id;
      console.log('[CalendarWidget] Fetching streak data for userId:', targetUserId);
      
      try {
        const url = `/api/v1/progress/streak/${targetUserId}`;
        console.log('[CalendarWidget] API call:', url);
        
        const response = await fetch(url, {
          credentials: 'include'
        });
        
        console.log('[CalendarWidget] Response status:', response.status);
        
        if (response.ok) {
          const result = await response.json();
          console.log('[CalendarWidget] API response:', result);
          
          const data = result.data || result;
          console.log('[CalendarWidget] Parsed data:', {
            streakDays: data.streakDays,
            currentStreak: data.currentStreak,
            maxStreak: data.maxStreak
          });
          
          setStreakData({
            streakDays: new Set(data.streakDays || []),
            currentStreak: data.currentStreak || 0,
            maxStreak: data.maxStreak || 0
          });
          
          console.log('[CalendarWidget] streakDays Set created with', data.streakDays?.length || 0, 'dates');
        } else {
          console.error('[CalendarWidget] API error:', response.status, response.statusText);
        }
      } catch (error) {
        console.error('[CalendarWidget] Failed to fetch streak data:', error);
      }
    };

    if (userId || user?.id) {
      fetchStreakData();
    } else {
      console.warn('[CalendarWidget] No userId available, skipping fetch');
    }
  }, [userId, user?.id, refreshTrigger]); // Add refreshTrigger to dependencies

  // Check if a date has a streak
  const hasStreakOnDate = (year: number, month: number, day: number): boolean => {
    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    return streakData.streakDays.has(dateStr);
  };
  
  // Get days in month
  const getDaysInMonth = (year: number, month: number) => {
    return new Date(year, month + 1, 0).getDate();
  };
  
  // Get first day of month (0-6, 0 is Sunday)
  const getFirstDayOfMonth = (year: number, month: number) => {
    return new Date(year, month, 1).getDay();
  };
  
  const daysInMonth = getDaysInMonth(currentYear, currentMonth);
  const firstDayOfMonth = getFirstDayOfMonth(currentYear, currentMonth);
  
  // Generate calendar days
  const generateCalendarDays = () => {
    const days = [];
    
    // Get previous month details
    const prevMonthYear = currentMonth === 0 ? currentYear - 1 : currentYear;
    const prevMonth = currentMonth === 0 ? 11 : currentMonth - 1;
    const daysInPrevMonth = getDaysInMonth(prevMonthYear, prevMonth);
    
    // Add previous month's trailing days
    for (let i = firstDayOfMonth - 1; i >= 0; i--) {
      const day = daysInPrevMonth - i;
      days.push(
        <div 
          key={`prev-${day}`}
          className="calendar-day" 
          role="gridcell" 
          aria-label={`${day} other month`}
          style={{ opacity: 1 }}
        >
          <div className="calendar-day-content">
            <div className="h-8 w-8 rounded-full flex items-center justify-center text-xs bg-[#0a0a0a] border border-[#2a2a2a] opacity-40">
              <span className="text-gray-500">{day}</span>
            </div>
          </div>
        </div>
      );
    }
    
    // Add days of month
    for (let day = 1; day <= daysInMonth; day++) {
      const today = new Date();
      const isToday = day === today.getDate() && 
                      currentMonth === today.getMonth() && 
                      currentYear === today.getFullYear();
                      
      const hasStreak = hasStreakOnDate(currentYear, currentMonth, day);
      
      // Check if this day is in the past (before today)
      const dateToCheck = new Date(currentYear, currentMonth, day);
      const todayStart = new Date(today.getFullYear(), today.getMonth(), today.getDate());
      const isPast = dateToCheck < todayStart;
      
      // Missed streak: past day without activity
      const missedStreak = isPast && !hasStreak;
      
      days.push(
        <div 
          key={`day-${day}`}
          className="calendar-day" 
          role="gridcell" 
          aria-label={`${day} current month`}
          style={{ opacity: 1 }}
        >
          <div className="calendar-day-content">
            <motion.div 
              className={`h-8 w-8 rounded-full flex items-center justify-center text-xs relative group cursor-pointer
                         bg-[#0a0a0a] border border-[#2a2a2a] hover:border-[#3a3a3a] transition-all
                         ${isToday ? 'font-bold' : ''}`}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
            >
              <span className={`relative z-10 ${hasStreak || missedStreak || isToday ? 'opacity-0' : 'text-gray-300'}`}>
                {day}
              </span>
              
              {/* Streak indicator - Flame icon */}
              {hasStreak && !isToday && (
                <div className="absolute inset-0 flex items-center justify-center p-1.5 rounded-full pointer-events-none calendar-day-emoji" data-state="closed" data-slot="tooltip-trigger">
                  <svg width="75%" height="75%" viewBox="0 0 11 14" fill="none" xmlns="http://www.w3.org/2000/svg" className="drop-shadow-lg">
                    <ellipse cx="6.55737" cy="8.99988" rx="2.5" ry="3.5" fill="#FFCE51"></ellipse>
                    <path d="M10.544 7.23329C9.49733 4.51329 5.77067 4.36662 6.67067 0.413284C6.73733 0.119951 6.424 -0.106715 6.17067 0.0466179C3.75067 1.47328 2.01067 4.33329 3.47067 8.07995C3.59067 8.38662 3.23067 8.67329 2.97067 8.47329C1.764 7.55995 1.63733 6.24662 1.744 5.30662C1.784 4.95995 1.33067 4.79329 1.13733 5.07995C0.683999 5.77329 0.223999 6.89329 0.223999 8.57995C0.477332 12.3133 3.63067 13.46 4.764 13.6066C6.384 13.8133 8.13733 13.5133 9.39733 12.36C10.784 11.0733 11.2907 9.01995 10.544 7.23329ZM4.35733 10.5866C5.31733 10.3533 5.81067 9.65995 5.944 9.04662C6.164 8.09329 5.304 7.15995 5.884 5.65328C6.104 6.89995 8.064 7.67995 8.064 9.03995C8.11733 10.7266 6.29067 12.1733 4.35733 10.5866Z" fill="#FF7324"></path>
                  </svg>
                </div>
              )}
              
              {/* Missed streak indicator - Gray dot */}
              {missedStreak && (
                <div className="absolute inset-0 flex items-center justify-center p-2 rounded-full pointer-events-none calendar-day-emoji" data-state="closed" data-slot="tooltip-trigger">
                  <svg width="70%" height="70%" viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="opacity-60">
                    <defs>
                      <linearGradient id={`missedGradient-${day}`} x1="63.6" y1="7" x2="63.6" y2="118.8" gradientUnits="userSpaceOnUse">
                        <stop offset="0" stopColor="#4b5563"/>
                        <stop offset="1" stopColor="#374151"/>
                      </linearGradient>
                    </defs>
                    <path d="m63.6 118.8c-27.9 0-58-17.5-58-55.9s30.1-55.9 58-55.9c15.5 0 29.8 5.1 40.4 14.4 11.5 10.2 17.6 24.6 17.6 41.5s-6.1 31.2-17.6 41.4c-10.6 9.3-25 14.5-40.4 14.5z" fill={`url(#missedGradient-${day})`}></path>
                  </svg>
                </div>
              )}
              
              {/* Today indicator - Alarm icon (hidden on hover if has streak) */}
              {isToday && (
                <>
                  <div className={`calendar-day-alarm rounded-full absolute inset-0 flex items-center justify-center pointer-events-none p-1.5 ${hasStreak ? 'group-hover:opacity-0' : ''} transition-opacity duration-200`} data-state="closed" data-slot="tooltip-trigger">
                    <svg xmlns="http://www.w3.org/2000/svg" width="80%" height="80%" viewBox="0 0 13 13" fill="none" className="text-blue-400 drop-shadow-lg">
                      <path d="M5.41645 1.62508H7.58311C7.88103 1.62508 8.12478 1.38133 8.12478 1.08341C8.12478 0.785498 7.88103 0.541748 7.58311 0.541748H5.41645C5.11853 0.541748 4.87478 0.785498 4.87478 1.08341C4.87478 1.38133 5.11853 1.62508 5.41645 1.62508ZM10.3077 4.003L10.7139 3.59675C10.8141 3.49597 10.8703 3.35966 10.8703 3.21758C10.8703 3.0755 10.8141 2.93919 10.7139 2.83841L10.7085 2.833C10.6078 2.73284 10.4714 2.67662 10.3294 2.67662C10.1873 2.67662 10.051 2.73284 9.9502 2.833L9.54395 3.23925C8.68129 2.54493 7.60714 2.16649 6.49978 2.16675C3.89978 2.16675 1.68978 4.31175 1.62478 6.91175C1.60741 7.5628 1.72068 8.21073 1.95788 8.81728C2.19508 9.42383 2.55142 9.9767 3.00585 10.4432C3.46027 10.9098 4.00358 11.2805 4.60368 11.5336C5.20377 11.7867 5.8485 11.917 6.49978 11.9167C7.41753 11.9172 8.31676 11.6585 9.09389 11.1703C9.87103 10.6821 10.4945 9.98435 10.8924 9.15736C11.2903 8.33036 11.4466 7.40779 11.3431 6.49588C11.2397 5.58398 10.8808 4.71985 10.3077 4.003ZM7.04145 7.04175C7.04145 7.33966 6.7977 7.58342 6.49978 7.58342C6.20186 7.58342 5.95811 7.33966 5.95811 7.04175V4.87508C5.95811 4.57716 6.20186 4.33341 6.49978 4.33341C6.7977 4.33341 7.04145 4.57716 7.04145 4.87508V7.04175Z" fill="currentColor"></path>
                    </svg>
                  </div>
                  {/* Alarm icon shown on hover if has streak */}
                  {hasStreak && (
                    <div className="absolute inset-0 flex items-center justify-center p-1.5 transition-opacity duration-200 rounded-full opacity-0 pointer-events-none calendar-day-alarm group-hover:opacity-100" data-state="closed" data-slot="tooltip-trigger">
                      <svg xmlns="http://www.w3.org/2000/svg" width="80%" height="80%" viewBox="0 0 13 13" fill="none" className="text-blue-400 drop-shadow-lg">
                        <path d="M5.41645 1.62508H7.58311C7.88103 1.62508 8.12478 1.38133 8.12478 1.08341C8.12478 0.785498 7.88103 0.541748 7.58311 0.541748H5.41645C5.11853 0.541748 4.87478 0.785498 4.87478 1.08341C4.87478 1.38133 5.11853 1.62508 5.41645 1.62508ZM10.3077 4.003L10.7139 3.59675C10.8141 3.49597 10.8703 3.35966 10.8703 3.21758C10.8703 3.0755 10.8141 2.93919 10.7139 2.83841L10.7085 2.833C10.6078 2.73284 10.4714 2.67662 10.3294 2.67662C10.1873 2.67662 10.051 2.73284 9.9502 2.833L9.54395 3.23925C8.68129 2.54493 7.60714 2.16649 6.49978 2.16675C3.89978 2.16675 1.68978 4.31175 1.62478 6.91175C1.60741 7.5628 1.72068 8.21073 1.95788 8.81728C2.19508 9.42383 2.55142 9.9767 3.00585 10.4432C3.46027 10.9098 4.00358 11.2805 4.60368 11.5336C5.20377 11.7867 5.8485 11.917 6.49978 11.9167C7.41753 11.9172 8.31676 11.6585 9.09389 11.1703C9.87103 10.6821 10.4945 9.98435 10.8924 9.15736C11.2903 8.33036 11.4466 7.40779 11.3431 6.49588C11.2397 5.58398 10.8808 4.71985 10.3077 4.003ZM7.04145 7.04175C7.04145 7.33966 6.7977 7.58342 6.49978 7.58342C6.20186 7.58342 5.95811 7.33966 5.95811 7.04175V4.87508C5.95811 4.57716 6.20186 4.33341 6.49978 4.33341C6.7977 4.33341 7.04145 4.57716 7.04145 4.87508V7.04175Z" fill="currentColor"></path>
                      </svg>
                    </div>
                  )}
                </>
              )}
            </motion.div>
          </div>
        </div>
      );
    }
    
    // Add next month's leading days to complete the grid
    const totalCells = days.length;
    const remainingCells = totalCells % 7 === 0 ? 0 : 7 - (totalCells % 7);
    
    for (let day = 1; day <= remainingCells; day++) {
      days.push(
        <div 
          key={`next-${day}`}
          className="calendar-day" 
          role="gridcell" 
          aria-label={`${day} other month`}
          style={{ opacity: 1 }}
        >
          <div className="calendar-day-content">
            <div className="h-8 w-8 rounded-full flex items-center justify-center text-xs bg-[#0a0a0a] border border-[#2a2a2a] opacity-40">
              <span className="text-gray-500">{day}</span>
            </div>
          </div>
        </div>
      );
    }
    
    return days;
  };
  
  // Handle month navigation
  const prevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear(currentYear - 1);
    } else {
      setCurrentMonth(currentMonth - 1);
    }
  };
  
  const nextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear(currentYear + 1);
    } else {
      setCurrentMonth(currentMonth + 1);
    }
  };
  
  // Get month name
  // Get month name
  const getMonthName = (month: number): string => {
    const monthNames = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ];
    return monthNames[month];
  };
  
  return (
    <div className="bg-[#1a1a1a] rounded-lg p-5 border border-[#2a2a2a] shadow-lg">
      <div className="flex items-center justify-between pb-3 mb-4 border-b border-gray-800">
        <div className="relative group">
          <button 
            className="flex items-center justify-center w-8 h-8 rounded hover:bg-[#2a2a2a] transition-colors" 
            data-state="closed" 
            data-slot="tooltip-trigger"
          >
            <svg width="18" height="18" viewBox="0 0 23 23" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12.3718 10.1762L10.225 10.4453L10.1481 10.8016L10.57 10.8794C10.8456 10.945 10.9 11.0444 10.84 11.3191L10.1481 14.5703C9.96621 15.4112 10.2465 15.8069 10.9056 15.8069C11.4165 15.8069 12.01 15.5706 12.279 15.2462L12.3615 14.8562C12.174 15.0212 11.9003 15.0869 11.7184 15.0869C11.4606 15.0869 11.3668 14.9059 11.4334 14.5872L12.3718 10.1762ZM12.4375 8.21875C12.4375 8.46739 12.3387 8.70585 12.1629 8.88166C11.9871 9.05748 11.7486 9.15625 11.5 9.15625C11.2513 9.15625 11.0129 9.05748 10.837 8.88166C10.6612 8.70585 10.5625 8.46739 10.5625 8.21875C10.5625 7.97011 10.6612 7.73165 10.837 7.55584C11.0129 7.38002 11.2513 7.28125 11.5 7.28125C11.7486 7.28125 11.9871 7.38002 12.1629 7.55584C12.3387 7.73165 12.4375 7.97011 12.4375 8.21875Z" fill="currentColor"></path>
            </svg>
          </button>
          
          {/* Tooltip */}
          <div className="absolute left-0 top-full mt-2 w-80 bg-[#1a1a1a] border border-[#2a2a2a] rounded-md shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
            <div className="flex flex-col px-3 py-4 space-y-2 text-sm">
              <span className="flex items-center w-full gap-2">
                <span className="border aspect-square rounded-full border-orange-500 text-orange-500 h-[1rem] flex items-center justify-center">
                  <svg width="100%" height="100%" viewBox="0 0 23 23" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12.3718 10.1762L10.225 10.4453L10.1481 10.8016L10.57 10.8794C10.8456 10.945 10.9 11.0444 10.84 11.3191L10.1481 14.5703C9.96621 15.4112 10.2465 15.8069 10.9056 15.8069C11.4165 15.8069 12.01 15.5706 12.279 15.2462L12.3615 14.8562C12.174 15.0212 11.9003 15.0869 11.7184 15.0869C11.4606 15.0869 11.3668 14.9059 11.4334 14.5872L12.3718 10.1762ZM12.4375 8.21875C12.4375 8.46739 12.3387 8.70585 12.1629 8.88166C11.9871 9.05748 11.7486 9.15625 11.5 9.15625C11.2513 9.15625 11.0129 9.05748 10.837 8.88166C10.6612 8.70585 10.5625 8.46739 10.5625 8.21875C10.5625 7.97011 10.6612 7.73165 10.837 7.55584C11.0129 7.38002 11.2513 7.28125 11.5 7.28125C11.7486 7.28125 11.9871 7.38002 12.1629 7.55584C12.3387 7.73165 12.4375 7.97011 12.4375 8.21875Z" fill="currentColor"></path>
                  </svg>
                </span>
                <span className="font-semibold text-orange-500">Keep in mind:</span>
              </span>
              <ol className="grid grid-cols-[0.6rem_1fr] gap-2 w-full text-gray-300">
                <span>1.</span>
                <li>For DSA, only <span className="font-medium text-green-400">accepted submissions</span> completed problems or completed problems count.</li>
                <span>2.</span>
                <li>Completing Core Subjects and Design problems adds to your streak.</li>
                <span>3.</span>
                <li>For Aptitude, finish an entire set in a category to earn streak credit.</li>
                <span>4.</span>
                <li>Repeating the same problem or activity <span className="font-medium text-yellow-400">within 30 days</span> won't count towards your streak.</li>
              </ol>
              <p className="text-orange-500">Streaks are tracked based on <span className="font-semibold text-orange-400">12:00 AM IST (midnight)</span></p>
              <p className="text-gray-300">Make sure your submissions are done before then to count for the day!</p>
              <p className="text-gray-400">Thanks for your <span className="font-medium text-orange-400">dedication -</span><br /><span className="text-orange-500">Keep going and happy learning!</span></p>
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <button 
            onClick={prevMonth}
            className="flex items-center justify-center w-8 h-8 rounded-full hover:bg-[#2a2a2a] transition-colors" 
            aria-label="Previous month"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-chevron-left" aria-hidden="true">
              <path d="m15 18-6-6 6-6"></path>
            </svg>
          </button>
          
          <div className="flex items-center justify-center min-w-[5.5rem]">
            <span className="text-sm font-semibold px-3 py-1 rounded-lg bg-[#2a2a2a]/50">
              {getMonthName(currentMonth).substring(0, 3)} '{String(currentYear).substring(2)}
            </span>
          </div>
          
          <button 
            onClick={nextMonth}
            className="flex items-center justify-center w-8 h-8 rounded-full hover:bg-[#2a2a2a] transition-colors" 
            aria-label="Next month"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-chevron-right" aria-hidden="true">
              <path d="m9 18 6-6-6-6"></path>
            </svg>
          </button>
        </div>
        
        <button 
          className="flex items-center justify-center w-8 h-8 rounded hover:bg-[#2a2a2a] transition-colors" 
          aria-label="Share calendar" 
          type="button"
          title="Share"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 15 15" fill="none">
            <path d="M12.5175 8.80885C12.4919 8.83117 12.4711 8.85847 12.4563 8.8891C12.4416 8.91972 12.4333 8.95303 12.4319 8.98698C12.4012 9.62023 12.3491 10.2523 12.2756 10.882C12.1794 11.7057 11.5131 12.3614 10.6819 12.4545C8.56691 12.689 6.43249 12.689 4.31751 12.4545C3.91372 12.4098 3.53679 12.2303 3.2476 11.9449C2.95842 11.6596 2.77387 11.2851 2.72376 10.882C2.47304 8.73929 2.47304 6.57467 2.72376 4.43198C2.77374 4.02872 2.95823 3.65408 3.24743 3.36863C3.53663 3.08318 3.91363 2.90358 4.31751 2.85885C5.71283 2.7038 7.11763 2.65116 8.52063 2.70135C8.62251 2.70448 8.70813 2.6276 8.71563 2.52635L8.74688 2.08698C8.74813 2.06115 8.75063 2.03552 8.75438 2.0101C8.76938 1.88885 8.68563 1.76885 8.56251 1.76448C7.1109 1.7133 5.6575 1.76761 4.21376 1.92698C2.95626 2.06823 1.94063 3.05823 1.79313 4.3226C1.53445 6.538 1.53445 8.77596 1.79313 10.9914C1.94063 12.2551 2.95563 13.2457 4.21376 13.3864C6.39792 13.6281 8.60209 13.6281 10.7863 13.3864C12.0438 13.2457 13.0594 12.2551 13.2069 10.9907C13.3123 10.0886 13.3748 9.18193 13.3944 8.27385C13.3969 8.15948 13.2569 8.10323 13.1775 8.18385C12.965 8.4001 12.745 8.60844 12.5175 8.80885Z" fill="currentColor"></path>
            <path d="M4.91696 9.71882C4.84978 9.7003 4.79071 9.65985 4.74915 9.60391C4.70759 9.54797 4.68592 9.47974 4.68759 9.41007L4.72509 7.87069C4.75054 6.81045 5.18959 5.8022 5.94845 5.06133C6.70731 4.32046 7.7258 3.90571 8.78634 3.90569H9.57196C9.58863 3.51569 9.61092 3.12611 9.63884 2.73694L9.68134 2.15569C9.68715 2.07445 9.71398 1.99611 9.75919 1.92836C9.8044 1.86061 9.86644 1.80577 9.93922 1.76922C10.012 1.73267 10.093 1.71566 10.1744 1.71986C10.2557 1.72407 10.3346 1.74933 10.4032 1.79319C11.6974 2.6206 12.8225 3.68637 13.7188 4.93382L14.0038 5.33069C14.0419 5.3838 14.0624 5.44752 14.0624 5.51288C14.0624 5.57824 14.0419 5.64196 14.0038 5.69507L13.7188 6.09194C12.8225 7.33916 11.6973 8.40472 10.4032 9.23194C10.3473 9.26768 10.2845 9.29121 10.2189 9.301C10.1532 9.31079 10.0863 9.3066 10.0224 9.28873C9.9585 9.27085 9.8991 9.23968 9.84808 9.19726C9.79706 9.15484 9.75558 9.10213 9.72634 9.04257C9.7012 8.98842 9.68596 8.93021 9.68134 8.87069L9.63884 8.28882C9.60513 7.82473 9.57992 7.36007 9.56321 6.89507L9.34196 6.86132C8.65309 6.75748 7.94893 6.8654 7.32278 7.17077C6.69662 7.47615 6.17803 7.96457 5.83571 8.57132L5.27196 9.57132C5.23769 9.63195 5.18414 9.67939 5.11983 9.70611C5.05551 9.73283 4.98411 9.7373 4.91696 9.71882Z" fill="currentColor"></path>
          </svg>
        </button>
      </div>
      
      {/* Calendar wrapper with fixed height */}
      <div className="w-full h-fit min-h-[15rem] flex items-center justify-center">
        <div className="w-full calendar-wrapper">
          {/* Day headers */}
          <div className="calendar-weekdays grid grid-cols-7 gap-1.5 mb-2">
            {daysOfWeek.map(day => (
              <div key={day} className="flex items-center justify-center h-6 text-xs font-medium text-gray-400 calendar-weekday" role="columnheader">
                {day}
              </div>
            ))}
          </div>
          
          {/* Calendar grid */}
          <div className="calendar-grid grid grid-cols-7 gap-1.5">
            {generateCalendarDays()}
          </div>
        </div>
      </div>
      
      {/* Streak info */}
      <div className="flex items-center justify-between pt-3 mt-5 border-t border-gray-800">
        <div className="bg-[#222] px-3 py-1.5 rounded-lg flex items-center gap-2">
          <Flame size={16} className="text-orange-500" />
          <span className="text-sm">Current: <span className="font-bold text-white">{streakData.currentStreak}</span></span>
        </div>
        <div className="bg-[#222] px-3 py-1.5 rounded-lg flex items-center gap-2">
          <Flame size={16} className="text-orange-500" />
          <span className="text-sm">Best: <span className="font-bold text-white">{streakData.maxStreak}</span></span>
        </div>
      </div>
    </div>
  );
};

export default CalendarWidget;
