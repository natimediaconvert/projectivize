
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { Skeleton } from '@/components/ui/skeleton';
import { Goal } from '@/types/goals';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28'];
const CATEGORIES = ['professional', 'project', 'personal'];

export default function GoalsProgressChart() {
  const { data, isLoading } = useQuery({
    queryKey: ['goals-progress'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('goals')
        .select('*');
      
      if (error) throw error;
      
      // Process data for chart
      const result = CATEGORIES.map(category => {
        const goalsInCategory = data?.filter(goal => goal.category === category) || [];
        const totalGoals = goalsInCategory.length;
        
        if (totalGoals === 0) {
          return {
            name: category.charAt(0).toUpperCase() + category.slice(1),
            value: 0,
            avgProgress: 0
          };
        }
        
        const totalProgress = goalsInCategory.reduce((sum, goal) => sum + goal.progress, 0);
        const avgProgress = totalGoals > 0 ? Math.round(totalProgress / totalGoals) : 0;
        
        return {
          name: category.charAt(0).toUpperCase() + category.slice(1),
          value: totalGoals,
          avgProgress
        };
      });
      
      return result;
    },
  });

  if (isLoading) {
    return <Skeleton className="h-full w-full" />;
  }

  if (!data || data.every(item => item.value === 0)) {
    return (
      <div className="h-full flex items-center justify-center">
        <p className="text-sm text-muted-foreground">No goals data available</p>
      </div>
    );
  }

  const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, index }) => {
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * Math.PI / 180);
    const y = cy + radius * Math.sin(-midAngle * Math.PI / 180);
    
    return (
      <text x={x} y={y} fill="white" textAnchor="middle" dominantBaseline="central">
        {`${data[index].avgProgress}%`}
      </text>
    );
  };

  return (
    <ResponsiveContainer width="100%" height="100%">
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          labelLine={false}
          label={renderCustomizedLabel}
          outerRadius={80}
          fill="#8884d8"
          dataKey="value"
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip formatter={(value, name, props) => [
          `${value} goals (Avg. progress: ${props.payload.avgProgress}%)`,
          name
        ]} />
        <Legend />
      </PieChart>
    </ResponsiveContainer>
  );
}
