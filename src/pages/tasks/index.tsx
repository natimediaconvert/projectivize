
import React, { useState, useCallback } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import MainLayout from '@/components/layout/MainLayout';
import TaskList from '@/components/tasks/TaskList';
import TaskFilters from '@/components/tasks/TaskFilters';
import TaskDetails from '@/components/tasks/TaskDetails';
import TaskHeader from '@/components/tasks/TaskHeader';
import { useTasks, type TaskFiltersType } from '@/hooks/useTasks';
import { useTaskMetadata } from '@/hooks/useTaskMetadata';

export default function TasksPage() {
  const queryClient = useQueryClient();
  const [filters, setFilters] = useState<TaskFiltersType>({
    search: '',
    status: [],
    priority: [],
    assignee: [],
    team: [],
    dueDateRange: 'all',
  });
  const [selectedTask, setSelectedTask] = useState<any>(null);
  const [isMyTasksOnly, setIsMyTasksOnly] = useState(false);
  const [displayMode, setDisplayMode] = useState<'grid' | 'list' | 'kanban'>('grid');

  const { data: tasks, isLoading, refetch } = useTasks(filters, isMyTasksOnly);
  const { teams, users } = useTaskMetadata();

  // Handle filter changes
  const handleFilterChange = useCallback((newFilters: Partial<TaskFiltersType>) => {
    setFilters(prevFilters => ({
      ...prevFilters,
      ...newFilters,
    }));
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

  return (
    <MainLayout>
      <div className="container mx-auto p-4 space-y-6">
        <TaskHeader 
          isMyTasksOnly={isMyTasksOnly}
          onMyTasksToggle={() => setIsMyTasksOnly(!isMyTasksOnly)}
          onTaskCreated={refetch}
        />
        
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
            onTaskUpdated={refetch}
            onTaskDeleted={refetch}
          />
        )}
      </div>
    </MainLayout>
  );
}
