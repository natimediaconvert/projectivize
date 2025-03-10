
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
import { useTranslation } from "@/providers/i18n/TranslationProvider";
import { useTheme } from "@/providers/ThemeProvider";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { LanguageToggle } from "@/components/ui/language-toggle";
import { UserAccountMenu } from "@/components/auth/UserAccountMenu";

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

  return (
    <Sidebar>
      <SidebarContent>
        <div className="flex items-center justify-between p-6">
          <img src="/lovable-uploads/5777b715-f615-4046-b1b4-1af3cd0a1135.png" alt="Logo" className="h-8" />
          <div className="flex items-center space-x-2">
            <ThemeToggle />
            <LanguageToggle />
            <UserAccountMenu />
          </div>
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
                    <item.icon className={`h-4 w-4 ${direction === "rtl" ? "sidebar-icon ml-2" : "mr-2"}`} />
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
}
