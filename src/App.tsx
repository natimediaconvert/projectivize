
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from '@/providers/AuthProvider';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { TranslationProvider } from '@/providers/i18n/TranslationProvider';
import { ThemeProvider } from '@/providers/ThemeProvider';

import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import TasksPage from "./pages/tasks";
import AuthPage from "./pages/auth";
import ProfileSettings from "./pages/settings/ProfileSettings";
import Unauthorized from "./pages/Unauthorized";
import GoalsPage from "./pages/goals";
import ReportsPage from "./pages/reports";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

const App = () => (
  <BrowserRouter>
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <TranslationProvider>
          <AuthProvider>
            <TooltipProvider>
              <Toaster />
              <Sonner />
              <Routes>
                <Route path="/auth" element={<AuthPage />} />
                <Route path="/unauthorized" element={<Unauthorized />} />
                
                <Route path="/" element={<ProtectedRoute><Index /></ProtectedRoute>} />
                <Route path="/tasks" element={<ProtectedRoute><TasksPage /></ProtectedRoute>} />
                <Route path="/profile" element={<ProtectedRoute><ProfileSettings /></ProtectedRoute>} />
                <Route path="/my-day" element={<ProtectedRoute><NotFound /></ProtectedRoute>} />
                <Route path="/projects" element={<ProtectedRoute><NotFound /></ProtectedRoute>} />
                <Route path="/team" element={<ProtectedRoute><NotFound /></ProtectedRoute>} />
                <Route path="/reports" element={<ProtectedRoute><ReportsPage /></ProtectedRoute>} />
                <Route path="/goals" element={<ProtectedRoute><GoalsPage /></ProtectedRoute>} />
                <Route path="/settings" element={<ProtectedRoute><ProfileSettings /></ProtectedRoute>} />
                
                {/* Fallback route - redirect to dashboard if logged in, otherwise to auth */}
                <Route path="*" element={<Navigate to="/auth" />} />
              </Routes>
            </TooltipProvider>
          </AuthProvider>
        </TranslationProvider>
      </ThemeProvider>
    </QueryClientProvider>
  </BrowserRouter>
);

export default App;
