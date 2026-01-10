import React, { useState, useRef, useEffect } from 'react';
import { useToast } from '@shared/hooks/ToastContext';
import { ChevronDown } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const topics = [
  'All topics',
  'Beginner Problems',
  'Sorting',
  'Arrays',
  'Hashing',
  'Binary Search',
  'Recursion',
  'Linked-List',
  'Bit Manipulation',
  'Greedy Algorithms',
  'Sliding Window / 2 Pointer',
  'Stack / Queues',
  'Binary Trees',
  'Binary Search Trees',
  'Heaps',
  'Graphs',
  'Dynamic Programming',
  'Tries',
  'Strings (Advanced Algo)',
  'Maths'
];

const RoadmapPage: React.FC = () => {
  const navigate = useNavigate();
  const { success: toastSuccess } = useToast();
  const [days, setDays] = useState(180);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [selectedTopics, setSelectedTopics] = useState<string[]>(['All topics']);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleTopicToggle = (topic: string) => {
    if (topic === 'All topics') {
      if (selectedTopics.includes('All topics')) {
        setSelectedTopics([]);
      } else {
        setSelectedTopics(topics);
      }
    } else {
      const newSelected = selectedTopics.includes(topic)
        ? selectedTopics.filter(t => t !== topic && t !== 'All topics')
        : [...selectedTopics.filter(t => t !== 'All topics'), topic];
      
      // Check if all individual topics are selected
      const individualTopics = topics.filter(t => t !== 'All topics');
      if (newSelected.length === individualTopics.length) {
        setSelectedTopics(['All topics', ...individualTopics]);
      } else {
        setSelectedTopics(newSelected);
      }
    }
  };

  const getDisplayText = () => {
    if (selectedTopics.length === 0) return 'Select topics';
    if (selectedTopics.includes('All topics')) return 'All topics';
    if (selectedTopics.length === 1) return selectedTopics[0];
    return `${selectedTopics.length} topics selected`;
  };

  const handleSubmit = () => {
    toastSuccess('Roadmap started! Good luck on your journey.');
    navigate('/dsa/roadmap/view');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0f0f0f] p-4">
      <div className="w-full max-w-2xl">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-2xl md:text-3xl font-bold text-white mb-2">
            Set Your Roadmap
          </h1>
          <p className="text-[#9ca3af] text-sm md:text-base">
            Customise Your Journey, Track Results With Ease
          </p>
          <p className="text-[#6b7280] text-xs md:text-sm mt-1">
            Pick your preferred topics and set a timeline for personalized roadmap
          </p>
        </div>

        <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl p-6 md:p-8">
          {/* Selected Topics Dropdown */}
          <div className="space-y-2 mb-6">
            <label className="text-[#d1d5db] text-xs md:text-sm font-normal block">
              Selected Topics
            </label>
            <div className="relative" ref={dropdownRef}>
              <button 
                data-slot="button"
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="cursor-pointer gap-2 whitespace-nowrap text-sm font-medium disabled:pointer-events-none disabled:opacity-50 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] shadow-xs py-2 w-full h-10 md:h-11 bg-[#1a1a1a] hover:bg-[#2a2a2a] border border-[#2a2a2a] text-white rounded-lg px-3 md:px-4 hover:border-[#3a3d45] flex items-center justify-between transition-colors"
              >
                <span className="text-xs md:text-sm text-[#6b7280]">{getDisplayText()}</span>
                <ChevronDown className={`size-4 text-[#9ca3af] transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`} />
              </button>

              {/* Dropdown Menu */}
              {isDropdownOpen && (
                <div className="absolute z-50 w-full mt-2 bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg shadow-lg max-h-[250px] overflow-y-auto custom-scrollbar">
                  {topics.map((topic) => (
                    <label
                      key={topic}
                      className={`w-full flex items-center gap-3 px-3 md:px-4 py-2.5 text-xs md:text-sm transition-colors cursor-pointer ${
                        selectedTopics.includes(topic)
                          ? 'bg-[#2a2a2a] text-white'
                          : 'text-[#9ca3af] hover:bg-[#2a2a2a] hover:text-white'
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={selectedTopics.includes(topic)}
                        onChange={() => handleTopicToggle(topic)}
                        className="w-4 h-4 rounded border-2 border-[#2a2a2a] bg-[#0f0f0f] checked:bg-[#EA763F] checked:border-[#EA763F] focus:ring-2 focus:ring-[#EA763F] focus:ring-offset-0 cursor-pointer accent-[#EA763F]"
                        style={{
                          accentColor: '#EA763F'
                        }}
                      />
                      <span>{topic}</span>
                    </label>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Days Input */}
          <div className="border border-[#2a2a2a] bg-[#1a1a1a] rounded-lg p-3 md:p-4 space-y-2 md:space-y-3">
            <label className="text-[#9ca3af] text-xs md:text-sm block">
              Enter custom number of days
            </label>
            <div className="space-y-1">
              <input 
                min={19}
                max={365}
                placeholder="Enter number of days"
                className="w-full h-10 md:h-11 bg-[#0f0f0f] border border-[#2a2a2a] focus:border-[#EA763F] rounded-lg px-3 md:px-4 text-[#9ca3af] text-xs md:text-sm focus:outline-none hover:border-[#3a3d45] transition-colors [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                type="number"
                value={days}
                onChange={(e) => setDays(Number(e.target.value))}
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-3 pt-2 md:gap-4">
            <button 
              data-slot="button"
              onClick={() => navigate(-1)}
              className="flex-1 cursor-pointer inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md transition-all disabled:pointer-events-none disabled:opacity-50 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] bg-[#1a1a1a] text-white shadow-xs hover:bg-[#2a2a2a] px-4 py-2 h-10 md:h-12 text-xs md:text-sm font-medium"
            >
              Cancel
            </button>
            <button 
              data-slot="button"
              onClick={handleSubmit}
              className="flex-1 cursor-pointer inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md transition-all disabled:pointer-events-none disabled:opacity-50 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] bg-[#EA763F] text-white shadow-xs hover:bg-[#EA763F]/90 px-4 py-2 h-10 md:h-12 text-xs md:text-sm font-medium"
            >
              <div>Start your journey</div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RoadmapPage;
