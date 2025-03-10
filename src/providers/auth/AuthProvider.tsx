
import React from 'react';
import AuthContext from './AuthContext';
import { useAuthState } from './useAuth';
import { useAuthMethods } from './useAuthMethods';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, profile, loading: stateLoading, setUser, setProfile } = useAuthState();
  const { 
    signIn, 
    signUp, 
    signOut, 
    updateProfile, 
    loading: methodsLoading 
  } = useAuthMethods(user, setUser, { profile, setProfile, fetchUserProfile: () => Promise.resolve(null), updateUserProfile: () => Promise.resolve({ success: false }) });

  // Combine loading states
  const loading = stateLoading || methodsLoading;

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
