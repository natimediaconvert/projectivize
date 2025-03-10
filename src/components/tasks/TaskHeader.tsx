
import { Button } from '@/components/ui/button';
import { CircleUserRound } from 'lucide-react';
import CreateTaskButton from './CreateTaskButton';

type TaskHeaderProps = {
  isMyTasksOnly: boolean;
  onMyTasksToggle: () => void;
  onTaskCreated: () => void;
};

export default function TaskHeader({ 
  isMyTasksOnly, 
  onMyTasksToggle, 
  onTaskCreated 
}: TaskHeaderProps) {
  return (
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
          onClick={onMyTasksToggle}
          className="gap-2"
        >
          <CircleUserRound className="h-4 w-4" />
          {isMyTasksOnly ? "My Tasks" : "All Tasks"}
        </Button>
        
        <CreateTaskButton onTaskCreated={onTaskCreated} />
      </div>
    </div>
  );
}
