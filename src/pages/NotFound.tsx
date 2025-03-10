
import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import MainLayout from "@/components/layout/MainLayout";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <MainLayout>
      <div className="flex items-center justify-center min-h-[80vh]">
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold text-primary">404</h1>
          <p className="text-xl text-muted-foreground">Oops! Page not found</p>
          <a href="/" className="text-primary hover:text-primary/80 underline">
            Return to Dashboard
          </a>
        </div>
      </div>
    </MainLayout>
  );
};

export default NotFound;
