
import React, { useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/providers/AuthProvider';

// Use the same UIRole type as defined in AuthProvider
type UIRole = 'admin' | 'manager' | 'team_member' | 'guest' | 'employee' | 'team_lead';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRoles?: Array<UIRole>;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children,
  requiredRoles = []
}) => {
  const { user, profile, loading } = useAuth();
  const location = useLocation();

  // If still loading auth state, show loading indicator
  if (loading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  // If not authenticated, redirect to login
  if (!user) {
    return <Navigate to="/auth" state={{ from: location }} replace />;
  }

  // If role check is required
  if (requiredRoles.length > 0 && profile) {
    const hasRequiredRole = requiredRoles.includes(profile.role);
    
    if (!hasRequiredRole) {
      // User doesn't have required role, redirect to unauthorized page
      return <Navigate to="/unauthorized" replace />;
    }
  }

  // User is authenticated and has required role if specified
  return <>{children}</>;
};
