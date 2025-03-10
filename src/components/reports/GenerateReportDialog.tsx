
import React from 'react';
import { useAuth } from '@/providers/AuthProvider';
import { useReportForm } from './hooks/useReportForm';
import { ReportFormFields } from './ReportFormFields';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Form } from '@/components/ui/form';
import { Button } from '@/components/ui/button';

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
  const { form, onSubmit } = useReportForm({
    user,
    onSuccess: onReportCreated
  });

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
          <form onSubmit={onSubmit} className="space-y-4">
            <ReportFormFields form={form} />
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
