
import React, { useEffect, useState } from 'react';
import AuthContext from './AuthContext';
import { useAuthState } from './useAuth';
import { useAuthMethods } from './useAuthMethods';
import { useProfile } from './useProfile';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [authInitialized, setAuthInitialized] = useState(false);
  const { user, profile, loading: stateLoading, setUser, setProfile } = useAuthState();
  const { fetchUserProfile, updateUserProfile } = useProfile();
  
  // Initialize auth faster
  useEffect(() => {
    // Mark auth as initialized quickly
    if (!authInitialized) {
      console.log('[DEBUG] Auth initialized at:', new Date().toISOString());
      setAuthInitialized(true);
    }
  }, [authInitialized]);
  
  const { 
    signIn, 
    signUp, 
    signOut, 
    updateProfile, 
    loading: methodsLoading 
  } = useAuthMethods(user, setUser, { profile, setProfile, fetchUserProfile, updateUserProfile });

  // Only consider auth as loading during initial check
  const loading = stateLoading && !authInitialized;

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
