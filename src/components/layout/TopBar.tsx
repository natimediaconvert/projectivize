
import React from 'react';
import { Bell } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ThemeToggle } from '@/components/ui/theme-toggle';
import { LanguageToggle } from '@/components/ui/language-toggle';
import { UserAccountMenu } from '@/components/auth/UserAccountMenu';
import { useTheme } from '@/providers/ThemeProvider';

/**
 * TopBar component that displays the main navigation bar at the top of the application
 * Includes the logo, notification bell, theme toggle, language toggle, and user account menu
 */
const TopBar = (): JSX.Element => {
  const { direction } = useTheme();
  
  return (
    <div className="h-20 border-b bg-[#1EAEDB] text-white fixed top-0 left-0 right-0 z-40 flex items-center justify-between px-6">
      <div className="flex items-center h-full relative" style={{ minWidth: '250px' }}>
        <img 
          src="/lovable-uploads/0cc3f056-b4cc-437a-8752-2e98414e29f8.png" 
          alt="QualiTasks Logo" 
          className="h-[64px] w-auto absolute left-0 top-1/2 transform -translate-y-1/2" 
          style={{ 
            transform: 'translateY(-40%) scale(4)',
            transformOrigin: 'left center'
          }}
        />
      </div>
      
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" className="text-white hover:bg-[#33C3F0]/20">
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
