
import React from 'react';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Briefcase, 
  Target, 
  User,
  Calendar, 
  Pencil,
  MoreHorizontal
} from 'lucide-react';
import { format } from 'date-fns';
import { Goal } from '@/types/goals';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface GoalsListProps {
  goals: Goal[];
  onUpdate: () => void;
}

const GoalsList: React.FC<GoalsListProps> = ({ goals, onUpdate }) => {
  const { toast } = useToast();

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'professional': return <Briefcase className="h-4 w-4" />;
      case 'project': return <Target className="h-4 w-4" />;
      case 'personal': return <User className="h-4 w-4" />;
      default: return null;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'professional': return 'bg-blue-100 text-blue-800';
      case 'project': return 'bg-green-100 text-green-800';
      case 'personal': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleUpdateProgress = async (goalId: string, newProgress: number) => {
    try {
      const { error } = await supabase
        .from('goals')
        .update({ 
          progress: newProgress,
          updated_at: new Date().toISOString()
        })
        .eq('id', goalId);
      
      if (error) throw error;
      
      toast({
        title: "Progress updated",
        description: `Goal progress updated to ${newProgress}%.`,
      });
      
      onUpdate();
    } catch (error: any) {
      console.error("Error updating goal progress:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to update goal progress.",
        variant: "destructive",
      });
    }
  };

  const handleDeleteGoal = async (goalId: string) => {
    try {
      const { error } = await supabase
        .from('goals')
        .delete()
        .eq('id', goalId);
      
      if (error) throw error;
      
      toast({
        title: "Goal deleted",
        description: "The goal has been deleted successfully.",
      });
      
      onUpdate();
    } catch (error: any) {
      console.error("Error deleting goal:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to delete the goal.",
        variant: "destructive",
      });
    }
  };

  if (goals.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">No goals found in this category.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {goals.map((goal) => (
        <Card key={goal.id} className="p-4">
          <div className="flex flex-col gap-2">
            <div className="flex justify-between items-start">
              <div className="flex items-center gap-2">
                <Badge variant="outline" className={`flex items-center gap-1 ${getCategoryColor(goal.category)}`}>
                  {getCategoryIcon(goal.category)}
                  {goal.category.charAt(0).toUpperCase() + goal.category.slice(1)}
                </Badge>
                {goal.deadline && (
                  <Badge variant="outline" className="flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    {format(new Date(goal.deadline), 'MMM d, yyyy')}
                  </Badge>
                )}
              </div>
              
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => handleUpdateProgress(goal.id, 25)}>
                    Set to 25%
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleUpdateProgress(goal.id, 50)}>
                    Set to 50%
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleUpdateProgress(goal.id, 75)}>
                    Set to 75%
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleUpdateProgress(goal.id, 100)}>
                    Mark as Complete
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleDeleteGoal(goal.id)}>
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
            
            <h3 className="text-lg font-semibold">{goal.title}</h3>
            {goal.description && <p className="text-muted-foreground">{goal.description}</p>}
            
            <div className="mt-2">
              <div className="flex justify-between text-sm mb-1">
                <span>Progress</span>
                <span>{goal.progress}%</span>
              </div>
              <Progress value={goal.progress} className="h-2" />
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
};

export default GoalsList;
