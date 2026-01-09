import { create } from 'zustand';
import { problemService, type Problem, type Submission } from '@/features/problems/services/problemService';

interface EditorConfig {
  theme: string;
  fontSize: number;
  tabSize: number;
  language: string;
}

interface TestResult {
  testCaseId: string;
  passed: boolean;
  actualOutput: string;
  expectedOutput: string;
  executionTime?: number;
}

interface ProblemState {
  problems: Problem[];
  currentProblem: Problem | null;
  currentProblemId: string | null;
  editorContent: Record<string, string>;
  editorConfig: EditorConfig;
  selectedLanguage: Record<string, string>;
  isLoading: boolean;
  isSubmitting: boolean;
  isRunningTests: boolean;
  error: string | null;
  lastSubmission: Submission | null;
  testResults: TestResult[];
  
  // Actions
  fetchProblems: (filters?: { difficulty?: string; topic?: string; search?: string }) => Promise<void>;
  fetchProblem: (problemId: string) => Promise<void>;
  setCurrentProblem: (problemId: string) => void;
  updateEditorContent: (problemId: string, content: string) => void;
  updateEditorConfig: (config: Partial<EditorConfig>) => void;
  setLanguageForProblem: (problemId: string, language: string) => void;
  getLanguageForProblem: (problemId: string) => string | undefined;
  setSubmitting: (isSubmitting: boolean) => void;
  submitSolution: (problemId: string, code: string, language: string) => Promise<Submission>;
  resetLastSubmission: () => void;
  runTests: (problemId: string, code: string, language: string) => Promise<TestResult[]>;
  clearTestResults: () => void;
}

const defaultEditorConfig: EditorConfig = {
  theme: 'vs-dark',
  fontSize: 14,
  tabSize: 2,
  language: 'javascript'
};

export const useProblemStore = create<ProblemState>()((set, get) => ({
  // State
  problems: [],
  currentProblem: null,
  currentProblemId: null,
  editorContent: {},
  editorConfig: defaultEditorConfig,
  selectedLanguage: {},
  isLoading: false,
  isSubmitting: false,
  isRunningTests: false,
  error: null,
  lastSubmission: null,
  testResults: [],
  
  // Actions
  fetchProblems: async (filters?) => {
    set({ isLoading: true, error: null });
    try {
      const problems = await problemService.getProblems(filters);
      set({ problems, isLoading: false });
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to fetch problems', 
        isLoading: false 
      });
    }
  },
  
  fetchProblem: async (problemId: string) => {
    set({ isLoading: true, error: null });
    try {
      const problem = await problemService.getProblem(problemId);
      set({ 
        currentProblem: problem,
        currentProblemId: problemId,
        isLoading: false 
      });
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to fetch problem', 
        isLoading: false 
      });
    }
  },
  
  setCurrentProblem: (problemId: string) => {
    const { problems } = get();
    const problem = problems.find(p => p._id === problemId);
    
    set({ 
      currentProblemId: problemId,
      currentProblem: problem || null
    });
    
    // If we don't have the problem details yet, fetch it
    if (!problem) {
      get().fetchProblem(problemId);
    }
  },
  
  updateEditorContent: (problemId: string, content: string) => 
    set(state => ({
      editorContent: {
        ...state.editorContent,
        [problemId]: content
      }
    })),
  
  updateEditorConfig: (config: Partial<EditorConfig>) => 
    set(state => ({
      editorConfig: {
        ...state.editorConfig,
        ...config
      }
    })),

  setLanguageForProblem: (problemId: string, language: string) =>
    set(state => ({
      selectedLanguage: {
        ...state.selectedLanguage,
        [problemId]: language
      }
    })),

  getLanguageForProblem: (problemId: string) => {
    const { selectedLanguage } = get();
    return selectedLanguage[problemId];
  },
  
  setSubmitting: (isSubmitting: boolean) => set({ isSubmitting }),
  
  submitSolution: async (problemId: string, code: string, language: string) => {
    set({ isSubmitting: true, error: null });
    try {
      const submission = await problemService.submitSolution({
        problemId,
        code,
        language
      });
      set({ 
        lastSubmission: submission,
        isSubmitting: false 
      });
      return submission;
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to submit solution', 
        isSubmitting: false 
      });
      throw error;
    }
  },
  
  resetLastSubmission: () => set({
    lastSubmission: null
  }),

  runTests: async (problemId: string, code: string, language: string) => {
    set({ isRunningTests: true, error: null, testResults: [] });
    try {
      // Get current problem to access test cases
      const { currentProblem } = get();
      if (!currentProblem || !currentProblem.testCases) {
        throw new Error('No test cases available');
      }

      // Simulate test execution (replace with actual API call)
      const results: TestResult[] = currentProblem.testCases.map(testCase => {
        // Mock execution - in real implementation, call Judge0 or backend
        const passed = Math.random() > 0.3; // Mock result
        return {
          testCaseId: testCase.id,
          passed,
          actualOutput: passed ? testCase.output : 'Wrong output',
          expectedOutput: testCase.output,
          executionTime: Math.floor(Math.random() * 100)
        };
      });

      set({ testResults: results, isRunningTests: false });
      return results;
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to run tests', 
        isRunningTests: false 
      });
      throw error;
    }
  },

  clearTestResults: () => set({ testResults: [] }),
}));