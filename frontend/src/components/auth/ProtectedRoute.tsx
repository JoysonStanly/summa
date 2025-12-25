import type { ReactNode } from 'react';

interface ProtectedRouteProps {
  children: ReactNode;
  requiredRole?: 'student' | 'instructor' | 'admin';
}

export const ProtectedRoute = ({ 
  children
}: ProtectedRouteProps) => {
  // No authentication required - just render children
  return <>{children}</>;
};