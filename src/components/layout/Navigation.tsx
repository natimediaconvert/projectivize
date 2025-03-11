
import { Calendar, LayoutDashboard, ListTodo, Users, BarChart3, Target, Settings, FolderKanban } from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { useNavigate, useLocation } from "react-router-dom";
import { useTranslation } from "@/providers/i18n/TranslationProvider";
import { useTheme } from "@/providers/ThemeProvider";
import { Button } from "@/components/ui/button";

export default function Navigation() {
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useTranslation();
  const { direction } = useTheme();

  const navigationItems = [
    { title: t("myDay"), icon: Calendar, path: "/my-day" },
    { title: t("dashboard"), icon: LayoutDashboard, path: "/" },
    { title: t("tasks"), icon: ListTodo, path: "/tasks" },
    { title: t("projects"), icon: FolderKanban, path: "/projects" },
    { title: t("team"), icon: Users, path: "/team" },
    { title: t("reports"), icon: BarChart3, path: "/reports" },
    { title: t("goals"), icon: Target, path: "/goals" },
    { title: t("settings"), icon: Settings, path: "/settings" },
  ];

  const handleNavigation = (path: string) => {
    console.log("Navigating to:", path);
    navigate(path);
  };

  return (
    <Sidebar variant="sidebar">
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu className="space-y-1">
              {navigationItems.map((item) => (
                <SidebarMenuItem key={item.path}>
                  <SidebarMenuButton 
                    onClick={() => handleNavigation(item.path)}
                    className={`w-full flex items-center ${
                      location.pathname === item.path ? "bg-primary text-white" : ""
                    }`}
                  >
                    <item.icon className={`h-5 w-5 ${direction === "rtl" ? "ml-3" : "mr-3"}`} />
                    <span className="text-base">{item.title}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
