
import React from 'react';
import { format } from 'date-fns';
import { CalendarIcon, Clock, AlertTriangle, CheckCircle2, CircleDot, CircleEllipsis } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

const priorityConfig = {
  low: {
    color: 'bg-green-100 text-green-800 border-green-200',
    icon: null
  },
  medium: {
    color: 'bg-blue-100 text-blue-800 border-blue-200',
    icon: null
  },
  high: {
    color: 'bg-orange-100 text-orange-800 border-orange-200',
    icon: AlertTriangle
  },
  urgent: {
    color: 'bg-red-100 text-red-800 border-red-200',
    icon: AlertTriangle
  },
};

const statusConfig = {
  pending: {
    color: 'bg-gray-100 text-gray-800 border-gray-200',
    icon: CircleDot,
    label: 'To Do'
  },
  in_progress: {
    color: 'bg-blue-100 text-blue-800 border-blue-200',
    icon: CircleEllipsis,
    label: 'In Progress'
  },
  completed: {
    color: 'bg-green-100 text-green-800 border-green-200',
    icon: CheckCircle2,
    label: 'Completed'
  },
};

export default function TaskCard({ 
  task, 
  onClick,
  onStatusChange
}: { 
  task: any; 
  onClick?: (task: any) => void;
  onStatusChange?: (taskId: string, newStatus: string) => void;
}) {
  const priorityInfo = priorityConfig[task.priority as keyof typeof priorityConfig];
  const statusInfo = statusConfig[task.status as keyof typeof statusConfig];
  const PriorityIcon = priorityInfo?.icon;
  const StatusIcon = statusInfo?.icon;

  // Calculate if due date is past
  const isPastDue = task.due_date && new Date(task.due_date) < new Date() && task.status !== 'completed';

  return (
    <Card 
      className="hover:shadow-md transition-shadow cursor-pointer" 
      onClick={() => onClick && onClick(task)}
    >
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <CardTitle className="text-lg font-semibold line-clamp-1">{task.title}</CardTitle>
          {task.assigned_to && (
            <Avatar className="h-8 w-8">
              <AvatarImage src={task.assigned_to?.profile_picture} />
              <AvatarFallback>
                {task.assigned_to?.full_name?.charAt(0) || '?'}
              </AvatarFallback>
            </Avatar>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {task.description && (
            <p className="text-sm text-muted-foreground line-clamp-2">{task.description}</p>
          )}
          
          <div className="flex flex-wrap gap-2">
            <Badge variant="outline" className={statusInfo.color}>
              {StatusIcon && <StatusIcon className="h-3 w-3 mr-1" />}
              {statusInfo.label}
            </Badge>
            
            <Badge variant="outline" className={priorityInfo.color}>
              {PriorityIcon && <PriorityIcon className="h-3 w-3 mr-1" />}
              {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
            </Badge>
            
            {task.team && (
              <Badge variant="outline">Team: {task.team.name}</Badge>
            )}
          </div>
          
          <div className="flex items-center gap-4 text-xs text-muted-foreground">
            <div className="flex items-center gap-1">
              <Clock className="h-3 w-3" />
              <span>Created {format(new Date(task.created_at), 'MMM d, yyyy')}</span>
            </div>
            
            {task.due_date && (
              <div className={`flex items-center gap-1 ${isPastDue ? 'text-red-500 font-medium' : ''}`}>
                <CalendarIcon className="h-3 w-3" />
                <span>
                  Due {format(new Date(task.due_date), 'MMM d, yyyy')}
                  {isPastDue && ' (Overdue)'}
                </span>
              </div>
            )}
          </div>
          
          {onStatusChange && (
            <div className="flex gap-2 pt-2">
              <TooltipProvider>
                {task.status !== 'pending' && (
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="h-8 px-2"
                        onClick={(e) => {
                          e.stopPropagation();
                          onStatusChange(task.id, 'pending');
                        }}
                      >
                        <CircleDot className="h-4 w-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Mark as To Do</p>
                    </TooltipContent>
                  </Tooltip>
                )}
                
                {task.status !== 'in_progress' && (
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="h-8 px-2"
                        onClick={(e) => {
                          e.stopPropagation();
                          onStatusChange(task.id, 'in_progress');
                        }}
                      >
                        <CircleEllipsis className="h-4 w-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Mark as In Progress</p>
                    </TooltipContent>
                  </Tooltip>
                )}
                
                {task.status !== 'completed' && (
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="h-8 px-2"
                        onClick={(e) => {
                          e.stopPropagation();
                          onStatusChange(task.id, 'completed');
                        }}
                      >
                        <CheckCircle2 className="h-4 w-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Mark as Completed</p>
                    </TooltipContent>
                  </Tooltip>
                )}
              </TooltipProvider>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
