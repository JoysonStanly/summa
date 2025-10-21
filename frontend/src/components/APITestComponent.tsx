import React, { useEffect, useState } from 'react';
import { useProblemStore } from '../store/problemStore';
import { authApi } from '../services/authService';

/**
 * This component tests the integration between the frontend and backend API.
 * It demonstrates how to use the problem store to fetch data from the backend.
 */
const APITestComponent: React.FC = () => {
  const { 
    problems, 
    fetchProblems, 
    isLoading, 
    error,
    currentProblem,
    fetchProblem
  } = useProblemStore();

  const [testResult, setTestResult] = useState<string>('');
  const [testLoading, setTestLoading] = useState<boolean>(false);

  useEffect(() => {
    // Fetch all problems on component mount
    fetchProblems();
  }, [fetchProblems]);

  const handleFetchProblem = (id: string) => {
    fetchProblem(id);
  };

  const testRegistration = async () => {
    setTestLoading(true);
    setTestResult('');
    
    try {
      // Test with a sample registration
      const testData = {
        name: 'Test User',
        email: `test${Date.now()}@example.com`,
        password: 'TestPassword123!',
        role: 'student' as const
      };
      
      await authApi.register(testData);
      setTestResult('✅ Registration test successful!');
    } catch (error) {
      setTestResult(`❌ Registration test failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setTestLoading(false);
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">API Integration Test</h2>
      
      {/* Registration Test Section */}
      <div className="mb-6 p-4 border border-gray-300 rounded">
        <h3 className="text-xl font-semibold mb-2">Registration Test</h3>
        <button 
          onClick={testRegistration}
          disabled={testLoading}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
        >
          {testLoading ? 'Testing...' : 'Test Registration'}
        </button>
        {testResult && (
          <div className="mt-2 p-2 bg-gray-100 rounded">
            <pre className="text-sm">{testResult}</pre>
          </div>
        )}
      </div>
      
      {error && (
        <div className="p-4 bg-red-100 border border-red-400 text-red-700 rounded mb-4">
          <h3 className="text-lg font-bold">API Error</h3>
          <p>{error}</p>
        </div>
      )}
      
      {isLoading ? (
        <div className="flex items-center justify-center p-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
          <span className="ml-2">Loading...</span>
        </div>
      ) : (
        <div>
          <h3 className="text-xl font-semibold mb-2">Problems List</h3>
          
          {problems.length === 0 ? (
            <p className="text-gray-500">No problems found. Make sure your backend is running and the database is seeded.</p>
          ) : (
            <div>
              <p className="mb-2">Found {problems.length} problems:</p>
              <ul className="list-disc pl-5">
                {problems.map((problem) => (
                  <li key={problem._id} className="mb-1">
                    <span className="font-medium">{problem.title}</span> - 
                    <span className={`ml-2 ${
                      problem.difficulty === 'easy' ? 'text-green-500' : 
                      problem.difficulty === 'medium' ? 'text-yellow-500' : 
                      'text-red-500'
                    }`}>
                      {problem.difficulty}
                    </span>
                    <button 
                      className="ml-2 px-2 py-1 bg-blue-500 text-white rounded text-xs"
                      onClick={() => handleFetchProblem(problem._id)}
                    >
                      View Details
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}
          
          {currentProblem && (
            <div className="mt-6 p-4 border border-gray-300 rounded">
              <h3 className="text-xl font-semibold">{currentProblem.title}</h3>
              <div className="my-2 text-sm">
                <span className={`inline-block px-2 py-1 rounded ${
                  currentProblem.difficulty === 'easy' ? 'bg-green-100 text-green-800' : 
                  currentProblem.difficulty === 'medium' ? 'bg-yellow-100 text-yellow-800' : 
                  'bg-red-100 text-red-800'
                }`}>
                  {currentProblem.difficulty}
                </span>
                {currentProblem.tags && currentProblem.tags.map(tag => (
                  <span key={tag} className="ml-2 inline-block px-2 py-1 bg-gray-100 text-gray-800 rounded">
                    {tag}
                  </span>
                ))}
              </div>
              <p className="my-4">{currentProblem.statement}</p>
              <div className="mt-4">
                <h4 className="font-semibold">Test Cases:</h4>
                <ul className="list-disc pl-5">
                  {currentProblem.testCases.map((testCase, index) => (
                    <li key={index}>
                      <div>
                        <strong>Input:</strong> <code className="bg-gray-100 p-1">{testCase.input}</code>
                      </div>
                      <div>
                        <strong>Output:</strong> <code className="bg-gray-100 p-1">{testCase.output}</code>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default APITestComponent;