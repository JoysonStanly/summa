import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { progressService, type UserProgress as APIProgress, type ProgressStats } from '@/features/profile/services/progressService';

// Local UI state (can be persisted)
interface LocalUserState {
  notes: Record<string, string>; // Notes are local only
}

interface UserState extends LocalUserState {
  // Progress data from API
  progress: APIProgress | null;
  stats: ProgressStats | null;
  
  // Loading states
  isLoadingProgress: boolean;
  isLoadingStats: boolean;
  error: string | null;
  
  // Actions
  fetchProgress: () => Promise<void>;
  fetchStats: () => Promise<void>;
  updateProgress: (action: 'solved' | 'attempted' | 'streak', problemId?: string) => Promise<void>;
  
  // Local actions (notes only)
  saveNote: (topicId: string, content: string) => void;
  
  // Clear on logout
  clearProgress: () => void;
}

const initialState = {
  progress: null,
  stats: null,
  notes: {},
  isLoadingProgress: false,
  isLoadingStats: false,
  error: null,
};

export const useUserStore = create<UserState>()(
  persist(
    (set) => ({
      // State
      ...initialState,
      
      // Fetch user progress from backend
      fetchProgress: async () => {
        set({ isLoadingProgress: true, error: null });
        try {
          const progress = await progressService.getProgress();
          set({ progress, isLoadingProgress: false });
        } catch (error) {
          set({ 
            error: error instanceof Error ? error.message : 'Failed to fetch progress',
            isLoadingProgress: false 
          });
        }
      },
      
      // Fetch user statistics from backend
      fetchStats: async () => {
        set({ isLoadingStats: true, error: null });
        try {
          const stats = await progressService.getStats();
          set({ stats, isLoadingStats: false });
        } catch (error) {
          set({ 
            error: error instanceof Error ? error.message : 'Failed to fetch stats',
            isLoadingStats: false 
          });
        }
      },
      
      // Update progress on backend
      updateProgress: async (action: 'solved' | 'attempted' | 'streak', problemId?: string) => {
        set({ error: null });
        try {
          const progress = await progressService.updateProgress({
            action,
            problemId,
          });
          set({ progress });
        } catch (error) {
          set({ 
            error: error instanceof Error ? error.message : 'Failed to update progress'
          });
        }
      },
      
      // Save note locally (notes are not synced with backend)
      saveNote: (topicId, content) =>
        set((state) => ({
          notes: { ...state.notes, [topicId]: content }
        })),
      
      // Clear all progress data (on logout)
      clearProgress: () => set({
        progress: null,
        stats: null,
        error: null,
      }),
    }),
    {
      name: 'studyio-user-storage',
      // Only persist local notes, not API data
      partialize: (state) => ({
        notes: state.notes,
      })
    }
  )
);