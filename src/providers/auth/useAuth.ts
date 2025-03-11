
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
      
      // Shorter timeout (3 seconds) for auth initialization
      authTimeout = setTimeout(() => {
        if (mounted && loading) {
          console.warn('Auth initialization timed out');
          setLoading(false);
        }
      }, 3000);
      
      try {
        console.log('Checking for existing session...');
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
          console.log('Existing session found, setting user:', session.user.email);
          setUser(session.user);
          await fetchUserProfile(session.user.id);
          
          // If on auth page with valid session, redirect to home
          if (window.location.pathname === '/auth') {
            console.log('Redirecting from auth page to home due to valid session');
            window.location.href = '/';
          }
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

    // Listen for auth state changes with improved handling
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
            
            // Force redirect to home page immediately after sign in
            if (window.location.pathname === '/auth') {
              console.log('Detected sign in on auth page, redirecting to home');
              window.location.href = '/';
            }
          }
        } else if (event === 'SIGNED_OUT') {
          console.log('User signed out, clearing state');
          setUser(null);
          setProfile(null);
        }
        
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
