
import { Card } from "@/components/ui/card";
import MainLayout from "@/components/layout/MainLayout";

const Dashboard = () => {
  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-primary">Dashboard</h1>
          <p className="text-sm text-muted-foreground">Welcome back!</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card className="p-6 backdrop-blur-sm bg-white/50">
            <h3 className="font-semibold mb-2">Today's Tasks</h3>
            <p className="text-2xl font-bold text-primary">0</p>
          </Card>
          
          <Card className="p-6 backdrop-blur-sm bg-white/50">
            <h3 className="font-semibold mb-2">Ongoing Projects</h3>
            <p className="text-2xl font-bold text-primary">0</p>
          </Card>
          
          <Card className="p-6 backdrop-blur-sm bg-white/50">
            <h3 className="font-semibold mb-2">Team Members</h3>
            <p className="text-2xl font-bold text-primary">0</p>
          </Card>
        </div>

        <Card className="p-6 backdrop-blur-sm bg-white/50">
          <h3 className="font-semibold mb-4">Recent Activity</h3>
          <p className="text-muted-foreground">No recent activity</p>
        </Card>
      </div>
    </MainLayout>
  );
};

export default Dashboard;
