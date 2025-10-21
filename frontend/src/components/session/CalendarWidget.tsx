import { useState } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, Flame } from 'lucide-react';

const daysOfWeek = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];

interface CalendarWidgetProps {
  month?: number; // 0-11
  year?: number;
  streakDays?: number[]; // Days of month with streaks (1-31)
  currentStreak?: number;
  maxStreak?: number;
}

const CalendarWidget = ({
  month = new Date().getMonth(),
  year = new Date().getFullYear(),
  streakDays = [5, 6, 7, 10, 11, 12],
  currentStreak = 1,
  maxStreak = 67
}: CalendarWidgetProps) => {
  const [currentMonth, setCurrentMonth] = useState(month);
  const [currentYear, setCurrentYear] = useState(year);
  
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
    
    // Add empty cells for days before the 1st of month
    for (let i = 0; i < firstDayOfMonth; i++) {
      days.push(<div key={`empty-${i}`} className="w-8 h-8 rounded-full"></div>);
    }
    
    // Add days of month
    for (let day = 1; day <= daysInMonth; day++) {
      const isToday = day === new Date().getDate() && 
                      currentMonth === new Date().getMonth() && 
                      currentYear === new Date().getFullYear();
                      
      const hasStreak = streakDays.includes(day);
      
      days.push(
        <motion.div 
          key={`day-${day}`}
          className={`h-8 w-8 rounded-full flex items-center justify-center text-sm relative
                     ${isToday ? 'border-2 border-blue-500 font-bold' : ''}
                     ${hasStreak ? 'bg-gray-800' : ''}`}
          whileHover={{ scale: 1.15 }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          {day}
          {hasStreak && (
            <Flame 
              size={12} 
              className="absolute -bottom-0.5 -right-0.5 text-orange-500" 
            />
          )}
        </motion.div>
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
      <div className="flex items-center justify-between pb-2 mb-5 border-b border-gray-800">
        <h3 className="text-lg font-semibold">{getMonthName(currentMonth)}</h3>
        <div className="flex items-center">
          <button 
            onClick={prevMonth} 
            className="p-1.5 rounded hover:bg-[#333] mr-1 transition-colors"
          >
            <ChevronLeft size={16} />
          </button>
          <button 
            onClick={nextMonth} 
            className="p-1.5 rounded hover:bg-[#333] transition-colors"
          >
            <ChevronRight size={16} />
          </button>
        </div>
      </div>
      
      {/* Day headers */}
      <div className="grid grid-cols-7 gap-1.5 mb-3">
        {daysOfWeek.map(day => (
          <div key={day} className="flex items-center justify-center h-8 text-xs font-medium text-gray-400">
            {day}
          </div>
        ))}
      </div>
      
      {/* Calendar grid */}
      <div className="grid grid-cols-7 gap-1.5">
        {generateCalendarDays()}
      </div>
      
      {/* Streak info */}
      <div className="flex items-center justify-between pt-3 mt-5 border-t border-gray-800">
        <div className="bg-[#222] px-3 py-1.5 rounded-lg flex items-center gap-2">
          <Flame size={16} className="text-orange-500" />
          <span className="text-sm">Current: <span className="font-bold text-white">{currentStreak}</span></span>
        </div>
        <div className="bg-[#222] px-3 py-1.5 rounded-lg flex items-center gap-2">
          <Flame size={16} className="text-orange-500" />
          <span className="text-sm">Best: <span className="font-bold text-white">{maxStreak}</span></span>
        </div>
      </div>
    </div>
  );
};

export default CalendarWidget;
