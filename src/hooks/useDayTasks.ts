
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { 
  startOfToday, 
  endOfToday, 
  startOfYesterday, 
  endOfYesterday, 
  startOfWeek, 
  endOfWeek, 
  isSameDay,
  parseISO,
  isAfter,
  isBefore,
  startOfDay
} from 'date-fns';

export const useDayTasks = () => {
  const fetchTasks = async () => {
    const today = new Date();
    const startOfTodayDate = startOfToday();
    const endOfTodayDate = endOfToday();
    const startOfYesterdayDate = startOfYesterday();
    const endOfYesterdayDate = endOfYesterday();
    const startOfWeekDate = startOfWeek(today);
    const endOfWeekDate = endOfWeek(today);

    // Fetch all tasks for the week, including yesterday and today
    const { data, error } = await supabase
      .from('tasks')
      .select(`
        *,
        assigned_to:assigned_to (
          id,
          full_name,
          profile_picture
        ),
        team:team_id (
          id,
          name
        )
      `)
      .or(`
        and(due_date.gte.${startOfYesterdayDate.toISOString()},due_date.lte.${endOfWeekDate.toISOString()}),
        and(status.neq.completed,due_date.lt.${startOfTodayDate.toISOString()})
      `)
      .order('due_date', { ascending: true });

    if (error) throw error;

    // Process tasks into categories
    const todayTasks = [];
    const weeklyTasks = [];
    const yesterdayTasks = [];

    // Find incomplete tasks from yesterday to mark as carried over
    const incompleteYesterdayTaskIds = new Set();

    (data || []).forEach(task => {
      // Parse the due date
      const dueDate = task.due_date ? parseISO(task.due_date) : null;
      
      // Handle yesterday's incomplete tasks to mark as carried over
      if (dueDate && 
          isSameDay(dueDate, startOfYesterdayDate) && 
          task.status !== 'completed') {
        incompleteYesterdayTaskIds.add(task.id);
      }
    });

    // Now process all tasks with the carried over flags
    (data || []).forEach(task => {
      const dueDate = task.due_date ? parseISO(task.due_date) : null;
      
      // Today's tasks (including carried over from yesterday)
      if ((dueDate && isSameDay(dueDate, startOfTodayDate)) || 
          // Overdue tasks count as today's tasks
          (dueDate && isBefore(dueDate, startOfTodayDate) && task.status !== 'completed') ||
          // Tasks without due dates that aren't completed
          (!dueDate && task.status !== 'completed')) {
        
        // Mark as carried over if from yesterday
        const taskWithCarriedOver = {
          ...task,
          carried_over: incompleteYesterdayTaskIds.has(task.id)
        };
        
        todayTasks.push(taskWithCarriedOver);
      }
      // Yesterday's tasks
      else if (dueDate && 
               isAfter(dueDate, startOfYesterdayDate) && 
               isBefore(dueDate, endOfYesterdayDate)) {
        yesterdayTasks.push(task);
      }
      // Weekly tasks (excluding today)
      else if (dueDate && 
               isAfter(dueDate, endOfTodayDate) && 
               isBefore(dueDate, endOfWeekDate)) {
        weeklyTasks.push(task);
      }
    });

    // Sort tasks by priority and status
    const priorityOrder = { urgent: 0, high: 1, medium: 2, low: 3 };
    const statusOrder = { pending: 0, in_progress: 1, completed: 2 };
    
    const sortTasks = (a, b) => {
      // First by completion status
      if (a.status === 'completed' && b.status !== 'completed') return 1;
      if (a.status !== 'completed' && b.status === 'completed') return -1;
      
      // Then by priority (if both tasks have the same completion status)
      const aPriority = priorityOrder[a.priority] ?? 999;
      const bPriority = priorityOrder[b.priority] ?? 999;
      
      if (aPriority !== bPriority) {
        return aPriority - bPriority;
      }
      
      // Then by status
      const aStatus = statusOrder[a.status] ?? 999;
      const bStatus = statusOrder[b.status] ?? 999;
      
      if (aStatus !== bStatus) {
        return aStatus - bStatus;
      }
      
      // Lastly by due date (if available)
      if (a.due_date && b.due_date) {
        return new Date(a.due_date).getTime() - new Date(b.due_date).getTime();
      }
      
      return 0;
    };
    
    return {
      todayTasks: todayTasks.sort(sortTasks),
      weeklyTasks: weeklyTasks.sort(sortTasks),
      yesterdayTasks: yesterdayTasks.sort(sortTasks)
    };
  };

  const { data, isLoading, error } = useQuery({
    queryKey: ['day-tasks'],
    queryFn: fetchTasks,
  });

  return {
    todayTasks: data?.todayTasks || [],
    weeklyTasks: data?.weeklyTasks || [],
    yesterdayTasks: data?.yesterdayTasks || [],
    isLoading,
    error,
  };
};
