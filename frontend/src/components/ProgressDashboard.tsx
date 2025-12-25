import { useEffect, useState } from 'react';
import ProgressChart from './ProgressChart';
import UserStreak from './UserStreak';
import moduleService from '../services/moduleService';
import type { Module } from '../services/moduleService';

interface ProgressDashboardProps {
  userId: string;
}

/**
 * Progress Dashboard
 * A comprehensive view of user progress and activity
 */
const ProgressDashboard: React.FC<ProgressDashboardProps> = ({ userId }) => {
  const [activeTab, setActiveTab] = useState<'overall' | 'modules'>('overall');
  const [selectedModuleId, setSelectedModuleId] = useState<string | null>(null);
  const [modules, setModules] = useState<Module[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Fetch modules for the filter
    const fetchModules = async () => {
      try {
        setLoading(true);
        const data = await moduleService.getAllModules();
        setModules(data || []);
      } catch (error) {
        console.error('Failed to fetch modules:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchModules();
  }, []);

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-bold mb-6">Your Learning Progress</h2>

      {/* Progress Tabs */}
      <div className="border-b border-gray-200 mb-6">
        <ul className="flex -mb-px">
          <li className="mr-2">
            <button
              className={`inline-block py-2 px-4 ${
                activeTab === 'overall'
                  ? 'text-blue-600 border-b-2 border-blue-600 font-medium'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
              onClick={() => {
                setActiveTab('overall');
                setSelectedModuleId(null);
              }}
            >
              Overall Progress
            </button>
          </li>
          <li className="mr-2">
            <button
              className={`inline-block py-2 px-4 ${
                activeTab === 'modules'
                  ? 'text-blue-600 border-b-2 border-blue-600 font-medium'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
              onClick={() => setActiveTab('modules')}
            >
              Progress by Module
            </button>
          </li>
        </ul>
      </div>

      {/* Module Selector (visible only when modules tab is active) */}
      {activeTab === 'modules' && (
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Select Module
          </label>
          <select
            className="block w-full bg-white border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            value={selectedModuleId || ''}
            onChange={(e) => setSelectedModuleId(e.target.value)}
            disabled={loading}
          >
            <option value="">Select a module...</option>
            {modules.map((module) => (
              <option key={module._id} value={module._id}>
                {module.title}
              </option>
            ))}
          </select>
        </div>
      )}

      {/* Progress Visualization */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Progress Chart (spans 2 columns on md screens) */}
        <div className="md:col-span-2">
          <ProgressChart 
            userId={userId} 
            moduleId={activeTab === 'modules' ? selectedModuleId || undefined : undefined} 
          />
        </div>
        
        {/* Streak Component */}
        <div>
          <UserStreak userId={userId} />
        </div>
      </div>
    </div>
  );
};

export default ProgressDashboard;