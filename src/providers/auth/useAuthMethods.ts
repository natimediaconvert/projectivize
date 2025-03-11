
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';
import { useTranslation } from '@/providers/i18n/TranslationProvider';
import { User, UserProfile } from './types';
import { useProfile } from './useProfile';
import { useNavigate } from 'react-router-dom';

type ProfileHelpers = {
  profile: UserProfile | null;
  setProfile: React.Dispatch<React.SetStateAction<UserProfile | null>>;
  fetchUserProfile: ReturnType<typeof useProfile>['fetchUserProfile'];
  updateUserProfile: ReturnType<typeof useProfile>['updateUserProfile'];
};

export const useAuthMethods = (
  user: User, 
  setUser: (user: User) => void,
  { profile, setProfile, fetchUserProfile, updateUserProfile }: ProfileHelpers
) => {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const { t } = useTranslation();
  const navigate = useNavigate();

  const signIn = async (email: string, password: string) => {
    try {
      console.log('[DEBUG] Starting sign in process with:', email);
      setLoading(true);
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        console.error('[DEBUG] Sign in error from Supabase:', error.message);
        throw error;
      }
      
      console.log('[DEBUG] Sign in successful, user data received:', !!data.user);
      
      if (data.user) {
        setUser(data.user);
        await fetchUserProfile(data.user.id);
        toast({
          title: t('welcomeBack'),
        });
        return { user: data.user };
      }
      
      return { user: null };
    } catch (error: any) {
      console.error('[DEBUG] Error in signIn method:', error.message);
      toast({
        title: t('error'),
        description: error.message,
        variant: 'destructive',
      });
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const signUp = async (email: string, password: string, fullName: string) => {
    try {
      console.log('[DEBUG] Starting sign up process with:', email);
      setLoading(true);
      
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
          },
        },
      });

      if (error) {
        console.error('[DEBUG] Sign up error from Supabase:', error.message);
        throw error;
      }
      
      console.log('[DEBUG] Sign up successful, confirmation email sent');
      
      toast({
        title: t('signupSuccess'),
        description: t('checkEmail'),
      });
      
      return { user: data.user };
    } catch (error: any) {
      console.error('[DEBUG] Error in signUp method:', error.message);
      toast({
        title: t('error'),
        description: error.message,
        variant: 'destructive',
      });
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    try {
      console.log('[DEBUG] Starting sign out process...');
      
      // First clear local state immediately for better UX
      setUser(null);
      setProfile(null);
      
      // Navigate to auth page first
      navigate('/auth');
      
      // Then sign out from Supabase in the background
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error('[DEBUG] Sign out error from Supabase:', error.message);
        throw error;
      }
      
      console.log('[DEBUG] Sign out successful, user state cleared');
      
      toast({
        title: t('signedOut'),
      });
    } catch (error: any) {
      console.error('[DEBUG] Error in signOut method:', error.message);
      toast({
        title: t('error'),
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = async (updates: Partial<Omit<UserProfile, "role">> & { role?: any }) => {
    try {
      if (!user) throw new Error('No user logged in');
      
      setLoading(true);
      
      const result = await updateUserProfile(user.id, updates);
      
      if (!result.success) throw result.error;
      
      toast({
        title: t('profileUpdated'),
      });
    } catch (error: any) {
      toast({
        title: t('error'),
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return {
    signIn,
    signUp,
    signOut,
    updateProfile,
    loading
  };
};
