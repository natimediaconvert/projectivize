
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
    
    // Create a timeout to prevent infinite loading
    const timeoutId = setTimeout(() => {
      console.error("Sign in timed out after 8 seconds");
      setLoading(false);
      toast({
        title: t('error'),
        description: t('signInTimeout'),
        variant: 'destructive',
      });
    }, 8000); // 8 second timeout
    
    try {
      console.log("Attempting to sign in with email:", email);
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      // Clear the timeout since we got a response
      clearTimeout(timeoutId);

      if (error) throw error;
      
      if (data.user) {
        console.log("Sign in successful, navigating to home");
        toast({
          title: t('welcomeBack'),
        });
        navigate('/', { replace: true });
      }
    } catch (error: any) {
      // Clear the timeout
      clearTimeout(timeoutId);
      
      console.error("Sign in error:", error.message);
      handleError(error.message);
    } finally {
      clearTimeout(timeoutId); // Make sure timeout is cleared in all cases
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
