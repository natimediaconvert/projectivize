
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { ArrowUpRight, Calendar, CheckSquare, ListTodo, Target, Users, Clock } from 'lucide-react';
import MainLayout from "@/components/layout/MainLayout";
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';
import { Skeleton } from '@/components/ui/skeleton';
import TaskCompletionChart from '@/components/reports/TaskCompletionChart';
import { useAuth } from '@/providers/AuthProvider';

const Dashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const { data: taskStats, isLoading: isLoadingTasks } = useQuery({
    queryKey: ['dashboard-tasks'],
    queryFn: async () => {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      const { data, error } = await supabase
        .from('tasks')
        .select('*');
      
      if (error) throw error;
      
      const stats = {
        total: data?.length || 0,
        completed: data?.filter(task => task.status === 'completed').length || 0,
        today: data?.filter(task => {
          const dueDate = task.due_date ? new Date(task.due_date) : null;
          return dueDate && dueDate.toDateString() === today.toDateString();
        }).length || 0,
        overdue: data?.filter(task => {
          const dueDate = task.due_date ? new Date(task.due_date) : null;
          return dueDate && dueDate < today && task.status !== 'completed';
        }).length || 0
      };
      
      return stats;
    }
  });

  const { data: goalStats, isLoading: isLoadingGoals } = useQuery({
    queryKey: ['dashboard-goals'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('goals')
        .select('*');
      
      if (error) throw error;
      
      // Calculate average progress across all goals
      const totalProgress = data?.reduce((sum, goal) => sum + (goal.progress || 0), 0) || 0;
      const avgProgress = data && data.length > 0 ? Math.round(totalProgress / data.length) : 0;
      
      return {
        total: data?.length || 0,
        avgProgress,
        completed: data?.filter(goal => goal.progress === 100).length || 0
      };
    }
  });

  const { data: teamStats, isLoading: isLoadingTeams } = useQuery({
    queryKey: ['dashboard-teams'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('teams')
        .select('*');
      
      if (error) throw error;
      
      return {
        total: data?.length || 0
      };
    }
  });

  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-sm text-muted-foreground">
            {user?.user_metadata?.full_name ? `Welcome back, ${user.user_metadata.full_name}!` : 'Welcome back!'}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="p-4 backdrop-blur-sm bg-white/50 dark:bg-gray-800/50">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-semibold mb-2 text-muted-foreground">Today's Tasks</h3>
                {isLoadingTasks ? (
                  <Skeleton className="h-8 w-16" />
                ) : (
                  <p className="text-2xl font-bold">{taskStats?.today || 0}</p>
                )}
              </div>
              <Calendar className="h-8 w-8 text-blue-500" />
            </div>
            <div className="mt-2">
              <Button variant="link" size="sm" className="p-0 h-auto" onClick={() => navigate('/tasks')}>
                View Tasks <ArrowUpRight className="ml-1 h-3 w-3" />
              </Button>
            </div>
          </Card>
          
          <Card className="p-4 backdrop-blur-sm bg-white/50 dark:bg-gray-800/50">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-semibold mb-2 text-muted-foreground">Completed Tasks</h3>
                {isLoadingTasks ? (
                  <Skeleton className="h-8 w-16" />
                ) : (
                  <p className="text-2xl font-bold">{taskStats?.completed || 0}</p>
                )}
              </div>
              <CheckSquare className="h-8 w-8 text-green-500" />
            </div>
            <div className="mt-2">
              {isLoadingTasks ? (
                <Skeleton className="h-2 w-full" />
              ) : (
                <>
                  <div className="flex justify-between text-xs mb-1">
                    <span>Completion Rate</span>
                    <span>
                      {taskStats && taskStats.total > 0
                        ? `${Math.round((taskStats.completed / taskStats.total) * 100)}%`
                        : '0%'}
                    </span>
                  </div>
                  <Progress 
                    value={taskStats && taskStats.total > 0 
                      ? (taskStats.completed / taskStats.total) * 100 
                      : 0
                    } 
                    className="h-1" 
                  />
                </>
              )}
            </div>
          </Card>
          
          <Card className="p-4 backdrop-blur-sm bg-white/50 dark:bg-gray-800/50">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-semibold mb-2 text-muted-foreground">Active Goals</h3>
                {isLoadingGoals ? (
                  <Skeleton className="h-8 w-16" />
                ) : (
                  <p className="text-2xl font-bold">{goalStats?.total || 0}</p>
                )}
              </div>
              <Target className="h-8 w-8 text-purple-500" />
            </div>
            <div className="mt-2">
              {isLoadingGoals ? (
                <Skeleton className="h-2 w-full" />
              ) : (
                <>
                  <div className="flex justify-between text-xs mb-1">
                    <span>Average Progress</span>
                    <span>{goalStats?.avgProgress || 0}%</span>
                  </div>
                  <Progress value={goalStats?.avgProgress || 0} className="h-1" />
                </>
              )}
            </div>
          </Card>
          
          <Card className="p-4 backdrop-blur-sm bg-white/50 dark:bg-gray-800/50">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-semibold mb-2 text-muted-foreground">Team Members</h3>
                {isLoadingTeams ? (
                  <Skeleton className="h-8 w-16" />
                ) : (
                  <p className="text-2xl font-bold">{teamStats?.total || 0}</p>
                )}
              </div>
              <Users className="h-8 w-8 text-amber-500" />
            </div>
            <div className="mt-2">
              <Button variant="link" size="sm" className="p-0 h-auto" onClick={() => navigate('/team')}>
                View Teams <ArrowUpRight className="ml-1 h-3 w-3" />
              </Button>
            </div>
          </Card>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="p-4">
            <h3 className="font-semibold mb-4">Task Completion</h3>
            <div className="h-[200px]">
              <TaskCompletionChart />
            </div>
            <div className="mt-4 text-center">
              <Button variant="outline" onClick={() => navigate('/reports')}>
                View Full Analytics
              </Button>
            </div>
          </Card>
          
          <Card className="p-4">
            <h3 className="font-semibold mb-4">Recent Activity</h3>
            {isLoadingTasks ? (
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <Skeleton key={i} className="h-8 w-full" />
                ))}
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <Clock className="h-5 w-5 text-muted-foreground mt-1" />
                  <div>
                    <p className="font-medium">Task statuses updated</p>
                    <p className="text-sm text-muted-foreground">3 tasks marked as completed</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Target className="h-5 w-5 text-muted-foreground mt-1" />
                  <div>
                    <p className="font-medium">New goal created</p>
                    <p className="text-sm text-muted-foreground">Professional goal added</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <ListTodo className="h-5 w-5 text-muted-foreground mt-1" />
                  <div>
                    <p className="font-medium">Tasks assigned</p>
                    <p className="text-sm text-muted-foreground">2 new tasks assigned to team</p>
                  </div>
                </div>
              </div>
            )}
          </Card>
        </div>
      </div>
    </MainLayout>
  );
};

export default Dashboard;
