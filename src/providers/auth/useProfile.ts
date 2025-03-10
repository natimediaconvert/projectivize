
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { UserProfile } from './types';

export const useProfile = () => {
  const [profile, setProfile] = useState<UserProfile | null>(null);

  const fetchUserProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) {
        console.error('Error fetching user profile:', error.message);
        return null;
      }
      
      if (data) {
        setProfile(data as UserProfile);
        return data;
      }
      return null;
    } catch (error: any) {
      console.error('Error fetching user profile:', error.message);
      return null;
    }
  };

  const updateUserProfile = async (
    userId: string, 
    updates: Partial<Omit<UserProfile, 'role'>> & { role?: any }
  ) => {
    try {
      const { error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('id', userId);
      
      if (error) throw error;
      
      if (profile) {
        setProfile({ ...profile, ...updates as any });
      }
      
      return { success: true };
    } catch (error: any) {
      console.error('Error updating profile:', error.message);
      return { success: false, error };
    }
  };

  return {
    profile,
    setProfile,
    fetchUserProfile,
    updateUserProfile
  };
};
