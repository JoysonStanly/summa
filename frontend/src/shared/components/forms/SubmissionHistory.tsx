import { useState, useEffect } from 'react';
import submissionService from '@features/problems/services/submissionService';
import type { Submission, SubmissionStatus } from '@features/problems/services/submissionService';

interface SubmissionHistoryProps {
  problemId: string;
  userId: string;
  onViewSubmission?: (submissionId: string) => void;
}

const SubmissionHistory: React.FC<SubmissionHistoryProps> = ({
  problemId,
  userId,
  onViewSubmission,
}) => {
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSubmissions = async () => {
      try {
        setLoading(true);
        const data = await submissionService.getSubmissionsByProblem(problemId);
        // Filter by user if userId is provided
        const userSubmissions = userId 
          ? data.filter((sub: Submission) => sub.userId === userId)
          : data;
        setSubmissions(userSubmissions);
      } catch (err) {
        console.error('Error fetching submissions:', err);
        setError('Failed to load submission history');
      } finally {
        setLoading(false);
      }
    };

    fetchSubmissions();
  }, [problemId, userId]);

  // Function to format date
  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
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

  if (loading) {
    return <div className="text-center py-4">Loading submissions...</div>;
  }

  if (error) {
    return <div className="text-red-500 text-center py-4">{error}</div>;
  }

  if (submissions.length === 0) {
    return <div className="text-center py-4">No submissions yet</div>;
  }

  return (
    <div className="bg-[#1e1e1e] rounded-lg p-3 sm:p-4">
      <style>{`
        .submission-scroll-container {
          position: relative;
          width: 100%;
        }
        
        .submission-scroll-wrapper {
          overflow-x: auto;
          overflow-y: visible;
          -webkit-overflow-scrolling: touch;
          scrollbar-width: thin;
          scrollbar-color: #9ca3af #2d2d2d;
        }
        
        .submission-scroll-wrapper::-webkit-scrollbar {
          height: 12px;
        }
        
        .submission-scroll-wrapper::-webkit-scrollbar-track {
          background: #2d2d2d;
          border-radius: 6px;
        }
        
        .submission-scroll-wrapper::-webkit-scrollbar-thumb {
          background: #9ca3af;
          border-radius: 6px;
          border: 2px solid #2d2d2d;
        }
        
        .submission-scroll-wrapper::-webkit-scrollbar-thumb:hover {
          background: #d1d5db;
        }
        
        .submission-table {
          min-width: 900px;
          width: max-content;
        }
      `}</style>
      
      <h3 className="text-lg sm:text-xl font-bold mb-3 sm:mb-4">Submission History</h3>
      
      {/* Scroll Indicator for Mobile */}
      <div className="md:hidden mb-2 px-3 py-2 bg-[#2d2d2d] rounded-md text-center">
        <p className="text-xs text-gray-300">
          👆 Scroll left and right to see all columns
        </p>
      </div>
      
      {/* Scrollable Table Container */}
      <div className="submission-scroll-container">
        <div className="submission-scroll-wrapper border border-gray-700 rounded-lg">
          <table className="submission-table w-full divide-y divide-gray-700">
            <thead className="bg-[#2d2d2d]">
              <tr>
                <th scope="col" className="px-3 sm:px-4 lg:px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider whitespace-nowrap">
                  Status
                </th>
                <th scope="col" className="px-3 sm:px-4 lg:px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider whitespace-nowrap">
                  Language
                </th>
                <th scope="col" className="px-3 sm:px-4 lg:px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider whitespace-nowrap">
                  Runtime
                </th>
                <th scope="col" className="px-3 sm:px-4 lg:px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider whitespace-nowrap">
                  Memory
                </th>
                <th scope="col" className="px-3 sm:px-4 lg:px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider whitespace-nowrap">
                  Submitted
                </th>
                <th scope="col" className="px-3 sm:px-4 lg:px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider whitespace-nowrap">
                  Action
                </th>
              </tr>
            </thead>
            <tbody className="bg-[#1e1e1e] divide-y divide-gray-700">
              {submissions.map((submission) => (
                <tr key={submission._id} className="hover:bg-[#2a2a2a]">
                  <td className="px-3 sm:px-4 lg:px-6 py-3 lg:py-4 whitespace-nowrap text-xs sm:text-sm">
                    <span className={`${getStatusColor(submission.result)}`}>
                      {submission.result.charAt(0).toUpperCase() + submission.result.slice(1)}
                    </span>
                  </td>
                  <td className="px-3 sm:px-4 lg:px-6 py-3 lg:py-4 whitespace-nowrap text-xs sm:text-sm">
                    {submission.language}
                  </td>
                  <td className="px-3 sm:px-4 lg:px-6 py-3 lg:py-4 whitespace-nowrap text-xs sm:text-sm">
                    {submission.timeTaken} ms
                  </td>
                  <td className="px-3 sm:px-4 lg:px-6 py-3 lg:py-4 whitespace-nowrap text-xs sm:text-sm">
                    {submission.memory} KB
                  </td>
                  <td className="px-3 sm:px-4 lg:px-6 py-3 lg:py-4 whitespace-nowrap text-xs sm:text-sm">
                    {formatDate(submission.createdAt)}
                  </td>
                  <td className="px-3 sm:px-4 lg:px-6 py-3 lg:py-4 whitespace-nowrap text-xs sm:text-sm">
                    {onViewSubmission && (
                      <button
                        onClick={() => onViewSubmission(submission._id)}
                        className="text-blue-500 hover:text-blue-400 font-medium"
                      >
                        View
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export { SubmissionHistory };
export default SubmissionHistory;