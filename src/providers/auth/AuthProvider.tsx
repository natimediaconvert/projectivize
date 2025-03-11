
import React, { useEffect, useState } from 'react';
import AuthContext from './AuthContext';
import { useAuthState } from './useAuth';
import { useAuthMethods } from './useAuthMethods';
import { useProfile } from './useProfile';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [authInitialized, setAuthInitialized] = useState(false);
  const { user, profile, loading: stateLoading, setUser, setProfile } = useAuthState();
  const { fetchUserProfile, updateUserProfile } = useProfile();
  
  // Initialize auth with improved logging and timing
  useEffect(() => {
    if (!stateLoading && !authInitialized) {
      console.log('Auth initialized, user state:', user ? 'logged in' : 'logged out');
      setAuthInitialized(true);
      
      // If user is authenticated, ensure the UI is updated immediately
      if (user && window.location.pathname === '/auth') {
        console.log('User is authenticated but on auth page, redirecting to home');
        window.location.href = '/';
      }
    }
  }, [stateLoading, authInitialized, user]);
  
  const { 
    signIn, 
    signUp, 
    signOut, 
    updateProfile, 
    loading: methodsLoading 
  } = useAuthMethods(user, setUser, { profile, setProfile, fetchUserProfile, updateUserProfile });

  // Simplified loading state
  const loading = stateLoading;

  const value = {
    user,
    profile,
    signIn,
    signUp,
    signOut,
    loading,
    updateProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = React.useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
