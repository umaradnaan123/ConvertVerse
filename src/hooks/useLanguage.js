import { useContext } from 'react';
import { LanguageContext, SUPPORTED_LANGUAGES } from './LanguageContext';
import { LanguageProvider } from './LanguageProvider';

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}

export { LanguageProvider, LanguageContext, SUPPORTED_LANGUAGES };
