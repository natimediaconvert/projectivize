
import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import MainLayout from '@/components/layout/MainLayout';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { FileDown } from 'lucide-react';
import TaskCompletionChart from '@/components/reports/TaskCompletionChart';
import PriorityDistributionChart from '@/components/reports/PriorityDistributionChart';
import TeamPerformanceChart from '@/components/reports/TeamPerformanceChart';
import GoalsProgressChart from '@/components/reports/GoalsProgressChart';
import GenerateReportDialog from '@/components/reports/GenerateReportDialog';
import ReportsList from '@/components/reports/ReportsList';

export default function ReportsPage() {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isGenerateDialogOpen, setIsGenerateDialogOpen] = useState(false);

  const { data: reports, isLoading, refetch } = useQuery({
    queryKey: ['reports'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('reports')
        .select(`
          *,
          generated_by (
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

  const handleReportCreated = () => {
    toast({
      title: "Report generated",
      description: "Your report has been generated successfully.",
    });
    refetch();
    setIsGenerateDialogOpen(false);
  };

  const handleExportData = () => {
    toast({
      title: "Exporting data",
      description: "Your data export is being prepared.",
    });
    
    // In a real implementation, this would generate and download a CSV/PDF file
    setTimeout(() => {
      toast({
        title: "Export ready",
        description: "Your data has been exported successfully.",
      });
    }, 1500);
  };

  return (
    <MainLayout>
      <div className="container mx-auto p-4 space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">Reports & Analytics</h1>
          <div className="space-x-2">
            <Button variant="outline" onClick={handleExportData} className="gap-2">
              <FileDown className="h-4 w-4" />
              Export Data
            </Button>
            <Button onClick={() => setIsGenerateDialogOpen(true)}>Generate Report</Button>
          </div>
        </div>

        <Tabs defaultValue="dashboard" onValueChange={setActiveTab}>
          <TabsList className="mb-4">
            <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
            <TabsTrigger value="tasks">Task Analytics</TabsTrigger>
            <TabsTrigger value="teams">Team Performance</TabsTrigger>
            <TabsTrigger value="goals">Goals Progress</TabsTrigger>
            <TabsTrigger value="saved">Saved Reports</TabsTrigger>
          </TabsList>
          
          <TabsContent value="dashboard" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <Card className="p-4">
                <h3 className="font-semibold mb-2">Completion Rate</h3>
                <div className="h-48">
                  <TaskCompletionChart />
                </div>
              </Card>
              
              <Card className="p-4">
                <h3 className="font-semibold mb-2">Tasks by Priority</h3>
                <div className="h-48">
                  <PriorityDistributionChart />
                </div>
              </Card>
              
              <Card className="p-4">
                <h3 className="font-semibold mb-2">Goals Progress</h3>
                <div className="h-48">
                  <GoalsProgressChart />
                </div>
              </Card>
            </div>

            <Card className="p-4">
              <h3 className="font-semibold mb-4">Team Performance Overview</h3>
              <div className="h-64">
                <TeamPerformanceChart />
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="tasks">
            <Card className="p-6">
              <h3 className="font-semibold mb-4">Task Completion Trends</h3>
              <div className="h-64">
                <TaskCompletionChart showDetailed={true} />
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="teams">
            <Card className="p-6">
              <h3 className="font-semibold mb-4">Team Performance Metrics</h3>
              <div className="h-64">
                <TeamPerformanceChart showDetailed={true} />
              </div>
            </Card>
          </TabsContent>
          
          <TabsContent value="goals">
            <Card className="p-6">
              <h3 className="font-semibold mb-4">Goals Progress by Category</h3>
              <div className="h-64">
                <GoalsProgressChart />
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="saved">
            {isLoading ? (
              <p>Loading saved reports...</p>
            ) : (
              <ReportsList reports={reports || []} onUpdate={refetch} />
            )}
          </TabsContent>
        </Tabs>
        
        <GenerateReportDialog 
          isOpen={isGenerateDialogOpen} 
          onClose={() => setIsGenerateDialogOpen(false)}
          onReportCreated={handleReportCreated}
        />
      </div>
    </MainLayout>
  );
}
