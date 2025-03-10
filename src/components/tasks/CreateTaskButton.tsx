
import React, { useState } from 'react';
import { PlusCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import TaskForm from './TaskForm';

export default function CreateTaskButton({
  buttonText = 'Create Task',
  variant = 'default',
  size = 'default',
  teamId,
  onTaskCreated,
  showIcon = true,
}: {
  buttonText?: string;
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link';
  size?: 'default' | 'sm' | 'lg' | 'icon';
  teamId?: string;
  onTaskCreated?: () => void;
  showIcon?: boolean;
}) {
  const [isOpen, setIsOpen] = useState(false);

  const handleSuccess = () => {
    setIsOpen(false);
    if (onTaskCreated) {
      onTaskCreated();
    }
  };

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button variant={variant} size={size}>
          {showIcon && <PlusCircle className="h-4 w-4 mr-2" />}
          {buttonText}
        </Button>
      </SheetTrigger>
      <SheetContent className="sm:max-w-xl overflow-y-auto">
        <SheetHeader>
          <SheetTitle>Create New Task</SheetTitle>
        </SheetHeader>
        <div className="py-4">
          <TaskForm 
            onSuccess={handleSuccess}
            onCancel={() => setIsOpen(false)}
            teamId={teamId}
          />
        </div>
      </SheetContent>
    </Sheet>
  );
}
