import React, { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { format } from 'date-fns';
import { motion } from 'framer-motion';
import { Clock, CalendarIcon, ArrowUp, ArrowDown, Filter } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import MainLayout from '@/components/layout/MainLayout';
import TaskList from '@/components/tasks/TaskList';
import CreateTaskButton from '@/components/tasks/CreateTaskButton';
import { useAuth } from '@/providers/AuthProvider';
import { useTranslation } from '@/providers/i18n/TranslationProvider';
import { useTheme } from '@/providers/ThemeProvider';
import { fetchTasks, Task } from '@/services';
import { useToast } from '@/hooks/use-toast';

/**
 * MyDay page component that displays the user's daily task overview
 * Includes today's tasks, weekly tasks, and yesterday's tasks
 * @returns JSX element representing the MyDay page
 */
const MyDay: React.FC = () => {
  const { user } = useAuth();
  const { t } = useTranslation();
  const { toast } = useToast();
  const { direction } = useTheme();
  const [currentTime, setCurrentTime] = useState(new Date());
  const [taskView, setTaskView] = useState<'grid' | 'list' | 'kanban'>('grid');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [priorityFilter, setPriorityFilter] = useState<string | null>(null);

  // Update the time every minute
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);

    return () => clearInterval(timer);
  }, []);

  // Fetch tasks using React Query
  const { data: tasks, isLoading, refetch } = useQuery({
    queryKey: ['my-day-tasks'],
    queryFn: () => fetchTasks(),
  });

  // Get today's date at midnight for comparison
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // Get yesterday's date
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  // Get end of current week
  const endOfWeek = new Date(today);
  endOfWeek.setDate(endOfWeek.getDate() + (6 - endOfWeek.getDay()));

  // Filter tasks for today, this week, and yesterday
  const todaysTasks = tasks?.filter(task => {
    const taskDate = new Date(task.due_date);
    taskDate.setHours(0, 0, 0, 0);
    return taskDate.getTime() === today.getTime();
  }) || [];

  const weeklyTasks = tasks?.filter(task => {
    const taskDate = new Date(task.due_date);
    taskDate.setHours(0, 0, 0, 0);
    return taskDate > today && taskDate <= endOfWeek;
  }) || [];

  const yesterdaysTasks = tasks?.filter(task => {
    const taskDate = new Date(task.due_date);
    taskDate.setHours(0, 0, 0, 0);
    return taskDate.getTime() === yesterday.getTime();
  }) || [];

  // Get incomplete tasks from yesterday (to be marked as carried over)
  const carriedOverTasks = yesterdaysTasks
    .filter(task => task.status !== 'completed')
    .map(task => ({
      ...task,
      isCarriedOver: true, // Add a flag to identify carried over tasks
    }));

  // Combine carried over tasks with today's tasks
  const allTodaysTasks = [...carriedOverTasks, ...todaysTasks];

  // Apply sorting and filtering to tasks
  const sortAndFilterTasks = (taskList: Task[]) => {
    // Apply priority filter if set
    let filteredTasks = priorityFilter
      ? taskList.filter(task => task.priority === priorityFilter)
      : taskList;

    // Apply sorting
    return [...filteredTasks].sort((a, b) => {
      // First sort by priority
      const priorityOrder = { urgent: 0, high: 1, medium: 2, low: 3 };
      const priorityA = priorityOrder[a.priority as keyof typeof priorityOrder];
      const priorityB = priorityOrder[b.priority as keyof typeof priorityOrder];

      if (priorityA !== priorityB) {
        return sortOrder === 'asc'
          ? priorityA - priorityB
          : priorityB - priorityA;
      }

      // Then sort by due date
      const dateA = new Date(a.due_date).getTime();
      const dateB = new Date(b.due_date).getTime();
      return sortOrder === 'asc' ? dateA - dateB : dateB - dateA;
    });
  };

  const sortedTodaysTasks = sortAndFilterTasks(allTodaysTasks);
  const sortedWeeklyTasks = sortAndFilterTasks(weeklyTasks);
  const sortedYesterdaysTasks = sortAndFilterTasks(yesterdaysTasks);

  const handleTaskClick = (task: Task) => {
    // Navigate to task details or open a modal
    // This would be implemented based on the app's navigation pattern
    console.log('Task clicked:', task);
  };

  const handleTaskStatusChange = async (taskId: string, newStatus: string) => {
    // Refresh the task list after status change
    await refetch();

    toast({
      title: "Status updated",
      description: `Task status changed to ${newStatus.replace('_', ' ')}.`,
    });
  };

  const handleTaskCreated = () => {
    // Refresh the task list after a new task is created
    refetch();

    toast({
      title: "Task created",
      description: "Your new task has been created successfully.",
    });
  };

  const toggleSortOrder = () => {
    setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc');
  };

  const handlePriorityFilter = (priority: string | null) => {
    setPriorityFilter(priority);
  };

  return (
    <MainLayout>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="max-w-7xl mx-auto px-4"
      >
        <div className="flex justify-between items-center mb-8" dir={direction}>
          <div>
            <h1 className="text-3xl font-bold mb-2">
              {t('hello')}, {user?.user_metadata?.full_name || user?.email}!
            </h1>
            <p className="text-gray-500 flex items-center gap-2">
              <CalendarIcon className="h-4 w-4" />
              {format(currentTime, 'EEEE, MMMM d, yyyy')}
              <Clock className="h-4 w-4 ml-2" />
              {format(currentTime, 'HH:mm')}
            </p>
          </div>
          <CreateTaskButton onTaskCreated={handleTaskCreated} />
        </div>

        <div className="flex justify-end gap-2 mb-4">
          <Button
            variant="outline"
            size="sm"
            onClick={toggleSortOrder}
            className="flex items-center gap-1"
          >
            {sortOrder === 'asc' ? (
              <>
                <ArrowUp className="h-4 w-4" />
                <span>Sort Ascending</span>
              </>
            ) : (
              <>
                <ArrowDown className="h-4 w-4" />
                <span>Sort Descending</span>
              </>
            )}
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="flex items-center gap-1">
                <Filter className="h-4 w-4" />
                <span>
                  {priorityFilter
                    ? `Priority: ${priorityFilter.charAt(0).toUpperCase() + priorityFilter.slice(1)}`
                    : 'Filter Priority'}
                </span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => handlePriorityFilter(null)}>
                All Priorities
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handlePriorityFilter('urgent')}>
                Urgent
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handlePriorityFilter('high')}>
                High
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handlePriorityFilter('medium')}>
                Medium
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handlePriorityFilter('low')}>
                Low
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <div className="space-y-8">
          <Card className="border-t-4 border-t-blue-500">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle dir={direction}>{t('todaysTasks')}</CardTitle>
              <CreateTaskButton
                buttonText={t('createTask')}
                variant="outline"
                size="sm"
                onTaskCreated={handleTaskCreated}
              />
            </CardHeader>
            <CardContent>
              <TaskList
                tasks={sortedTodaysTasks}
                isLoading={isLoading}
                onTaskClick={handleTaskClick}
                onTaskStatusChange={handleTaskStatusChange}
                onViewChange={setTaskView}
              />
            </CardContent>
          </Card>

          <Card className="border-t-4 border-t-green-500">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle dir={direction}>{t('weeklyTasks')}</CardTitle>
              <CreateTaskButton
                buttonText={t('createTask')}
                variant="outline"
                size="sm"
                onTaskCreated={handleTaskCreated}
              />
            </CardHeader>
            <CardContent>
              <TaskList
                tasks={sortedWeeklyTasks}
                isLoading={isLoading}
                onTaskClick={handleTaskClick}
                onTaskStatusChange={handleTaskStatusChange}
                onViewChange={setTaskView}
              />
            </CardContent>
          </Card>

          <Card className="border-t-4 border-t-orange-500">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle dir={direction}>{t('yesterdaysTasks')}</CardTitle>
            </CardHeader>
            <CardContent>
              <TaskList
                tasks={sortedYesterdaysTasks}
                isLoading={isLoading}
                onTaskClick={handleTaskClick}
                onTaskStatusChange={handleTaskStatusChange}
                onViewChange={setTaskView}
              />
            </CardContent>
          </Card>
        </div>
      </motion.div>
    </MainLayout>
  );
};

export default MyDay;
