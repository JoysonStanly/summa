import api from '@/services/api/axiosClient';

export type SubmissionStatus = 'accepted' | 'rejected' | 'error' | 'timeout';

export interface Submission {
  _id: string;
  problemId: string;
  userId: string;
  code: string;
  language: string;
  result: SubmissionStatus;
  timeTaken: number;
  memory: number;
  attempts: number;
  createdAt: string;
  updatedAt: string;
}

export interface TestResult {
  passed: boolean;
  input?: string;
  expected?: string;
  actual?: string;
  error?: string;
  executionTime?: number;
}

export interface SubmissionResult {
  status: SubmissionStatus;
  timeTaken: number;
  memory: number;
  message?: string;
  testResults?: TestResult[];
}

export interface SubmissionRequest {
  problemId: string;
  userId: string;
  code: string;
  language: string;
}

/**
 * Service for handling code submissions and retrieving submission history
 */
const submissionService = {
  /**
   * Submit a solution for evaluation
   */
  submitSolution: async (data: SubmissionRequest): Promise<Submission> => {
    const response = await api.post('/submissions', data);
    return response.data.data;
  },

  /**
   * Get submission history for a specific problem
   */
  getSubmissionsByProblem: async (problemId: string): Promise<Submission[]> => {
    const response = await api.get(`/submissions?problemId=${problemId}`);
    return response.data.data;
  },

  /**
   * Get submission history for a specific user
   */
  getSubmissionsByUser: async (userId: string): Promise<Submission[]> => {
    const response = await api.get(`/submissions?userId=${userId}`);
    return response.data.data;
  },

  /**
   * Get a specific submission by ID
   */
  getSubmissionById: async (submissionId: string): Promise<Submission> => {
    const response = await api.get(`/submissions/${submissionId}`);
    return response.data.data;
  },

  /**
   * Mock local executor – simulates running code and returns per-test results
   * Note: This is a simplified mock. In production, use backend API for code execution.
   */
  runLocally: async (
    testCases: Array<{ id: string; input: string[]; output: string }>,
    code: string,
    language: string,
    problemId?: string
  ): Promise<SubmissionResult> => {
    const tests = testCases || [];
    const results: TestResult[] = [];

    // Very naive executors for a couple of demo problems
    const execLinearSearch = (nums: number[], target: number) => nums.indexOf(target);

    for (const t of tests) {
      try {
        // Parse input strings like '[2, 3, 4]' and '3'
        const arr = JSON.parse(t.input[0].replace(/'/g, '"')) as number[];
        const target = JSON.parse(t.input[1]);
        let actual: number | string = -1;

        // Simple demo: attempt linear search for arrays
        actual = execLinearSearch(arr, target);

        const expected = Number.isNaN(Number(t.output)) ? t.output : Number(t.output);
        const passed = String(actual) === String(expected);
        results.push({ passed, input: `${t.input.join(', ')}`, expected: String(expected), actual: String(actual), executionTime: Math.floor(Math.random() * 5) + 1 });
      } catch (err: unknown) {
        const message = err instanceof Error ? err.message : 'Parse error';
        results.push({ passed: false, error: message });
      }
    }

  // reference inputs to avoid unused warnings in mock
  void code; void language; void problemId;
  const allPassed = results.every(r => r.passed);
    return {
      status: allPassed ? 'accepted' : 'rejected',
      timeTaken: Math.floor(Math.random() * 20) + 5,
      memory: Math.floor(Math.random() * 20) + 10,
      message: allPassed ? 'All test cases passed' : 'Some test cases failed',
      testResults: results
    };
  }
};

export default submissionService;