
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import { ThemeProvider } from "./providers/ThemeProvider";
import { Toaster } from "./components/ui/toaster";
import { Toaster as Sonner } from "./components/ui/sonner";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import TranslationProvider from "./providers/i18n/TranslationProvider";
import { AuthProvider } from "./providers/auth/AuthProvider";
import { AuthPage } from "./pages/auth";
import { ProtectedRoute } from "./components/auth/ProtectedRoute";
import NotFound from "./pages/NotFound";
import Index from "./pages/Index";
import TasksPage from "./pages/tasks";
import GoalsPage from "./pages/goals";
import ReportsPage from "./pages/reports";
import MyDayPage from "./pages/my-day";

import "./App.css";

const queryClient = new QueryClient();

const router = createBrowserRouter([
  {
    path: "/auth",
    element: <AuthPage />,
  },
  {
    path: "/",
    element: (
      <ProtectedRoute>
        <Index />
      </ProtectedRoute>
    ),
  },
  {
    path: "/my-day",
    element: (
      <ProtectedRoute>
        <MyDayPage />
      </ProtectedRoute>
    ),
  },
  {
    path: "/tasks",
    element: (
      <ProtectedRoute>
        <TasksPage />
      </ProtectedRoute>
    ),
  },
  {
    path: "/goals",
    element: (
      <ProtectedRoute>
        <GoalsPage />
      </ProtectedRoute>
    ),
  },
  {
    path: "/reports",
    element: (
      <ProtectedRoute>
        <ReportsPage />
      </ProtectedRoute>
    ),
  },
  {
    path: "*",
    element: <NotFound />,
  },
]);

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <ThemeProvider defaultTheme="light" storageKey="ui-theme">
          <TranslationProvider>
            <RouterProvider router={router} />
            <Toaster />
            <Sonner />
          </TranslationProvider>
        </ThemeProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
