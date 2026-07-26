import React, { useState } from 'react';
import {
  LayoutDashboard,
  FileText,
  Image as ImageIcon,
  Minimize2,
  ShieldCheck,
  Sparkles,
  RefreshCw,
  Cpu,
  Workflow,
  Menu,
  X,
  ChevronRight,
  Search,
  ExternalLink,
  Shield,
  Zap,
  Globe,
  Sun,
  Moon
} from 'lucide-react';
import { TOOLS_REGISTRY, BASE_URL } from '../constants/toolsData';

interface MainLayoutProps {
  currentView: string;
  setCurrentView: (view: string) => void;
  children: React.ReactNode;
}

export const MainLayout: React.FC<MainLayoutProps> = ({
  currentView,
  setCurrentView,
  children
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isDarkMode, setIsDarkMode] = useState(true);

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
    if (isDarkMode) {
      document.documentElement.classList.remove('dark');
    } else {
      document.documentElement.classList.add('dark');
    }
  };

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'pdf', label: 'PDF Toolbox', icon: FileText, badge: 'Popular' },
    { id: 'image-tools', label: 'Image Suite', icon: ImageIcon },
    { id: 'universal-compressor', label: 'Compressor', icon: Minimize2 },
    { id: 'ai-secure-vault', label: 'AI Secure Vault', icon: ShieldCheck, badge: 'Security' },
    { id: 'seo-media-optimizer', label: 'SEO Optimizer', icon: Sparkles },
    { id: 'converter', label: 'Converter Center', icon: RefreshCw },
    { id: 'ai-document-toolkit', label: 'AI OCR Scan', icon: Cpu, badge: 'AI' },
    { id: 'batch-automation', label: 'Batch Studio', icon: Workflow }
  ];

  const filteredNavItems = navItems.filter((item) =>
    item.label.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const currentTool = TOOLS_REGISTRY[currentView] || TOOLS_REGISTRY['dashboard'];

  return (
    <div className={`min-h-screen flex flex-col font-sans transition-colors duration-300 ${isDarkMode ? 'dark bg-slate-950 text-slate-100' : 'bg-slate-50 text-slate-800'}`}>
      {/* Skip Navigation Link for Accessibility */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-violet-600 focus:text-white focus:rounded-lg focus:shadow-xl"
      >
        Skip to main content
      </a>

      {/* Top Navigation Header */}
      <header className="sticky top-0 z-40 w-full backdrop-blur-xl bg-slate-900/80 border-b border-slate-800/80 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
          
          {/* Logo & Mobile Menu Toggle */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 text-slate-400 hover:text-slate-100 rounded-lg hover:bg-slate-800/60 focus:outline-none focus:ring-2 focus:ring-violet-500"
              aria-label="Toggle navigation menu"
              aria-expanded={mobileMenuOpen}
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>

            <button
              onClick={() => setCurrentView('dashboard')}
              className="flex items-center gap-2.5 group focus:outline-none"
            >
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-violet-600 to-cyan-500 flex items-center justify-center shadow-lg shadow-violet-500/20 group-hover:scale-105 transition-transform">
                <Zap className="w-5 h-5 text-white" />
              </div>
              <div className="text-left">
                <span className="text-xl font-bold tracking-tight bg-gradient-to-r from-violet-400 via-cyan-400 to-emerald-400 bg-clip-text text-transparent">
                  ConvertVerse
                </span>
                <span className="hidden sm:block text-[10px] text-slate-400 tracking-wider font-semibold uppercase">
                  100% Client-Side Workstation
                </span>
              </div>
            </button>
          </div>

          {/* Quick Tool Search Bar */}
          <div className="hidden md:flex items-center flex-1 max-w-md relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search utilities (e.g. PDF merge, compress, OCR)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-1.5 bg-slate-800/60 border border-slate-700/60 rounded-xl text-sm text-slate-200 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-violet-500/50 focus:border-violet-500 transition-all"
              aria-label="Search tools"
            />
          </div>

          {/* Header Controls */}
          <div className="flex items-center gap-3">
            <span className="hidden lg:flex items-center gap-1.5 px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 rounded-full text-xs text-emerald-400 font-medium">
              <Shield className="w-3.5 h-3.5" />
              100% Local Privacy
            </span>

            {/* Dark/Light Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-xl bg-slate-800/60 border border-slate-700/60 text-slate-300 hover:text-white hover:bg-slate-800 transition-all focus:outline-none focus:ring-2 focus:ring-violet-500"
              aria-label="Toggle dark mode"
            >
              {isDarkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-700" />}
            </button>
          </div>
        </div>
      </header>

      {/* Main Layout Body */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex-1 flex gap-8 w-full">
        
        {/* Desktop Sidebar Navigation */}
        <aside className="hidden lg:block w-64 shrink-0">
          <nav className="sticky top-24 space-y-1.5" aria-label="Sidebar Navigation">
            <div className="px-3 py-2 text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Utility Suite
            </div>
            {filteredNavItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentView === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setCurrentView(item.id)}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all ${
                    isActive
                      ? 'bg-gradient-to-r from-violet-600 to-indigo-600 text-white shadow-lg shadow-violet-600/25 border border-violet-500/30'
                      : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/50'
                  }`}
                  aria-current={isActive ? 'page' : undefined}
                >
                  <div className="flex items-center gap-3">
                    <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                    <span>{item.label}</span>
                  </div>
                  {item.badge && (
                    <span
                      className={`text-[10px] px-2 py-0.5 rounded-full font-semibold ${
                        isActive
                          ? 'bg-white/20 text-white'
                          : 'bg-violet-500/10 text-violet-400 border border-violet-500/20'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </aside>

        {/* Mobile Drawer Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex flex-col">
            <div className="p-4 flex items-center justify-between border-b border-slate-800">
              <span className="font-bold text-lg text-slate-100">Navigation Menu</span>
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="p-2 text-slate-400 hover:text-white"
                aria-label="Close menu"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            <nav className="p-4 space-y-2 overflow-y-auto flex-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = currentView === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      setCurrentView(item.id);
                      setMobileMenuOpen(false);
                    }}
                    className={`w-full flex items-center justify-between p-3 rounded-xl text-base font-medium transition-all ${
                      isActive
                        ? 'bg-violet-600 text-white'
                        : 'text-slate-300 hover:bg-slate-800'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Icon className="w-5 h-5" />
                      <span>{item.label}</span>
                    </div>
                    {item.badge && (
                      <span className="text-xs px-2.5 py-0.5 bg-white/20 rounded-full font-semibold">
                        {item.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </nav>
          </div>
        )}

        {/* Main Workspace Area */}
        <main id="main-content" className="flex-1 min-w-0">
          
          {/* Accessible Breadcrumb Navigation */}
          <nav className="flex items-center text-xs text-slate-400 mb-6" aria-label="Breadcrumb">
            <ol className="flex items-center gap-1.5 flex-wrap">
              <li>
                <button
                  onClick={() => setCurrentView('dashboard')}
                  className="hover:text-slate-200 transition-colors"
                >
                  Home
                </button>
              </li>
              {currentTool.id !== 'dashboard' && (
                <>
                  <li>
                    <ChevronRight className="w-3.5 h-3.5 text-slate-600" />
                  </li>
                  <li className="font-medium text-slate-200" aria-current="page">
                    {currentTool.name}
                  </li>
                </>
              )}
            </ol>
          </nav>

          {/* Render Active View Component */}
          {children}
        </main>
      </div>

      {/* Accessible Global Footer */}
      <footer className="w-full border-t border-slate-800/80 bg-slate-950/60 mt-16 py-12 text-sm text-slate-400">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <span className="text-lg font-bold text-slate-100 flex items-center gap-2 mb-3">
              <Zap className="w-5 h-5 text-violet-400" />
              ConvertVerse
            </span>
            <p className="text-xs text-slate-400 leading-relaxed mb-4">
              ConvertVerse is a private, client-side workstation that handles PDF editing, image compression, format conversions, and OCR text recognition without uploading your files anywhere.
            </p>
          </div>

          <div>
            <h3 className="text-xs font-semibold text-slate-200 uppercase tracking-wider mb-3">
              PDF Utilities
            </h3>
            <ul className="space-y-2 text-xs">
              <li><button onClick={() => setCurrentView('pdf')} className="hover:text-violet-400">Merge PDF Files</button></li>
              <li><button onClick={() => setCurrentView('pdf')} className="hover:text-violet-400">Split PDF Pages</button></li>
              <li><button onClick={() => setCurrentView('pdf')} className="hover:text-violet-400">Add Page Numbers</button></li>
              <li><button onClick={() => setCurrentView('pdf')} className="hover:text-violet-400">Rotate PDF Layout</button></li>
            </ul>
          </div>

          <div>
            <h3 className="text-xs font-semibold text-slate-200 uppercase tracking-wider mb-3">
              Image & Media Tools
            </h3>
            <ul className="space-y-2 text-xs">
              <li><button onClick={() => setCurrentView('image-tools')} className="hover:text-violet-400">Batch Image Compressor</button></li>
              <li><button onClick={() => setCurrentView('image-tools')} className="hover:text-violet-400">Metric Print Resizer (DPI)</button></li>
              <li><button onClick={() => setCurrentView('image-tools')} className="hover:text-violet-400">Apple HEIC to JPG</button></li>
              <li><button onClick={() => setCurrentView('image-tools')} className="hover:text-violet-400">EXIF Metadata Scrubber</button></li>
            </ul>
          </div>

          <div>
            <h3 className="text-xs font-semibold text-slate-200 uppercase tracking-wider mb-3">
              Security & Privacy
            </h3>
            <ul className="space-y-2 text-xs">
              <li><button onClick={() => setCurrentView('ai-secure-vault')} className="hover:text-violet-400">AES-256 Crypto Vault</button></li>
              <li><button onClick={() => setCurrentView('ai-secure-vault')} className="hover:text-violet-400">Face Blur Censor</button></li>
              <li><button onClick={() => setCurrentView('seo-media-optimizer')} className="hover:text-violet-400">Core Web Vitals Audit</button></li>
            </ul>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 pt-6 border-t border-slate-800/50 flex flex-col sm:flex-row justify-between items-center text-xs text-slate-500">
          <p>© 2026 ConvertVerse. All rights reserved. 100% Serverless Local Browser Utility.</p>
          <div className="flex items-center gap-4 mt-4 sm:mt-0">
            <a href="https://github.com/umaradnaan123/ConvertVerse" target="_blank" rel="noopener noreferrer" className="hover:text-slate-300 flex items-center gap-1">
              GitHub <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
};
