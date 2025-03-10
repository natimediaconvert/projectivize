
import React, { createContext, useContext, useState } from 'react';
import { translations, type Translations } from './translations';
import { useTheme } from '../ThemeProvider';

type TranslationContextType = {
  t: (key: keyof Translations) => string;
};

const TranslationContext = createContext<TranslationContextType | undefined>(undefined);

export const TranslationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { language } = useTheme();
  
  const t = (key: keyof Translations): string => {
    return translations[language]?.[key] || translations.en[key] || key;
  };

  return (
    <TranslationContext.Provider value={{ t }}>
      {children}
    </TranslationContext.Provider>
  );
};

export const useTranslation = () => {
  const context = useContext(TranslationContext);
  if (!context) {
    throw new Error('useTranslation must be used within a TranslationProvider');
  }
  return context;
};
