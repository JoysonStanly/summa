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
  return (
    <div className="bg-[#1a1a1a] rounded-xl p-4 shadow-lg hover:shadow-xl transition-shadow duration-300 border border-[#2a2a2a]">
      {/* HEADER */}
      <h3 className="mb-4 text-sm font-semibold">DSA Progress</h3>

      {/* CONTENT */}
      <div className="flex flex-col items-center">
        <div className="relative w-40 h-40 mb-6">
          <svg className="w-full h-full" viewBox="0 0 100 100">
            <g transform="rotate(-90 50 50)">
              {/* TRACK */}
              <circle
                strokeWidth="2"
                cx="50"
                cy="50"
                r="36"
                fill="transparent"
                stroke="#333"
                opacity="0.3"
              />

              {/* EASY */}
              <g className="cursor-pointer" opacity="1">
                <path
                  d="M 81.4119 63.0112 A 34 34 0 0 0 54.4379 16.2909"
                  stroke="transparent"
                  strokeWidth="26"
                  strokeLinecap="round"
                  fill="none"
                  pointerEvents="stroke"
                />
                <path
                  d="M 81.4119 63.0112 A 34 34 0 0 0 54.4379 16.2909"
                  stroke="#10B981"
                  strokeLinecap="round"
                  fill="none"
                  strokeWidth="6"
                  opacity="0.2"
                />
                <path
                  d="M 77.8869 27.2334 A 36 36 0 0 0 53.763 14.1972"
                  stroke="#10B981"
                  strokeLinecap="round"
                  fill="none"
                  strokeWidth="2"
                  filter="drop-shadow(0 0 6px #10B981)"
                />
              </g>

              {/* MEDIUM */}
              <g className="cursor-pointer" opacity="1">
                <path
                  d="M 23.026 70.6979 A 34 34 0 0 0 76.974 70.6979"
                  stroke="transparent"
                  strokeWidth="26"
                  strokeLinecap="round"
                  fill="none"
                  pointerEvents="stroke"
                />
                <path
                  d="M 23.026 70.6979 A 34 34 0 0 0 76.974 70.6979"
                  stroke="#FCD34D"
                  strokeLinecap="round"
                  fill="none"
                  strokeWidth="6"
                  opacity="0.2"
                />
                <path
                  d="M 69.0344 80.5563 A 36 36 0 0 0 79.1246 71.1603"
                  stroke="#FCD34D"
                  strokeLinecap="round"
                  fill="none"
                  strokeWidth="2"
                  filter="drop-shadow(0 0 6px #FCD34D)"
                />
              </g>

              {/* HARD */}
              <g className="cursor-pointer" opacity="1">
                <path
                  d="M 45.5621 16.2909 A 34 34 0 0 0 18.5881 63.0112"
                  stroke="transparent"
                  strokeWidth="26"
                  strokeLinecap="round"
                  fill="none"
                  pointerEvents="stroke"
                />
                <path
                  d="M 45.5621 16.2909 A 34 34 0 0 0 18.5881 63.0112"
                  stroke="#EF4444"
                  strokeLinecap="round"
                  fill="none"
                  strokeWidth="6"
                  opacity="0.2"
                />
                <path
                  d="M 14.4364 55.5883 A 36 36 0 0 0 17.1124 64.6425"
                  stroke="#EF4444"
                  strokeLinecap="round"
                  fill="none"
                  strokeWidth="2"
                  filter="drop-shadow(0 0 6px #EF4444)"
                />
              </g>
            </g>
          </svg>

          {/* CENTER TEXT */}
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <div className="text-center">
              <span
                className="text-xl font-bold"
                style={{
                  fontVariantNumeric: "tabular-nums",
                }}
              >
                {stats.totalSolved}
              </span>
            </div>

            <div className="pt-1 mt-1 text-xs text-gray-400 border-t border-gray-600">
              {stats.totalProblems}
            </div>
          </div>
        </div>

        {/* LEGEND */}
        <div className="flex items-center justify-center w-full gap-6">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 bg-green-500 rounded-full" />
            <span className="text-xs text-gray-300">Easy</span>
            <span className="text-xs font-medium">{stats.easy.solved}/{stats.easy.total}</span>
          </div>

          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 bg-yellow-400 rounded-full" />
            <span className="text-xs text-gray-300">Medium</span>
            <span className="text-xs font-medium">{stats.medium.solved}/{stats.medium.total}</span>
          </div>

          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 bg-red-500 rounded-full" />
            <span className="text-xs text-gray-300">Hard</span>
            <span className="text-xs font-medium">{stats.hard.solved}/{stats.hard.total}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DSAProgress;
