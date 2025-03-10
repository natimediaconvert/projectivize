
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip, CartesianGrid } from 'recharts';
import { supabase } from '@/integrations/supabase/client';
import { Skeleton } from '@/components/ui/skeleton';

export default function PriorityDistributionChart() {
  const { data, isLoading } = useQuery({
    queryKey: ['priority-distribution'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('tasks')
        .select('priority');
      
      if (error) throw error;
      
      // Count by priority
      const counts = {
        low: 0,
        medium: 0,
        high: 0,
        urgent: 0
      };
      
      data?.forEach(task => {
        if (task.priority) counts[task.priority]++;
      });
      
      return [
        { name: 'Low', value: counts.low },
        { name: 'Medium', value: counts.medium },
        { name: 'High', value: counts.high },
        { name: 'Urgent', value: counts.urgent }
      ];
    },
  });

  if (isLoading) {
    return <Skeleton className="h-full w-full" />;
  }

  if (!data || data.every(item => item.value === 0)) {
    return (
      <div className="h-full flex items-center justify-center">
        <p className="text-sm text-muted-foreground">No priority data available</p>
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={data}>
        <XAxis dataKey="name" />
        <YAxis allowDecimals={false} />
        <Tooltip />
        <CartesianGrid strokeDasharray="3 3" vertical={false} />
        <Bar 
          dataKey="value" 
          fill="#8884d8" 
          radius={[4, 4, 0, 0]} 
        />
      </BarChart>
    </ResponsiveContainer>
  );
}
