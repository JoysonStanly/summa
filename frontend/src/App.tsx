import { lazy, Suspense } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { ThemeProvider } from './context/ThemeContext'
import { AuthProvider } from './context/AuthProvider'
import { ToastProvider } from './context/ToastContext'
import { ProtectedRoute } from './components/auth/ProtectedRoute'
import LandingPage from './pages/LandingPage'
import LoginPage from './pages/LoginPage'
import SignupPage from './pages/SignupPage'
import HomePage from './pages/HomePage'
import SessionsPage from './pages/SessionsPage'
import UnauthorizedPage from './pages/UnauthorizedPage'
import AccountPage from './pages/AccountPage'
import BuganizerPage from './pages/BuganizerPage'
import AdminProblemsPage from './pages/AdminProblemsPage'
import AddProblemPage from './pages/AddProblemPage'
import EditProblemPage from './pages/EditProblemPage'
import AdminDashboardPage from './pages/AdminDashboardPage'
import AdminBuganizerPage from './pages/AdminBuganizerPage'
import AdminNotificationsPage from './pages/AdminNotificationsPage'
import AdminSessionsPage from './pages/AdminSessionsPage'
import AddSessionPage from './pages/AddSessionPage'
import EditSessionPage from './pages/EditSessionPage'
import AdminAptitudePage from './pages/AdminAptitudePage'
import AdminUsersPage from './pages/AdminUsersPage'

import CoreSubjectPage from './pages/CoreSubjectPage'
import AptitudePage from './pages/AptitudePage'
import LogicalReasoningPage from './pages/LogicalReasoningPage'
import VerbalAbilityPage from './pages/VerbalAbilityPage'
import MockTestPage from './pages/MockTestPage'
import RankingsPage from './pages/RankingsPage'
import RoadmapPage from './pages/RoadmapPage'
import RoadmapViewPage from './pages/RoadmapViewPage'
import RoadmapCalendarPage from './pages/RoadmapCalendarPage'

// Lazy-loaded components for better performance
const ProblemPage = lazy(() => import('./pages/ProblemPage'))
const ProblemSubmitPage = lazy(() => import('./pages/ProblemSubmitPage'))
const ProfilePage = lazy(() => import('./pages/ProfilePage'))
const EditorialPage = lazy(() => import('./pages/EditorialPage'))

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <ToastProvider>
          <Router>
            <Suspense fallback={<div className="flex items-center justify-center h-screen text-white bg-background">Loading...</div>}>
              <Routes>
              <Route path="/" element={<LandingPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/signup" element={<SignupPage />} />
              <Route path="/home" element={
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
              <Route path="/quiz" element={<AptitudePage />} />
              <Route path="/quiz/:categoryId/:subCategoryId" element={<AptitudePage />} />
              <Route path="/logical-reasoning" element={<LogicalReasoningPage />} />
              <Route path="/logical-reasoning/:categoryId/:subCategoryId" element={<LogicalReasoningPage />} />
              <Route path="/verbal-ability" element={<VerbalAbilityPage />} />
              <Route path="/verbal-ability/:categoryId/:subCategoryId" element={<VerbalAbilityPage />} />
              <Route path="/mock-test" element={<MockTestPage />} />
              <Route path="/mock-test/:categoryId/:subCategoryId" element={<MockTestPage />} />
              <Route path="/rankings" element={<RankingsPage />} />
              <Route path="/plus/dsa/roadmap" element={<RoadmapPage />} />
              <Route path="/plus/dsa/roadmap/calendar" element={<RoadmapCalendarPage />} />
              <Route path="/plus/dsa/roadmap/view" element={<RoadmapViewPage />} />
              <Route path="/plus/account" element={
                <ProtectedRoute>
                  <AccountPage />
                </ProtectedRoute>
              } />
              <Route path="/plus/buganizer" element={
                <ProtectedRoute>
                  <BuganizerPage />
                </ProtectedRoute>
              } />
              
              {/* Admin Routes */}
              <Route path="/admin" element={
                <ProtectedRoute>
                  <AdminDashboardPage />
                </ProtectedRoute>
              } />
              <Route path="/admin/problems" element={
                <ProtectedRoute>
                  <AdminProblemsPage />
                </ProtectedRoute>
              } />
              <Route path="/admin/problems/new" element={
                <ProtectedRoute>
                  <AddProblemPage />
                </ProtectedRoute>
              } />
              <Route path="/admin/problems/:problemId/edit" element={
                <ProtectedRoute>
                  <EditProblemPage />
                </ProtectedRoute>
              } />
              <Route path="/admin/buganizer" element={
                <ProtectedRoute>
                  <AdminBuganizerPage />
                </ProtectedRoute>
              } />
              <Route path="/admin/notifications" element={
                <ProtectedRoute>
                  <AdminNotificationsPage />
                </ProtectedRoute>
              } />
              <Route path="/admin/sessions" element={
                <ProtectedRoute>
                  <AdminSessionsPage />
                </ProtectedRoute>
              } />
              <Route path="/admin/sessions/new" element={
                <ProtectedRoute>
                  <AddSessionPage />
                </ProtectedRoute>
              } />
              <Route path="/admin/sessions/:sessionId/edit" element={
                <ProtectedRoute>
                  <EditSessionPage />
                </ProtectedRoute>
              } />
              <Route path="/admin/aptitude" element={
                <ProtectedRoute>
                  <AdminAptitudePage />
                </ProtectedRoute>
              } />
              <Route path="/admin/users" element={
                <ProtectedRoute>
                  <AdminUsersPage />
                </ProtectedRoute>
              } />
              
              <Route path="/:subjectId" element={<CoreSubjectPage />} />
              <Route path="/:subjectId/:moduleId/:topicId" element={<CoreSubjectPage />} />
            </Routes>
          </Suspense>
        </Router>
      </ToastProvider>
      </AuthProvider>
    </ThemeProvider>
  )
}

export default App
