import React from 'react';
import { Input } from "@/components/ui/input";
import { UserAccountMenu } from "@/components/auth/UserAccountMenu";
import { ModeToggle } from "@/components/ui/mode-toggle";
import { useTranslation } from '@/providers/i18n/TranslationProvider';

const TopBar = () => {
  const { t } = useTranslation();
  
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex items-center justify-between h-16">
        <ModeToggle />
        <form className="md:flex-1 md:flex-shrink-0 hidden md:flex mx-6" onSubmit={(e) => e.preventDefault()}>
          <Input
            type="search"
            placeholder={t('searchPlaceholder')}
            className="h-9 md:w-[300px] lg:w-[400px] xl:w-[600px]"
          />
        </form>
        <UserAccountMenu />
      </div>
    </header>
  );
};

export default TopBar;
