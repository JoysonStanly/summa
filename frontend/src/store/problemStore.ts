import { create } from 'zustand';
import { problemsApi, type Problem, type ProblemStatus, type SubmissionResult } from '../services/api';

interface EditorConfig {
  theme: string;
  fontSize: number;
  tabSize: number;
  language: string;
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
  error: string | null;
  lastSubmission: {
    status: ProblemStatus | null;
    runtime: string;
    memory: string;
    message?: string;
  };
  
  // Actions
  fetchProblems: (filters?: { difficulty?: string; tags?: string[] }) => Promise<void>;
  fetchProblem: (problemId: string) => Promise<void>;
  setCurrentProblem: (problemId: string) => void;
  updateEditorContent: (problemId: string, content: string) => void;
  updateEditorConfig: (config: Partial<EditorConfig>) => void;
  setLanguageForProblem: (problemId: string, language: string) => void;
  getLanguageForProblem: (problemId: string) => string | undefined;
  setSubmitting: (isSubmitting: boolean) => void;
  submitSolution: (problemId: string, code: string, language: string) => Promise<SubmissionResult>;
  setSubmissionResult: (result: {
    status: ProblemStatus;
    runtime: string;
    memory: string;
    message?: string;
  }) => void;
  resetLastSubmission: () => void;
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
  error: null,
  lastSubmission: {
    status: null,
    runtime: '0ms',
    memory: '0MB',
  },
  
  // Actions
  fetchProblems: async (filters?: { difficulty?: string; tags?: string[] }) => {
    set({ isLoading: true, error: null });
    try {
      const problems = await problemsApi.getProblems(filters);
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
      const problem = await problemsApi.getProblem(problemId);
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
      const result = await problemsApi.submitSolution(problemId, code, language);
      set({ 
        lastSubmission: result,
        isSubmitting: false 
      });
      return result;
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to submit solution', 
        isSubmitting: false 
      });
      throw error;
    }
  },
  
  setSubmissionResult: (result) => set({ 
    lastSubmission: result,
    isSubmitting: false,
  }),
  
  resetLastSubmission: () => set({
    lastSubmission: {
      status: null,
      runtime: '0ms',
      memory: '0MB',
    }
  }),
}));