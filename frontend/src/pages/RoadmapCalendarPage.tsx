import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight, ChevronDown, LayoutGrid, Calendar as CalendarIcon, Info, RotateCcw } from 'lucide-react';
import { UnifiedSidebar } from '../components/navigation';

const RoadmapCalendarPage: React.FC = () => {
  const [currentMonth, setCurrentMonth] = useState('December');
  const [currentYear] = useState(2025);

  const daysInMonth = 31;
  const startDay = 0; // Sunday

  const getDayStatus = (day: number) => {
    if (day < 23) return 'past';
    if (day === 23) return 'ongoing';
    return 'upcoming';
  };

  const getDayStyles = (day: number) => {
    const status = getDayStatus(day);
    
    switch (status) {
      case 'ongoing':
        return {
          backgroundColor: 'rgba(234, 118, 63, 0.2)',
          color: 'rgb(234, 118, 63)',
          ring: 'ring-2 ring-gray-900 dark:ring-white ring-offset-2 ring-offset-[#0f0f0f]'
        };
      case 'upcoming':
        return {
          backgroundColor: 'rgba(115, 115, 115, 0.2)',
          color: 'rgba(115, 115, 115, 0.6)',
          ring: ''
        };
      default:
        return {
          backgroundColor: 'transparent',
          color: 'var(--roadmap-modal-text-muted)',
          ring: ''
        };
    }
  };

  const getModuleForDay = (day: number) => {
    if (day >= 23) {
      return {
        name: 'Beginner Problems',
        status: day === 23 ? 'Ongoing' : 'Upcoming',
        statusColor: day === 23 ? 'rgb(234, 118, 63)' : 'rgba(115, 115, 115, 0.6)',
        bgColor: day === 23 ? 'rgba(234, 118, 63, 0.2)' : 'rgba(115, 115, 115, 0.2)'
      };
    }
    return null;
  };

  const renderCalendarDays = () => {
    const days = [];
    
    // Empty cells for days before month starts
    for (let i = 0; i < startDay; i++) {
      days.push(<div key={`empty-${i}`} className="bg-[#0f0f0f] min-h-[130px]"></div>);
    }
    
    // Actual days
    for (let day = 1; day <= daysInMonth; day++) {
      const module = getModuleForDay(day);
      days.push(
        <div key={day} className="bg-[#0f0f0f] min-h-[130px] p-3 relative flex flex-col hover:bg-[#1a1a1a] transition-colors">
          <span className="text-sm font-medium mb-3 text-gray-900 dark:text-white">{day}</span>
          {module && (
            <div className="rounded-lg overflow-hidden flex" style={{ backgroundColor: module.bgColor }}>
              <div className="w-1 my-2.5 ml-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: module.statusColor }}></div>
              <div className="py-2.5 px-3 flex flex-col gap-1">
                <div className="flex justify-between items-start gap-1">
                  <span className="text-xs font-normal line-clamp-2 leading-snug text-gray-900 dark:text-white">{module.name}</span>
                </div>
                <span className="text-xs font-normal" style={{ color: module.statusColor }}>{module.status}</span>
              </div>
            </div>
          )}
        </div>
      );
    }
    
    // Fill remaining cells
    const totalCells = days.length;
    const remainingCells = 35 - totalCells;
    for (let i = 0; i < remainingCells; i++) {
      days.push(<div key={`end-${i}`} className="bg-[#0f0f0f] min-h-[130px]"></div>);
    }
    
    return days;
  };

  const renderMobileCalendar = () => {
    const mobileDays = [];
    for (let i = 0; i < startDay; i++) {
      mobileDays.push(<div key={`mobile-empty-${i}`}></div>);
    }
    
    for (let day = 1; day <= daysInMonth; day++) {
      const styles = getDayStyles(day);
      mobileDays.push(
        <div key={day} className="flex justify-center">
          <button 
            className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium transition-all ${styles.ring}`}
            style={{ backgroundColor: styles.backgroundColor, color: styles.color }}
          >
            {day}
          </button>
        </div>
      );
    }
    
    return mobileDays;
  };

  return (
    <div className="h-screen flex overflow-hidden bg-[#0f0f0f]">
      {/* UnifiedSidebar */}
      <div className="h-full">
        <UnifiedSidebar 
          title="DSA Roadmap"
          categories={[]}
          searchPlaceholder=""
          basePath="/dsa"
          showTabs={false}
          showSearch={false}
          showTitle={false}
          showModuleCalendar={true}
        />
      </div>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        <div className="flex h-full w-full flex-col min-w-0">
          <div className="flex w-full flex-grow overflow-hidden p-0 lg:p-[10px] lg:pl-0">
            <div className="relative flex h-full w-full overflow-hidden">
              <div className="w-full h-full overflow-y-auto bg-[#0f0f0f] text-gray-900 dark:text-white p-1 lg:p-0 rounded-2xl">
                
                {/* Mobile View */}
                <div className="md:hidden flex flex-col gap-4 p-4 bg-[#0f0f0f] text-gray-900 dark:text-white">
                  <div className="w-full bg-[#1a1a1a] rounded-3xl overflow-hidden border border-[#2a2a2a] shadow-xl">
                    <div className="h-1 bg-[#EA763F] mx-auto w-32 rounded-b-full"></div>
                    <div className="p-5">
                      <div className="flex items-center justify-between mb-6">
                        <button className="w-10 h-10 flex items-center justify-center rounded-full border border-[#2a2a2a] text-[#9ca3af] hover:bg-[#2a2a2a] hover:text-gray-900 dark:hover:text-white transition-colors">
                          <Info className="w-5 h-5" />
                        </button>
                        <div className="flex items-center gap-2">
                          <button className="w-8 h-8 flex items-center justify-center rounded-full text-[#9ca3af] hover:text-gray-900 dark:hover:text-white transition-colors">
                            <ChevronLeft className="w-5 h-5" />
                          </button>
                          <button className="h-9 px-5 bg-[#2a2a2a] border-none rounded-full text-sm font-medium text-gray-900 dark:text-white hover:bg-[#2a2a2a]/80 transition-colors w-auto min-w-[130px] justify-center gap-2 flex items-center">
                            <span>{currentMonth}</span>
                            <ChevronDown className="w-4 h-4 opacity-50" />
                          </button>
                          <button className="w-8 h-8 flex items-center justify-center rounded-full text-[#9ca3af] hover:text-gray-900 dark:hover:text-white transition-colors">
                            <ChevronRight className="w-5 h-5" />
                          </button>
                        </div>
                        <button className="w-10 h-10 flex items-center justify-center rounded-full border border-[#2a2a2a] text-[#9ca3af] hover:bg-[#2a2a2a] hover:text-gray-900 dark:hover:text-white transition-colors">
                          <RotateCcw className="w-5 h-5" />
                        </button>
                      </div>
                      
                      {/* Day labels */}
                      <div className="grid grid-cols-7 mb-3">
                        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                          <div key={day} className="text-center text-xs font-medium text-[#9ca3af]">{day}</div>
                        ))}
                      </div>
                      
                      {/* Calendar grid */}
                      <div className="grid grid-cols-7 gap-y-3 gap-x-1">
                        {renderMobileCalendar()}
                      </div>
                      
                      {/* Legend */}
                      <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2 mt-6 pt-5 border-t border-[#2a2a2a]">
                        <div className="flex items-center gap-1.5">
                          <div className="w-2.5 h-2.5 rounded-full bg-[#10b981]"></div>
                          <span className="text-xs font-normal text-[#9ca3af]">Completed</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <div className="w-2.5 h-2.5 rounded-full bg-[#EA763F]"></div>
                          <span className="text-xs font-normal text-[#9ca3af]">Ongoing</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <div className="w-2.5 h-2.5 rounded-full bg-[#FACC15]"></div>
                          <span className="text-xs font-normal text-[#9ca3af]">Paused</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <div className="w-2.5 h-2.5 rounded-full bg-[#EF2400]"></div>
                          <span className="text-xs font-normal text-[#9ca3af]">Missed</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <div className="w-2.5 h-2.5 rounded-full bg-[rgba(115,115,115,0.6)]"></div>
                          <span className="text-xs font-normal text-[#9ca3af]">Upcoming</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Today's module card */}
                  <div className="w-full bg-[#1a1a1a] rounded-2xl p-4 border border-[#2a2a2a] flex items-center gap-4 shadow-lg">
                    <div className="w-14 h-14 rounded-xl flex items-center justify-center shrink-0 text-xl font-semibold" style={{ backgroundColor: 'rgba(234, 118, 63, 0.2)', color: 'rgb(234, 118, 63)' }}>
                      23
                    </div>
                    <div className="flex flex-col gap-1 overflow-hidden min-w-0">
                      <h3 className="text-sm font-normal text-gray-900 dark:text-white truncate">Beginner Problems</h3>
                      <div className="flex items-center gap-1.5">
                        <div className="w-2 h-2 rounded-full bg-[#EA763F]"></div>
                        <span className="text-xs font-normal text-[#EA763F]">Ongoing</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Desktop View */}
                <div className="hidden md:block">
                  {/* Header */}
                  <div className="flex items-center justify-between my-4 px-3">
                    <div className="flex items-center gap-2">
                      <button className="w-8 h-8 flex items-center justify-center rounded-full text-[#9ca3af] hover:text-gray-900 dark:hover:text-white transition-colors">
                        <ChevronLeft className="w-5 h-5" />
                      </button>
                      <button className="h-9 px-5 bg-[#2a2a2a] border-none rounded-full text-sm font-medium text-gray-900 dark:text-white hover:bg-[#2a2a2a]/80 transition-colors w-auto min-w-[130px] justify-center gap-2 flex items-center">
                        <span>{currentMonth}</span>
                        <ChevronDown className="w-4 h-4 opacity-50" />
                      </button>
                      <button className="w-8 h-8 flex items-center justify-center rounded-full text-[#9ca3af] hover:text-gray-900 dark:hover:text-white transition-colors">
                        <ChevronRight className="w-5 h-5" />
                      </button>
                    </div>
                    
                    {/* Legend */}
                    <div className="flex items-center gap-5">
                      <div className="flex items-center gap-2">
                        <div className="w-2.5 h-2.5 rounded-full bg-[#10b981]"></div>
                        <span className="text-xs text-[#9ca3af] font-medium">Completed</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-2.5 h-2.5 rounded-full bg-[#EA763F]"></div>
                        <span className="text-xs text-[#9ca3af] font-medium">Ongoing</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-2.5 h-2.5 rounded-full bg-[#FACC15]"></div>
                        <span className="text-xs text-[#9ca3af] font-medium">Paused</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-2.5 h-2.5 rounded-full bg-[#EF2400]"></div>
                        <span className="text-xs text-[#9ca3af] font-medium">Missed</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-2.5 h-2.5 rounded-full bg-[rgba(115,115,115,0.6)]"></div>
                        <span className="text-xs text-[#9ca3af] font-medium">Upcoming</span>
                      </div>
                    </div>
                  </div>

                  {/* Weekday labels */}
                  <div className="grid grid-cols-7">
                    {['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'].map(day => (
                      <div key={day} className="py-2 text-center text-sm text-[#9ca3af] font-medium">{day}</div>
                    ))}
                  </div>

                  {/* Calendar grid */}
                  <div className="grid grid-cols-7 bg-[#2a2a2a] gap-px border border-[#2a2a2a] m-1">
                    {renderCalendarDays()}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RoadmapCalendarPage;
