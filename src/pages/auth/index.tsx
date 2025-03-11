
import React, { useEffect, useState } from 'react';
import { useSessionCheck } from './hooks/useSessionCheck';
import { useAuthForms } from './hooks/useAuthForms';
import AuthCard from './components/AuthCard';
import LoadingScreen from './components/LoadingScreen';

export default function AuthPage() {
  const { checkingSession } = useSessionCheck();
  const [logoLoaded, setLogoLoaded] = useState(false);
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

  // Add state to prevent flash of auth form
  const [showAuthCard, setShowAuthCard] = useState(false);

  useEffect(() => {
    // Preload logo
    const img = new Image();
    img.src = "/lovable-uploads/0cc3f056-b4cc-437a-8752-2e98414e29f8.png";
    img.onload = () => {
      setLogoLoaded(true);
    };
    
    // Log when the auth page renders
    console.log("[DEBUG] Auth page rendered at:", new Date().toISOString(), "checkingSession:", checkingSession);
    
    // Add a quick timeout to prevent a flash of the auth form while checking session
    const showAuthTimeout = setTimeout(() => {
      if (!checkingSession) {
        setShowAuthCard(true);
      }
    }, 100); // Short delay to let checkingSession update first
    
    return () => {
      console.log("[DEBUG] Auth page unmounted at:", new Date().toISOString());
      clearTimeout(showAuthTimeout);
    };
  }, [checkingSession]);

  // Update showAuthCard when checkingSession changes
  useEffect(() => {
    if (!checkingSession) {
      console.log("[DEBUG] Auth page: Session check complete, showing auth card");
      // Add a small delay to ensure smooth transition
      const timer = setTimeout(() => {
        setShowAuthCard(true);
      }, 50);
      return () => clearTimeout(timer);
    }
  }, [checkingSession]);

  // Show loading screen if checking session or if we're not ready to show auth card
  if (checkingSession || !showAuthCard) {
    console.log("[DEBUG] Auth page showing loading screen, logoLoaded:", logoLoaded);
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
