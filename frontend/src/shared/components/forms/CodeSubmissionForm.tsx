import { useState } from 'react';
import submissionService from '../../services/submissionService';
import type { SubmissionResult } from '../../services/submissionService';

interface CodeSubmissionFormProps {
  problemId: string;
  userId: string;
  onSubmissionComplete: (result: SubmissionResult) => void;
  initialCode?: string;
}

const supportedLanguages = [
  { value: 'javascript', label: 'JavaScript' },
  { value: 'python', label: 'Python' },
  { value: 'java', label: 'Java' },
  { value: 'cpp', label: 'C++' },
];

const CodeSubmissionForm: React.FC<CodeSubmissionFormProps> = ({
  problemId,
  userId,
  onSubmissionComplete,
  initialCode = '',
}) => {
  const [code, setCode] = useState(initialCode);
  const [language, setLanguage] = useState('javascript');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    
    if (!code.trim()) {
      setError('Please enter some code before submitting.');
      return;
    }
    
    try {
      setIsSubmitting(true);
      setError(null);
      
      const response = await submissionService.submitSolution({
        problemId,
        userId,
        code,
        language,
      });
      
      // The response includes the submission object and evaluation details
      onSubmissionComplete(response as unknown as SubmissionResult);
    } catch (err) {
      console.error('Error submitting code:', err);
      setError('Failed to submit code. Please try again later.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-[#1e1e1e] rounded-lg p-4">
      <form onSubmit={handleSubmit}>
        <div className="mb-4 flex justify-between items-center">
          <div>
            <label htmlFor="language" className="block text-sm font-medium mb-1">
              Language
            </label>
            <select
              id="language"
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="bg-[#2d2d2d] text-white px-3 py-2 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
              disabled={isSubmitting}
            >
              {supportedLanguages.map((lang) => (
                <option key={lang.value} value={lang.value}>
                  {lang.label}
                </option>
              ))}
            </select>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className={`px-4 py-2 rounded-md ${
              isSubmitting
                ? 'bg-gray-600 cursor-not-allowed'
                : 'bg-green-600 hover:bg-green-700'
            } text-white`}
          >
            {isSubmitting ? 'Submitting...' : 'Submit Solution'}
          </button>
        </div>

        <div className="mb-4">
          <label htmlFor="code" className="sr-only">
            Code
          </label>
          <textarea
            id="code"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            className="w-full h-64 bg-[#2d2d2d] text-white font-mono p-4 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
            placeholder="Write your solution here..."
            disabled={isSubmitting}
          />
        </div>

        {error && (
          <div className="text-red-500 mb-4">
            {error}
          </div>
        )}
      </form>
    </div>
  );
};

export { CodeSubmissionForm };
export default CodeSubmissionForm;