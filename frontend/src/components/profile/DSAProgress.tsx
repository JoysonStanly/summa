interface DSAStats {
  totalSolved: number;
  totalProblems: number;
  easy: {
    solved: number;
    total: number;
  };
  medium: {
    solved: number;
    total: number;
  };
  hard: {
    solved: number;
    total: number;
  };
}

interface DSAProgressProps {
  stats: DSAStats;
}

const DSAProgress: React.FC<DSAProgressProps> = ({ stats }) => {
  // Calculate the percentage for the progress circle
  const percentage = Math.round((stats.totalSolved / stats.totalProblems) * 100);
  
  // Calculate the circle's circumference and offset
  const radius = 70;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (percentage / 100) * circumference;
  
  return (
    <div className="bg-[#1a1a1a] rounded-lg p-6">
      <h2 className="text-lg font-medium mb-4">DSA Progress</h2>
      
      {/* Progress circle */}
      <div className="flex items-center justify-center mb-6">
        <div className="relative w-48 h-48">
          {/* Background circle */}
          <svg className="w-full h-full" viewBox="0 0 180 180">
            <circle
              cx="90"
              cy="90"
              r={radius}
              fill="none"
              stroke="#333"
              strokeWidth="10"
            />
            {/* Progress circle */}
            <circle
              cx="90"
              cy="90"
              r={radius}
              fill="none"
              stroke="url(#circleGradient)"
              strokeWidth="10"
              strokeDasharray={circumference}
              strokeDashoffset={offset}
              strokeLinecap="round"
              transform="rotate(-90 90 90)"
            />
            {/* Gradient definition */}
            <defs>
              <linearGradient id="circleGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#22c55e" />
                <stop offset="100%" stopColor="#4ade80" />
              </linearGradient>
            </defs>
          </svg>
          
          {/* Center text */}
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-3xl font-bold">{stats.totalSolved}</span>
            <span className="text-gray-500 text-xs">/{stats.totalProblems}</span>
            <span className="text-xs text-gray-400 mt-1">Solved</span>
          </div>
        </div>
      </div>
      
      {/* Difficulty breakdown */}
      <div className="grid grid-cols-3 gap-4">
        {/* Easy */}
        <div className="text-center">
          <div className="flex justify-center items-center mb-1">
            <div className="w-3 h-3 rounded-full bg-green-500 mr-2"></div>
            <span className="text-sm">Easy</span>
          </div>
          <div className="text-xl font-medium">{stats.easy.solved}</div>
          <div className="text-xs text-gray-400">/{stats.easy.total}</div>
        </div>
        
        {/* Medium */}
        <div className="text-center">
          <div className="flex justify-center items-center mb-1">
            <div className="w-3 h-3 rounded-full bg-yellow-500 mr-2"></div>
            <span className="text-sm">Medium</span>
          </div>
          <div className="text-xl font-medium">{stats.medium.solved}</div>
          <div className="text-xs text-gray-400">/{stats.medium.total}</div>
        </div>
        
        {/* Hard */}
        <div className="text-center">
          <div className="flex justify-center items-center mb-1">
            <div className="w-3 h-3 rounded-full bg-red-500 mr-2"></div>
            <span className="text-sm">Hard</span>
          </div>
          <div className="text-xl font-medium">{stats.hard.solved}</div>
          <div className="text-xs text-gray-400">/{stats.hard.total}</div>
        </div>
      </div>
    </div>
  );
};

export default DSAProgress;
