
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';
import { useTranslation } from '@/providers/i18n/TranslationProvider';

export const useAuthForms = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();
  const { t } = useTranslation();

  // Helper function to reset the loading state and show an error message
  const handleError = (message: string) => {
    setLoading(false);
    toast({
      title: t('error'),
      description: message,
      variant: 'destructive',
    });
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      console.log("Attempting to sign up with email:", email);
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
          },
        },
      });

      if (error) throw error;
      
      if (data.user) {
        toast({
          title: t('signupSuccess'),
          description: t('checkEmail'),
        });
      }
    } catch (error: any) {
      console.error("Sign up error:", error.message);
      handleError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    // Declare the timeout variable
    let timeoutId: NodeJS.Timeout | undefined = undefined;
    
    try {
      // Set a timeout for the sign-in process
      const timeoutPromise = new Promise((_, reject) => {
        timeoutId = setTimeout(() => {
          reject(new Error("Sign in request timed out. Please try again."));
        }, 8000);
      });
      
      console.log("Attempting to sign in with email:", email);
      
      // Race between the sign-in process and the timeout
      const result = await Promise.race([
        supabase.auth.signInWithPassword({
          email,
          password,
        }),
        timeoutPromise
      ]);
      
      // If we got here, the sign-in completed before timeout
      // Clear the timeout
      if (timeoutId) {
        clearTimeout(timeoutId);
        timeoutId = undefined;
      }
      
      // Now process the result
      const { data, error } = result as Awaited<ReturnType<typeof supabase.auth.signInWithPassword>>;
      
      if (error) throw error;
      
      if (data.user) {
        console.log("Sign in successful, navigating to home");
        toast({
          title: t('welcomeBack'),
        });
        navigate('/', { replace: true });
      }
    } catch (error: any) {
      // Clear the timeout if it exists
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
      
      console.error("Sign in error:", error.message);
      handleError(error.message);
    } finally {
      // Just to be extra safe, clear the timeout again
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
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
