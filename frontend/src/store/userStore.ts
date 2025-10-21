import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface UserProgress {
  completedProblems: string[];
  solvedQuizzes: Record<string, { score: number; completedAt: string }>;
  notes: Record<string, string>;
  submissionStats: {
    total: number;
    accepted: number;
    rejected: number;
  };
  streakData: {
    currentStreak: number;
    lastActiveDate: string;
    maxStreak: number;
  };
}

interface UserState extends UserProgress {
  isAuthenticated: boolean;
  userId: string | null;
  username: string | null;
  
  // Problem related actions
  addCompletedProblem: (problemId: string) => void;
  saveNote: (topicId: string, content: string) => void;
  incrementSubmissionStat: (type: 'total' | 'accepted' | 'rejected') => void;
  
  // Quiz related actions
  saveQuizResult: (quizId: string, score: number) => void;
  
  // User session actions
  login: (userId: string, username: string) => void;
  logout: () => void;
  
  // Streak management
  updateStreak: () => void;
}

const initialProgress: UserProgress = {
  completedProblems: [],
  solvedQuizzes: {},
  notes: {},
  submissionStats: {
    total: 0,
    accepted: 0,
    rejected: 0,
  },
  streakData: {
    currentStreak: 0,
    lastActiveDate: '',
    maxStreak: 0,
  },
};

export const useUserStore = create<UserState>()(
  persist(
    (set, get) => ({
      // State
      ...initialProgress,
      isAuthenticated: false,
      userId: null,
      username: null,
      
      // Problem related actions
      addCompletedProblem: (problemId) => 
        set((state) => ({
          completedProblems: [...state.completedProblems, problemId]
        })),
      
      saveNote: (topicId, content) =>
        set((state) => ({
          notes: { ...state.notes, [topicId]: content }
        })),
      
      incrementSubmissionStat: (type) =>
        set((state) => ({
          submissionStats: {
            ...state.submissionStats,
            [type]: state.submissionStats[type] + 1
          }
        })),
      
      // Quiz related actions
      saveQuizResult: (quizId, score) =>
        set((state) => ({
          solvedQuizzes: {
            ...state.solvedQuizzes,
            [quizId]: {
              score,
              completedAt: new Date().toISOString()
            }
          }
        })),
      
      // User session actions
      login: (userId, username) =>
        set(() => ({
          isAuthenticated: true,
          userId,
          username
        })),
        
      logout: () =>
        set(() => ({
          isAuthenticated: false,
          userId: null,
          username: null
        })),
      
      // Streak management
      updateStreak: () => {
        set((state) => {
          const today = new Date().toISOString().split('T')[0];
          const lastActive = state.streakData.lastActiveDate;
          
          // If first time or same day, no change to streak
          if (!lastActive || lastActive === today) {
            return {
              streakData: {
                ...state.streakData,
                lastActiveDate: today
              }
            };
          }
          
          // Calculate days between last active and today
          const lastActiveDate = new Date(lastActive);
          const todayDate = new Date(today);
          const diffTime = Math.abs(todayDate.getTime() - lastActiveDate.getTime());
          const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
          
          // If consecutive day, increment streak
          if (diffDays === 1) {
            const newStreak = state.streakData.currentStreak + 1;
            return {
              streakData: {
                currentStreak: newStreak,
                lastActiveDate: today,
                maxStreak: Math.max(newStreak, state.streakData.maxStreak)
              }
            };
          }
          
          // If missed a day, reset streak
          return {
            streakData: {
              currentStreak: 1,
              lastActiveDate: today,
              maxStreak: state.streakData.maxStreak
            }
          };
        });
      }
    }),
    {
      name: 'studyio-user-storage',
      // Only persist certain parts of the state
      partialize: (state) => ({
        completedProblems: state.completedProblems,
        solvedQuizzes: state.solvedQuizzes,
        notes: state.notes,
        submissionStats: state.submissionStats,
        streakData: state.streakData,
        isAuthenticated: state.isAuthenticated,
        userId: state.userId,
        username: state.username,
      })
    }
  )
);