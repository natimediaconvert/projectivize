
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { supabase } from '@/integrations/supabase/client';
import { goalFormSchema, GoalFormValues } from '../schema/goalFormSchema';
import { GoalCategory } from '@/types/goals';
import { User } from '@/providers/auth/types';

interface UseGoalFormProps {
  user: User | null;
  onSuccess: () => void;
}

export function useGoalForm({ user, onSuccess }: UseGoalFormProps) {
  const form = useForm<GoalFormValues>({
    resolver: zodResolver(goalFormSchema),
    defaultValues: {
      title: '',
      description: '',
      category: 'professional',
    },
  });

  const onSubmit = async (values: GoalFormValues) => {
    try {
      if (!user) {
        throw new Error('You must be logged in to create a goal');
      }

      const { error } = await supabase.from('goals').insert({
        title: values.title,
        description: values.description || null,
        category: values.category as GoalCategory,
        deadline: values.deadline ? values.deadline.toISOString() : null,
        progress: 0,
        user_id: user.id,
      });

      if (error) throw error;
      
      onSuccess();
      form.reset();
    } catch (error: any) {
      console.error('Error creating goal:', error);
    }
  };

  return {
    form,
    onSubmit: form.handleSubmit(onSubmit),
  };
}
