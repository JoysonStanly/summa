// Type definitions
export type Difficulty = 'easy' | 'medium' | 'hard';

// Enums as objects for runtime use
export const DifficultyValues = {
  EASY: 'easy' as Difficulty,
  MEDIUM: 'medium' as Difficulty,
  HARD: 'hard' as Difficulty
};

export type ContentType = 'video' | 'slides' | 'notes';

export const ContentTypeValues = {
  VIDEO: 'video' as ContentType,
  SLIDES: 'slides' as ContentType,
  NOTES: 'notes' as ContentType
};

export type SubmissionResult = 'accepted' | 'rejected' | 'error' | 'timeout';

export const SubmissionResultValues = {
  ACCEPTED: 'accepted' as SubmissionResult,
  REJECTED: 'rejected' as SubmissionResult,
  ERROR: 'error' as SubmissionResult,
  TIMEOUT: 'timeout' as SubmissionResult
};