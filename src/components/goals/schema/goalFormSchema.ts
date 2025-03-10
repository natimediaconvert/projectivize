
import { z } from 'zod';

export const goalFormSchema = z.object({
  title: z.string().min(3, { message: 'Title must be at least 3 characters' }),
  description: z.string().optional(),
  category: z.enum(['professional', 'project', 'personal']),
  deadline: z.date().optional(),
});

export type GoalFormValues = z.infer<typeof goalFormSchema>;
