
import React from 'react';
import { useTranslation } from '@/providers/i18n/TranslationProvider';

const LoadingScreen: React.FC = () => {
  const { t } = useTranslation();

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <p className="text-lg">{t('checkingSession')}</p>
        <p className="text-sm text-muted-foreground mt-2">Please wait...</p>
      </div>
    </div>
  );
};

export default LoadingScreen;
