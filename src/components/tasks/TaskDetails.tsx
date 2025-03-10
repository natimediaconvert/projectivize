
import React, { useState } from 'react';
import { format } from 'date-fns';
import { CalendarIcon, Clock, Edit2, Trash2, User, MessageSquare, Calendar, CheckCircle2, XCircle, Users } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import TaskForm from './TaskForm';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

const priorityConfig = {
  low: {
    color: 'bg-green-100 text-green-800 border-green-200',
  },
  medium: {
    color: 'bg-blue-100 text-blue-800 border-blue-200',
  },
  high: {
    color: 'bg-orange-100 text-orange-800 border-orange-200',
  },
  urgent: {
    color: 'bg-red-100 text-red-800 border-red-200',
  },
};

const statusConfig = {
  pending: {
    color: 'bg-gray-100 text-gray-800 border-gray-200',
    label: 'To Do'
  },
  in_progress: {
    color: 'bg-blue-100 text-blue-800 border-blue-200',
    label: 'In Progress'
  },
  completed: {
    color: 'bg-green-100 text-green-800 border-green-200',
    label: 'Completed'
  },
};

export default function TaskDetails({
  task,
  isOpen,
  onClose,
  onTaskUpdated,
  onTaskDeleted,
}: {
  task: any;
  isOpen: boolean;
  onClose: () => void;
  onTaskUpdated?: (updatedTask: any) => void;
  onTaskDeleted?: (taskId: string) => void;
}) {
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [activeTab, setActiveTab] = useState('details');
  
  if (!task) return null;
  
  const handleTaskUpdated = () => {
    setIsEditing(false);
    if (onTaskUpdated) {
      onTaskUpdated(task);
    }
    toast({
      title: "Task updated",
      description: "Task has been successfully updated.",
    });
  };
  
  const handleDelete = async () => {
    try {
      const { error } = await supabase
        .from('tasks')
        .delete()
        .eq('id', task.id);
        
      if (error) throw error;
      
      toast({
        title: "Task deleted",
        description: "Task has been successfully deleted.",
      });
      
      onClose();
      if (onTaskDeleted) {
        onTaskDeleted(task.id);
      }
    } catch (error: any) {
      console.error("Error deleting task:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to delete task.",
        variant: "destructive",
      });
    } finally {
      setIsDeleting(false);
    }
  };
  
  const formatDate = (dateString: string) => {
    if (!dateString) return 'No date set';
    return format(new Date(dateString), 'PPP');
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        {isEditing ? (
          <TaskForm
            initialData={task}
            onSuccess={handleTaskUpdated}
            onCancel={() => setIsEditing(false)}
          />
        ) : (
          <div className="space-y-4">
            <div className="flex justify-between items-start">
              <div>
                <h2 className="text-2xl font-bold">{task.title}</h2>
                <div className="flex items-center gap-2 mt-1">
                  <Badge variant="outline" className={statusConfig[task.status as keyof typeof statusConfig].color}>
                    {statusConfig[task.status as keyof typeof statusConfig].label}
                  </Badge>
                  <Badge variant="outline" className={priorityConfig[task.priority as keyof typeof priorityConfig].color}>
                    {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)} Priority
                  </Badge>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="icon" onClick={() => setIsEditing(true)}>
                  <Edit2 className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon" onClick={() => setIsDeleting(true)}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
            
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="details">Details</TabsTrigger>
                <TabsTrigger value="activity">Activity</TabsTrigger>
                <TabsTrigger value="comments">Comments</TabsTrigger>
              </TabsList>
              
              <TabsContent value="details" className="space-y-4 pt-4">
                {task.description && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base">Description</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="whitespace-pre-wrap">{task.description}</p>
                    </CardContent>
                  </Card>
                )}
                
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Task Details</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="flex items-start gap-2">
                        <User className="h-5 w-5 text-muted-foreground mt-0.5" />
                        <div>
                          <p className="text-sm font-medium">Assignee</p>
                          {task.assigned_to ? (
                            <div className="flex items-center gap-2 mt-1">
                              <Avatar className="h-6 w-6">
                                <AvatarImage src={task.assigned_to?.profile_picture} />
                                <AvatarFallback>
                                  {task.assigned_to?.full_name?.charAt(0) || '?'}
                                </AvatarFallback>
                              </Avatar>
                              <span>{task.assigned_to?.full_name}</span>
                            </div>
                          ) : (
                            <p className="text-sm text-muted-foreground">Unassigned</p>
                          )}
                        </div>
                      </div>
                      
                      <div className="flex items-start gap-2">
                        <Calendar className="h-5 w-5 text-muted-foreground mt-0.5" />
                        <div>
                          <p className="text-sm font-medium">Due Date</p>
                          <p className="text-sm">
                            {task.due_date ? formatDate(task.due_date) : 'No due date set'}
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex items-start gap-2">
                        <Clock className="h-5 w-5 text-muted-foreground mt-0.5" />
                        <div>
                          <p className="text-sm font-medium">Created</p>
                          <p className="text-sm">{formatDate(task.created_at)}</p>
                          <p className="text-xs text-muted-foreground">
                            by {task.created_by?.full_name || 'Unknown'}
                          </p>
                        </div>
                      </div>
                      
                      {task.team && (
                        <div className="flex items-start gap-2">
                          <Users className="h-5 w-5 text-muted-foreground mt-0.5" />
                          <div>
                            <p className="text-sm font-medium">Team</p>
                            <p className="text-sm">{task.team.name}</p>
                          </div>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
                
                {/* Subtasks section - placeholder for future implementation */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Subtasks</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground text-center py-4">
                      Subtasks feature coming soon
                    </p>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="activity" className="space-y-4 pt-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Activity Log</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground text-center py-4">
                      Activity tracking feature coming soon
                    </p>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="comments" className="space-y-4 pt-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Comments</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground text-center py-4">
                      Comments feature coming soon
                    </p>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
            
            {isDeleting && (
              <Card className="border-destructive">
                <CardHeader>
                  <CardTitle className="text-destructive">Confirm Deletion</CardTitle>
                </CardHeader>
                <CardContent>
                  <p>Are you sure you want to delete this task? This action cannot be undone.</p>
                </CardContent>
                <CardFooter className="flex justify-end gap-2">
                  <Button 
                    variant="ghost" 
                    onClick={() => setIsDeleting(false)}
                  >
                    <XCircle className="h-4 w-4 mr-2" />
                    Cancel
                  </Button>
                  <Button 
                    variant="destructive" 
                    onClick={handleDelete}
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete Task
                  </Button>
                </CardFooter>
              </Card>
            )}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
