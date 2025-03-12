import { User } from '@supabase/supabase-js';
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useTranslation } from '@/providers/i18n/TranslationProvider';
import { toast } from '@/components/ui/use-toast';
import { UserProfile } from './types';

export const useAuthMethods = (
  user: User | null,
  setUser: (user: User | null) => void,
  profileOptions: {
    profile: UserProfile | null;
    setProfile: (profile: UserProfile | null) => void;
    fetchUserProfile: (userId: string) => Promise<UserProfile | null>;
    updateUserProfile: (userId: string, profile: Partial<UserProfile>) => Promise<any>;
  }
) => {
  const [loading, setLoading] = useState(false);
  const { t } = useTranslation();
  const { profile, setProfile, fetchUserProfile, updateUserProfile } = profileOptions;

  const signIn = async (email: string, password: string) => {
    setLoading(true);
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        throw new Error(error.message || t('signInTimeout'));
      }

      if (data.user) {
        setUser(data.user);
        await fetchUserProfile(data.user.id);
        toast({
          title: t('welcomeBack'),
          description: `${t('signingIn')} ${email}`,
        });
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : t('error');
      toast({
        variant: 'destructive',
        title: t('error'),
        description: message,
      });
    } finally {
      setLoading(false);
    }
  };

  const signUp = async (email: string, password: string, fullName: string) => {
    setLoading(true);
    try {
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
          },
        },
      });

      if (authError) {
        throw new Error(authError.message || t('error'));
      }

      if (authData.user) {
        setUser(authData.user);
        await fetchUserProfile(authData.user.id);
        toast({
          title: t('signupSuccess'),
          description: t('checkEmail'),
        });
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : t('error');
      toast({
        variant: 'destructive',
        title: t('error'),
        description: message,
      });
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    setLoading(true);
    try {
      const { error } = await supabase.auth.signOut();

      if (error) {
        throw new Error(error.message || t('error'));
      }

      setUser(null);
      setProfile(null);
      toast({
        description: t('signedOut'),
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : t('error');
      toast({
        variant: 'destructive',
        title: t('error'),
        description: message,
      });
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = async (updates: Partial<UserProfile>) => {
    if (!user) {
      console.error('No user to update profile for.');
      return;
    }

    setLoading(true);
    try {
      const updatedProfile = await updateUserProfile(user.id, updates);

      if (updatedProfile) {
        setProfile(updatedProfile);
        toast({
          description: t('profileUpdated'),
        });
      } else {
        toast({
          variant: 'destructive',
          title: t('error'),
          description: 'Failed to update profile.',
        });
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : t('error');
      toast({
        variant: 'destructive',
        title: t('error'),
        description: message,
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
