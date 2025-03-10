
export type GoalCategory = 'professional' | 'project' | 'personal';
export type GoalPriority = 'low' | 'medium' | 'high';

export interface Goal {
  id: string;
  title: string;
  description: string | null;
  category: GoalCategory;
  priority?: GoalPriority;
  progress: number;
  deadline: string | null;
  user_id: string;
  created_at: string;
  updated_at: string;
  user?: {
    id: string;
    full_name: string;
    profile_picture: string | null;
  };
}
