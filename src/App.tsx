
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from '@/providers/AuthProvider';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';

import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import TasksPage from "./pages/tasks";
import AuthPage from "./pages/auth";
import ProfileSettings from "./pages/settings/ProfileSettings";
import Unauthorized from "./pages/Unauthorized";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/auth" element={<AuthPage />} />
            <Route path="/unauthorized" element={<Unauthorized />} />
            
            <Route path="/" element={<ProtectedRoute><Index /></ProtectedRoute>} />
            <Route path="/tasks" element={<ProtectedRoute><TasksPage /></ProtectedRoute>} />
            <Route path="/profile" element={<ProtectedRoute><ProfileSettings /></ProtectedRoute>} />
            <Route path="/my-day" element={<ProtectedRoute><NotFound /></ProtectedRoute>} />
            <Route path="/projects" element={<ProtectedRoute><NotFound /></ProtectedRoute>} />
            <Route path="/team" element={<ProtectedRoute><NotFound /></ProtectedRoute>} />
            <Route path="/reports" element={<ProtectedRoute><NotFound /></ProtectedRoute>} />
            <Route path="/goals" element={<ProtectedRoute><NotFound /></ProtectedRoute>} />
            <Route path="/settings" element={<ProtectedRoute><ProfileSettings /></ProtectedRoute>} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
