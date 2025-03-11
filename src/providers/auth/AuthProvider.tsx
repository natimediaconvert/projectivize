
import React, { useEffect, useState } from 'react';
import AuthContext from './AuthContext';
import { useAuthState } from './useAuth';
import { useAuthMethods } from './useAuthMethods';
import { useProfile } from './useProfile';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [authInitialized, setAuthInitialized] = useState(false);
  const { user, profile, loading: stateLoading, setUser, setProfile } = useAuthState();
  const { fetchUserProfile, updateUserProfile } = useProfile();
  
  // Initialize auth
  useEffect(() => {
    // Mark auth as initialized once the useAuthState has completed its initial check
    if (!stateLoading && !authInitialized) {
      console.log('[DEBUG] Auth initialized at:', new Date().toISOString(), 'user state:', user ? 'logged in' : 'logged out');
      setAuthInitialized(true);
    }
  }, [stateLoading, authInitialized, user]);
  
  const { 
    signIn, 
    signUp, 
    signOut, 
    updateProfile, 
    loading: methodsLoading 
  } = useAuthMethods(user, setUser, { profile, setProfile, fetchUserProfile, updateUserProfile });

  // Only consider auth as loading during initial check
  const loading = stateLoading;

  // Add some debug info
  useEffect(() => {
    console.log('[DEBUG] AuthProvider state updated:', 
      'loading:', loading, 
      'authInitialized:', authInitialized, 
      'user:', user ? 'present' : 'null'
    );
  }, [loading, authInitialized, user]);

  const value = {
    user,
    profile,
    signIn,
    signUp,
    signOut,
    loading,
    updateProfile,
    authInitialized,
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
