
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { startOfDay, endOfWeek, isAfter, isBefore, parseISO, isSameDay } from 'date-fns';

export type TaskStatus = 'pending' | 'in_progress' | 'completed';
export type TaskPriority = 'low' | 'medium' | 'high' | 'urgent';
export type DateRange = 'all' | 'today' | 'thisWeek' | 'overdue' | 'none';

export type TaskFiltersType = {
  search: string;
  status: TaskStatus[];
  priority: TaskPriority[];
  assignee: string[];
  team: string[];
  dueDateRange: DateRange;
};

export const useTasks = (filters: TaskFiltersType, isMyTasksOnly: boolean) => {
  return useQuery({
    queryKey: ['tasks', filters, isMyTasksOnly],
    queryFn: async () => {
      let query = supabase
        .from('tasks')
        .select(`
          *,
          assigned_to:assigned_to (
            id,
            full_name,
            profile_picture
          ),
          created_by:created_by (
            id,
            full_name
          ),
          team:team_id (
            id,
            name
          )
        `)
        .order('created_at', { ascending: false });

      // Get current user for "My Tasks" filter
      if (isMyTasksOnly) {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          query = query.eq('assigned_to', user.id);
        }
      }

      // Apply search filter
      if (filters.search) {
        query = query.ilike('title', `%${filters.search}%`);
      }

      // Apply status filter
      if (filters.status && filters.status.length > 0) {
        query = query.in('status', filters.status);
      }

      // Apply priority filter
      if (filters.priority && filters.priority.length > 0) {
        query = query.in('priority', filters.priority);
      }

      // Apply assignee filter
      if (filters.assignee && filters.assignee.length > 0) {
        if (filters.assignee.includes('unassigned')) {
          query = query.is('assigned_to', null);
        } else {
          query = query.in('assigned_to', filters.assignee);
        }
      }

      // Apply team filter
      if (filters.team && filters.team.length > 0) {
        if (filters.team.includes('none')) {
          query = query.is('team_id', null);
        } else {
          query = query.in('team_id', filters.team);
        }
      }

      const { data, error } = await query;

      if (error) throw error;

      // Apply due date filters on the client side
      let filteredData = data || [];
      if (filters.dueDateRange && filters.dueDateRange !== 'all') {
        const today = startOfDay(new Date());
        const endOfThisWeek = endOfWeek(today);

        switch (filters.dueDateRange) {
          case 'today':
            filteredData = filteredData.filter(task => 
              task.due_date && 
              isSameDay(parseISO(task.due_date), today)
            );
            break;
          case 'thisWeek':
            filteredData = filteredData.filter(task => 
              task.due_date && 
              isAfter(parseISO(task.due_date), today) && 
              isBefore(parseISO(task.due_date), endOfThisWeek)
            );
            break;
          case 'overdue':
            filteredData = filteredData.filter(task => 
              task.due_date && 
              isBefore(parseISO(task.due_date), today) &&
              task.status !== 'completed'
            );
            break;
          case 'none':
            filteredData = filteredData.filter(task => !task.due_date);
            break;
        }
      }

      return filteredData;
    },
  });
};
