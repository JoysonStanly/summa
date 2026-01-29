// Think First Feature Type Definitions

export interface ThinkFirstQuestion {
    id: number;
    codeLine: string;
    question: string;
    options: string[];
    correctIndex: number;
    hint: string;
}

export interface ThinkFirstState {
    currentQuestionIndex: number;
    answeredQuestions: Set<number>;
    showHint: boolean;
    isComplete: boolean;
}

export interface ThinkFirstData {
    problemId: string;
    questions: ThinkFirstQuestion[];
}

export interface QuestionAttempt {
    questionId: number;
    selectedIndex: number;
    isCorrect: boolean;
    timestamp: number;
}
