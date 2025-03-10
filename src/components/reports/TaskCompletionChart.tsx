
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { supabase } from '@/integrations/supabase/client';
import { Skeleton } from '@/components/ui/skeleton';

const COLORS = ['#4f46e5', '#f59e0b', '#10b981'];

export default function TaskCompletionChart({ showDetailed = false }: { showDetailed?: boolean }) {
  const { data, isLoading } = useQuery({
    queryKey: ['task-completion-stats'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('tasks')
        .select('status, count')
        .select();
      
      if (error) throw error;
      
      // Group by status and count
      const stats = {
        completed: 0,
        in_progress: 0,
        pending: 0
      };
      
      data?.forEach(task => {
        if (task.status === 'completed') stats.completed++;
        else if (task.status === 'in_progress') stats.in_progress++;
        else if (task.status === 'pending') stats.pending++;
      });
      
      return [
        { name: 'Completed', value: stats.completed },
        { name: 'In Progress', value: stats.in_progress },
        { name: 'Pending', value: stats.pending }
      ];
    },
  });

  if (isLoading) {
    return <Skeleton className="h-full w-full" />;
  }

  if (!data || data.every(item => item.value === 0)) {
    return (
      <div className="h-full flex items-center justify-center">
        <p className="text-sm text-muted-foreground">No task data available</p>
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height="100%">
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          labelLine={showDetailed}
          outerRadius={showDetailed ? 80 : 60}
          fill="#8884d8"
          dataKey="value"
          label={showDetailed ? 
            ({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%` : 
            false
          }
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip />
        <Legend verticalAlign="bottom" height={36} />
      </PieChart>
    </ResponsiveContainer>
  );
}
