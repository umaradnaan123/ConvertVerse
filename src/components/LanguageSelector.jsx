import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Globe, Check, ChevronDown } from 'lucide-react';
import { useLanguage } from '../hooks/useLanguage';

export default function LanguageSelector({ isMobile = false }) {
  const { lang, setLang, t, SUPPORTED_LANGUAGES } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const containerRef = useRef(null);

  // Close dropdown on click outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const currentLang = SUPPORTED_LANGUAGES.find((l) => l.code === lang) || SUPPORTED_LANGUAGES[0];

  const filteredLanguages = SUPPORTED_LANGUAGES.filter(
    (l) =>
      l.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      l.localName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      l.code.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSelect = (code) => {
    setLang(code);
    setIsOpen(false);
    setSearchQuery('');
  };

  if (isMobile) {
    return (
      <div className="w-full space-y-2 text-xs" ref={containerRef}>
        <div className="flex justify-between items-center text-dark-300 font-medium">
          <span>{t('selectLang')}</span>
          <span className="text-[10px] font-bold text-primary-400 bg-primary-500/10 px-2 py-0.5 rounded-full flex items-center gap-1">
            {currentLang.flag} {currentLang.localName}
          </span>
        </div>
        
        {/* Mobile Selection Input */}
        <div className="relative">
          <div className="relative flex items-center">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setIsOpen(true);
              }}
              onFocus={() => setIsOpen(true)}
              placeholder="Search 50+ languages..."
              className="w-full bg-white/5 border border-white/10 rounded-xl pl-8.5 pr-3.5 py-2 text-white placeholder-dark-450 focus:border-primary-500/50 outline-none"
            />
            <Search className="absolute left-3 text-dark-400" size={13} />
          </div>

          <AnimatePresence>
            {isOpen && filteredLanguages.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -5 }}
                className="absolute z-50 left-0 right-0 mt-1 max-h-44 overflow-y-auto rounded-xl border border-white/10 bg-dark-900/95 backdrop-blur-md p-1.5 scrollbar-thin shadow-2xl"
              >
                {filteredLanguages.map((l) => (
                  <button
                    key={l.code}
                    onClick={() => handleSelect(l.code)}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-left transition-all ${
                      lang === l.code
                        ? 'bg-primary-500/15 text-primary-400 font-semibold'
                        : 'text-dark-300 hover:bg-white/5 hover:text-white'
                    }`}
                  >
                    <span className="flex items-center gap-2">
                      <span className="text-sm leading-none">{l.flag}</span>
                      <span>{l.localName} <span className="text-[9px] text-dark-450">({l.name})</span></span>
                    </span>
                    {lang === l.code && <Check size={11} />}
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    );
  }

  return (
    <div className="relative" ref={containerRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 text-white rounded-xl px-3.5 py-2 text-xs font-semibold shadow-sm transition-all focus:outline-none"
      >
        <Globe size={13} className="text-primary-400 animate-pulse" />
        <span className="flex items-center gap-1.5">
          <span>{currentLang.flag}</span>
          <span>{currentLang.localName}</span>
        </span>
        <ChevronDown size={12} className={`text-dark-400 transition-all ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.95 }}
            transition={{ duration: 0.15, ease: 'easeOut' }}
            className="absolute z-50 right-0 mt-2 w-72 rounded-2xl border border-white/10 bg-dark-900/90 backdrop-blur-md p-2.5 shadow-2xl flex flex-col gap-2"
          >
            {/* Search Input Box */}
            <div className="relative flex items-center">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search languages..."
                className="w-full bg-white/5 border border-white/10 rounded-xl pl-8.5 pr-3.5 py-1.5 text-xs text-white placeholder-dark-450 focus:border-primary-500/50 outline-none"
                autoFocus
              />
              <Search className="absolute left-3 text-dark-400" size={12} />
            </div>

            {/* Language Scroll Area */}
            <div className="max-h-60 overflow-y-auto rounded-xl p-0.5 space-y-0.5 scrollbar-thin">
              {filteredLanguages.length > 0 ? (
                filteredLanguages.map((l) => (
                  <button
                    key={l.code}
                    onClick={() => handleSelect(l.code)}
                    className={`w-full flex items-center justify-between px-3 py-1.5 rounded-lg text-xs text-left transition-all ${
                      lang === l.code
                        ? 'bg-primary-500/15 text-primary-400 font-bold border border-primary-500/20'
                        : 'text-dark-300 hover:bg-white/5 hover:text-white'
                    }`}
                  >
                    <span className="flex items-center gap-2">
                      <span className="text-sm leading-none">{l.flag}</span>
                      <span>
                        {l.localName}{' '}
                        <span className="text-[10px] text-dark-450">({l.name})</span>
                      </span>
                    </span>
                    {lang === l.code && <Check size={12} className="text-primary-400" />}
                  </button>
                ))
              ) : (
                <div className="text-center py-4 text-xs text-dark-450">No languages matched.</div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
