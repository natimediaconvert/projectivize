
import React, { useEffect, useState } from 'react';
import { useTranslation } from '@/providers/i18n/TranslationProvider';
import { Loader2 } from 'lucide-react';
import { Progress } from '@/components/ui/progress';

const LoadingScreen: React.FC = () => {
  const { t } = useTranslation();
  const [progress, setProgress] = useState(20);
  const [imgLoaded, setImgLoaded] = useState(false);

  // Use a faster progress simulation
  useEffect(() => {
    let unmounted = false;
    
    // Preload the logo to avoid flashing
    const logoImg = new Image();
    logoImg.src = "/lovable-uploads/0cc3f056-b4cc-437a-8752-2e98414e29f8.png";
    logoImg.onload = () => {
      if (!unmounted) {
        console.log("[DEBUG] Auth page: Logo loaded in loading screen");
        setImgLoaded(true);
        setProgress(50); // Jump to 50% when logo is loaded
      }
    };
    
    // Much faster progress updates for better UX
    const interval = setInterval(() => {
      if (unmounted) return;
      
      setProgress((prev) => {
        if (prev >= 90) {
          clearInterval(interval);
          return 90;
        }
        return prev + 20; // Much faster increments
      });
    }, 50); // Much faster interval - 50ms instead of 70ms
    
    // Force progress to complete after 1 second no matter what
    const forceCompleteTimeout = setTimeout(() => {
      if (!unmounted) {
        clearInterval(interval);
        setProgress(100);
      }
    }, 1000);

    return () => {
      unmounted = true;
      clearInterval(interval);
      clearTimeout(forceCompleteTimeout);
    };
  }, []);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center max-w-md w-full px-4 animate-fade-in">
        {imgLoaded ? (
          <img 
            src="/lovable-uploads/0cc3f056-b4cc-437a-8752-2e98414e29f8.png" 
            alt="QualiTasks Logo" 
            className="h-20 w-auto mx-auto mb-8" 
            style={{ transform: 'scale(1.5)' }}
          />
        ) : (
          <div className="h-20 w-auto mx-auto mb-8 flex items-center justify-center">
            <Loader2 className="h-10 w-10 animate-spin" />
          </div>
        )}
        <Progress value={progress} className="h-2 mb-4" />
        <Loader2 className="h-6 w-6 animate-spin mx-auto mb-2" />
        <p className="text-lg font-medium">{t('checkingSession')}</p>
        <p className="text-sm text-muted-foreground mt-1">Almost ready...</p>
      </div>
    </div>
  );
};

export default LoadingScreen;
