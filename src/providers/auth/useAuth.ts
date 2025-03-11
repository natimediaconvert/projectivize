
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
      }, 5000); // 5 second timeout
      
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
          console.log('Session found, setting user');
          setUser(session.user);
          await fetchUserProfile(session.user.id);
        } else if (mounted) {
          console.log('No session found, user is logged out');
          setUser(null);
          setProfile(null);
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

    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state changed:', event);
        
        if (!mounted) return;
        
        // Clear timeout on any auth state change
        clearTimeout(authTimeout);
        
        if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
          if (session?.user) {
            console.log('User signed in:', session.user.email);
            setUser(session.user);
            await fetchUserProfile(session.user.id);
          }
        } else if (event === 'SIGNED_OUT') {
          console.log('User signed out, clearing state');
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
