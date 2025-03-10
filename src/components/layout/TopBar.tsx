
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bell, Plus, Search, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { UserAccountMenu } from '@/components/auth/UserAccountMenu';
import { ThemeToggle } from '@/components/ui/theme-toggle';
import CreateTaskButton from '@/components/tasks/CreateTaskButton';
import { LanguageToggle } from '@/components/ui/language-toggle';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useTheme } from '@/providers/ThemeProvider';
import { useTranslation } from '@/providers/i18n/TranslationProvider';
import { Badge } from '@/components/ui/badge';

const TopBar: React.FC = () => {
  const navigate = useNavigate();
  const { direction } = useTheme();
  const { t } = useTranslation();
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [showMobileSearch, setShowMobileSearch] = useState<boolean>(false);

  // Dummy notification data
  const notifications = [
    { id: 1, title: 'New task assigned', description: 'A new task has been assigned to you', read: false },
    { id: 2, title: 'Task deadline approaching', description: 'Task "Project Planning" is due tomorrow', read: false },
    { id: 3, title: 'Goal update', description: 'You\'ve reached 75% of your professional goal', read: true },
  ];

  const unreadCount = notifications.filter(n => !n.read).length;

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Implement search functionality
    console.log('Searching for:', searchQuery);
  };

  const toggleMobileSearch = () => {
    setShowMobileSearch(!showMobileSearch);
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center px-4">
        {/* Logo */}
        <div className="mr-4 hidden md:flex">
          <a 
            href="/" 
            className="flex items-center space-x-2" 
            onClick={(e) => { e.preventDefault(); navigate('/'); }}
          >
            <img 
              src="/lovable-uploads/3e825f67-846e-4c52-bb64-a98fd67d419d.png" 
              alt="QualiTasks Logo" 
              className="h-8" 
            />
          </a>
        </div>

        {/* Mobile Menu Button - This is a placeholder for mobile menu toggle if needed */}
        <div className="md:hidden flex">
          <a 
            href="/" 
            className="flex items-center" 
            onClick={(e) => { e.preventDefault(); navigate('/'); }}
          >
            <img 
              src="/lovable-uploads/3e825f67-846e-4c52-bb64-a98fd67d419d.png" 
              alt="QualiTasks Logo" 
              className="h-6" 
            />
          </a>
        </div>

        {/* Search Bar - Desktop */}
        <div className={`flex-1 ${direction === 'rtl' ? 'mr-4' : 'ml-4'} md:flex ${showMobileSearch ? 'hidden' : 'hidden md:flex'}`}>
          <form onSubmit={handleSearch} className="w-full flex">
            <div className="relative w-full max-w-2xl">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder={t('searchPlaceholder')}
                className="w-full pl-8 pr-4"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </form>
        </div>

        {/* Search Bar - Mobile */}
        {showMobileSearch && (
          <div className="flex-1 flex items-center">
            <form onSubmit={handleSearch} className="w-full flex">
              <div className="relative w-full">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder={t('searchPlaceholder')}
                  className="w-full pl-8 pr-8"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  autoFocus
                />
                <Button 
                  type="button" 
                  variant="ghost" 
                  size="icon" 
                  className="absolute right-0 top-0"
                  onClick={toggleMobileSearch}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </form>
          </div>
        )}

        <div className="flex items-center space-x-1 md:space-x-2">
          {/* Mobile Search Toggle */}
          {!showMobileSearch && (
            <Button 
              variant="ghost" 
              size="icon" 
              className="md:hidden" 
              onClick={toggleMobileSearch}
              aria-label="Search"
            >
              <Search className="h-5 w-5" />
            </Button>
          )}

          {/* Quick Add Task */}
          <CreateTaskButton 
            buttonText=""
            variant="ghost"
            size="icon"
            showIcon={true}
          />

          {/* Notification Center */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" aria-label="Notifications">
                <div className="relative">
                  <Bell className="h-5 w-5" />
                  {unreadCount > 0 && (
                    <Badge 
                      className="absolute -top-1 -right-1 px-1 min-w-[18px] h-[18px] flex items-center justify-center text-[10px] bg-destructive"
                    >
                      {unreadCount}
                    </Badge>
                  )}
                </div>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-[300px]">
              <DropdownMenuLabel>Notifications</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <div className="max-h-[300px] overflow-auto">
                {notifications.length > 0 ? (
                  notifications.map((notification) => (
                    <DropdownMenuItem key={notification.id} className="flex flex-col items-start py-2">
                      <div className="font-medium flex items-center w-full">
                        {notification.title}
                        {!notification.read && (
                          <div className="ml-2 h-2 w-2 rounded-full bg-destructive"></div>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">{notification.description}</p>
                    </DropdownMenuItem>
                  ))
                ) : (
                  <div className="p-4 text-center text-sm text-muted-foreground">
                    No notifications
                  </div>
                )}
              </div>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="justify-center font-medium">
                View all notifications
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Theme Toggle */}
          <ThemeToggle />
          
          {/* Language Toggle */}
          <LanguageToggle />

          {/* User Menu */}
          <UserAccountMenu />
        </div>
      </div>
    </header>
  );
};

export default TopBar;
