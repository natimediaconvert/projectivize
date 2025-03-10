
import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import MainLayout from '@/components/layout/MainLayout';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import GoalsList from '@/components/goals/GoalsList';
import CreateGoalDialog from '@/components/goals/CreateGoalDialog';
import { GoalCategory } from '@/types/goals';
import { Skeleton } from '@/components/ui/skeleton';

export default function GoalsPage() {
  const { toast } = useToast();
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<GoalCategory | 'all'>('all');

  const { data: goals, isLoading, refetch } = useQuery({
    queryKey: ['goals'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('goals')
        .select(`
          *,
          user:user_id (
            id,
            full_name,
            profile_picture
          )
        `)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data || [];
    },
  });

  const handleGoalCreated = () => {
    toast({
      title: "Goal created",
      description: "Your new goal has been created successfully.",
    });
    refetch();
    setIsCreateDialogOpen(false);
  };

  const filteredGoals = goals?.filter(goal => 
    activeTab === 'all' || goal.category === activeTab
  );

  return (
    <MainLayout>
      <div className="container mx-auto p-4 space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">Goals</h1>
          <Button onClick={() => setIsCreateDialogOpen(true)}>
            Create Goal
          </Button>
        </div>

        <Tabs defaultValue="all" onValueChange={(value) => setActiveTab(value as GoalCategory | 'all')}>
          <TabsList className="mb-4">
            <TabsTrigger value="all">All Goals</TabsTrigger>
            <TabsTrigger value="professional">Professional</TabsTrigger>
            <TabsTrigger value="project">Project</TabsTrigger>
            <TabsTrigger value="personal">Personal</TabsTrigger>
          </TabsList>
          
          <TabsContent value="all">
            {isLoading ? (
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <Card key={i} className="p-4">
                    <Skeleton className="h-6 w-40 mb-2" />
                    <Skeleton className="h-4 w-full mb-4" />
                    <Skeleton className="h-4 w-3/4" />
                  </Card>
                ))}
              </div>
            ) : filteredGoals && filteredGoals.length > 0 ? (
              <GoalsList goals={filteredGoals} onUpdate={refetch} />
            ) : (
              <Card className="p-8 text-center">
                <p className="text-muted-foreground mb-4">No goals found.</p>
                <Button onClick={() => setIsCreateDialogOpen(true)}>Create your first goal</Button>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="professional">
            {isLoading ? (
              <Skeleton className="h-48 w-full" />
            ) : (
              <GoalsList 
                goals={filteredGoals || []} 
                onUpdate={refetch} 
              />
            )}
          </TabsContent>

          <TabsContent value="project">
            {isLoading ? (
              <Skeleton className="h-48 w-full" />
            ) : (
              <GoalsList 
                goals={filteredGoals || []} 
                onUpdate={refetch} 
              />
            )}
          </TabsContent>

          <TabsContent value="personal">
            {isLoading ? (
              <Skeleton className="h-48 w-full" />
            ) : (
              <GoalsList 
                goals={filteredGoals || []} 
                onUpdate={refetch} 
              />
            )}
          </TabsContent>
        </Tabs>

        <CreateGoalDialog 
          isOpen={isCreateDialogOpen} 
          onClose={() => setIsCreateDialogOpen(false)}
          onGoalCreated={handleGoalCreated}
        />
      </div>
    </MainLayout>
  );
}
