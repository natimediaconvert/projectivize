
import React from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/providers/AuthProvider';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';

const formSchema = z.object({
  report_type: z.string(),
  include_charts: z.boolean().default(true),
  include_raw_data: z.boolean().default(false),
});

type FormValues = z.infer<typeof formSchema>;

interface GenerateReportDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onReportCreated: () => void;
}

export default function GenerateReportDialog({
  isOpen,
  onClose,
  onReportCreated,
}: GenerateReportDialogProps) {
  const { user } = useAuth();
  
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      report_type: 'task_performance',
      include_charts: true,
      include_raw_data: false,
    },
  });

  const onSubmit = async (values: FormValues) => {
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
      
      onReportCreated();
      form.reset();
    } catch (error: any) {
      console.error('Error generating report:', error);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Generate Report</DialogTitle>
          <DialogDescription>
            Create a custom report based on your task and team data.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="report_type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Report Type</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a report type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="task_performance">Task Performance</SelectItem>
                      <SelectItem value="team_analytics">Team Analytics</SelectItem>
                      <SelectItem value="goal_progress">Goal Progress</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormDescription>
                    Choose the type of report you want to generate.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="include_charts"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>Include Charts</FormLabel>
                    <FormDescription>
                      Add visual charts and graphs to the report.
                    </FormDescription>
                  </div>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="include_raw_data"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>Include Raw Data</FormLabel>
                    <FormDescription>
                      Add detailed raw data to the report.
                    </FormDescription>
                  </div>
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button type="button" variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit">Generate Report</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
