import { useState } from 'react';
import { Eye, Activity, Trash2, ThumbsUp, ThumbsDown, Bug, StickyNote, ChevronLeft, ChevronRight } from 'lucide-react';

// Define the types for our submission data
interface Submission {
  id: string;
  status: 'Accepted' | 'Wrong Answer' | 'Compilation Error' | 'Runtime Error (NZEC)';
  language: string;
  timestamp: string;
  hasAnalysis: boolean;
}

// Mock data for submissions (19 submissions total to match the HTML example)
const mockSubmissions: Submission[] = [
  { id: '1', status: 'Accepted', language: 'java', timestamp: 'Dec 20, 2025', hasAnalysis: true },
  { id: '2', status: 'Compilation Error', language: 'java', timestamp: 'Dec 15, 2025', hasAnalysis: false },
  { id: '3', status: 'Accepted', language: 'java', timestamp: 'Dec 8, 2025', hasAnalysis: true },
  { id: '4', status: 'Accepted', language: 'java', timestamp: 'Dec 8, 2025', hasAnalysis: true },
  { id: '5', status: 'Runtime Error (NZEC)', language: 'java', timestamp: 'Dec 8, 2025', hasAnalysis: false },
  { id: '6', status: 'Runtime Error (NZEC)', language: 'java', timestamp: 'Dec 8, 2025', hasAnalysis: false },
  { id: '7', status: 'Wrong Answer', language: 'java', timestamp: 'Dec 8, 2025', hasAnalysis: false },
  { id: '8', status: 'Wrong Answer', language: 'java', timestamp: 'Dec 8, 2025', hasAnalysis: false },
  { id: '9', status: 'Accepted', language: 'java', timestamp: 'Sep 5, 2025', hasAnalysis: true },
  { id: '10', status: 'Accepted', language: 'java', timestamp: 'Sep 1, 2025', hasAnalysis: true },
  { id: '11', status: 'Accepted', language: 'java', timestamp: 'Aug 29, 2025', hasAnalysis: true },
  { id: '12', status: 'Wrong Answer', language: 'java', timestamp: 'Aug 29, 2025', hasAnalysis: false },
  { id: '13', status: 'Wrong Answer', language: 'java', timestamp: 'Aug 29, 2025', hasAnalysis: false },
  { id: '14', status: 'Accepted', language: 'java', timestamp: 'Aug 28, 2025', hasAnalysis: true },
  { id: '15', status: 'Accepted', language: 'java', timestamp: 'Aug 28, 2025', hasAnalysis: true },
  { id: '16', status: 'Accepted', language: 'java', timestamp: 'Jul 19, 2025', hasAnalysis: true },
  { id: '17', status: 'Wrong Answer', language: 'java', timestamp: 'Jul 19, 2025', hasAnalysis: false },
  { id: '18', status: 'Wrong Answer', language: 'java', timestamp: 'Jul 19, 2025', hasAnalysis: false },
  { id: '19', status: 'Accepted', language: 'java', timestamp: 'Jul 12, 2025', hasAnalysis: true },
];


const Submissions = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [isLiked, setIsLiked] = useState(false);
  const [isDisliked, setIsDisliked] = useState(false);
  const [autoPlay, setAutoPlay] = useState(true);
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

  // Function to handle delete submission
  const handleDelete = (id: string) => {
    console.log(`Delete submission ${id}`);
  };

  // Get status color
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Accepted':
        return 'text-green-500';
      case 'Wrong Answer':
        return 'text-red-500';
      case 'Compilation Error':
        return 'text-yellow-500';
      case 'Runtime Error (NZEC)':
        return 'text-gray-500';
      default:
        return 'text-gray-400';
    }
  };
  
  return (
    <div className="flex flex-col h-full w-full relative">
      <div className="flex flex-col p-3">
        <div>
          {/* Table container */}
          <div className="rounded-xl border border-zinc-700">
            <div className="relative w-full overflow-x-auto">
              <table className="w-full caption-bottom text-sm">
                <thead className="border-b border-zinc-700">
                  <tr className="hover:bg-zinc-800/50 transition-colors">
                    <th className="h-10 px-2 text-left align-middle whitespace-nowrap w-[60px] text-zinc-400 font-normal">
                      No.
                    </th>
                    <th className="h-10 px-2 text-left align-middle whitespace-nowrap text-zinc-400 font-normal">
                      Status
                    </th>
                    <th className="h-10 px-2 text-left align-middle font-medium whitespace-nowrap text-zinc-400">
                      Language
                    </th>
                    <th className="h-10 px-2 align-middle whitespace-nowrap text-center text-zinc-400 font-normal">
                      Code
                    </th>
                    <th className="h-10 px-2 align-middle whitespace-nowrap text-center text-zinc-400 font-normal">
                      Analysis
                    </th>
                    <th className="h-10 px-2 align-middle whitespace-nowrap text-center text-zinc-400 font-normal">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {currentSubmissions.map((submission, index) => (
                    <tr key={submission.id} className="border-b border-zinc-700">
                      <td className="p-2 align-middle whitespace-nowrap font-medium">
                        {indexOfFirstSubmission + index + 1}
                      </td>
                      <td className="p-2 align-middle whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <span className={`${getStatusColor(submission.status)} font-medium`}>
                            {submission.status}
                          </span>
                        </div>
                        <div className="text-xs text-zinc-500 mt-1">{submission.timestamp}</div>
                      </td>
                      <td className="p-2 align-middle whitespace-nowrap">
                        <span className="inline-flex items-center justify-center text-xs font-medium whitespace-nowrap px-3 rounded-xl py-1 bg-zinc-800 text-zinc-300">
                          {submission.language}
                        </span>
                      </td>
                      <td className="p-2 align-middle whitespace-nowrap text-center">
                        <button
                          onClick={() => handleViewCode(submission.id)}
                          className="cursor-pointer inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all size-9 hover:bg-zinc-800 group"
                          aria-label="View Code"
                        >
                          <Eye className="h-4 w-4 text-zinc-400 group-hover:text-[#FF6D00] transition-all duration-300" />
                        </button>
                      </td>
                      <td className="p-2 align-middle whitespace-nowrap text-center">
                        {submission.hasAnalysis ? (
                          <button
                            onClick={() => handleViewAnalysis(submission.id)}
                            className="cursor-pointer inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all size-9 hover:bg-zinc-800 group"
                            aria-label="Analysis"
                          >
                            <Activity className="h-4 w-4 text-zinc-400 group-hover:text-yellow-400 transition-all duration-300" />
                          </button>
                        ) : (
                          <span className="text-zinc-500">-</span>
                        )}
                      </td>
                      <td className="p-2 align-middle whitespace-nowrap text-center">
                        <button
                          onClick={() => handleDelete(submission.id)}
                          className="cursor-pointer inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all size-9 hover:bg-zinc-800 group"
                          aria-label="Delete"
                        >
                          <Trash2 className="h-4 w-4 text-zinc-400 group-hover:text-red-500 transition-all duration-300" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-between text-sm mt-3">
            <div className="text-zinc-400">
              Showing {currentSubmissions.length} out of {mockSubmissions.length} submissions
            </div>
            <div className="flex items-center gap-3">
              <div className="text-zinc-400">Page {currentPage}</div>
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage >= totalPages}
                className="h-4 w-4 rounded-full border p-0.5 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
                aria-label="Next page"
              >
                <ChevronRight className="w-full h-full" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Sticky footer bar */}
      <div className="sticky mt-auto bottom-0 left-0 right-0 z-10 bg-zinc-950 border-t border-zinc-700">
        <div className="flex flex-row justify-between items-center px-4 py-1">
          {/* Left side - Like, Dislike, Bug, Notes */}
          <div className="flex items-center gap-x-3">
            <button
              onClick={() => {
                setIsLiked(!isLiked);
                if (isDisliked) setIsDisliked(false);
              }}
              className="flex items-center gap-x-2 text-zinc-400 cursor-pointer hover:text-zinc-300"
              aria-pressed={isLiked}
              aria-label="Like problem"
            >
              <ThumbsUp className={`w-4 h-4 ${isLiked ? 'fill-current text-[#FF6D00]' : ''}`} />
              <span className="text-sm">6</span>
            </button>
            <button
              onClick={() => {
                setIsDisliked(!isDisliked);
                if (isLiked) setIsLiked(false);
              }}
              className="flex items-center text-zinc-400 cursor-pointer hover:text-zinc-300"
              aria-pressed={isDisliked}
              aria-label="Dislike problem"
            >
              <ThumbsDown className={`w-4 h-4 ${isDisliked ? 'fill-current text-[#FF6D00]' : ''}`} />
            </button>
            <div className="h-[12px] w-[1px] bg-zinc-700"></div>
            <button
              type="button"
              className="text-sm transition-colors text-zinc-400 cursor-pointer hover:text-zinc-300"
              aria-label="Report a bug for this problem"
            >
              <Bug className="w-4 h-4" />
            </button>
            <div className="h-[12px] w-[1px] bg-zinc-700"></div>
            <button
              type="button"
              className="text-sm text-zinc-400 hover:text-[#FF6D00] transition-colors cursor-pointer"
              aria-label="Open notes"
            >
              <StickyNote className="w-5 h-5" />
            </button>
          </div>

          {/* Right side - Auto-play, Prev/Next problem */}
          <div className="flex items-center gap-x-3">
            <div className="flex items-center gap-4">
              <label className="flex select-none items-center gap-2 text-xs text-zinc-400 cursor-pointer">
                <input
                  type="checkbox"
                  checked={autoPlay}
                  onChange={() => setAutoPlay(!autoPlay)}
                  className="w-4 h-4 rounded border-zinc-600 bg-zinc-800 checked:bg-[#FF6D00] checked:border-[#FF6D00] cursor-pointer"
                />
              </label>
            </div>
            <div className="h-[12px] w-[1px] bg-zinc-700"></div>
            <div className="flex flex-row justify-between items-center gap-x-2 text-zinc-400">
              <button
                type="button"
                aria-label="Previous problem"
                className="disabled:opacity-40 cursor-pointer disabled:cursor-not-allowed hover:text-zinc-300"
              >
                <ChevronLeft className="w-3.5 h-3.5" />
              </button>
              <div className="h-[12px] w-[1px] bg-zinc-700"></div>
              <button
                type="button"
                aria-label="Next problem"
                className="disabled:opacity-40 cursor-pointer disabled:cursor-not-allowed hover:text-zinc-300"
              >
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Submissions;
