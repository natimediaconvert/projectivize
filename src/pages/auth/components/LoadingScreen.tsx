
import React from 'react';
import { useTranslation } from '@/providers/i18n/TranslationProvider';
import { Loader2 } from 'lucide-react';

const LoadingScreen: React.FC = () => {
  const { t } = useTranslation();

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
        <p className="text-lg font-medium">{t('checkingSession')}</p>
        <p className="text-sm text-muted-foreground mt-2">Please wait...</p>
      </div>
    </div>
  );
};

export default LoadingScreen;
