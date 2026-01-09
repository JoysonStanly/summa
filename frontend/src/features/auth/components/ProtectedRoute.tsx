import { Navigate } from 'react-router-dom';
import { useAuth } from '@/features/auth/stores/AuthContext';
import { LoadingSpinner } from '@/components/ui';
import type { ReactNode } from 'react';

interface ProtectedRouteProps {
  children: ReactNode;
  requiredRole?: 'student' | 'instructor' | 'admin';
}

export const ProtectedRoute = ({ 
  children,
  requiredRole 
}: ProtectedRouteProps) => {
  const { user, loading, isAuthenticated } = useAuth();

  // Show loading while checking auth
  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-[#0a0a0a] text-white">
        <LoadingSpinner />
      </div>
    );
  }

  // Not logged in → redirect to login
  if (!isAuthenticated()) {
    return <Navigate to="/login" replace />;
  }

  // Check role if required
  if (requiredRole && user?.role !== requiredRole) {
    // Not authorized → redirect to unauthorized page
    return <Navigate to="/unauthorized" replace />;
  }

  // All checks passed → render children
  return <>{children}</>;
};