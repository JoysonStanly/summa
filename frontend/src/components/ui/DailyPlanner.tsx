import { useState } from 'react';
import { Edit2, Maximize2 } from 'lucide-react';

interface DailyPlannerProps {
  tasks?: {
    id: string;
    title: string;
    completed: boolean;
  }[];
}

const DailyPlanner = ({ tasks = [] }: DailyPlannerProps) => {
  const [activeTab, setActiveTab] = useState<'incomplete' | 'completed'>('incomplete');
  
  return (
    <div className="-ml-3 -mr-3 bg-[#1a1a1a] rounded-lg border border-[#2a2a2a] overflow-hidden shadow-lg">
      <div className="flex items-center justify-between p-4 border-b border-gray-800">
        <h3 className="text-lg font-semibold">Daily Planner</h3>
        <div className="flex items-center gap-2">
          <button className="p-1.5 rounded hover:bg-[#333] transition-colors">
            <Edit2 size={16} />
          </button>
          <button className="p-1.5 rounded hover:bg-[#333] transition-colors">
            <Maximize2 size={16} />
          </button>
        </div>
      </div>
      
      {/* Tabs */}
      <div className="flex">
        <button 
          className={`px-4 py-3 flex-1 text-sm font-medium transition-colors ${activeTab === 'incomplete' ? 'text-white border-b-2 border-blue-500 bg-[#222]' : 'text-gray-400 hover:text-gray-300 hover:bg-[#222]'}`}
          onClick={() => setActiveTab('incomplete')}
        >
          Incomplete
        </button>
        <button 
          className={`px-4 py-3 flex-1 text-sm font-medium transition-colors ${activeTab === 'completed' ? 'text-white border-b-2 border-blue-500 bg-[#222]' : 'text-gray-400 hover:text-gray-300 hover:bg-[#222]'}`}
          onClick={() => setActiveTab('completed')}
        >
          Completed
        </button>
      </div>
      
      {/* Task list */}
      <div className="p-5 min-h-[200px] flex items-center justify-center">
        {tasks.length === 0 && (
          <div className="text-center text-[#9ca3af]">
            <p className="text-sm">No tasks {activeTab === 'incomplete' ? 'to do' : 'completed'}</p>
          </div>
        )}
        
        {tasks.length > 0 && (
          <ul className="w-full divide-y divide-[#2a2a2a]">
            {tasks
              .filter(task => activeTab === 'incomplete' ? !task.completed : task.completed)
              .map(task => (
                <li key={task.id} className="py-2">
                  <div className="flex items-center">
                    <input 
                      type="checkbox" 
                      checked={task.completed}
                      className="mr-2"
                      readOnly
                    />
                    <span className={task.completed ? 'line-through text-[#9ca3af]' : ''}>{task.title}</span>
                  </div>
                </li>
              ))
            }
          </ul>
        )}
      </div>
    </div>
  );
};

export default DailyPlanner;
