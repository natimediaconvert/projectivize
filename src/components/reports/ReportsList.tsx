
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  FileText, 
  Download, 
  Clock, 
  User, 
  BarChart,
  FileDown
} from 'lucide-react';
import { format } from 'date-fns';
import { useToast } from '@/hooks/use-toast';

interface Report {
  id: string;
  report_type: string;
  date: string;
  data: any;
  created_at: string;
  generated_by: {
    id: string;
    full_name: string;
    profile_picture: string | null;
  };
}

interface ReportsListProps {
  reports: Report[];
  onUpdate: () => void;
}

export default function ReportsList({ reports, onUpdate }: ReportsListProps) {
  const { toast } = useToast();

  const handleExportReport = (report: Report) => {
    // In a real implementation, this would generate a file
    toast({
      title: "Report exported",
      description: "The report has been exported successfully.",
    });
  };

  const getReportTypeIcon = (type: string) => {
    switch (type) {
      case 'task_performance': return <BarChart className="h-5 w-5 mr-1" />;
      case 'team_analytics': return <BarChart className="h-5 w-5 mr-1" />;
      default: return <FileText className="h-5 w-5 mr-1" />;
    }
  };

  const getReportTypeName = (type: string) => {
    switch (type) {
      case 'task_performance': return 'Task Performance';
      case 'team_analytics': return 'Team Analytics';
      default: return type.replace('_', ' ');
    }
  };

  if (reports.length === 0) {
    return (
      <Card className="p-8 text-center">
        <p className="text-muted-foreground mb-4">No reports have been generated yet.</p>
        <Button>Generate your first report</Button>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {reports.map((report) => (
        <Card key={report.id}>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center text-lg">
              {getReportTypeIcon(report.report_type)}
              {getReportTypeName(report.report_type)}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center text-sm text-muted-foreground space-x-4 mb-3">
              <div className="flex items-center">
                <Clock className="h-4 w-4 mr-1" />
                {format(new Date(report.created_at), 'MMM d, yyyy')}
              </div>
              <div className="flex items-center">
                <User className="h-4 w-4 mr-1" />
                {report.generated_by.full_name}
              </div>
            </div>
            
            <div className="border rounded-md p-3 bg-muted/50 mb-3">
              <pre className="whitespace-pre-wrap text-sm">
                {JSON.stringify(report.data, null, 2).substring(0, 100)}...
              </pre>
            </div>
            
            <div className="flex justify-end space-x-2">
              <Button 
                variant="outline" 
                size="sm"
                className="flex items-center gap-1"
                onClick={() => handleExportReport(report)}
              >
                <FileDown className="h-4 w-4" />
                Export
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
