
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { 
  ComposedChart, 
  Line, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer 
} from 'recharts';
import { supabase } from '@/integrations/supabase/client';
import { Skeleton } from '@/components/ui/skeleton';

export default function TeamPerformanceChart({ showDetailed = false }: { showDetailed?: boolean }) {
  const { data, isLoading } = useQuery({
    queryKey: ['team-performance'],
    queryFn: async () => {
      // This would ideally fetch real team performance data
      // For now, we'll return sample data
      return [
        { name: 'Team A', tasks: 40, completion: 75, performance: 82 },
        { name: 'Team B', tasks: 30, completion: 65, performance: 70 },
        { name: 'Team C', tasks: 20, completion: 90, performance: 85 },
        { name: 'Team D', tasks: 25, completion: 80, performance: 75 }
      ];
    },
  });

  if (isLoading) {
    return <Skeleton className="h-full w-full" />;
  }

  if (!data || data.length === 0) {
    return (
      <div className="h-full flex items-center justify-center">
        <p className="text-sm text-muted-foreground">No team data available</p>
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height="100%">
      <ComposedChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Bar dataKey="tasks" fill="#8884d8" name="Total Tasks" />
        <Bar dataKey="completion" fill="#82ca9d" name="Completion %" />
        <Line type="monotone" dataKey="performance" stroke="#ff7300" name="Performance Score" />
      </ComposedChart>
    </ResponsiveContainer>
  );
}
