import { useState, useEffect } from 'react';
import { translations } from '../locales/translation';
import { useLocalStorage } from './useLocalStorage';
import { SUPPORTED_LANGUAGES, LanguageContext } from './LanguageContext';
import { useConnectivity } from './useConnectivity';
import { safeStorage } from '../utils/safeStorage';

export function LanguageProvider({ children }) {
  const { isOnline } = useConnectivity();
  
  const getInitialLanguage = () => {
    try {
      const saved = safeStorage.getItem('convertverse_lang');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.warn('Failed to parse saved language:', e);
    }
    
    const browserLang = navigator.language?.split('-')[0] || 'en';
    const isSupported = SUPPORTED_LANGUAGES.some(l => l.code === browserLang);
    return isSupported ? browserLang : 'en';
  };

  const [lang, setLang] = useLocalStorage('convertverse_lang', getInitialLanguage());
  
  // Initialize cachedDict directly from localStorage to avoid synchronous state update inside useEffect
  const [cachedDict, setCachedDict] = useState(() => {
    const initialLang = getInitialLanguage();
    if (initialLang === 'en') return {};
    try {
      const stored = safeStorage.getItem(`convertverse_cache_${initialLang}`);
      return stored ? JSON.parse(stored) : {};
    } catch {
      return {};
    }
  });

  // Handle setting language and synchronizing cachedDict
  const changeLanguage = (newLang) => {
    setLang(newLang);
    if (newLang === 'en') {
      setCachedDict({});
    } else {
      let cache = {};
      try {
        const stored = safeStorage.getItem(`convertverse_cache_${newLang}`);
        if (stored) {
          cache = JSON.parse(stored);
        }
      } catch (e) {
        console.error('Failed to load local translation cache:', e);
      }
      setCachedDict(cache);
    }
  };

  // Trigger HTML DOM metadata and layout direction updates
  useEffect(() => {
    const currentLangConfig = SUPPORTED_LANGUAGES.find(l => l.code === lang) || SUPPORTED_LANGUAGES[0];
    const isRtl = currentLangConfig.dir === 'rtl';

    document.documentElement.setAttribute('dir', isRtl ? 'rtl' : 'ltr');
    document.documentElement.setAttribute('lang', lang);
  }, [lang]);

  // Progressive background auto-translation preloader
  useEffect(() => {
    if (lang === 'en' || !isOnline) {
      return;
    }

    // Read the current cache state
    let cache = {};
    try {
      const stored = safeStorage.getItem(`convertverse_cache_${lang}`);
      if (stored) {
        cache = JSON.parse(stored);
      }
    } catch (e) {
      console.error('Failed to load local translation cache:', e);
    }

    // Warm up and resolve missing translation keys in the background
    const englishKeys = Object.keys(translations['en']);
    const missingKeys = englishKeys.filter(
      (key) => !translations[lang]?.[key] && !cache[key]
    );

    if (missingKeys.length === 0) return;

    let index = 0;
    const batchSize = 3;
    const interval = setInterval(async () => {
      if (!navigator.onLine) {
        clearInterval(interval);
        return;
      }

      if (index >= missingKeys.length) {
        clearInterval(interval);
        return;
      }

      const batch = missingKeys.slice(index, index + batchSize);
      index += batchSize;

      await Promise.all(
        batch.map(async (key) => {
          const englishText = translations['en'][key];
          try {
            const apiBase = import.meta.env.VITE_TRANSLATION_API_URL || 'https://api.mymemory.translated.net/get';
            const url = `${apiBase}?q=${encodeURIComponent(englishText)}&langpair=en|${lang}`;
            
            const res = await fetch(url);
            if (!res.ok) {
              throw new Error(`HTTP error! status: ${res.status}`);
            }
            const data = await res.json();
            const translated = data?.responseData?.translatedText;
            
            // Clean translations warning matches
            if (translated && !translated.includes('MYMEMORY WARNING') && !translated.includes('IS EXCEEDED')) {
              cache[key] = translated;
              safeStorage.setItem(`convertverse_cache_${lang}`, JSON.stringify(cache));
            }
          } catch (err) {
            console.warn(`Failed dynamically fetching translation key '${key}':`, err.message);
          }
        })
      );

      // Trigger progressive state re-renders to show dynamic translations in real time
      setCachedDict({ ...cache });
    }, 1200);

    return () => clearInterval(interval);
  }, [lang, isOnline]);

  // Translation lookup key parser
  const t = (key) => {
    return (
      cachedDict[key] ||
      translations[lang]?.[key] || 
      translations['en']?.[key] || 
      key
    );
  };

  // Localized date/time formatter
  const formatDate = (date, options = { dateStyle: 'medium' }) => {
    try {
      return new Intl.DateTimeFormat(lang, options).format(new Date(date));
    } catch {
      return new Date(date).toLocaleDateString();
    }
  };

  return (
    <LanguageContext.Provider value={{ lang, setLang: changeLanguage, t, formatDate, SUPPORTED_LANGUAGES }}>
      {children}
    </LanguageContext.Provider>
  );
}
