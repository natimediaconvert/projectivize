
import { Database } from '@/integrations/supabase/types';

export type User = any | null;
export type UIRole = 'admin' | 'manager' | 'team_member' | 'guest' | 'employee' | 'team_lead';
export type DBRole = Database['public']['Enums']['user_role'];

export interface UserProfile {
  id: string;
  full_name: string;
  role: UIRole;
  profile_picture?: string | null;
}

export interface AuthContextType {
  user: User;
  profile: UserProfile | null;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, fullName: string) => Promise<void>;
  signOut: () => Promise<void>;
  loading: boolean;
  updateProfile: (updates: Partial<Omit<UserProfile, 'role'>> & { role?: DBRole }) => Promise<void>;
}
