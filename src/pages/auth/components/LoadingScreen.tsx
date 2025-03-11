
import React, { useEffect, useState } from 'react';
import { useTranslation } from '@/providers/i18n/TranslationProvider';
import { Loader2 } from 'lucide-react';
import { Progress } from '@/components/ui/progress';

const LoadingScreen: React.FC = () => {
  const { t } = useTranslation();
  const [progress, setProgress] = useState(0);

  // Simulate progress to give user visual feedback while waiting
  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 90) {
          clearInterval(interval);
          return 90;
        }
        return prev + 10;
      });
    }, 100);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center max-w-md w-full px-4">
        <img 
          src="/lovable-uploads/0cc3f056-b4cc-437a-8752-2e98414e29f8.png" 
          alt="QualiTasks Logo" 
          className="h-24 w-auto mx-auto mb-8" 
        />
        <Progress value={progress} className="h-2 mb-4" />
        <Loader2 className="h-6 w-6 animate-spin mx-auto mb-2" />
        <p className="text-lg font-medium">{t('checkingSession')}</p>
        <p className="text-sm text-muted-foreground mt-1">Almost ready...</p>
      </div>
    </div>
  );
};

export default LoadingScreen;
