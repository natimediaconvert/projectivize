
import React from 'react';
import { useAuth } from '@/providers/AuthProvider';
import { GoalFormFields } from './GoalFormFields';
import { useGoalForm } from './hooks/useGoalForm';
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

interface CreateGoalDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onGoalCreated: () => void;
}

export default function CreateGoalDialog({
  isOpen,
  onClose,
  onGoalCreated,
}: CreateGoalDialogProps) {
  const { user } = useAuth();
  const { form, onSubmit } = useGoalForm({ 
    user, 
    onSuccess: onGoalCreated 
  });

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Create New Goal</DialogTitle>
          <DialogDescription>
            Set a new goal to track your progress.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={onSubmit} className="space-y-4">
            <GoalFormFields form={form} />
            <DialogFooter>
              <Button type="button" variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit">Create Goal</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
