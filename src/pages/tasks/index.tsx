
import React, { useState, useCallback, useEffect } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { startOfDay, endOfWeek, isAfter, isBefore, parseISO } from 'date-fns';
import { supabase } from '@/integrations/supabase/client';
import MainLayout from '@/components/layout/MainLayout';
import TaskList from '@/components/tasks/TaskList';
import CreateTaskButton from '@/components/tasks/CreateTaskButton';
import TaskFilters from '@/components/tasks/TaskFilters';
import TaskDetails from '@/components/tasks/TaskDetails';
import { Button } from '@/components/ui/button';
import { CircleUserRound, Rows, Columns } from 'lucide-react';

export default function TasksPage() {
  const queryClient = useQueryClient();
  const [filters, setFilters] = useState({
    search: '',
    status: [] as string[],
    priority: [] as string[],
    assignee: [] as string[],
    team: [] as string[],
    dueDateRange: 'all',
  });
  const [selectedTask, setSelectedTask] = useState<any>(null);
  const [isMyTasksOnly, setIsMyTasksOnly] = useState(false);
  const [displayMode, setDisplayMode] = useState<'grid' | 'list' | 'kanban'>('grid');

  // Fetch tasks with filters applied
  const { data: tasks, isLoading, refetch } = useQuery({
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

      // Apply due date filters on the client side (as they can be complex for SQL)
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

  // Helper function to check if dates are the same day
  const isSameDay = (date1: Date, date2: Date) => {
    return (
      date1.getFullYear() === date2.getFullYear() &&
      date1.getMonth() === date2.getMonth() &&
      date1.getDate() === date2.getDate()
    );
  };

  // Fetch teams for filters
  const { data: teams } = useQuery({
    queryKey: ['teams'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('teams')
        .select('id, name');
      
      if (error) throw error;
      return data || [];
    },
  });

  // Fetch users for filters and assignee dropdown
  const { data: users } = useQuery({
    queryKey: ['users'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('profiles')
        .select('id, full_name, profile_picture');
      
      if (error) throw error;
      return data || [];
    },
  });

  // Handle filter changes
  const handleFilterChange = useCallback((newFilters: any) => {
    setFilters(newFilters);
  }, []);

  // Handle task click to view details
  const handleTaskClick = useCallback((task: any) => {
    setSelectedTask(task);
  }, []);

  // Handle task status change
  const handleTaskStatusChange = useCallback((taskId: string, newStatus: string) => {
    // Optimistic update
    queryClient.setQueryData(['tasks', filters, isMyTasksOnly], (oldData: any) => {
      if (!oldData) return oldData;
      
      return oldData.map((task: any) => {
        if (task.id === taskId) {
          return { ...task, status: newStatus };
        }
        return task;
      });
    });
    
    // Refetch after a short delay to ensure server state is synchronized
    setTimeout(() => {
      refetch();
    }, 1000);
  }, [filters, isMyTasksOnly, queryClient, refetch]);

  // Handle task creation/update/deletion
  const handleTaskChange = useCallback(() => {
    refetch();
  }, [refetch]);

  return (
    <MainLayout>
      <div className="container mx-auto p-4 space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold">Tasks</h1>
            <p className="text-muted-foreground">
              Manage and track your team's work
            </p>
          </div>
          
          <div className="flex items-center gap-2">
            <Button
              variant={isMyTasksOnly ? "default" : "outline"}
              onClick={() => setIsMyTasksOnly(!isMyTasksOnly)}
              className="gap-2"
            >
              <CircleUserRound className="h-4 w-4" />
              {isMyTasksOnly ? "My Tasks" : "All Tasks"}
            </Button>
            
            <CreateTaskButton onTaskCreated={handleTaskChange} />
          </div>
        </div>
        
        <TaskFilters 
          onFilter={handleFilterChange}
          availableTeams={teams || []}
          availableUsers={users || []}
          filters={filters}
        />
        
        <TaskList 
          tasks={tasks || []} 
          isLoading={isLoading}
          onTaskClick={handleTaskClick}
          onTaskStatusChange={handleTaskStatusChange}
          onViewChange={(view) => setDisplayMode(view)}
        />

        {selectedTask && (
          <TaskDetails 
            task={selectedTask}
            isOpen={!!selectedTask}
            onClose={() => setSelectedTask(null)}
            onTaskUpdated={handleTaskChange}
            onTaskDeleted={handleTaskChange}
          />
        )}
      </div>
    </MainLayout>
  );
}
