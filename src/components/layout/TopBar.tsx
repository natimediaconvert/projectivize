
import React from 'react';
import { Bell } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ThemeToggle } from '@/components/ui/theme-toggle';
import { LanguageToggle } from '@/components/ui/language-toggle';
import { UserAccountMenu } from '@/components/auth/UserAccountMenu';
import { useTheme } from '@/providers/ThemeProvider';

const TopBar = () => {
  const { direction } = useTheme();
  
  return (
    <div className="h-20 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 flex items-center justify-between px-6 sticky top-0 z-50">
      <div className="flex items-center gap-4">
        <img 
          src="/lovable-uploads/0cc3f056-b4cc-437a-8752-2e98414e29f8.png" 
          alt="QualiTasks Logo" 
          className="h-12 w-auto" 
        />
      </div>
      
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" className="text-muted-foreground">
          <Bell className="h-5 w-5" />
        </Button>
        <ThemeToggle />
        <LanguageToggle />
        <UserAccountMenu />
      </div>
    </div>
  );
};

export default TopBar;
