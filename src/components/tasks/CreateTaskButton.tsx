
import React from 'react';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function CreateTaskButton() {
  return (
    <Button className="flex items-center gap-2">
      <Plus className="h-4 w-4" />
      Create Task
    </Button>
  );
}
