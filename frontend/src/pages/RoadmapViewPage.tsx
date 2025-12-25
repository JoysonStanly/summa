import React, { useState } from 'react';
import { ChevronDown, CirclePlus, CircleMinus, RotateCcw, CirclePause, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { UnifiedSidebar } from '../components/navigation';

interface TopicModule {
  id: string;
  name: string;
  completed: number;
  total: number;
  startDate: string;
  endDate: string;
  isCompleted: boolean;
}

const RoadmapViewPage: React.FC = () => {
  const [modules] = useState<TopicModule[]>([
    { id: '1', name: 'Beginner Problems', completed: 10, total: 11, startDate: '23 Dec', endDate: '20 Jan', isCompleted: false },
    { id: '2', name: 'Sorting', completed: 0, total: 1, startDate: '21 Jan', endDate: '21 Jan', isCompleted: false },
    { id: '3', name: 'Arrays', completed: 2, total: 4, startDate: '22 Jan', endDate: '01 Feb', isCompleted: false },
    { id: '4', name: 'Hashing', completed: 1, total: 2, startDate: '02 Feb', endDate: '05 Feb', isCompleted: false },
    { id: '5', name: 'Binary Search', completed: 5, total: 5, startDate: '06 Feb', endDate: '16 Feb', isCompleted: true },
    { id: '6', name: 'Recursion', completed: 4, total: 5, startDate: '17 Feb', endDate: '27 Feb', isCompleted: false },
    { id: '7', name: 'Linked-List', completed: 6, total: 6, startDate: '28 Feb', endDate: '11 Mar', isCompleted: true },
    { id: '8', name: 'Bit Manipulation', completed: 2, total: 2, startDate: '12 Mar', endDate: '17 Mar', isCompleted: true },
    { id: '9', name: 'Greedy Algorithms', completed: 3, total: 3, startDate: '18 Mar', endDate: '24 Mar', isCompleted: true },
    { id: '10', name: 'Sliding Window / 2 Pointer', completed: 4, total: 4, startDate: '25 Mar', endDate: '02 Apr', isCompleted: true },
    { id: '11', name: 'Stack / Queues', completed: 0, total: 3, startDate: '03 Apr', endDate: '09 Apr', isCompleted: false },
    { id: '12', name: 'Binary Trees', completed: 2, total: 5, startDate: '10 Apr', endDate: '20 Apr', isCompleted: false },
    { id: '13', name: 'Binary Search Trees', completed: 1, total: 3, startDate: '21 Apr', endDate: '27 Apr', isCompleted: false },
    { id: '14', name: 'Heaps', completed: 0, total: 2, startDate: '28 Apr', endDate: '03 May', isCompleted: false },
    { id: '15', name: 'Graphs', completed: 0, total: 8, startDate: '04 May', endDate: '20 May', isCompleted: false },
    { id: '16', name: 'Dynamic Programming', completed: 0, total: 9, startDate: '21 May', endDate: '06 Jun', isCompleted: false },
    { id: '17', name: 'Tries', completed: 0, total: 2, startDate: '07 Jun', endDate: '10 Jun', isCompleted: false },
    { id: '18', name: 'Strings (Advanced Algo)', completed: 0, total: 2, startDate: '11 Jun', endDate: '16 Jun', isCompleted: false },
    { id: '19', name: 'Maths', completed: 0, total: 1, startDate: '17 Jun', endDate: '20 Jun', isCompleted: false },
  ]);

  const totalCompleted = modules.reduce((acc, mod) => acc + mod.completed, 0);
  const totalProblems = modules.reduce((acc, mod) => acc + mod.total, 0);
  const progressPercentage = Math.round((totalCompleted / totalProblems) * 100);

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
      <div className="flex flex-col flex-1 overflow-hidden">
        <div className="flex flex-col w-full h-full min-w-0">
          {/* Header */}
          <header className="relative bg-[#1a1a1a] border border-[#2a2a2a] rounded-[10px] mx-2.5 mt-2.5">
            <div className="flex items-center gap-4 mx-4 sm:mx-4 h-9">
              {/* Progress Bar */}
              <div className="flex flex-1">
                <div className="relative flex items-center w-full max-w-md gap-3">
                  <span className="text-sm font-medium text-white whitespace-nowrap">Progress</span>
                  <div className="relative flex-1 h-1 bg-[#EA763F]/20 rounded-full overflow-visible">
                    <div 
                      className="h-full bg-[#EA763F] rounded-full transition-all duration-300 ease-out" 
                      style={{ width: `${progressPercentage}%` }}
                    />
                    <div 
                      className="absolute top-1/2 -translate-y-1/2 w-2.5 h-2.5 bg-white/30 border border-white/20 rounded-full shadow-lg transition-all duration-300 ease-out" 
                      style={{ left: `calc(${progressPercentage}% - 8px)` }}
                    />
                    <div 
                      className="absolute flex flex-col items-center gap-1 translate-x-1/2 -translate-y-1/2 pointer-events-none top-1/2" 
                      style={{ right: '0px' }}
                    >
                      <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <g clipPath="url(#clip0_244_12638)">
                          <path d="M15.175 9.27375C15.5219 8.98781 17.525 7.74875 18.6219 6.705C19.4781 5.88938 19.8094 3.75969 18.4922 2.72375C16.7797 1.37844 15.1359 2.79094 15.1359 2.79094C15.1359 2.79094 14.9922 1.9925 13.9922 1.52375C12.7328 0.933126 11.1375 0.712814 9.67031 0.731564C8.24844 0.748751 6.93907 0.920626 5.77657 1.49094C4.73594 2.00188 4.67344 2.73 4.67344 2.73C4.67344 2.73 3.30782 1.42531 1.63438 2.48469C-0.0374971 3.54563 0.44219 5.67063 1.24688 6.56281C2.29532 7.72531 3.55469 8.3175 4.12657 8.74563C4.69688 9.17375 5.24375 9.58156 5.24375 9.94875C5.24375 10.3159 5.08125 10.3972 5.01875 10.3769C4.95782 10.3566 4.85 9.99875 4.57032 10.1519C4.18907 10.3628 4.30469 11.2128 5.1 11.2941C5.87032 11.3738 6.01719 10.5597 6.01719 10.5597L6.13907 9.76438L7.40313 10.6409L8.78907 11.7831L8.74844 12.7613C8.74844 12.7613 8.6875 13.5159 8.32032 14.1691C7.95313 14.8222 7.3625 15.4738 7.3625 15.4738L7.34375 16.0644L12.4828 15.9425L12.3203 15.3722C12.3203 15.3722 11.6578 14.6441 11.2594 13.8628C10.975 13.3034 10.9297 12.7394 10.9297 12.7394L10.9172 11.3363L13.5844 9.70188C13.5844 9.70188 13.8703 9.92688 13.8297 10.0081C13.7891 10.0894 13.7797 10.9222 14.4203 11.2316C15.0531 11.5378 15.5625 11.1503 15.5016 10.6191C15.4406 10.0894 15.1141 10.2722 15.0125 10.3534C14.9109 10.4347 14.6859 10.455 14.625 10.1488C14.5625 9.84563 14.8281 9.55969 15.175 9.27375Z" fill="#FEC417" />
                        </g>
                      </svg>
                    </div>
                  </div>
                  <span className="text-sm font-medium text-white whitespace-nowrap">Day 1/180</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-1">
                <button className="inline-flex items-center justify-center whitespace-nowrap text-sm font-medium hover:bg-[#2a2a2a] rounded-md gap-1.5 md:gap-2 h-8 px-2 md:px-3 transition-colors">
                  <RotateCcw className="w-4 h-4 text-[#9ca3af]" />
                  <span className="text-[#9ca3af] text-xs md:text-sm hidden sm:inline">Reset</span>
                </button>
                <button className="inline-flex items-center justify-center whitespace-nowrap text-sm font-medium hover:bg-[#2a2a2a] rounded-md gap-1.5 md:gap-2 h-8 px-2 md:px-3 transition-colors">
                  <CirclePause className="w-4 h-4 text-[#9ca3af]" />
                  <span className="text-[#9ca3af] text-xs md:text-sm hidden sm:inline">Pause</span>
                </button>
              </div>
            </div>
          </header>

          {/* Content Area */}
          <div className="flex w-full flex-grow overflow-hidden p-2.5 pl-2.5">
            <div className="relative flex w-full h-full overflow-hidden">
              <div className="flex flex-col w-full h-full p-1 overflow-y-auto">
                <div className="flex-1 py-3 md:py-6">
                  <div className="flex flex-col gap-4 md:gap-6">
                    <div className="w-full h-full overflow-y-auto">
                      {/* Topic Modules */}
                      {modules.map((module) => (
                        <div key={module.id} className="w-full mb-2 sm:mb-4 flex flex-col rounded-xl border border-[#2a2a2a]">
                          <div className="rounded-xl border cursor-pointer border-[#2a2a2a]">
                            <button className="flex p-2 cursor-pointer sm:p-3 px-3 sm:px-4 items-center justify-between w-full group text-white rounded-t-xl hover:bg-[#1a1a1a] transition-colors">
                              {/* Left Section */}
                              <div className="flex items-center justify-center gap-1.5 sm:gap-2 min-w-0">
                                <input 
                                  readOnly
                                  disabled
                                  className={`border-white border-[1.3px] h-3 w-3 sm:h-4 sm:w-4 rounded-full ${
                                    module.isCompleted ? 'bg-green-500 checked:bg-green-500' : 'bg-transparent'
                                  }`}
                                  type="checkbox" 
                                  checked={module.isCompleted}
                                />
                                <div className="flex min-w-0 gap-1 text-sm font-bold text-left sm:text-base">
                                  <div className="text-sm font-medium truncate sm:text-base">{module.name}</div>
                                  <p className="font-medium whitespace-nowrap text-[#9ca3af]">
                                    ({module.completed}/{module.total})
                                  </p>
                                </div>
                              </div>

                              {/* Right Section */}
                              <div className="flex items-center gap-1 ml-2 sm:gap-2 shrink-0">
                                <div role="button" className="p-1 cursor-pointer">
                                  <CircleMinus className="w-4 h-4 sm:w-5 sm:h-5 stroke-[#9ca3af]" strokeWidth={1.3} />
                                </div>
                                <div className="items-center hidden sm:flex">
                                  <p className="text-xs sm:text-sm text-[#9ca3af]">{module.startDate} - {module.endDate}</p>
                                </div>
                                <div role="button" className="p-1 cursor-pointer">
                                  <CirclePlus className="w-4 h-4 sm:w-5 sm:h-5 stroke-[#9ca3af]" strokeWidth={1.3} />
                                </div>
                                <div className="stroke-[#9ca3af] ml-1 sm:ml-5">
                                  <ChevronDown className="w-5 h-5" />
                                </div>
                              </div>
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
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

export default RoadmapViewPage;
