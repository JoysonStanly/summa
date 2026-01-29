import { create } from 'zustand';

interface ThinkFirstStore {
    currentQuestionIndex: number;
    answeredQuestions: Set<number>;
    showHint: boolean;
    isComplete: boolean;

    // Actions
    answerQuestion: (questionId: number, isCorrect: boolean) => void;
    toggleHint: () => void;
    nextQuestion: () => void;
    reset: () => void;
}

export const useThinkFirstStore = create<ThinkFirstStore>((set) => ({
    currentQuestionIndex: 0,
    answeredQuestions: new Set<number>(),
    showHint: false,
    isComplete: false,

    answerQuestion: (questionId: number, isCorrect: boolean) => {
        if (isCorrect) {
            set((state) => ({
                answeredQuestions: new Set(state.answeredQuestions).add(questionId),
                showHint: false,
            }));
        }
    },

    toggleHint: () => set((state) => ({ showHint: !state.showHint })),

    nextQuestion: () => set((state) => ({
        currentQuestionIndex: state.currentQuestionIndex + 1,
        showHint: false,
    })),

    reset: () => set({
        currentQuestionIndex: 0,
        answeredQuestions: new Set<number>(),
        showHint: false,
        isComplete: false,
    }),
}));
