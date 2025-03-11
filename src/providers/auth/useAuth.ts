
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
      }, 20000); // Increase timeout to 20 seconds
      
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('Error getting session:', error.message);
          if (mounted) {
            setLoading(false);
            clearTimeout(authTimeout);
          }
          return;
        }
        
        if (session?.user && mounted) {
          console.log('Session found during initialization');
          setUser(session.user);
          await fetchUserProfile(session.user.id);
          clearTimeout(authTimeout);
          setLoading(false);
        } else if (mounted) {
          console.log('No session found during initialization');
          setLoading(false);
          clearTimeout(authTimeout);
        }
      } catch (error) {
        console.error('Error initializing auth:', error);
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
        
        // Always clear the timeout on any auth state change
        clearTimeout(authTimeout);
        
        if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
          if (session?.user) {
            console.log('User signed in or token refreshed:', session.user.id);
            setUser(session.user);
            await fetchUserProfile(session.user.id);
          }
        } else if (event === 'SIGNED_OUT') {
          console.log('User signed out');
          setUser(null);
          setProfile(null);
        }
        
        // Always set loading to false after processing the auth state change
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
