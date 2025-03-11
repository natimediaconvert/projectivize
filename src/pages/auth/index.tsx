
import React from 'react';
import { useSessionCheck } from './hooks/useSessionCheck';
import { useAuthForms } from './hooks/useAuthForms';
import AuthCard from './components/AuthCard';
import LoadingScreen from './components/LoadingScreen';

export default function AuthPage() {
  const { checkingSession } = useSessionCheck();
  const {
    email,
    setEmail,
    password,
    setPassword,
    fullName,
    setFullName,
    loading,
    handleSignUp,
    handleSignIn
  } = useAuthForms();

  if (checkingSession) {
    return <LoadingScreen />;
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-background p-4">
      <AuthCard
        email={email}
        setEmail={setEmail}
        password={password}
        setPassword={setPassword}
        fullName={fullName}
        setFullName={setFullName}
        loading={loading}
        handleSignIn={handleSignIn}
        handleSignUp={handleSignUp}
      />
    </div>
  );
}
