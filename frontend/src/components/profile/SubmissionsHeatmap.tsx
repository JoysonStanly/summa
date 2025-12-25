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
  const monthsData = [
    { name: 'Jan', span: 6, days: 31 },
    { name: 'Feb', span: 5, days: 28 },
    { name: 'Mar', span: 5, days: 31 },
    { name: 'Apr', span: 5, days: 30 },
    { name: 'May', span: 6, days: 31 },
    { name: 'Jun', span: 5, days: 30 },
    { name: 'Jul', span: 5, days: 31 },
    { name: 'Aug', span: 5, days: 31 },
    { name: 'Sep', span: 5, days: 30 },
    { name: 'Oct', span: 6, days: 31 },
    { name: 'Nov', span: 5, days: 30 },
    { name: 'Dec', span: 5, days: 31 },
  ];

  // Generate all day cells
  const generateDayCells = () => {
    const cells: React.ReactNode[] = [];
    let startOfWeek = 5; // Jan 1, 2025 is Wednesday
    
    // Add empty cells at the beginning
    for (let i = 0; i < startOfWeek; i++) {
      cells.push(<div key={`empty-start-${i}`} />);
    }
    
    // Add cells for each month
    monthsData.forEach((monthInfo, monthIdx) => {
      const monthNum = String(monthIdx + 1).padStart(2, '0');
      
      for (let day = 1; day <= monthInfo.days; day++) {
        const dayStr = String(day).padStart(2, '0');
        const dateKey = `${monthInfo.name}-${day}`;
        const count = activityData[dateKey] || 0;
        
        let bgColorClass = 'bg-[#2a2a2a]'; // Not visited
        if (count >= 3) {
          bgColorClass = 'bg-green-600'; // Dark green for high activity
        } else if (count > 0) {
          bgColorClass = 'bg-green-400'; // Light green for low activity
        }
        
        cells.push(
          <div
            key={`${dayStr}-${monthNum}-${year}`}
            className={`${bgColorClass} rounded-sm hover:opacity-80 transition-opacity cursor-pointer`}
            style={{
              aspectRatio: '1',
              width: '100%',
            }}
            aria-label={`${dayStr}-${monthNum}-${year}: ${count} submissions`}
            title={`${dayStr}-${monthNum}-${year}: ${count} submissions`}
          />
        );
      }
      
      // Add spacer between months (except after the last month)
      if (monthIdx < monthsData.length - 1) {
        for (let i = 0; i < 7; i++) {
          cells.push(<div key={`spacer-${monthIdx}-${i}`} />);
        }
      }
    });
    
    return cells;
  };

  return (
    <div className="bg-[#1a1a1a] rounded-xl p-4 shadow-lg hover:shadow-xl transition-shadow duration-300 border border-[#2a2a2a]">
      <div className="w-full">
        {/* HEADER */}
        <div className="mb-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm">
              <span className="text-white font-bold">{submissions}</span>{' '}
              submissions in the year
            </h3>

            {/* YEAR SELECTOR */}
            <div className="relative">
              <button
                className="flex items-center gap-1 px-3 py-1.5 bg-[#2a2a2a] hover:bg-[#333] rounded-lg text-sm transition-colors"
                aria-label="Select year"
                aria-expanded="false"
              >
                {year}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="opacity-70"
                  aria-hidden="true"
                >
                  <path d="m6 9 6 6 6-6" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* HEATMAP */}
        <div className="overflow-x-auto mb-4">
          <div className="min-w-max">
            {/* MONTH HEADERS */}
            <div
              className="grid mb-1.5 text-[11px] text-gray-400 font-medium"
              style={{
                gridAutoFlow: 'column',
                gridAutoColumns: 'clamp(12px, calc((100% - 1rem - 126px) / 64), 16px)',
                gap: '2px',
              }}
            >
              {monthsData.map((month, idx) => {
                if (idx === 7) {
                  return (
                    <React.Fragment key={idx}>
                      <div className="text-center" style={{ gridColumn: `span ${month.span}` }}>
                        {month.name}
                      </div>
                      <div />
                    </React.Fragment>
                  );
                }
                return (
                  <div key={idx} className="text-center" style={{ gridColumn: `span ${month.span}` }}>
                    {month.name}
                  </div>
                );
              })}
            </div>

            {/* GRID */}
            <div
              className="grid"
              style={{
                gridTemplateRows: 'repeat(7, auto)',
                gridAutoFlow: 'column',
                gridAutoColumns: 'clamp(12px, calc((100% - 1rem - 126px) / 64), 16px)',
                gap: '2px',
              }}
            >
              {generateDayCells()}
            </div>
          </div>
        </div>

        {/* FOOTER */}
        <div className="flex items-center justify-between pt-3 border-t border-[#2a2a2a]">
          <div className="flex items-center gap-4">
            <div className="text-xs text-gray-400">
              <span>
                Active Days -{' '}
                <span className="text-white font-semibold">{activeCount}</span>
              </span>
            </div>
            <span className="w-px h-4 bg-[#2a2a2a]" />
            <div className="text-xs text-gray-400">
              <span>
                Max Streak -{' '}
                <span className="text-white font-semibold">{maxStreak}</span>
              </span>
            </div>
          </div>

          <div className="flex items-center gap-4 text-xs">
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-3 rounded-sm bg-[#2a2a2a]" />
              <span className="text-gray-400">Not visited yet</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-3 rounded-sm bg-green-500" />
              <span className="text-gray-400">Achieved</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SubmissionsHeatmap;
