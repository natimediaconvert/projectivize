
import React from 'react';
import { Grid, List, KanbanSquare } from 'lucide-react';
import { Button } from '@/components/ui/button';
import TaskCard from './TaskCard';
import { Skeleton } from '@/components/ui/skeleton';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

export default function TaskList({
  tasks = [],
  isLoading = false,
  onTaskClick,
  onTaskStatusChange,
  onViewChange
}: {
  tasks: any[];
  isLoading?: boolean;
  onTaskClick?: (task: any) => void;
  onTaskStatusChange?: (taskId: string, newStatus: string) => void;
  onViewChange?: (view: 'grid' | 'list' | 'kanban') => void;
}) {
  const { toast } = useToast();
  const [view, setView] = React.useState<'grid' | 'list' | 'kanban'>('grid');
  
  const handleStatusChange = async (taskId: string, newStatus: string) => {
    try {
      const { error } = await supabase
        .from('tasks')
        .update({ 
          status: newStatus,
          updated_at: new Date().toISOString()
        })
        .eq('id', taskId);
        
      if (error) throw error;
      
      toast({
        title: "Status updated",
        description: `Task status changed to ${newStatus.replace('_', ' ')}.`,
      });
      
      // If parent component provided handler, call it
      if (onTaskStatusChange) {
        onTaskStatusChange(taskId, newStatus);
      }
    } catch (error: any) {
      console.error("Error updating task status:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to update task status.",
        variant: "destructive",
      });
    }
  };

  const changeView = (newView: 'grid' | 'list' | 'kanban') => {
    setView(newView);
    if (onViewChange) {
      onViewChange(newView);
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="space-y-2">
            <Skeleton className="h-8 w-48" />
            <Skeleton className="h-32 w-full" />
          </div>
        ))}
      </div>
    );
  }

  if (tasks.length === 0) {
    return (
      <div className="text-center py-12">
        <h3 className="text-lg font-medium">No tasks found</h3>
        <p className="text-muted-foreground">Create a new task to get started.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm">
              {view === 'grid' && <Grid className="h-4 w-4 mr-2" />}
              {view === 'list' && <List className="h-4 w-4 mr-2" />}
              {view === 'kanban' && <KanbanSquare className="h-4 w-4 mr-2" />}
              View
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => changeView('grid')}>
              <Grid className="h-4 w-4 mr-2" />
              Grid
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => changeView('list')}>
              <List className="h-4 w-4 mr-2" />
              List
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => changeView('kanban')}>
              <KanbanSquare className="h-4 w-4 mr-2" />
              Kanban
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      
      {view === 'grid' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {tasks.map((task) => (
            <TaskCard 
              key={task.id} 
              task={task} 
              onClick={onTaskClick}
              onStatusChange={handleStatusChange}
            />
          ))}
        </div>
      )}
      
      {view === 'list' && (
        <div className="space-y-2">
          {tasks.map((task) => (
            <TaskCard 
              key={task.id} 
              task={task} 
              onClick={onTaskClick}
              onStatusChange={handleStatusChange}
            />
          ))}
        </div>
      )}
      
      {view === 'kanban' && (
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
          <div className="space-y-4">
            <h3 className="font-medium flex items-center gap-2">
              <CircleDot className="h-4 w-4" /> To Do
            </h3>
            <div className="space-y-2">
              {tasks
                .filter(task => task.status === 'pending')
                .map(task => (
                  <TaskCard 
                    key={task.id} 
                    task={task} 
                    onClick={onTaskClick}
                    onStatusChange={handleStatusChange}
                  />
                ))}
              {tasks.filter(task => task.status === 'pending').length === 0 && (
                <p className="text-sm text-muted-foreground text-center py-4">
                  No tasks in this column
                </p>
              )}
            </div>
          </div>
          
          <div className="space-y-4">
            <h3 className="font-medium flex items-center gap-2">
              <CircleEllipsis className="h-4 w-4" /> In Progress
            </h3>
            <div className="space-y-2">
              {tasks
                .filter(task => task.status === 'in_progress')
                .map(task => (
                  <TaskCard 
                    key={task.id} 
                    task={task} 
                    onClick={onTaskClick}
                    onStatusChange={handleStatusChange}
                  />
                ))}
              {tasks.filter(task => task.status === 'in_progress').length === 0 && (
                <p className="text-sm text-muted-foreground text-center py-4">
                  No tasks in this column
                </p>
              )}
            </div>
          </div>
          
          <div className="space-y-4">
            <h3 className="font-medium flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4" /> Completed
            </h3>
            <div className="space-y-2">
              {tasks
                .filter(task => task.status === 'completed')
                .map(task => (
                  <TaskCard 
                    key={task.id} 
                    task={task} 
                    onClick={onTaskClick}
                    onStatusChange={handleStatusChange}
                  />
                ))}
              {tasks.filter(task => task.status === 'completed').length === 0 && (
                <p className="text-sm text-muted-foreground text-center py-4">
                  No tasks in this column
                </p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
