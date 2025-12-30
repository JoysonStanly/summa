import { lazy, Suspense } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { ThemeProvider } from '@/shared/hooks/ThemeContext'
import { AuthProvider } from '@/features/auth/components/AuthProvider'
import { ToastProvider } from '@/shared/hooks/ToastContext'
import { ProtectedRoute } from '@/features/auth/components/ProtectedRoute'

// Auth pages
import LoginPage from '@/features/auth/pages/LoginPage'
import SignupPage from '@/features/auth/pages/SignupPage'
import UnauthorizedPage from '@/features/auth/pages/UnauthorizedPage'

// Dashboard pages
import LandingPage from '@/features/dashboard/pages/LandingPage'
import HomePage from '@/features/dashboard/pages/HomePage'

// Session pages
import SessionsPage from '@/features/sessions/pages/SessionsPage'
import AddSessionPage from '@/features/sessions/pages/AddSessionPage'
import EditSessionPage from '@/features/sessions/pages/EditSessionPage'

// Profile pages
import AccountPage from '@/features/profile/pages/AccountPage'

// Assessment pages
import AptitudePage from '@/features/assessment/pages/AptitudePage'
import LogicalReasoningPage from '@/features/assessment/pages/LogicalReasoningPage'
import VerbalAbilityPage from '@/features/assessment/pages/VerbalAbilityPage'
import MockTestPage from '@/features/assessment/pages/MockTestPage'

// Core subject pages
import CoreSubjectPage from '@/features/core-subjects/pages/CoreSubjectPage'

// Rankings pages
import RankingsPage from '@/features/rankings/pages/RankingsPage'

// Roadmap pages
import RoadmapPage from '@/features/roadmap/pages/RoadmapPage'
import RoadmapViewPage from '@/features/roadmap/pages/RoadmapViewPage'
import RoadmapCalendarPage from '@/features/roadmap/pages/RoadmapCalendarPage'

// Buganizer pages
import BuganizerPage from '@/features/buganizer/pages/BuganizerPage'

// Admin pages
import AdminProblemsPage from '@/features/admin/pages/AdminProblemsPage'
import AddProblemPage from '@/features/admin/pages/AddProblemPage'
import EditProblemPage from '@/features/admin/pages/EditProblemPage'
import AdminDashboardPage from '@/features/admin/pages/AdminDashboardPage'
import AdminBuganizerPage from '@/features/admin/pages/AdminBuganizerPage'
import AdminNotificationsPage from '@/features/admin/pages/AdminNotificationsPage'
import AdminSessionsPage from '@/features/admin/pages/AdminSessionsPage'
import AdminAptitudePage from '@/features/admin/pages/AdminAptitudePage'
import AdminUsersPage from '@/features/admin/pages/AdminUsersPage'

// Lazy-loaded components for better performance
const ProblemPage = lazy(() => import('@/features/problems/pages/ProblemPage'))
const ProblemSubmitPage = lazy(() => import('@/features/problems/pages/ProblemSubmitPage'))
const ProfilePage = lazy(() => import('@/features/profile/pages/ProfilePage'))
const EditorialPage = lazy(() => import('@/features/problems/pages/EditorialPage'))

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

              {/* DSA Routes - Support both 2-level and 3-level structure */}
              <Route path="/dsa/:topicId/:subtopicId/:problemId" element={<ProblemPage />} />
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
