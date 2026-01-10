// Application-wide constants

export const APP_NAME = 'StudyIO';
export const APP_DESCRIPTION = 'Learning Dashboard';

export const ROUTES = {
  HOME: '/home',
  LOGIN: '/login',
  SIGNUP: '/signup',
  PROFILE: '/profile',
  ACCOUNT: '/account',
  RANKINGS: '/rankings',
  BUGANIZER: '/buganizer',
  ADMIN: '/admin',
  SESSIONS: '/sessions',
  DSA: '/dsa',
  QUIZ: '/quiz',
  LOGICAL_REASONING: '/logical-reasoning',
  VERBAL_ABILITY: '/verbal-ability',
  MOCK_TEST: '/mock-test',
  ROADMAP: '/dsa/roadmap',
} as const;

export const USER_ROLES = {
  STUDENT: 'student',
  INSTRUCTOR: 'instructor',
  ADMIN: 'admin',
} as const;

export const STORAGE_KEYS = {
  USER: 'studyio_user',
  THEME: 'studyio_theme',
  AUTH_TOKEN: 'studyio_auth_token',
} as const;

export const DIFFICULTY_LEVELS = {
  EASY: 'Easy',
  MEDIUM: 'Medium',
  HARD: 'Hard',
} as const;

export const SUBMISSION_STATUS = {
  PENDING: 'pending',
  ACCEPTED: 'accepted',
  WRONG_ANSWER: 'wrong_answer',
  TIME_LIMIT_EXCEEDED: 'time_limit_exceeded',
  RUNTIME_ERROR: 'runtime_error',
  COMPILATION_ERROR: 'compilation_error',
} as const;
