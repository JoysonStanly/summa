import React from 'react';
import type { SubmissionResult, SubmissionStatus } from '@features/problems/services/submissionService';

interface SubmissionResultDisplayProps {
  result: SubmissionResult;
}

const SubmissionResultDisplay: React.FC<SubmissionResultDisplayProps> = ({ result }) => {
  // Function to format time display
  const formatTime = (time: number): string => {
    if (time < 1000) {
      return `${time}ms`;
    }
    return `${(time / 1000).toFixed(2)}s`;
  };

  // Function to format memory display
  const formatMemory = (memory: number): string => {
    if (memory < 1024) {
      return `${memory}KB`;
    }
    return `${(memory / 1024).toFixed(2)}MB`;
  };

  // Function to get status color
  const getStatusColor = (status: SubmissionStatus): string => {
    switch (status) {
      case 'accepted':
        return 'text-green-500';
      case 'rejected':
        return 'text-red-500';
      case 'error':
        return 'text-orange-500';
      case 'timeout':
        return 'text-yellow-500';
      default:
        return 'text-gray-500';
    }
  };

  // Function to get status badge
  const getStatusBadge = (status: SubmissionStatus): React.ReactNode => {
    const colorClass = {
      accepted: 'bg-green-100 text-green-800',
      rejected: 'bg-red-100 text-red-800',
      error: 'bg-orange-100 text-orange-800',
      timeout: 'bg-yellow-100 text-yellow-800',
    }[status];

    const statusText = {
      accepted: 'Accepted',
      rejected: 'Wrong Answer',
      error: 'Runtime Error',
      timeout: 'Time Limit Exceeded',
    }[status];

    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${colorClass}`}>
        {statusText}
      </span>
    );
  };

  return (
    <div className="bg-[#1e1e1e] rounded-lg p-3 sm:p-4 md:p-6 my-3 sm:my-4">
      <div className="mb-3 sm:mb-4 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
        <h3 className="text-lg sm:text-xl font-bold">Submission Result</h3>
        <div>{getStatusBadge(result.status)}</div>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:gap-4 mb-4 sm:mb-6">
        <div className="bg-[#2d2d2d] p-2.5 sm:p-3 rounded-md">
          <p className="text-xs sm:text-sm text-gray-400">Execution Time</p>
          <p className="text-base sm:text-lg font-semibold">{formatTime(result.timeTaken)}</p>
        </div>
        <div className="bg-[#2d2d2d] p-2.5 sm:p-3 rounded-md">
          <p className="text-xs sm:text-sm text-gray-400">Memory Usage</p>
          <p className="text-base sm:text-lg font-semibold">{formatMemory(result.memory)}</p>
        </div>
      </div>

      {result.message && (
        <div className={`p-2.5 sm:p-3 mb-3 sm:mb-4 rounded-md ${
          result.status === 'accepted' ? 'bg-green-800 bg-opacity-20' : 'bg-red-800 bg-opacity-20'
        }`}>
          <p className={`text-xs sm:text-sm ${getStatusColor(result.status)}`}>{result.message}</p>
        </div>
      )}

      {result.testResults && result.testResults.length > 0 && (
        <div className="mt-3 sm:mt-4">
          <h4 className="text-base sm:text-lg font-semibold mb-2">Test Results</h4>
          <div className="space-y-2">
            {result.testResults.slice(0, 2).map((test, index) => (
              <div 
                key={index}
                className={`p-2.5 sm:p-3 rounded-md ${
                  test.passed ? 'bg-green-800 bg-opacity-20' : 'bg-red-800 bg-opacity-20'
                }`}
              >
                <div className="flex justify-between mb-1">
                  <span className="text-sm sm:text-base font-medium">Case {index + 1}</span>
                  <span className={`text-sm sm:text-base ${test.passed ? 'text-green-500' : 'text-red-500'}`}>
                    {test.passed ? 'Passed' : 'Failed'}
                  </span>
                </div>
                
                {test.executionTime && (
                  <div className="text-xs sm:text-sm text-gray-400">
                    Execution time: {formatTime(test.executionTime)}
                  </div>
                )}
                
                {test.error && (
                  <div className="text-xs sm:text-sm text-red-400 mt-2 break-words">
                    Error: {test.error}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export { SubmissionResultDisplay };
export default SubmissionResultDisplay;