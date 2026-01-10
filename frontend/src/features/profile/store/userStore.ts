import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { progressService, type UserProgress as APIProgress, type ProgressStats } from '../services/progressService';

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
  
  // Streak refresh trigger
  streakRefreshTrigger: number;
  
  // Actions
  fetchProgress: () => Promise<void>;
  fetchStats: () => Promise<void>;
  updateProgress: (action: 'solved' | 'attempted' | 'streak', problemId?: string) => Promise<void>;
  refreshStreak: () => void; // Trigger calendar refresh
  
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
  streakRefreshTrigger: 0,
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
          // Silently fail - don't spam errors when backend is down
          console.warn('Progress API unavailable, using local data');
          set({ 
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
          // Silently fail - don't spam errors when backend is down
          console.warn('Stats API unavailable');
          set({ 
            isLoadingStats: false 
          });
        }
      },
      
      // Update progress on backend
      updateProgress: async (action: 'solved' | 'attempted' | 'streak', problemId?: string) => {
        set({ error: null });
        console.log('[userStore] updateProgress called:', { action, problemId });
        try {
          const progress = await progressService.updateProgress({
            action,
            problemId,
          });
          console.log('[userStore] Progress updated:', progress);
          set({ progress });
          
          // Trigger calendar refresh if streak was updated
          if (action === 'streak' || action === 'solved') {
            console.log('[userStore] Incrementing streakRefreshTrigger');
            set((state) => {
              const newTrigger = state.streakRefreshTrigger + 1;
              console.log('[userStore] streakRefreshTrigger:', state.streakRefreshTrigger, 'ΓåÆ', newTrigger);
              return { streakRefreshTrigger: newTrigger };
            });
          }
        } catch (error) {
          console.error('[userStore] Failed to update progress:', error);
          set({ 
            error: error instanceof Error ? error.message : 'Failed to update progress'
          });
          throw error; // Re-throw so the caller knows it failed
        }
      },
      
      // Manually trigger streak refresh
      refreshStreak: () => {
        console.log('[userStore] refreshStreak called manually');
        set((state) => {
          const newTrigger = state.streakRefreshTrigger + 1;
          console.log('[userStore] Manual refresh - streakRefreshTrigger:', state.streakRefreshTrigger, 'ΓåÆ', newTrigger);
          return { streakRefreshTrigger: newTrigger };
        });
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
