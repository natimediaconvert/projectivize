
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useProfile } from './useProfile';
import { User } from './types';

export const useAuthState = () => {
  const [user, setUser] = useState<User>(null);
  const [loading, setLoading] = useState(true);
  const { profile, setProfile, fetchUserProfile } = useProfile();

  useEffect(() => {
    let mounted = true;
    let authTimeout: NodeJS.Timeout;
    
    const initAuth = async () => {
      if (!mounted) return;
      
      setLoading(true);
      
      // Set a timeout to prevent infinite loading
      authTimeout = setTimeout(() => {
        if (mounted && loading) {
          console.warn('Auth initialization timed out');
          setLoading(false);
        }
      }, 10000); // Increase timeout to 10 seconds
      
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('Error getting session:', error.message);
          if (mounted) {
            setLoading(false);
          }
          return;
        }
        
        if (session?.user && mounted) {
          setUser(session.user);
          await fetchUserProfile(session.user.id);
        } 
      } catch (error) {
        console.error('Error initializing auth:', error);
      } finally {
        if (mounted) {
          setLoading(false);
          clearTimeout(authTimeout);
        }
      }
    };

    initAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state changed:', event);
        
        if (!mounted) return;
        
        if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
          if (session?.user) {
            setUser(session.user);
            await fetchUserProfile(session.user.id);
          }
        } else if (event === 'SIGNED_OUT') {
          setUser(null);
          setProfile(null);
        }
        
        // Set loading to false after processing the auth state change
        setLoading(false);
      }
    );

    return () => {
      mounted = false;
      clearTimeout(authTimeout);
      subscription.unsubscribe();
    };
  }, []);
  
  return { user, profile, loading, setUser, setProfile };
};
