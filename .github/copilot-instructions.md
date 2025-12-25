# StudyIO Copilot Instructions

## Project Overview
StudyIO is a modern educational platform built with React + TypeScript + Vite, focusing on DSA (Data Structures & Algorithms) learning, core computer science subjects (OS, DBMS), and coding practice. The platform features an interactive coding environment, progress tracking, and comprehensive learning materials.

## Architecture & Key Patterns

### State Management
- **Zustand stores** (not Redux): Use `useProblemStore()` and `useUserStore()` for global state
- **React Context**: `AuthProvider` and `ThemeProvider` wrap the entire app
- **State persistence**: User data persists to localStorage automatically via Zustand middleware

### Component Organization
```
src/components/
├── auth/           # Authentication (AuthButtons, ProtectedRoute, RoleBadge)
├── editorial/      # Problem editorial UI (Editorial, CodeTabs, VideoCard)
├── navigation/     # Sidebar variants (MySidebar, DSASidebar, TopBar)
├── problem/        # Coding workspace (CodeEditor, ProblemStatement, AIAssistant)
├── ui/            # Reusable UI components (Card, Breadcrumbs, ProgressCircle)
└── [domain]/      # Feature-specific components
```

### Service Layer Pattern
All API communication goes through service files in `src/services/`:
- `api.ts` - Core API definitions and types
- `authService.ts` - Authentication with cookie-based sessions
- `problemService.ts` - Problem CRUD operations  
- `progressService.ts` - User progress tracking
- Mock implementations provided for development

### Data Flow & Types
- **Dual type definitions**: Types defined in both `src/types/models.ts` and `src/services/api.ts`
- **Enum-like objects**: Use `DifficultyValues.EASY` instead of string literals
- **Problem data**: Static data in `src/data/problems.ts`, dynamic via services

## Development Workflows

### Running the Project
```bash
# From project root (uses workspace configuration)
npm run dev          # Starts frontend dev server
npm run build        # Build for production
npm run lint         # ESLint with TypeScript rules
```

### Key Development Patterns

#### Component Structure
Always use functional components with proper TypeScript props:
```tsx
interface ComponentProps {
  userId: string;
  onComplete?: (result: any) => void;
}

const Component: React.FC<ComponentProps> = ({ userId, onComplete }) => {
  // Use appropriate store hook
  const { user } = useUserStore();
  // Component logic
};
```

#### State Store Usage
```tsx
// Problem workspace state
const { 
  setCurrentProblem, 
  updateEditorContent, 
  submitSolution 
} = useProblemStore();

// User progress tracking
const { 
  addCompletedProblem, 
  updateStreak, 
  user 
} = useUserStore();
```

#### Route Structure
- `/` - HomePage (protected)
- `/dsa/:topicId/:problemId` - Problem solving interface
- `/problems/:problemId/submit` - Submission page (protected)
- `/:subjectId/:moduleId/:topicId` - Core subject learning

#### Theme Integration
Use Tailwind classes with theme-aware colors:
```css
bg-bg-dark dark:bg-bg-light
text-text-dark dark:text-text-light
border-border-dark dark:border-border-light
```

### Component Conventions

#### Monaco Editor Integration
Use `@monaco-editor/react` with editor config from problem store:
```tsx
const { editorConfig, updateEditorContent } = useProblemStore();
// Theme, fontSize, tabSize, language are managed globally
```

#### Navigation Components
- `MySidebar` - DSA problem navigation with collapsible topics
- `TopBar` - Progress display with coins, streaks, progress bars
- `CoreSubjectSidebar` - Academic subject navigation

#### Editorial System
Problems include rich editorial content:
```tsx
<Editorial 
  title="Problem Title"
  sections={[{title: "Approach", content: "..."}]}
  solutions={{brute: {...}, optimal: {...}}}
  dryRunImages={[{id, src, alt}]}
/>
```

## Integration Points

### Authentication Flow
- Cookie-based sessions (no JWT in localStorage)
- Optional authentication - users can access content without login
- Role-based access: `student | instructor | admin`

### Code Submission Flow
1. `CodeEditor` → `useProblemStore.updateEditorContent()`
2. Submit → `problemService.submitSolution()`
3. Results → Update problem store with status/metrics

### Progress Tracking
- Automatic streak calculation on problem completion
- Progress persisted across sessions
- Heatmap visualization for activity tracking

## Critical Files
- `src/App.tsx` - Route definition and provider setup
- `src/store/problemStore.ts` - Coding workspace state
- `src/store/userStore.ts` - User progress and persistence
- `src/data/problems.ts` - Static problem definitions
- `frontend/tailwind.config.js` - Theme system configuration

## Common Pitfalls
- Don't use React.createContext for new global state - use Zustand
- Always check if problem exists before rendering (data comes from static files)
- Use absolute imports from `src/` root, not relative imports
- Theme classes require both dark/light variants in Tailwind
- Protected routes require `<ProtectedRoute>` wrapper, not manual auth checks