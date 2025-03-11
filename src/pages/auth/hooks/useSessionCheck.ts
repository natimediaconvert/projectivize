
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
        console.log("[DEBUG] Auth page: Starting session check at:", new Date().toISOString());
        const { data, error } = await supabase.auth.getSession();
        
        if (!isMounted) {
          console.log("[DEBUG] Component unmounted during session check");
          return;
        }
        
        if (error) {
          console.error("[DEBUG] Auth page: Error checking session:", error.message);
          setCheckingSession(false);
          return;
        }
        
        console.log("[DEBUG] Auth page: Session check result:", data.session ? "Session found" : "No session");
        
        if (data.session) {
          console.log("[DEBUG] Auth page: User has active session, redirecting to home");
          navigate('/', { replace: true });
        } else {
          console.log("[DEBUG] Auth page: No active session found");
          setCheckingSession(false);
        }
      } catch (error: any) {
        console.error('[DEBUG] Error checking session:', error);
        if (isMounted) {
          setCheckingSession(false);
        }
      }
    };
    
    // Check session immediately
    checkUser();
    
    // Add a short safety timeout to prevent long loading - reduce to 500ms
    const safetyTimeoutId = setTimeout(() => {
      if (isMounted && checkingSession) {
        console.log("[DEBUG] Auth page: Safety timeout triggered - forcing completion of session check");
        setCheckingSession(false);
      }
    }, 500); // Reduced from 800ms to 500ms for faster display
    
    // Listen for auth state changes
    const { data } = supabase.auth.onAuthStateChange((event, session) => {
      if (!isMounted) {
        console.log("[DEBUG] Component unmounted during auth state change");
        return;
      }
      
      console.log("[DEBUG] Auth page: Auth state changed:", event);
      
      if (event === 'SIGNED_IN' && session) {
        console.log("[DEBUG] Auth page: User signed in, redirecting to home at:", new Date().toISOString());
        navigate('/', { replace: true });
      }
    });
    
    return () => {
      console.log("[DEBUG] Auth page: Cleaning up useSessionCheck effect");
      isMounted = false;
      clearTimeout(safetyTimeoutId);
      data.subscription.unsubscribe();
    };
  }, [navigate]);

  return { checkingSession };
};
