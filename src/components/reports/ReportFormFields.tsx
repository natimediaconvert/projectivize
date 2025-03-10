
import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import { ReportFormValues } from './schema/reportFormSchema';
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormDescription,
  FormMessage,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';

interface ReportFormFieldsProps {
  form: UseFormReturn<ReportFormValues>;
}

export function ReportFormFields({ form }: ReportFormFieldsProps) {
  return (
    <>
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
    </>
  );
}
