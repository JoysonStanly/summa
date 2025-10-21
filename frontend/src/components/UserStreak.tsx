import { useEffect, useState } from 'react';
import progressService from '../services/progressService';
import type { StreakData } from '../services/progressService';

interface UserStreakProps {
  userId: string;
}

/**
 * User Streak Component
 * Shows the user's current streak and activity calendar
 */
const UserStreak: React.FC<UserStreakProps> = ({ userId }) => {
  const [streakData, setStreakData] = useState<StreakData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStreakData = async () => {
      try {
        setLoading(true);
        const data = await progressService.getUserStreak(userId);
        setStreakData(data);
        setError(null);
      } catch (err) {
        console.error('Failed to fetch streak data:', err);
        setError('Failed to load streak data');
      } finally {
        setLoading(false);
      }
    };

    fetchStreakData();
  }, [userId]);

  if (loading) {
    return <div className="flex justify-center p-6">Loading streak data...</div>;
  }

  if (error) {
    return <div className="text-red-500 p-4">{error}</div>;
  }

  if (!streakData) {
    return <div className="p-4">No streak data available</div>;
  }

  // Get last 4 weeks of activity
  const today = new Date();
  const fourWeeksAgo = new Date();
  fourWeeksAgo.setDate(today.getDate() - 28);

  // Create a map of dates with activity
  const activityMap = new Map(
    streakData.dailyActivity.map((day) => [day._id, day.count])
  );

  // Generate dates for the last 28 days
  const dates = Array.from({ length: 28 }, (_, i) => {
    const date = new Date();
    date.setDate(today.getDate() - 27 + i);
    return date.toISOString().split('T')[0]; // YYYY-MM-DD format
  });

  return (
    <div className="bg-white shadow-md rounded-lg p-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-semibold">Activity Streak</h3>
        <div className="flex items-center">
          <span className="text-2xl font-bold">{streakData.currentStreak}</span>
          <span className="text-gray-500 ml-2">day{streakData.currentStreak !== 1 ? 's' : ''}</span>
        </div>
      </div>

      {/* Streak Stats */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-blue-50 p-3 rounded-md">
          <p className="text-sm text-gray-600">Current Streak</p>
          <p className="text-xl font-bold">{streakData.currentStreak} day{streakData.currentStreak !== 1 ? 's' : ''}</p>
        </div>
        
        <div className="bg-green-50 p-3 rounded-md">
          <p className="text-sm text-gray-600">Best Streak</p>
          <p className="text-xl font-bold">{streakData.maxStreak} day{streakData.maxStreak !== 1 ? 's' : ''}</p>
        </div>
      </div>

      {/* Activity Calendar */}
      <div className="mb-2">
        <h4 className="text-sm font-medium text-gray-700 mb-2">Last 4 Weeks</h4>
        <div className="grid grid-cols-7 gap-1">
          {dates.map((date) => {
            const count = activityMap.get(date) || 0;
            let bgColor = 'bg-gray-100';
            
            if (count > 0) {
              if (count >= 10) bgColor = 'bg-green-500';
              else if (count >= 5) bgColor = 'bg-green-400';
              else if (count >= 3) bgColor = 'bg-green-300';
              else bgColor = 'bg-green-200';
            }
            
            return (
              <div
                key={date}
                className={`${bgColor} h-6 rounded-sm`}
                title={`${date}: ${count} activities`}
              />
            );
          })}
        </div>
      </div>

      <div className="flex justify-between text-xs text-gray-500 px-1">
        <span>{fourWeeksAgo.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
        <span>{today.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
      </div>
    </div>
  );
};

export default UserStreak;