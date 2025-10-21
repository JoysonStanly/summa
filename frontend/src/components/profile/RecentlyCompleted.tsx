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
        <h2 className="text-lg font-medium">Recently Completed</h2>
        <a href="#" className="text-orange-500 text-sm hover:underline">
          View All Completions
        </a>
      </div>
      
      {/* Problems table */}
      <table className="w-full">
        <thead className="border-b border-[#333]">
          <tr>
            <th className="text-left py-2 px-2 text-sm font-medium">Problem</th>
            <th className="text-left py-2 px-2 text-sm font-medium">Topic</th>
            <th className="text-left py-2 px-2 text-sm font-medium">Date</th>
            <th className="text-left py-2 px-2 text-sm font-medium">Difficulty</th>
            <th className="text-right py-2 px-2"></th>
          </tr>
        </thead>
        <tbody>
          {problems.map((problem, index) => (
            <tr key={index} className="border-b border-[#333]">
              <td className="py-2 px-2 text-sm">{problem.name}</td>
              <td className="py-2 px-2 text-sm">{problem.topic}</td>
              <td className="py-2 px-2 text-sm">{problem.date}</td>
              <td className="py-2 px-2">
                <span className={`inline-flex items-center rounded-full px-2 py-1 text-xs ${getDifficultyBadge(problem.difficulty)}`}>
                  {problem.difficulty}
                </span>
              </td>
              <td className="py-2 px-2 text-right">
                <a href="#" className="text-blue-400 text-xs hover:underline">
                  View details
                </a>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default RecentlyCompleted;
