import React, { useState, useEffect, useContext } from 'react';
import { useToast } from '@/shared/hooks/ToastContext';
import { useParams, useNavigate } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';
import { AuthContext } from "@/features/auth/stores/AuthContext";
import { CodeSubmissionForm } from '../components/submissions/CodeSubmissionForm';
import { SubmissionHistory } from '../components/submissions/SubmissionHistory';
import { SubmissionResultDisplay } from '../components/submissions/SubmissionResultDisplay';
import submissionService from '../services/submissionService';
import type { SubmissionResult, Submission } from '../services/submissionService';

// Assuming we have problem service
import problemService from '../services/problemService';
import type { Problem, ProblemExample } from '../services/problemService';

interface ProblemSubmitPageProps {
  userId?: string; // Make userId optional as we'll get it from context
}

const ProblemSubmitPage: React.FC<ProblemSubmitPageProps> = ({ userId: propUserId }) => {
  const { error: toastError } = useToast();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  // Use the userId from props if provided, otherwise from the authenticated user
  const userId = propUserId || (user ? user.id : '');
  const { problemId } = useParams<{ problemId: string }>();
  const [problem, setProblem] = useState<Problem | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [submission, setSubmission] = useState<Submission | null>(null);
  const [submissionResult, setSubmissionResult] = useState<SubmissionResult | null>(null);
  const [viewingSubmissionId, setViewingSubmissionId] = useState<string | null>(null);
  
  useEffect(() => {
    const fetchProblem = async () => {
      if (!problemId) return;
      try {
        setLoading(true);
        const data = await problemService.getProblemById(problemId);
        setProblem(data);
      } catch (err) {
        console.error('Error fetching problem:', err);
        setError('Failed to load problem details');
      } finally {
        setLoading(false);
      }
    };
    fetchProblem();
  }, [problemId]);

  // Show toast on error
  useEffect(() => {
    if (error) {
      toastError(typeof error === 'string' ? error : 'Failed to load problem or submission');
    }
  }, [error, toastError]);

  const handleSubmissionComplete = (result: SubmissionResult) => {
    setSubmissionResult(result);
    // Reset viewingSubmissionId since we're now viewing a new submission
    setViewingSubmissionId(null);
  };

  const handleViewSubmission = async (submissionId: string) => {
    try {
      setLoading(true);
      const data = await submissionService.getSubmissionById(submissionId);
      setSubmission(data);
      setViewingSubmissionId(submissionId);
      // Clear previous submission result since we're viewing a historical submission
      setSubmissionResult(null);
    } catch (err) {
      console.error('Error fetching submission:', err);
      setError('Failed to load submission details');
    } finally {
      setLoading(false);
    }
  };

  if (loading && !problem) {
    return <div className="py-12 text-center">Loading problem...</div>;
  }

  if (error) {
    return <div className="py-12 text-center text-red-500">{error}</div>;
  }

  if (!problem) {
    return <div className="py-12 text-center">Problem not found</div>;
  }

  return (
    <div className="min-h-screen bg-background pb-16 sm:pb-8">
      <div className="max-w-5xl px-3 sm:px-4 md:px-6 py-4 sm:py-6 md:py-8 mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 sm:gap-4 mb-4 sm:mb-6 md:mb-8">
        <div className="flex-1">
          <h1 className="text-xl sm:text-2xl md:text-3xl font-bold leading-tight">{problem.title}</h1>
          <p className="mt-1 text-sm sm:text-base text-gray-400">{problem.difficulty} • {problem.category}</p>
        </div>
        
        <div className="shrink-0">
          <button 
            onClick={() => navigate(`/dsa/all/${problemId}`)}
            className="w-full sm:w-auto px-3 sm:px-4 py-2 bg-[#2d2d2d] hover:bg-[#3d3d3d] rounded-md text-white flex items-center justify-center gap-2 text-sm sm:text-base"
          >
            <ChevronLeft size={16} className="sm:w-[18px] sm:h-[18px]" />
            <span className="hidden xs:inline">Back to </span>Problem
          </button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 gap-4 sm:gap-6 md:gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2 order-2 lg:order-1">
          <div className="bg-[#1e1e1e] rounded-lg p-3 sm:p-4 md:p-6 mb-4 sm:mb-6 md:mb-8">
            <h2 className="mb-3 sm:mb-4 text-lg sm:text-xl md:text-2xl font-bold">Problem Description</h2>
            <div className="prose prose-invert prose-sm sm:prose-base max-w-none">
              <div dangerouslySetInnerHTML={{ __html: problem.description }} />
            </div>
            
            {problem.examples && problem.examples.length > 0 && (
              <div className="mt-4 sm:mt-5 md:mt-6">
                <h3 className="mb-2 sm:mb-3 text-base sm:text-lg md:text-xl font-bold">Examples</h3>
                <div className="space-y-3 sm:space-y-4">
                  {problem.examples.map((example: ProblemExample, idx: number) => (
                    <div key={idx} className="bg-[#2d2d2d] p-3 sm:p-4 rounded-md">
                      <p className="mb-2 text-sm sm:text-base font-medium">Example {idx + 1}:</p>
                      <div className="grid grid-cols-1 gap-3 sm:gap-4">
                        <div>
                          <p className="text-xs sm:text-sm text-gray-400">Input:</p>
                          <pre className="bg-[#1e1e1e] p-2 rounded mt-1 text-xs sm:text-sm overflow-x-auto">
                            {example.input}
                          </pre>
                        </div>
                        <div>
                          <p className="text-xs sm:text-sm text-gray-400">Output:</p>
                          <pre className="bg-[#1e1e1e] p-2 rounded mt-1 text-xs sm:text-sm overflow-x-auto">
                            {example.output}
                          </pre>
                        </div>
                      </div>
                      {example.explanation && (
                        <div className="mt-2">
                          <p className="text-xs sm:text-sm text-gray-400">Explanation:</p>
                          <p className="mt-1 text-xs sm:text-sm">{example.explanation}</p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            {problem.constraints && (
              <div className="mt-4 sm:mt-5 md:mt-6">
                <h3 className="mb-2 sm:mb-3 text-base sm:text-lg md:text-xl font-bold">Constraints</h3>
                <ul className="space-y-1 text-xs sm:text-sm md:text-base text-gray-300 list-disc list-inside">
                  {problem.constraints.map((constraint: string, idx: number) => (
                    <li key={idx} className="break-words">{constraint}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
          
          <div className="mb-4 sm:mb-6 md:mb-8">
            <h2 className="mb-3 sm:mb-4 text-lg sm:text-xl md:text-2xl font-bold">Your Solution</h2>
            <CodeSubmissionForm 
              problemId={problemId || ''}
              userId={userId}
              onSubmissionComplete={handleSubmissionComplete}
              initialCode={problem.starterCode || ''}
            />
          </div>
          
          {submissionResult && (
            <SubmissionResultDisplay result={submissionResult} />
          )}
          
          {viewingSubmissionId && submission && (
            <div className="mb-4 sm:mb-6 md:mb-8">
              <h2 className="mb-3 sm:mb-4 text-lg sm:text-xl md:text-2xl font-bold">Viewing Submission</h2>
              <div className="bg-[#1e1e1e] rounded-lg p-3 sm:p-4 md:p-6">
                <div className="mb-4">
                  <h3 className="text-base sm:text-lg font-medium">Submission Details</h3>
                  <p className="text-xs sm:text-sm text-gray-400">
                    Submitted on {new Date(submission.createdAt).toLocaleString()}
                  </p>
                  <p className={`font-medium ${
                    submission.result === 'accepted' ? 'text-green-500' : 
                    submission.result === 'rejected' ? 'text-red-500' : 
                    submission.result === 'error' ? 'text-orange-500' : 'text-yellow-500'
                  }`}>
                    Status: {submission.result.toUpperCase()}
                  </p>
                </div>
                
                <div>
                  <h4 className="mb-2 text-sm sm:text-base font-medium">Code</h4>
                  <pre className="bg-[#2d2d2d] p-2 sm:p-3 md:p-4 rounded-md overflow-x-auto text-xs sm:text-sm">
                    <code>{submission.code}</code>
                  </pre>
                </div>
              </div>
            </div>
          )}
        </div>
        
        <div className="order-1 lg:order-2">
          <div className="lg:sticky lg:top-4">
            <SubmissionHistory 
              problemId={problemId || ''}
              userId={userId}
              onViewSubmission={handleViewSubmission}
            />
          </div>
        </div>
      </div>
    </div>
    </div>
  );
};

export default ProblemSubmitPage;