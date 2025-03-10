
import { Calendar, LayoutDashboard, ListTodo, Users, BarChart3, Target, Settings, FolderKanban } from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { useNavigate, useLocation } from "react-router-dom";

const navigationItems = [
  { title: "My Day", icon: Calendar, path: "/my-day" },
  { title: "Dashboard", icon: LayoutDashboard, path: "/" },
  { title: "Tasks", icon: ListTodo, path: "/tasks" },
  { title: "Projects", icon: FolderKanban, path: "/projects" },
  { title: "Team", icon: Users, path: "/team" },
  { title: "Reports", icon: BarChart3, path: "/reports" },
  { title: "Goals", icon: Target, path: "/goals" },
  { title: "Settings", icon: Settings, path: "/settings" },
];

const Navigation = () => {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <Sidebar>
      <SidebarContent>
        <div className="flex items-center justify-center p-6">
          <img src="/lovable-uploads/5777b715-f615-4046-b1b4-1af3cd0a1135.png" alt="Logo" className="h-8" />
        </div>
        <SidebarGroup>
          <SidebarGroupLabel>QualiTasks</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navigationItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    onClick={() => navigate(item.path)}
                    className={`w-full ${
                      location.pathname === item.path ? "bg-primary text-white" : ""
                    }`}
                  >
                    <item.icon className="h-4 w-4" />
                    <span>{item.title}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
};

export default Navigation;
