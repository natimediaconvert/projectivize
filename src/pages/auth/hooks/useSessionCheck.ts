
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
        }
      } catch (error) {
        console.error('Error checking session:', error);
      } finally {
        if (isMounted) {
          console.log("Auth page: Session check complete");
          setCheckingSession(false);
        }
      }
    };
    
    // Add a short timeout to allow state to settle
    const timeoutId = setTimeout(() => {
      checkUser();
    }, 100);
    
    return () => {
      isMounted = false;
      clearTimeout(timeoutId);
    };
  }, [navigate]);

  return { checkingSession };
};
