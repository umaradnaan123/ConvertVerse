import { useEffect } from 'react';
import { Sun, Moon } from 'lucide-react';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { useLanguage } from '../hooks/useLanguage';

export default function ThemeToggle() {
  const [theme, setTheme] = useLocalStorage('convertverse_theme', 'dark');
  const { t } = useLanguage();

  useEffect(() => {
    if (theme === 'light') {
      document.body.classList.add('light');
    } else {
      document.body.classList.remove('light');
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  return (
    <button
      onClick={toggleTheme}
      className="p-2.5 rounded-xl border border-white/10 dark:border-white/10 light:border-black/10 hover:bg-white/5 transition-all text-dark-400 hover:text-primary-400 dark:hover:text-primary-400 light:hover:text-primary-600 flex items-center justify-center gap-2"
      aria-label={theme === 'dark' ? t('lightMode') : t('darkMode')}
      title={theme === 'dark' ? t('lightMode') : t('darkMode')}
    >
      {theme === 'dark' ? (
        <>
          <Sun size={18} className="text-yellow-400" />
          <span className="md:hidden text-sm font-medium">{t('lightMode')}</span>
        </>
      ) : (
        <>
          <Moon size={18} className="text-primary-500" />
          <span className="md:hidden text-sm font-medium">{t('darkMode')}</span>
        </>
      )}
    </button>
  );
}
