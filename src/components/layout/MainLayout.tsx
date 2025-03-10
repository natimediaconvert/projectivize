
import React from 'react';
import { SidebarProvider } from "@/components/ui/sidebar";
import Navigation from './Navigation';
import { ThemeProvider } from '@/providers/ThemeProvider';
import { TranslationProvider } from '@/providers/i18n/TranslationProvider';
import { SkipLink } from '@/components/ui/skip-link';

const MainLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <ThemeProvider>
      <TranslationProvider>
        <SkipLink />
        <SidebarProvider>
          <div className="min-h-screen flex w-full bg-secondary/30">
            <Navigation />
            <main id="main-content" className="flex-1 p-4 md:p-6 overflow-auto animate-fade-in">
              {children}
            </main>
          </div>
        </SidebarProvider>
      </TranslationProvider>
    </ThemeProvider>
  );
};

export default MainLayout;
