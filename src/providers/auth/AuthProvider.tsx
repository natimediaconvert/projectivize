
import React from 'react';
import AuthContext from './AuthContext';
import { useAuthState } from './useAuth';
import { useAuthMethods } from './useAuthMethods';
import { useProfile } from './useProfile';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { profile, setProfile, fetchUserProfile, updateUserProfile } = useProfile();
  const { user, loading: stateLoading, setUser } = useAuthState();
  const { 
    signIn, 
    signUp, 
    signOut, 
    updateProfile, 
    loading: methodsLoading 
  } = useAuthMethods(user, setUser, { profile, setProfile, fetchUserProfile, updateUserProfile });

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
