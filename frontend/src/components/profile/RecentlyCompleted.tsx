import React from 'react';

interface CompletedProblem {
  name: string;
  topic: string;
  date: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
}

interface RecentlyCompletedProps {
  problems: CompletedProblem[];
}

const RecentlyCompleted: React.FC<RecentlyCompletedProps> = ({ problems }) => {
  // Get difficulty badge color
  const getDifficultyBadge = (difficulty: 'Easy' | 'Medium' | 'Hard') => {
    switch (difficulty) {
      case 'Easy':
        return 'bg-green-600';
      case 'Medium':
        return 'bg-yellow-500';
      case 'Hard':
        return 'bg-red-500';
      default:
        return 'bg-gray-500';
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-base font-semibold">Recently Completed</h2>
        <a href="#" className="text-orange-500 text-xs hover:text-orange-400 hover:underline transition-colors duration-200">
          View All Completions
        </a>
      </div>
      
      {/* Problems table */}
      <div className="overflow-hidden rounded-lg border border-[#2a2a2a]">
        <table className="w-full">
          <thead className="bg-[#0f0f0f] border-b border-[#2a2a2a]">
            <tr>
              <th className="text-left py-2 px-3 text-xs font-semibold">Problem</th>
              <th className="text-left py-2 px-3 text-xs font-semibold">Topic</th>
              <th className="text-left py-2 px-3 text-xs font-semibold">Date</th>
              <th className="text-left py-2 px-3 text-xs font-semibold">Difficulty</th>
              <th className="text-right py-2 px-3"></th>
            </tr>
          </thead>
          <tbody>
            {problems.map((problem, index) => (
              <tr key={index} className="border-b border-[#2a2a2a] hover:bg-[#1f1f1f] transition-colors duration-200 group">
                <td className="py-2 px-3 text-xs font-medium group-hover:text-white transition-colors">{problem.name}</td>
                <td className="py-2 px-3 text-xs text-gray-400">{problem.topic}</td>
                <td className="py-2 px-3 text-xs text-gray-400">{problem.date}</td>
                <td className="py-2 px-3">
                  <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${getDifficultyBadge(problem.difficulty)}`}>
                    {problem.difficulty}
                  </span>
                </td>
                <td className="py-3 px-3 text-right">
                  <a href="#" className="text-blue-400 text-sm hover:text-blue-300 hover:underline transition-colors duration-200">
                    View details
                  </a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default RecentlyCompleted;
