
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
        const { data } = await supabase.auth.getSession();
        
        if (!isMounted) return;
        
        if (data.session) {
          console.log("Auth page: User has active session, redirecting to home");
          navigate('/', { replace: true });
        } else {
          console.log("Auth page: No active session found");
          setCheckingSession(false);
        }
      } catch (error) {
        console.error('Error checking session:', error);
        if (isMounted) {
          setCheckingSession(false);
        }
      }
    };
    
    // Check session immediately, but use a very short timeout 
    // to ensure the component is mounted
    const timeoutId = setTimeout(() => {
      checkUser();
    }, 50);
    
    // Add a safety timeout to prevent indefinite loading
    const safetyTimeoutId = setTimeout(() => {
      if (isMounted && checkingSession) {
        console.log("Auth page: Safety timeout triggered - forcing completion of session check");
        setCheckingSession(false);
      }
    }, 2000); // 2 second safety timeout
    
    return () => {
      isMounted = false;
      clearTimeout(timeoutId);
      clearTimeout(safetyTimeoutId);
    };
  }, [navigate]);

  return { checkingSession };
};
