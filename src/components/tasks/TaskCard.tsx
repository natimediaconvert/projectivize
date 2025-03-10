
import React from 'react';
import { format } from 'date-fns';
import { CalendarIcon, Clock } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';

const priorityColors = {
  low: 'bg-green-500',
  medium: 'bg-yellow-500',
  high: 'bg-orange-500',
  urgent: 'bg-red-500',
};

const statusColors = {
  pending: 'bg-gray-500',
  in_progress: 'bg-blue-500',
  completed: 'bg-green-500',
};

export default function TaskCard({ task }: { task: any }) {
  return (
    <Card className="p-4 hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start gap-4">
        <div className="space-y-2 flex-1">
          <div className="flex items-center gap-2">
            <h3 className="font-semibold">{task.title}</h3>
            <Badge variant="outline" className={statusColors[task.status]}>
              {task.status}
            </Badge>
            <Badge variant="outline" className={priorityColors[task.priority]}>
              {task.priority}
            </Badge>
          </div>
          <p className="text-sm text-muted-foreground">{task.description}</p>
          {task.team && (
            <Badge variant="outline">Team: {task.team.name}</Badge>
          )}
        </div>
        <Avatar>
          <AvatarImage src={task.assigned_to?.profile_picture} />
          <AvatarFallback>
            {task.assigned_to?.full_name?.charAt(0) || '?'}
          </AvatarFallback>
        </Avatar>
      </div>
      <div className="flex items-center gap-4 mt-4 text-sm text-muted-foreground">
        <div className="flex items-center gap-1">
          <Clock className="h-4 w-4" />
          <span>Created {format(new Date(task.created_at), 'MMM d, yyyy')}</span>
        </div>
        {task.due_date && (
          <div className="flex items-center gap-1">
            <CalendarIcon className="h-4 w-4" />
            <span>Due {format(new Date(task.due_date), 'MMM d, yyyy')}</span>
          </div>
        )}
      </div>
    </Card>
  );
}
