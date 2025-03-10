
import React from 'react';
import { Button } from '@/components/ui/button';

export default function TaskFilters() {
  return (
    <div className="flex gap-2">
      <Button variant="outline" size="sm">All</Button>
      <Button variant="outline" size="sm">My Tasks</Button>
      <Button variant="outline" size="sm">Team Tasks</Button>
      <Button variant="outline" size="sm">Completed</Button>
    </div>
  );
}
