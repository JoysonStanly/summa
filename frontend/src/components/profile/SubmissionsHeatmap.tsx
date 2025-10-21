import React from 'react';

interface SubmissionsHeatmapProps {
  submissions: number;
  year: number;
  activityData: Record<string, number>;
  activeCount: number;
  maxStreak: number;
}

const SubmissionsHeatmap: React.FC<SubmissionsHeatmapProps> = ({
  submissions,
  year,
  activityData,
  activeCount,
  maxStreak
}) => {
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  
  // Generate a grid of cells for the heatmap
  const renderHeatmap = () => {
    // Create an array to hold all days
    const heatmapCells: React.ReactNode[] = [];
    
    // For each month
    months.forEach(month => {
      // For each day in month (simplified to 30 days)
      for (let day = 1; day <= 30; day++) {
        const date = `${month}-${day}`;
        const count = activityData[date] || 0;
        
        // Determine color based on activity count
        let bgColor = 'bg-[#222]';
        if (count > 0) {
          if (count >= 4) bgColor = 'bg-green-600';
          else if (count >= 3) bgColor = 'bg-green-500';
          else if (count >= 2) bgColor = 'bg-green-400/80';
          else bgColor = 'bg-green-400/60';
        }
        
        heatmapCells.push(
          <div
            key={date}
            className={`w-3 h-3 ${bgColor} rounded-sm`}
            title={`${month} ${day}, ${year}: ${count} contributions`}
          />
        );
      }
    });
    
    return heatmapCells;
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center">
          <span className="text-lg font-medium mr-2">{submissions} submissions</span>
          <span className="text-sm text-gray-400">in the year {year} ▼</span>
        </div>
        <div className="text-sm text-gray-400">
          <span className="mr-4">Active Days: {activeCount}</span>
          <span>Max Streak: {maxStreak}</span>
        </div>
      </div>
      
      {/* Month labels */}
      <div className="flex mb-1">
        <div className="w-8"></div> {/* Spacer for alignment */}
        <div className="flex justify-between flex-1">
          {months.map(month => (
            <div key={month} className="text-xs text-gray-500">{month}</div>
          ))}
        </div>
      </div>
      
      {/* Heatmap grid */}
      <div className="flex flex-wrap gap-1">
        {renderHeatmap()}
      </div>
    </div>
  );
};

export default SubmissionsHeatmap;
