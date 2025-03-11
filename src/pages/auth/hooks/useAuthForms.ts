
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
      const result = await signIn({ email, password });
      const duration = Date.now() - startTime;
      
      if (result.error) {
        console.error('[DEBUG] Sign in error:', result.error.message);
        toast({
          variant: 'destructive',
          title: 'Error signing in',
          description: result.error.message
        });
      } else {
        console.log(`[DEBUG] Sign in successful after ${duration}ms, user:`, result.user?.email);
        toast({
          title: 'Welcome back!',
          description: 'Signed in successfully'
        });
        
        // Add a small timeout to ensure Supabase has time to process the authentication
        console.log('[DEBUG] Redirecting to dashboard after sign in');
        navigate('/', { replace: true });
      }
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
      const result = await signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
          }
        }
      });
      
      if (result.error) {
        console.error('[DEBUG] Sign up error:', result.error.message);
        toast({
          variant: 'destructive',
          title: 'Error signing up',
          description: result.error.message
        });
      } else {
        console.log('[DEBUG] Sign up successful');
        toast({
          title: 'Account created',
          description: 'Please check your email to confirm your account'
        });
      }
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
