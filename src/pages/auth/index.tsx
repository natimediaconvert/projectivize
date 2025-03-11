
import React, { useEffect } from 'react';
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

  useEffect(() => {
    // Preload any necessary resources
    const img = new Image();
    img.src = "/lovable-uploads/0cc3f056-b4cc-437a-8752-2e98414e29f8.png";
    
    // Log when the auth page renders and its loading state
    console.log("[DEBUG] Auth page rendered at:", new Date().toISOString(), "checkingSession:", checkingSession);
    
    return () => {
      console.log("[DEBUG] Auth page unmounted at:", new Date().toISOString());
    };
  }, [checkingSession]);

  // Render loading screen for a very short time if checking session
  if (checkingSession) {
    console.log("[DEBUG] Auth page showing loading screen");
    return <LoadingScreen />;
  }

  console.log("[DEBUG] Auth page showing auth card");
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
