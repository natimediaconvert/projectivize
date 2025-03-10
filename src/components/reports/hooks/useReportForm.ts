
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { supabase } from '@/integrations/supabase/client';
import { reportFormSchema, ReportFormValues } from '../schema/reportFormSchema';
import { User } from '@/providers/auth/types';

interface UseReportFormProps {
  user: User | null;
  onSuccess: () => void;
}

export function useReportForm({ user, onSuccess }: UseReportFormProps) {
  const form = useForm<ReportFormValues>({
    resolver: zodResolver(reportFormSchema),
    defaultValues: {
      report_type: 'task_performance',
      include_charts: true,
      include_raw_data: false,
    },
  });

  const onSubmit = async (values: ReportFormValues) => {
    try {
      if (!user) {
        throw new Error('You must be logged in to generate a report');
      }

      // Generate a sample report data structure
      const reportData = {
        type: values.report_type,
        include_charts: values.include_charts,
        include_raw_data: values.include_raw_data,
        timestamp: new Date().toISOString(),
        summary: {
          total_tasks: 42,
          completed_tasks: 28,
          completion_rate: 66.7,
          overdue_tasks: 3
        },
        performance_metrics: {
          team_velocity: 15,
          avg_completion_time: "3.5 days"
        }
      };

      // Save the report to Supabase
      const { error } = await supabase.from('reports').insert({
        report_type: values.report_type,
        generated_by: user.id,
        data: reportData
      });

      if (error) throw error;
      
      onSuccess();
      form.reset();
    } catch (error: any) {
      console.error('Error generating report:', error);
    }
  };

  return {
    form,
    onSubmit: form.handleSubmit(onSubmit),
  };
}
