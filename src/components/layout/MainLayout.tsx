
import React from 'react';
import { SidebarProvider } from "@/components/ui/sidebar";
import Navigation from './Navigation';
import TopBar from './TopBar';
import { SkipLink } from '@/components/ui/skip-link';

const MainLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <SkipLink />
      <SidebarProvider>
        <div className="min-h-screen flex flex-col w-full">
          <TopBar />
          <div className="flex flex-1 h-[calc(100vh-5rem)]">
            <Navigation />
            <main id="main-content" className="flex-1 p-4 md:p-6 overflow-auto animate-fade-in">
              {children}
            </main>
          </div>
        </div>
      </SidebarProvider>
    </>
  );
};

export default MainLayout;
