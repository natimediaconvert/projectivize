
import React from 'react';
import { format } from 'date-fns';
import { useTaskMetadata } from '@/hooks/useTaskMetadata';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Clock, CalendarDays, AlertTriangle, Circle, CircleEllipsis, CheckCircle2 } from 'lucide-react';
import MainLayout from '@/components/layout/MainLayout';
import { useAuth } from '@/providers/auth/AuthProvider';
import { useDayTasks } from '@/hooks/useDayTasks';

const MyDayPage = () => {
  const { user } = useAuth();
  const { todayTasks, weeklyTasks, yesterdayTasks, isLoading, error } = useDayTasks();
  
  // Format today's date and time
  const currentDateTime = format(new Date(), 'HH:mm, EEEE, MMMM d, yyyy');
  
  // Get greeting based on time of day
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  const StatusIcon = ({ status }: { status: string }) => {
    switch(status) {
      case 'pending':
        return <Circle className="h-4 w-4 text-gray-500" />;
      case 'in_progress':
        return <CircleEllipsis className="h-4 w-4 text-blue-500" />;
      case 'completed':
        return <CheckCircle2 className="h-4 w-4 text-green-500" />;
      default:
        return null;
    }
  };

  const getPriorityBadge = (priority: string) => {
    switch(priority) {
      case 'urgent':
        return <Badge variant="outline" className="bg-red-100 text-red-800 border-red-200 flex items-center gap-1">
          <AlertTriangle className="h-3 w-3" /> Urgent
        </Badge>;
      case 'high':
        return <Badge variant="outline" className="bg-orange-100 text-orange-800 border-orange-200">High</Badge>;
      case 'medium':
        return <Badge variant="outline" className="bg-yellow-100 text-yellow-800 border-yellow-200">Medium</Badge>;
      case 'low':
        return <Badge variant="outline" className="bg-green-100 text-green-800 border-green-200">Low</Badge>;
      default:
        return null;
    }
  };

  const TaskItem = ({ task, isCarriedOver = false }: { task: any, isCarriedOver?: boolean }) => (
    <div className={`p-4 border rounded-md mb-2 ${task.status === 'completed' ? 'bg-gray-50' : 'bg-white'}`}>
      <div className="flex justify-between items-start">
        <div className={`${task.status === 'completed' ? 'line-through text-gray-500' : ''}`}>
          <div className="flex items-center gap-2">
            <StatusIcon status={task.status} />
            <h3 className="font-bold text-lg">{task.title}</h3>
            {isCarriedOver && (
              <Badge variant="outline" className="bg-purple-100 text-purple-800 border-purple-200">
                Carried Over
              </Badge>
            )}
          </div>
          {task.description && (
            <p className="text-gray-600 mt-1">{task.description}</p>
          )}
        </div>
        <div className="flex gap-2">
          {getPriorityBadge(task.priority)}
        </div>
      </div>
      
      {task.due_date && (
        <div className="flex items-center gap-1 mt-2 text-sm text-gray-500">
          <Clock className="h-4 w-4" />
          <span>Due {format(new Date(task.due_date), 'HH:mm, MMM d')}</span>
        </div>
      )}
    </div>
  );

  return (
    <MainLayout>
      <div className="max-w-4xl mx-auto animate-fade-in">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">
            {getGreeting()}, {user?.user_metadata?.full_name || 'there'}!
          </h1>
          <p className="text-gray-600 mt-1">
            <CalendarDays className="h-4 w-4 inline mr-2" />
            {currentDateTime}
          </p>
        </div>

        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertDescription>
              There was a problem loading your tasks. Please try again.
            </AlertDescription>
          </Alert>
        )}

        <div className="space-y-8">
          {/* Today's Tasks */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                Today's Tasks:
              </CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="space-y-4">
                  {Array.from({ length: 3 }).map((_, i) => (
                    <Skeleton key={i} className="h-24 w-full" />
                  ))}
                </div>
              ) : todayTasks.length > 0 ? (
                <div>
                  {todayTasks.map(task => (
                    <TaskItem 
                      key={task.id} 
                      task={task} 
                      isCarriedOver={task.carried_over}
                    />
                  ))}
                </div>
              ) : (
                <p className="text-center py-4 text-gray-500">No tasks scheduled for today.</p>
              )}
            </CardContent>
          </Card>

          {/* Weekly Tasks */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                Weekly Tasks:
              </CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="space-y-4">
                  {Array.from({ length: 2 }).map((_, i) => (
                    <Skeleton key={i} className="h-24 w-full" />
                  ))}
                </div>
              ) : weeklyTasks.length > 0 ? (
                <div>
                  {weeklyTasks.map(task => (
                    <TaskItem key={task.id} task={task} />
                  ))}
                </div>
              ) : (
                <p className="text-center py-4 text-gray-500">No tasks scheduled for this week.</p>
              )}
            </CardContent>
          </Card>

          {/* Yesterday's Tasks */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                Yesterday's Tasks:
              </CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="space-y-4">
                  {Array.from({ length: 2 }).map((_, i) => (
                    <Skeleton key={i} className="h-24 w-full" />
                  ))}
                </div>
              ) : yesterdayTasks.length > 0 ? (
                <div>
                  {yesterdayTasks.map(task => (
                    <TaskItem key={task.id} task={task} />
                  ))}
                </div>
              ) : (
                <p className="text-center py-4 text-gray-500">No tasks were scheduled for yesterday.</p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </MainLayout>
  );
};

export default MyDayPage;
