import { useState } from 'react';
import { Eye, Activity, Trash2, ThumbsUp, ThumbsDown, Bug, StickyNote, ChevronLeft, ChevronRight, Check, TrendingUp } from 'lucide-react';

// Define the types for our submission data
interface Submission {
  id: string;
  status: 'Accepted' | 'Wrong Answer' | 'Compilation Error' | 'Runtime Error (NZEC)';
  language: string;
  timestamp: string;
  hasAnalysis: boolean;
}

// 🎯 Interface for latest submission result from Submit button
interface LatestSubmission {
  status: string;
  testCasesPassed: number;
  totalTestCases: number;
  memoryUsed: string;
  language: string;
  timestamp: string;
}

interface SubmissionsProps {
  latestSubmission?: LatestSubmission | null;
  isSubmitting?: boolean; // Loading state
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


const Submissions = ({ latestSubmission, isSubmitting }: SubmissionsProps) => {
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
    <div className="relative flex flex-col w-full h-full">
      <div className="flex flex-col p-3">
        
        {/* 🎯 Loading Skeleton - Shows during submission (3 seconds) */}
        {isSubmitting && (
          <div className="relative mb-3 animate-pulse">
            <div className="flex items-center justify-between px-1 mb-2">
              <div className="w-32 h-4 rounded bg-zinc-700"></div>
            </div>
            <div className="p-2 border border-zinc-700 rounded-xl">
              <div className="flex items-center justify-between mb-3">
                <div className="w-48 h-6 rounded bg-zinc-700"></div>
                <div className="w-32 h-8 rounded-full bg-zinc-700"></div>
              </div>
              <div className="h-16 mb-3 w-80 bg-zinc-700 rounded-xl"></div>
              <div className="p-3 space-y-3 border border-zinc-700 rounded-xl w-fit">
                <div className="h-4 rounded w-96 bg-zinc-700"></div>
                <div className="h-4 rounded w-96 bg-zinc-700"></div>
                <div className="h-4 rounded w-96 bg-zinc-700"></div>
              </div>
            </div>
          </div>
        )}
        
        {/* 🎯 Current Submission Card - Shows when latestSubmission exists */}
        {!isSubmitting && latestSubmission && (
          <div className="relative mb-3" style={{ opacity: 1, filter: 'blur(0px)', height: 'auto', transform: 'none' }}>
            <div className="flex items-center justify-between px-1 mb-2" style={{ opacity: 1, transform: 'none' }}>
              <div className="text-sm font-medium">Current Submission</div>
            </div>
            <div className="p-2 border border-zinc-700 rounded-xl" style={{ transformStyle: 'preserve-3d', perspective: '1000px', opacity: 1, filter: 'blur(0px)', transform: 'none' }}>
              <div style={{ opacity: 1, transform: 'none' }}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="flex items-center gap-x-1">
                      <span className="text-sm text-zinc-400">Submission Verdict:</span>
                      <div className={`inline-flex items-center rounded-full text-sm ${
                        latestSubmission.status === 'Accepted' ? 'text-green-500' : 'text-red-500'
                      }`}>
                        {latestSubmission.status}
                      </div>
                    </div>
                  </div>
                  <button 
                    type="button" 
                    className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-sm font-medium text-zinc-300 bg-zinc-800 hover:bg-zinc-700 cursor-pointer"
                  >
                    <TrendingUp className="h-3.5 w-3.5" />
                    <span>Analyse code</span>
                  </button>
                </div>
              </div>
              <div style={{ opacity: 1, transform: 'none' }}>
                <div 
                  className="relative mb-3 mt-2 flex flex-wrap items-center gap-x-8 gap-y-2 rounded-xl px-3 py-2 text-[13px] text-green-400"
                  style={{ backgroundColor: 'color-mix(in srgb, rgb(34, 197, 94) 20%, transparent)' }}
                >
                  <div className="absolute top-0 left-0 w-full h-full" style={{ background: 'linear-gradient(175deg, rgba(255,255,255,0.1) 0%, transparent 100%)' }}></div>
                  <div className="relative z-10 font-medium text-zinc-400">
                    Test Cases Passed : <span className="text-green-400 bg-transparent"> {latestSubmission.testCasesPassed}</span>/{latestSubmission.totalTestCases}
                  </div>
                  <div className="relative z-10 font-medium text-zinc-400">Memory Used : {latestSubmission.memoryUsed}</div>
                </div>
              </div>
              <div className="pb-2 border border-zinc-700 rounded-xl" style={{ opacity: 1, transform: 'none' }}>
                <div className="mt-2 mb-3 space-y-2 text-sm rounded-md">
                  <div className="flex items-center justify-between px-3 py-2 border-b rounded-md rounded-b-none border-zinc-700">
                    <div className="flex items-center gap-2 text-xs">
                      <div style={{ opacity: 1, transform: 'none' }}>
                        <Check className="w-4 h-4 text-green-600" />
                      </div>
                      <span>Compilation Check</span>
                    </div>
                    <span className="text-zinc-500 !text-xs">Code compiled successfully</span>
                  </div>
                  <div className="flex items-center justify-between px-3 py-2 border-b rounded-md rounded-b-none border-zinc-700">
                    <div className="flex items-center gap-2 text-xs">
                      <div style={{ opacity: 1, transform: 'none' }}>
                        <Check className="w-4 h-4 text-green-600" />
                      </div>
                      <span>Test Cases (Small)</span>
                    </div>
                    <span className="text-zinc-500 !text-xs">Code passed for the given test case</span>
                  </div>
                  <div className="flex items-center justify-between px-3 pt-2 rounded-md">
                    <div className="flex items-center gap-2 text-xs">
                      <div style={{ opacity: 1, transform: 'none' }}>
                        <Check className="w-4 h-4 text-green-600" />
                      </div>
                      <span>Test Cases (Large)</span>
                    </div>
                    <span className="text-zinc-500 !text-xs">Large testcases passed successfully</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        <div>
          {/* All Submissions Section Label */}
          <p className="mb-2 text-sm font-medium">All Submissions</p>
          
          {/* Table container */}
          <div className="border rounded-xl border-zinc-700">
            <div className="relative w-full overflow-x-auto">
              <table className="w-full text-sm caption-bottom">
                <thead className="border-b border-zinc-700">
                  <tr className="transition-colors hover:bg-zinc-800/50">
                    <th className="h-10 px-2 text-left align-middle whitespace-nowrap w-[60px] text-zinc-400 font-normal">
                      No.
                    </th>
                    <th className="h-10 px-2 font-normal text-left align-middle whitespace-nowrap text-zinc-400">
                      Status
                    </th>
                    <th className="h-10 px-2 font-medium text-left align-middle whitespace-nowrap text-zinc-400">
                      Language
                    </th>
                    <th className="h-10 px-2 font-normal text-center align-middle whitespace-nowrap text-zinc-400">
                      Code
                    </th>
                    <th className="h-10 px-2 font-normal text-center align-middle whitespace-nowrap text-zinc-400">
                      Analysis
                    </th>
                    <th className="h-10 px-2 font-normal text-center align-middle whitespace-nowrap text-zinc-400">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {currentSubmissions.map((submission, index) => (
                    <tr key={submission.id} className="border-b border-zinc-700">
                      <td className="p-2 font-medium align-middle whitespace-nowrap">
                        {indexOfFirstSubmission + index + 1}
                      </td>
                      <td className="p-2 align-middle whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <span className={`${getStatusColor(submission.status)} font-medium`}>
                            {submission.status}
                          </span>
                        </div>
                        <div className="mt-1 text-xs text-zinc-500">{submission.timestamp}</div>
                      </td>
                      <td className="p-2 align-middle whitespace-nowrap">
                        <span className="inline-flex items-center justify-center px-3 py-1 text-xs font-medium whitespace-nowrap rounded-xl bg-zinc-800 text-zinc-300">
                          {submission.language}
                        </span>
                      </td>
                      <td className="p-2 text-center align-middle whitespace-nowrap">
                        <button
                          onClick={() => handleViewCode(submission.id)}
                          className="inline-flex items-center justify-center gap-2 text-sm font-medium transition-all rounded-md cursor-pointer whitespace-nowrap size-9 hover:bg-zinc-800 group"
                          aria-label="View Code"
                        >
                          <Eye className="h-4 w-4 text-zinc-400 group-hover:text-[#FF6D00] transition-all duration-300" />
                        </button>
                      </td>
                      <td className="p-2 text-center align-middle whitespace-nowrap">
                        {submission.hasAnalysis ? (
                          <button
                            onClick={() => handleViewAnalysis(submission.id)}
                            className="inline-flex items-center justify-center gap-2 text-sm font-medium transition-all rounded-md cursor-pointer whitespace-nowrap size-9 hover:bg-zinc-800 group"
                            aria-label="Analysis"
                          >
                            <Activity className="w-4 h-4 transition-all duration-300 text-zinc-400 group-hover:text-yellow-400" />
                          </button>
                        ) : (
                          <span className="text-zinc-500">-</span>
                        )}
                      </td>
                      <td className="p-2 text-center align-middle whitespace-nowrap">
                        <button
                          onClick={() => handleDelete(submission.id)}
                          className="inline-flex items-center justify-center gap-2 text-sm font-medium transition-all rounded-md cursor-pointer whitespace-nowrap size-9 hover:bg-zinc-800 group"
                          aria-label="Delete"
                        >
                          <Trash2 className="w-4 h-4 transition-all duration-300 text-zinc-400 group-hover:text-red-500" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-between mt-3 text-sm">
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
    </div>
  );
};

export default Submissions;
