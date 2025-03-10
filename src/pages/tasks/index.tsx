
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import MainLayout from '@/components/layout/MainLayout';
import TaskList from '@/components/tasks/TaskList';
import CreateTaskButton from '@/components/tasks/CreateTaskButton';
import TaskFilters from '@/components/tasks/TaskFilters';

export default function TasksPage() {
  const { data: tasks, isLoading } = useQuery({
    queryKey: ['tasks'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('tasks')
        .select(`
          *,
          assigned_to (
            id,
            full_name,
            profile_picture
          ),
          created_by (
            id,
            full_name
          ),
          team:team_id (
            id,
            name
          )
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data;
    },
  });

  return (
    <MainLayout>
      <div className="container mx-auto p-4 space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Tasks</h1>
          <CreateTaskButton />
        </div>
        <TaskFilters />
        <TaskList tasks={tasks || []} isLoading={isLoading} />
      </div>
    </MainLayout>
  );
}
