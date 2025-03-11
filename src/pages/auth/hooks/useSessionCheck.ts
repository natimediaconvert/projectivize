
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';

export const useSessionCheck = () => {
  const [checkingSession, setCheckingSession] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    let isMounted = true;
    
    const checkUser = async () => {
      try {
        console.log("Auth page: Checking session...");
        const { data, error } = await supabase.auth.getSession();
        
        if (!isMounted) return;
        
        if (error) {
          console.error("Auth page: Error checking session:", error.message);
          setCheckingSession(false);
          return;
        }
        
        if (data.session) {
          console.log("Auth page: User has active session, redirecting to home");
          // Use setTimeout to ensure this happens outside the current execution cycle
          // and give a bit more time for the auth state to be properly updated
          setTimeout(() => {
            if (isMounted) {
              console.log("Auth page: Navigating to home page");
              navigate('/', { replace: true });
            }
          }, 300); // Significantly increased timeout for more reliable navigation
        } else {
          console.log("Auth page: No active session found");
          setCheckingSession(false);
        }
      } catch (error: any) {
        console.error('Error checking session:', error);
        if (isMounted) {
          setCheckingSession(false);
        }
      }
    };
    
    // Check session immediately
    checkUser();
    
    // Add a safety timeout to prevent indefinite loading
    const safetyTimeoutId = setTimeout(() => {
      if (isMounted && checkingSession) {
        console.log("Auth page: Safety timeout triggered - forcing completion of session check");
        setCheckingSession(false);
      }
    }, 1500); // Increased timeout for better reliability
    
    // Listen for auth state changes
    const { data } = supabase.auth.onAuthStateChange((event, session) => {
      if (!isMounted) return;
      
      console.log("Auth page: Auth state changed:", event);
      
      if (event === 'SIGNED_IN' && session) {
        console.log("Auth page: User signed in, redirecting to home");
        // Use setTimeout to ensure this happens outside the current execution cycle
        // and give a bit more time for the auth state to be properly updated
        setTimeout(() => {
          if (isMounted) {
            console.log("Auth page: Navigating to home page after sign in");
            // Force refresh the page when redirecting after sign in
            window.location.href = '/';
          }
        }, 500); // Significantly increased timeout for more reliable navigation
      }
    });
    
    return () => {
      isMounted = false;
      clearTimeout(safetyTimeoutId);
      data.subscription.unsubscribe();
    };
  }, [navigate]);

  return { checkingSession };
};
