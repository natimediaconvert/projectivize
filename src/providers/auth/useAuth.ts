
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
      
      const startTime = Date.now();
      console.log('[DEBUG] Starting auth initialization at:', new Date().toISOString());
      setLoading(true);
      
      // Set a shorter timeout to prevent long loading
      authTimeout = setTimeout(() => {
        if (mounted && loading) {
          console.warn('[DEBUG] Auth initialization timed out after 1500ms at:', new Date().toISOString());
          setLoading(false);
        }
      }, 1500); // Keeping this at 1500ms
      
      try {
        console.log('[DEBUG] Getting auth session from Supabase');
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('[DEBUG] Error getting session:', error.message);
          if (mounted) {
            setLoading(false);
            clearTimeout(authTimeout);
          }
          return;
        }
        
        if (session?.user && mounted) {
          console.log('[DEBUG] Session found, setting user at:', new Date().toISOString());
          setUser(session.user);
          console.log('[DEBUG] Fetching user profile for ID:', session.user.id);
          await fetchUserProfile(session.user.id);
        } else if (mounted) {
          console.log('[DEBUG] No session found, user is logged out');
          setUser(null);
          setProfile(null);
        }
      } catch (error) {
        console.error('[DEBUG] Error initializing auth:', error);
      } finally {
        if (mounted) {
          const duration = Date.now() - startTime;
          console.log(`[DEBUG] Auth initialization completed in ${duration}ms`);
          setLoading(false);
          clearTimeout(authTimeout);
        }
      }
    };

    initAuth();

    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('[DEBUG] Auth state changed:', event, 'at:', new Date().toISOString());
        
        if (!mounted) return;
        
        // Clear timeout on any auth state change
        clearTimeout(authTimeout);
        
        if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
          if (session?.user) {
            console.log('[DEBUG] User signed in:', session.user.email);
            setUser(session.user);
            console.log('[DEBUG] Fetching profile after sign in');
            await fetchUserProfile(session.user.id);
          }
        } else if (event === 'SIGNED_OUT') {
          console.log('[DEBUG] User signed out, clearing state');
          setUser(null);
          setProfile(null);
        }
        
        // Set loading to false after processing the auth state change
        setLoading(false);
      }
    );

    return () => {
      console.log('[DEBUG] Cleaning up useAuthState effect');
      mounted = false;
      clearTimeout(authTimeout);
      subscription.unsubscribe();
    };
  }, []);
  
  return { user, profile, loading, setUser, setProfile };
};
