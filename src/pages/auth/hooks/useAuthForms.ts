
import { useState } from 'react';
import { useAuth } from '@/providers/AuthProvider';
import { useToast } from '@/components/ui/use-toast';
import { useNavigate } from 'react-router-dom';

export const useAuthForms = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [loading, setLoading] = useState(false);
  const { signIn, signUp } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Email and password are required'
      });
      return;
    }
    
    setLoading(true);
    console.log('[DEBUG] Attempting to sign in with email:', email, 'at:', new Date().toISOString());
    
    try {
      const startTime = Date.now();
      const result = await signIn(email, password);
      const duration = Date.now() - startTime;
      
      console.log(`[DEBUG] Sign in completed after ${duration}ms, redirecting to dashboard`);
      toast({
        title: 'Welcome back!',
        description: 'Signed in successfully'
      });
      
      navigate('/', { replace: true });
    } catch (error: any) {
      console.error('[DEBUG] Unexpected sign in error:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: error.message || 'An error occurred during sign in'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password || !fullName) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'All fields are required'
      });
      return;
    }
    
    setLoading(true);
    console.log('[DEBUG] Attempting to sign up with email:', email);
    
    try {
      await signUp(email, password, fullName);
      
      console.log('[DEBUG] Sign up successful');
      toast({
        title: 'Account created',
        description: 'Please check your email to confirm your account'
      });
    } catch (error: any) {
      console.error('[DEBUG] Unexpected sign up error:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: error.message || 'An error occurred during sign up'
      });
    } finally {
      setLoading(false);
    }
  };

  return {
    email,
    setEmail,
    password,
    setPassword,
    fullName,
    setFullName,
    loading,
    handleSignUp,
    handleSignIn
  };
};
