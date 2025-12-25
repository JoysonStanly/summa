import { useEffect, useState } from 'react';
import progressService from '../services/progressService';
import type { ProgressStats } from '../services/progressService';

interface ProgressChartProps {
  userId: string;
  moduleId?: string;
  topicId?: string;
}

/**
 * Progress visualization component
 * Shows progress statistics and a visual representation of completion status
 */
const ProgressChart: React.FC<ProgressChartProps> = ({ userId, moduleId, topicId }) => {
  const [stats, setStats] = useState<ProgressStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProgress = async () => {
      try {
        setLoading(true);
        let data;

        if (topicId) {
          // Get topic progress
          data = await progressService.getTopicProgress(userId, topicId);
        } else if (moduleId) {
          // Get module progress
          data = await progressService.getModuleProgress(userId, moduleId);
        } else {
          // Get overall progress
          data = await progressService.getUserProgress(userId);
        }

        setStats(data.stats);
        setError(null);
      } catch (err) {
        console.error('Failed to fetch progress data:', err);
        setError('Failed to load progress data');
      } finally {
        setLoading(false);
      }
    };

    fetchProgress();
  }, [userId, moduleId, topicId]);

  if (loading) {
    return <div className="flex justify-center p-6">Loading progress data...</div>;
  }

  if (error) {
    return <div className="text-red-500 p-4">{error}</div>;
  }

  if (!stats) {
    return <div className="p-4">No progress data available</div>;
  }

  // Format completion rate to 1 decimal place
  const formattedCompletionRate = stats.completionRate.toFixed(1);

  return (
    <div className="bg-white shadow-md rounded-lg p-6">
      <h3 className="text-xl font-semibold mb-4">Your Progress</h3>
      
      {/* Progress Bar */}
      <div className="w-full bg-gray-200 rounded-full h-4 mb-6">
        <div 
          className="bg-green-500 h-4 rounded-full transition-all duration-500 ease-out"
          style={{ width: `${Math.min(stats.completionRate, 100)}%` }}
        ></div>
      </div>
      
      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        <div className="bg-blue-50 p-3 rounded-md">
          <p className="text-sm text-gray-600">Completion</p>
          <p className="text-xl font-bold">{formattedCompletionRate}%</p>
        </div>
        
        <div className="bg-green-50 p-3 rounded-md">
          <p className="text-sm text-gray-600">Completed</p>
          <p className="text-xl font-bold">{stats.completedProblems}</p>
        </div>
        
        <div className="bg-yellow-50 p-3 rounded-md">
          <p className="text-sm text-gray-600">Attempted</p>
          <p className="text-xl font-bold">{stats.attemptedProblems}</p>
        </div>
        
        <div className="bg-purple-50 p-3 rounded-md">
          <p className="text-sm text-gray-600">Total Problems</p>
          <p className="text-xl font-bold">{stats.totalProblems}</p>
        </div>
      </div>
    </div>
  );
};

export default ProgressChart;