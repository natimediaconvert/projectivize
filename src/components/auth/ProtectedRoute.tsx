
import React, { useState, useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/providers/AuthProvider';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';

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
  const { user, profile, loading, authInitialized } = useAuth();
  const location = useLocation();
  const [showRetry, setShowRetry] = useState(false);
  const [showLoading, setShowLoading] = useState(true);
  
  // Log protected route state
  useEffect(() => {
    console.log('[DEBUG] ProtectedRoute state:', 
      'path:', location.pathname,
      'loading:', loading, 
      'authInitialized:', authInitialized,
      'user:', user ? 'logged in' : 'not logged in'
    );
    
    // Hide loading screen quickly if we have determined auth state
    if (!loading || user || authInitialized) {
      const quickHideTimeout = setTimeout(() => {
        setShowLoading(false);
      }, 100);
      
      return () => clearTimeout(quickHideTimeout);
    }
  }, [location.pathname, loading, authInitialized, user]);
  
  // Set a faster timeout to show retry button if loading takes too long
  useEffect(() => {
    let timeoutId: NodeJS.Timeout;
    
    if (loading) {
      // Show retry after 1.5 seconds of loading (reduced from 3)
      timeoutId = setTimeout(() => {
        console.log('[DEBUG] ProtectedRoute showing retry button after timeout');
        setShowRetry(true);
      }, 1500);
    } else {
      setShowRetry(false);
    }
    
    return () => {
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [loading]);

  // Handle retry button click
  const handleRetry = () => {
    console.log('[DEBUG] ProtectedRoute retry button clicked, reloading page');
    window.location.reload();
  };

  // If still loading auth state and we're showing loading, show loading indicator
  if ((loading || !authInitialized) && showLoading) {
    console.log('[DEBUG] ProtectedRoute showing loading state');
    return (
      <div className="flex flex-col justify-center items-center h-screen">
        <div className="w-full max-w-md space-y-4 p-8">
          <Skeleton className="h-12 w-3/4 mx-auto" />
          <Skeleton className="h-32 w-full" />
          <div className="space-y-2">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-5/6" />
            <Skeleton className="h-4 w-4/6" />
          </div>
          <Skeleton className="h-10 w-28 mx-auto" />
          
          {showRetry && (
            <div className="flex flex-col items-center mt-8 space-y-2">
              <p className="text-sm text-muted-foreground">
                Taking longer than expected...
              </p>
              <Button 
                variant="outline" 
                onClick={handleRetry}
                className="mt-2"
              >
                Retry
              </Button>
            </div>
          )}
        </div>
      </div>
    );
  }

  // If not authenticated, redirect to login immediately
  if (!user) {
    console.log("[DEBUG] User not authenticated, redirecting to auth page");
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
  console.log('[DEBUG] ProtectedRoute - authentication successful, rendering children');
  return <>{children}</>;
};
