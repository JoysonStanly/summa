import { lazy, Suspense } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { ThemeProvider } from './context/ThemeContext'
import { AuthProvider } from './context/AuthProvider'
import { ProtectedRoute } from './components/auth/ProtectedRoute'
import HomePage from './pages/HomePage'
import SessionsPage from './pages/SessionsPage'
import UnauthorizedPage from './pages/UnauthorizedPage'

import CoreSubjectPage from './pages/CoreSubjectPage'
import { QuizPage } from './pages/QuizPage'
import RankingsPage from './pages/RankingsPage'

// Lazy-loaded components for better performance
const ProblemPage = lazy(() => import('./pages/ProblemPage'))
const ProblemSubmitPage = lazy(() => import('./pages/ProblemSubmitPage'))
const ProfilePage = lazy(() => import('./pages/ProfilePage'))
const EditorialPage = lazy(() => import('./pages/EditorialPage'))

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Router>
          <Suspense fallback={<div className="flex items-center justify-center h-screen text-white bg-background">Loading...</div>}>
            <Routes>
              <Route path="/" element={
                <ProtectedRoute>
                  <HomePage />
                </ProtectedRoute>
              } />
              <Route path="/unauthorized" element={<UnauthorizedPage />} />
              <Route path="/sessions" element={<SessionsPage />} />
              
              {/* Protected Routes */}
              <Route path="/profile" element={
                <ProtectedRoute>
                  <ProfilePage />
                </ProtectedRoute>
              } />

              <Route path="/dsa/:topicId/:problemId" element={<ProblemPage />} />
              <Route path="/:topicId/:problemId/editorial" element={<EditorialPage />} />
              <Route path="/problems/:problemId/submit" element={
                <ProtectedRoute>
                  <ProblemSubmitPage />
                </ProtectedRoute>
              } />
              <Route path="/quiz" element={<QuizPage />} />
              <Route path="/rankings" element={<RankingsPage />} />
              <Route path="/:subjectId" element={<CoreSubjectPage />} />
              <Route path="/:subjectId/:moduleId/:topicId" element={<CoreSubjectPage />} />
            </Routes>
          </Suspense>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  )
}

export default App
