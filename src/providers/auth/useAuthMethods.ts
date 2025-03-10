import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';
import { useTranslation } from '@/providers/i18n/TranslationProvider';
import { User, UserProfile } from './types';
import { useProfile } from './useProfile';

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

  const signIn = async (email: string, password: string) => {
    try {
      setLoading(true);
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;
      
      if (data.user) {
        setUser(data.user);
        await fetchUserProfile(data.user.id);
        toast({
          title: t('welcomeBack'),
        });
      }
    } catch (error: any) {
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

      if (error) throw error;
      
      toast({
        title: t('signupSuccess'),
        description: t('checkEmail'),
      });
      
    } catch (error: any) {
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
      setLoading(true);
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      
      setUser(null);
      
      toast({
        title: t('signedOut'),
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
