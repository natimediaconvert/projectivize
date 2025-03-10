
import React from 'react';
import { SidebarProvider } from "@/components/ui/sidebar";
import Navigation from './Navigation';

const MainLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-secondary/30">
        <Navigation />
        <main className="flex-1 p-6 overflow-auto animate-fade-in">
          {children}
        </main>
      </div>
    </SidebarProvider>
  );
};

export default MainLayout;
