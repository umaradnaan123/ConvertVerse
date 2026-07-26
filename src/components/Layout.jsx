import { useState, useRef, useEffect } from 'react';
import { Menu, X, FileCode, Layers, RefreshCw, PenTool, ShieldCheck, Images, Sparkles, Wrench, Users2, ChevronDown, Wifi, WifiOff } from 'lucide-react';
import { useLanguage } from '../hooks/useLanguage';
import { useConnectivity } from '../hooks/useConnectivity';
import { AnimatePresence, motion } from 'framer-motion';
import ThemeToggle from './ThemeToggle';
import LanguageSelector from './LanguageSelector';

export default function Layout({ children, currentView, setCurrentView }) {
  const { t } = useLanguage();
  const { isOnline, toastState, hideToast } = useConnectivity();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [nextGenDropdownOpen, setNextGenDropdownOpen] = useState(false);
  const nextGenRef = useRef(null);

  // Close dropdown on click outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (nextGenRef.current && !nextGenRef.current.contains(event.target)) {
        setNextGenDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const navItems = [
    { id: 'dashboard', label: t('navHome'), icon: Layers },
    { id: 'image-tools', label: "Image Tools", icon: Images },
    { id: 'pdf', label: t('navPdf'), icon: FileCode },
    { id: 'converter', label: t('navConverter'), icon: RefreshCw },
    { id: 'pdf-editor', label: "Edit & Sign", icon: PenTool },
    { id: 'pdf-security', label: "Security", icon: ShieldCheck }
  ];

  const handleNavClick = (viewId) => {
    setCurrentView(viewId);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="relative min-h-screen flex flex-col z-10">
      {/* Header Floating Glass Navbar */}
      <header className="sticky top-4 left-0 right-0 z-50 mx-auto w-[94%] max-w-7xl">
        <div className="glass-panel px-6 py-3.5 rounded-2xl flex items-center justify-between shadow-glass">
          {/* Logo */}
          <button
            onClick={() => handleNavClick('dashboard')}
            className="flex items-center gap-2.5 group text-left"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-primary-500 to-secondary-500 flex items-center justify-center shadow-glow-primary group-hover:scale-105 transition-all">
              <RefreshCw size={20} className="text-white animate-spin-slow" />
            </div>
            <div>
              <span className="text-lg font-bold tracking-tight bg-gradient-to-r from-white via-primary-300 to-secondary-400 dark:from-white light:from-dark-900 bg-clip-text text-transparent group-hover:opacity-90 transition-all font-sans">
                {t('appName')}
              </span>
              <span className="block text-[10px] text-primary-400 dark:text-primary-400 light:text-primary-600 font-medium">
                {t('appSubtitle')}
              </span>
            </div>
          </button>

          {/* Desktop Nav Items */}
          <nav className="hidden lg:flex items-center gap-1.5">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentView === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 ${
                    isActive
                      ? 'bg-primary-500/15 border border-primary-500/25 text-primary-400 dark:text-primary-400 light:text-primary-600 shadow-glow-primary'
                      : 'text-dark-400 hover:text-dark-100 hover:bg-white/5 border border-transparent'
                  }`}
                >
                  <Icon size={16} />
                  <span>{item.label}</span>
                </button>
              );
            })}

            {/* Next-Gen SaaS Dropdown */}
            <div 
              ref={nextGenRef}
              className="relative"
            >
              <button
                onClick={() => setNextGenDropdownOpen(!nextGenDropdownOpen)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 ${
                  ['file-repair-recovery', 'collaboration-workspace', 'ai-content-creator', 'ai-secure-vault', 'seo-media-optimizer', 'batch-automation'].includes(currentView)
                    ? 'bg-secondary-500/15 border border-secondary-500/25 text-secondary-400 dark:text-secondary-400 light:text-secondary-600 shadow-glow-secondary'
                    : 'text-dark-400 hover:text-dark-100 hover:bg-white/5 border border-transparent'
                }`}
              >
                <Sparkles size={16} className="text-secondary-400" />
                <span>Next-Gen SaaS</span>
                <ChevronDown size={14} className={`transition-transform duration-300 ${nextGenDropdownOpen ? 'rotate-180' : ''}`} />
              </button>

              <AnimatePresence>
                {nextGenDropdownOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 8, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 8, scale: 0.95 }}
                    transition={{ duration: 0.15, ease: 'easeOut' }}
                    className="absolute top-full right-0 mt-2 w-64 glass-panel p-3 rounded-2xl shadow-glass flex flex-col gap-1 z-50 border border-white/10 before:absolute before:-top-3 before:left-0 before:right-0 before:h-3 before:content-['']"
                  >
                    <button
                      onClick={() => {
                        handleNavClick('file-repair-recovery');
                        setNextGenDropdownOpen(false);
                      }}
                      className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-left text-sm font-medium transition-all ${
                        currentView === 'file-repair-recovery'
                          ? 'bg-primary-500/15 text-primary-400 border border-primary-500/20'
                          : 'text-dark-300 hover:text-white hover:bg-white/5 border border-transparent'
                      }`}
                    >
                      <div className="p-1.5 rounded-lg bg-primary-500/10 text-primary-400">
                        <Wrench size={16} />
                      </div>
                      <div>
                        <span className="block text-xs font-bold text-white">AI Repair Center</span>
                        <span className="block text-[10px] text-dark-450 dark:text-dark-400 light:text-dark-600 font-normal">Recover corrupted/broken files</span>
                      </div>
                    </button>

                    <button
                      onClick={() => {
                        handleNavClick('collaboration-workspace');
                        setNextGenDropdownOpen(false);
                      }}
                      className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-left text-sm font-medium transition-all ${
                        currentView === 'collaboration-workspace'
                          ? 'bg-primary-500/15 text-primary-400 border border-primary-500/20'
                          : 'text-dark-300 hover:text-white hover:bg-white/5 border border-transparent'
                      }`}
                    >
                      <div className="p-1.5 rounded-lg bg-secondary-500/10 text-secondary-400">
                        <Users2 size={16} />
                      </div>
                      <div>
                        <span className="block text-xs font-bold text-white">Collab Workspace</span>
                        <span className="block text-[10px] text-dark-450 dark:text-dark-400 light:text-dark-600 font-normal">Real-time team collaboration</span>
                      </div>
                    </button>

                    <button
                      onClick={() => {
                        handleNavClick('ai-content-creator');
                        setNextGenDropdownOpen(false);
                      }}
                      className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-left text-sm font-medium transition-all ${
                        currentView === 'ai-content-creator'
                          ? 'bg-primary-500/15 text-primary-400 border border-primary-500/20'
                          : 'text-dark-300 hover:text-white hover:bg-white/5 border border-transparent'
                      }`}
                    >
                      <div className="p-1.5 rounded-lg bg-pink-500/10 text-pink-400">
                        <Sparkles size={16} />
                      </div>
                      <div>
                        <span className="block text-xs font-bold text-white">Content Studio</span>
                        <span className="block text-[10px] text-dark-450 dark:text-dark-400 light:text-dark-600 font-normal">Design visuals & QR assets</span>
                      </div>
                    </button>

                    <button
                      onClick={() => {
                        handleNavClick('ai-secure-vault');
                        setNextGenDropdownOpen(false);
                      }}
                      className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-left text-sm font-medium transition-all ${
                        currentView === 'ai-secure-vault'
                          ? 'bg-primary-500/15 text-primary-400 border border-primary-500/20'
                          : 'text-dark-300 hover:text-white hover:bg-white/5 border border-transparent'
                      }`}
                    >
                      <div className="p-1.5 rounded-lg bg-cyan-500/10 text-cyan-400">
                        <ShieldCheck size={16} />
                      </div>
                      <div>
                        <span className="block text-xs font-bold text-white">Secure Vault</span>
                        <span className="block text-[10px] text-dark-450 dark:text-dark-400 light:text-dark-600 font-normal">AES & EXIF metadata shield</span>
                      </div>
                    </button>

                    <button
                      onClick={() => {
                        handleNavClick('seo-media-optimizer');
                        setNextGenDropdownOpen(false);
                      }}
                      className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-left text-sm font-medium transition-all ${
                        currentView === 'seo-media-optimizer'
                          ? 'bg-primary-500/15 text-primary-400 border border-primary-500/20'
                          : 'text-dark-300 hover:text-white hover:bg-white/5 border border-transparent'
                      }`}
                    >
                      <div className="p-1.5 rounded-lg bg-primary-500/10 text-primary-400">
                        <Images size={16} />
                      </div>
                      <div>
                        <span className="block text-xs font-bold text-white">SEO Optimizer</span>
                        <span className="block text-[10px] text-dark-450 dark:text-dark-400 light:text-dark-600 font-normal">Widescreen cards & favicons</span>
                      </div>
                    </button>

                    <button
                      onClick={() => {
                        handleNavClick('batch-automation');
                        setNextGenDropdownOpen(false);
                      }}
                      className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-left text-sm font-medium transition-all ${
                        currentView === 'batch-automation'
                          ? 'bg-primary-500/15 text-primary-400 border border-primary-500/20'
                          : 'text-dark-300 hover:text-white hover:bg-white/5 border border-transparent'
                      }`}
                    >
                      <div className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-400">
                        <Layers size={16} />
                      </div>
                      <div>
                        <span className="block text-xs font-bold text-white">Batch Automation</span>
                        <span className="block text-[10px] text-dark-450 dark:text-dark-400 light:text-dark-600 font-normal">Workflow pipelines & zip stacks</span>
                      </div>
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </nav>

          {/* Right Utilities */}
          <div className="hidden lg:flex items-center gap-3">
            {/* Dynamic Online/Offline Badge */}
            <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-xs font-bold transition-all duration-300 ${
              isOnline 
                ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' 
                : 'bg-amber-500/10 border-amber-500/20 text-amber-400 animate-pulse'
            }`}>
              <span className={`w-1.5 h-1.5 rounded-full ${isOnline ? 'bg-emerald-500 shadow-glow-primary' : 'bg-amber-500 shadow-glow-secondary animate-pulse'}`} />
              <span className="flex items-center gap-1">
                {isOnline ? <Wifi size={12} /> : <WifiOff size={12} />}
                {isOnline ? 'Online' : 'Offline'}
              </span>
            </div>

            {/* Language Selector */}
            <LanguageSelector />

            {/* Theme Toggle */}
            <ThemeToggle />
          </div>

          {/* Mobile Menu Actions */}
          <div className="flex lg:hidden items-center gap-2.5">
            {/* Mobile Connection Status Badge */}
            <div className={`flex items-center gap-1 px-2.5 py-1 rounded-full border text-[10px] font-bold transition-all duration-300 ${
              isOnline 
                ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' 
                : 'bg-amber-500/10 border-amber-500/20 text-amber-400 animate-pulse'
            }`}>
              <span className={`w-1 h-1 rounded-full ${isOnline ? 'bg-emerald-500' : 'bg-amber-500 animate-pulse'}`} />
              <span>{isOnline ? 'Online' : 'Offline'}</span>
            </div>

            <ThemeToggle />
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2.5 rounded-xl border border-white/10 hover:bg-white/5 text-dark-400 hover:text-dark-100 transition-all"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu Panel */}
        {mobileMenuOpen && (
          <div className="glass-panel mt-3 rounded-2xl p-5 shadow-glass lg:hidden overflow-y-auto max-h-[calc(100vh-120px)] animate-in fade-in slide-in-from-top-4 duration-300">
            <nav className="flex flex-col gap-2">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = currentView === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => handleNavClick(item.id)}
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl text-base font-medium transition-all ${
                      isActive
                        ? 'bg-primary-500/15 border border-primary-500/25 text-primary-400 shadow-glow-primary'
                        : 'text-dark-400 hover:text-dark-100 hover:bg-white/5 border border-transparent'
                    }`}
                  >
                    <Icon size={18} />
                    <span>{item.label}</span>
                  </button>
                );
              })}

              <div className="h-[1px] bg-white/10 my-2" />
              <span className="px-4 py-1 text-[10px] uppercase font-bold text-dark-500 tracking-wider">Next-Gen SaaS Modules</span>

              <button
                onClick={() => handleNavClick('file-repair-recovery')}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-base font-medium transition-all ${
                  currentView === 'file-repair-recovery'
                    ? 'bg-primary-500/15 border border-primary-500/25 text-primary-400 shadow-glow-primary'
                    : 'text-dark-400 hover:text-dark-100 hover:bg-white/5 border border-transparent'
                }`}
              >
                <Wrench size={18} className="text-primary-400" />
                <span>AI File Repair Center</span>
              </button>

              <button
                onClick={() => handleNavClick('collaboration-workspace')}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-base font-medium transition-all ${
                  currentView === 'collaboration-workspace'
                    ? 'bg-primary-500/15 border border-primary-500/25 text-primary-400 shadow-glow-primary'
                    : 'text-dark-400 hover:text-dark-100 hover:bg-white/5 border border-transparent'
                }`}
              >
                <Users2 size={18} className="text-secondary-400" />
                <span>Collab Workspace</span>
              </button>

              <button
                onClick={() => handleNavClick('ai-content-creator')}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-base font-medium transition-all ${
                  currentView === 'ai-content-creator'
                    ? 'bg-primary-500/15 border border-primary-500/25 text-primary-400 shadow-glow-primary'
                    : 'text-dark-400 hover:text-dark-100 hover:bg-white/5 border border-transparent'
                }`}
              >
                <Sparkles size={18} className="text-pink-400" />
                <span>AI Content Studio</span>
              </button>

              <button
                onClick={() => handleNavClick('ai-secure-vault')}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-base font-medium transition-all ${
                  currentView === 'ai-secure-vault'
                    ? 'bg-primary-500/15 border border-primary-500/25 text-primary-400 shadow-glow-primary'
                    : 'text-dark-400 hover:text-dark-100 hover:bg-white/5 border border-transparent'
                }`}
              >
                <ShieldCheck size={18} className="text-cyan-400" />
                <span>AI Secure Vault</span>
              </button>

              <button
                onClick={() => handleNavClick('seo-media-optimizer')}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-base font-medium transition-all ${
                  currentView === 'seo-media-optimizer'
                    ? 'bg-primary-500/15 border border-primary-500/25 text-primary-400 shadow-glow-primary'
                    : 'text-dark-400 hover:text-dark-100 hover:bg-white/5 border border-transparent'
                }`}
              >
                <Images size={18} className="text-primary-400" />
                <span>SEO Media Optimizer</span>
              </button>

              <button
                onClick={() => handleNavClick('batch-automation')}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-base font-medium transition-all ${
                  currentView === 'batch-automation'
                    ? 'bg-primary-500/15 border border-primary-500/25 text-primary-400 shadow-glow-primary'
                    : 'text-dark-400 hover:text-dark-100 hover:bg-white/5 border border-transparent'
                }`}
              >
                <Layers size={18} className="text-emerald-400" />
                <span>Batch Automation</span>
              </button>
            </nav>

            <div className="h-[1px] bg-white/10 my-4" />

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 w-full">
              <div className="bg-black/20 p-3 rounded-2xl border border-white/5 w-full">
                <LanguageSelector isMobile={true} />
              </div>
            </div>
          </div>
        )}
      </header>

      {/* Main App Content Workspace */}
      <main className="flex-grow z-10 pb-20 pt-8 w-[94%] max-w-7xl mx-auto flex flex-col">
        {children}
      </main>

      {/* Futuristic SaaS Footer */}
      <footer className="w-full glass-panel border-t border-white/5 mt-auto z-10 py-12 relative overflow-hidden">
        <div className="absolute top-0 right-1/4 glow-orb-2 scale-50 opacity-15" />
        <div className="w-[94%] max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 px-4 relative z-10">
          <div className="md:col-span-2">
            <div className="flex items-center gap-2 text-left mb-4">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-primary-500 to-secondary-500 flex items-center justify-center">
                <RefreshCw size={16} className="text-white animate-spin-slow" />
              </div>
              <span className="text-base font-bold tracking-tight bg-gradient-to-r from-white to-primary-300 bg-clip-text text-transparent font-sans">
                {t('appName')}
              </span>
            </div>
            <p className="text-sm text-dark-400 max-w-md leading-relaxed mb-4">
              {t('tagline')}. Built with high-performance WebAssembly compilers, Tesseract AI workers, and native vector processing in your browser.
            </p>
            <div className="text-xs text-primary-400/80 font-medium">
              🔒 100% Privacy-Preserved: Files never touch our server infrastructure.
            </div>
          </div>

          <div>
            <h3 className="text-sm font-bold text-dark-100 uppercase tracking-widest mb-4">
              {t('navHome')}
            </h3>
            <ul className="space-y-2.5 text-sm text-dark-400">
              <li>
                <button onClick={() => handleNavClick('dashboard')} className="hover:text-primary-400 transition-colors">
                  {t('navHome')}
                </button>
              </li>
              <li>
                <button onClick={() => handleNavClick('image-tools')} className="hover:text-primary-400 transition-colors">
                  Image Resizer
                </button>
              </li>
              <li>
                <button onClick={() => handleNavClick('image-tools')} className="hover:text-primary-400 transition-colors">
                  Image Compressor
                </button>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-bold text-dark-100 uppercase tracking-widest mb-4">
              Advanced Tools
            </h3>
            <ul className="space-y-2.5 text-sm text-dark-400">
              <li>
                <button onClick={() => handleNavClick('pdf')} className="hover:text-primary-400 transition-colors">
                  {t('navPdf')}
                </button>
              </li>
              <li>
                <button onClick={() => handleNavClick('converter')} className="hover:text-primary-400 transition-colors">
                  {t('navConverter')}
                </button>
              </li>
              <li className="text-xs text-dark-500 font-medium mt-4">
                Cloud Platform v2.0 • Online Optimized
              </li>
            </ul>
          </div>
        </div>

        <div className="w-[94%] max-w-7xl mx-auto h-[1px] bg-white/10 my-8 px-4" />

        <div className="w-[94%] max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 px-4 text-xs text-dark-500">
          <p>© {new Date().getFullYear()} ConvertVerse Inc. Licensed under MIT. All processing runs locally.</p>
          <div className="flex items-center gap-4">
            <span className="hover:text-dark-300 transition-colors cursor-pointer">Privacy Policy</span>
            <span className="hover:text-dark-300 transition-colors cursor-pointer">Terms of Service</span>
            <span className="hover:text-dark-300 transition-colors cursor-pointer">Zero Cost Manifesto</span>
          </div>
        </div>
      </footer>

      {/* Dynamic Connection Monitor Notification Toast */}
      <AnimatePresence>
        {toastState.visible && (
          <motion.div
            initial={{ opacity: 0, y: 40, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
            className="fixed bottom-6 right-6 z-50 max-w-sm w-[90%] sm:w-full"
          >
            <div className={`glass-panel p-4 rounded-2xl shadow-glass border flex gap-3 items-start relative ${
              toastState.type === 'online' 
                ? 'border-emerald-500/30 bg-emerald-950/25 text-emerald-100' 
                : 'border-amber-500/30 bg-amber-950/25 text-amber-100'
            }`}>
              <div className={`p-2 rounded-xl mt-0.5 ${
                toastState.type === 'online' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-amber-500/20 text-amber-400'
              }`}>
                {toastState.type === 'online' ? <Wifi size={16} /> : <WifiOff size={16} />}
              </div>
              
              <div className="flex-grow space-y-1 pr-4">
                <h4 className="text-sm font-bold text-white">
                  {toastState.type === 'online' ? 'Internet Restored' : 'Offline Mode Active'}
                </h4>
                <p className="text-xs text-dark-350 dark:text-dark-400 light:text-dark-600 leading-relaxed">
                  {toastState.type === 'online' 
                    ? 'Your connection is back. Reconnection sync complete.' 
                    : 'Working locally inside browser memory. Core features remain fully operational offline!'}
                </p>
              </div>

              <button 
                onClick={hideToast}
                className="absolute top-3 right-3 text-dark-400 hover:text-white p-1 rounded-lg hover:bg-white/5 transition-all"
                aria-label="Dismiss notification"
              >
                <X size={14} />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
