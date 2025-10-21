import { useState } from 'react';
import { Eye } from 'lucide-react';

// Define the types for our submission data
interface Submission {
  id: string;
  status: 'Accepted' | 'Wrong Answer';
  language: string;
  timestamp: string;
  hasAnalysis: boolean;
}

// Mock data for submissions
const mockSubmissions: Submission[] = [
  { id: '1', status: 'Accepted', language: 'Java', timestamp: 'Aug 29, 2025', hasAnalysis: true },
  { id: '2', status: 'Wrong Answer', language: 'Java', timestamp: 'Aug 29, 2025', hasAnalysis: false },
  { id: '3', status: 'Wrong Answer', language: 'Java', timestamp: 'Aug 29, 2025', hasAnalysis: false },
  { id: '4', status: 'Accepted', language: 'Java', timestamp: 'Aug 28, 2025', hasAnalysis: true },
  { id: '5', status: 'Accepted', language: 'Java', timestamp: 'Aug 28, 2025', hasAnalysis: true },
  { id: '6', status: 'Accepted', language: 'Java', timestamp: 'Jul 19, 2025', hasAnalysis: true },
  { id: '7', status: 'Wrong Answer', language: 'Java', timestamp: 'Jul 19, 2025', hasAnalysis: false },
  { id: '8', status: 'Wrong Answer', language: 'Java', timestamp: 'Jul 19, 2025', hasAnalysis: false },
  { id: '9', status: 'Accepted', language: 'Java', timestamp: 'Jul 12, 2025', hasAnalysis: true },
  { id: '10', status: 'Wrong Answer', language: 'Java', timestamp: 'Jul 12, 2025', hasAnalysis: false },
];

const Submissions = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const submissionsPerPage = 10;
  
  // Calculate submissions for current page
  const indexOfLastSubmission = currentPage * submissionsPerPage;
  const indexOfFirstSubmission = indexOfLastSubmission - submissionsPerPage;
  const currentSubmissions = mockSubmissions.slice(indexOfFirstSubmission, indexOfLastSubmission);
  
  // Calculate total pages
  const totalPages = Math.ceil(mockSubmissions.length / submissionsPerPage);
  
  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };
  
  // Function to handle viewing code
  const handleViewCode = (id: string) => {
    console.log(`Viewing code for submission ${id}`);
  };
  
  // Function to handle viewing analysis
  const handleViewAnalysis = (id: string) => {
    console.log(`Viewing analysis for submission ${id}`);
  };
  
  return (
    <div className="w-full">
      <h2 className="text-xl font-bold mb-4 text-white">My submissions</h2>
      
      {/* Submissions Table */}
      <div className="overflow-x-auto bg-[#0D0D0D] rounded-lg border border-[#1a1a1a]">
        <table className="w-full border-collapse">
          <thead>
            <tr className="text-left border-b border-[#2a2a2a]">
              <th className="py-3 px-4 text-gray-400 font-medium text-sm">Status</th>
              <th className="py-3 px-4 text-gray-400 font-medium text-sm">Language</th>
              <th className="py-3 px-4 text-gray-400 font-medium text-sm">Code</th>
              <th className="py-3 px-4 text-gray-400 font-medium text-sm">Advance Analysis</th>
            </tr>
          </thead>
          <tbody>
            {currentSubmissions.map((submission) => (
              <tr key={submission.id} className="border-b border-[#1a1a1a]">
                <td className="py-3 px-4">
                  <div className="flex flex-col">
                    <span 
                      className={`${
                        submission.status === 'Accepted' 
                          ? 'text-[#00C853]' 
                          : 'text-[#FF1744]'
                      } font-medium`}
                    >
                      {submission.status}
                    </span>
                    <span className="text-xs text-gray-500 mt-1">{submission.timestamp}</span>
                  </div>
                </td>
                <td className="py-3 px-4">
                  <span className="px-3 py-1 rounded-full bg-[#1a1a1a] text-gray-300 text-sm inline-block">
                    {submission.language}
                  </span>
                </td>
                <td className="py-3 px-4">
                  <button 
                    onClick={() => handleViewCode(submission.id)}
                    className="text-gray-400 hover:text-white"
                    title="View code"
                  >
                    <Eye size={18} />
                  </button>
                </td>
                <td className="py-3 px-4">
                  {submission.hasAnalysis ? (
                    <button 
                      onClick={() => handleViewAnalysis(submission.id)}
                      className="text-blue-500 hover:underline font-medium"
                    >
                      View
                    </button>
                  ) : (
                    <span className="text-gray-600">–</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center mt-6">
          <div className="inline-flex bg-[#1a1a1a] rounded-full p-1">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => handlePageChange(page)}
                className={`w-8 h-8 flex items-center justify-center rounded-full text-sm mx-1 ${
                  currentPage === page
                    ? 'bg-[#FF6D00] text-white font-medium'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                {page}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Submissions;
