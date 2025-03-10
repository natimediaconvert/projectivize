
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useTranslation } from '@/providers/i18n/TranslationProvider';
import { Shield } from 'lucide-react';

export default function Unauthorized() {
  const navigate = useNavigate();
  const { t } = useTranslation();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 text-center">
      <Shield className="h-16 w-16 text-destructive mb-4" />
      <h1 className="text-3xl font-bold mb-2">{t('accessDenied')}</h1>
      <p className="text-muted-foreground mb-6 max-w-md">
        {t('unauthorizedDescription')}
      </p>
      <div className="flex gap-4">
        <Button onClick={() => navigate('/')}>
          {t('backToHome')}
        </Button>
        <Button variant="outline" onClick={() => navigate(-1)}>
          {t('goBack')}
        </Button>
      </div>
    </div>
  );
}
