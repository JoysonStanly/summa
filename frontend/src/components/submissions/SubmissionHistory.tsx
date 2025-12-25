import { useState, useEffect } from 'react';
import submissionService from '../../services/submissionService';
import type { Submission, SubmissionStatus } from '../../services/submissionService';

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
    <div className="bg-[#1e1e1e] rounded-lg p-4">
      <h3 className="text-xl font-bold mb-4">Submission History</h3>
      
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-700">
          <thead className="bg-[#2d2d2d]">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                Status
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                Language
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                Runtime
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                Memory
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                Submitted
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                Action
              </th>
            </tr>
          </thead>
          <tbody className="bg-[#1e1e1e] divide-y divide-gray-700">
            {submissions.map((submission) => (
              <tr key={submission._id} className="hover:bg-[#2a2a2a]">
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`${getStatusColor(submission.result)}`}>
                    {submission.result.charAt(0).toUpperCase() + submission.result.slice(1)}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {submission.language}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {submission.timeTaken} ms
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {submission.memory} KB
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {formatDate(submission.createdAt)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  {onViewSubmission && (
                    <button
                      onClick={() => onViewSubmission(submission._id)}
                      className="text-blue-500 hover:text-blue-400"
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
  );
};

export { SubmissionHistory };