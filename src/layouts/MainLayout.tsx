import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useLanguage } from '../hooks/useLanguage';
import { useConnectivity } from '../hooks/ConnectivityProvider';
import { TOOLS_REGISTRY, resolveToolByPath } from '../constants/toolsData';
import {
  LayoutDashboard,
  FileText,
  Image,
  RefreshCw,
  ShieldCheck,
  Sparkles,
  Workflow,
  Search,
  Globe,
  Wifi,
  WifiOff,
  Menu,
  X,
  ChevronRight,
  Folder,
  Info,
  Mail,
  HelpCircle,
  BookOpen
} from 'lucide-react';

interface MainLayoutProps {
  children: React.ReactNode;
}

export function MainLayout({ children }: MainLayoutProps) {
  const { lang, setLang, t } = useLanguage();
  const { isOnline } = useConnectivity();
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const currentTool = resolveToolByPath(location.pathname);

  // Transparently replace legacy hash URLs (e.g. /#pdf) with clean paths
  useEffect(() => {
    if (window.location.hash) {
      const legacyHash = window.location.hash.slice(1).split('/')[0];
      const legacyMap: Record<string, string> = {
        'dashboard': '/dashboard',
        'pdf': '/pdf-tools',
        'merge-pdf': '/pdf-tools/merge-pdf',
        'split-pdf': '/pdf-tools/split-pdf',
        'image-tools': '/image-tools',
        'compress-image': '/image-tools/compress-image',
        'resize-image': '/image-tools/resize-image',
        'resizer': '/image-tools/resize-image',
        'compressor': '/image-tools/compress-image',
        'universal-compressor': '/universal-compressor',
        'secure-vault': '/secure-vault',
        'ai-secure-vault': '/secure-vault',
        'seo-tools': '/seo-tools',
        'seo-media-optimizer': '/seo-tools',
        'converter': '/converter',
        'ai-content': '/ai-content',
        'batch-tools': '/batch-tools',
        'batch-automation': '/batch-tools',
        'file-repair-recovery': '/file-repair',
        'collaboration-workspace': '/collaboration',
        'about': '/about',
        'privacy-policy': '/privacy-policy',
        'terms': '/terms',
        'help': '/help',
        'blog': '/blog'
      };
      const targetPath = legacyMap[legacyHash] || '/dashboard';
      navigate(targetPath, { replace: true });
    }
  }, [navigate]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setMobileMenuOpen(false);
    }
  };

  const navItems = [
    { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { path: '/pdf-tools', label: 'PDF Suite', icon: FileText },
    { path: '/image-tools', label: 'Image Tools', icon: Image },
    { path: '/converter', label: 'Converters', icon: RefreshCw },
    { path: '/secure-vault', label: 'AI Vault', icon: ShieldCheck },
    { path: '/seo-tools', label: 'SEO Optimizer', icon: Sparkles },
    { path: '/batch-tools', label: 'Batch Studio', icon: Workflow },
    { path: '/tools', label: 'All Tools', icon: Folder }
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans flex flex-col antialiased">
      {/* Skip to Main Content Link for Accessibility (WCAG 2.2 AA) */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 z-50 bg-emerald-500 text-slate-950 font-bold px-4 py-2 rounded-lg shadow-lg focus:outline-none focus:ring-2 focus:ring-emerald-400"
      >
        Skip to main content
      </a>

      {/* Primary Accessible Navigation Header */}
      <header className="sticky top-0 z-40 bg-slate-900/90 backdrop-blur-xl border-b border-slate-800/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
          
          {/* Brand Logo & Title */}
          <Link
            to="/"
            className="flex items-center gap-2.5 group focus:outline-none focus:ring-2 focus:ring-emerald-400 rounded-lg p-1"
            aria-label="ConvertVerse Home Workstation"
          >
            <div className="w-9 h-9 bg-emerald-500/20 border border-emerald-500/30 rounded-xl flex items-center justify-center text-emerald-400 group-hover:scale-105 transition-transform">
              <Sparkles className="w-5 h-5" />
            </div>
            <span className="font-extrabold text-xl tracking-tight text-white group-hover:text-emerald-400 transition-colors">
              Convert<span className="text-emerald-400">Verse</span>
            </span>
          </Link>

          {/* Desktop Search Bar */}
          <form onSubmit={handleSearchSubmit} className="hidden md:flex items-center flex-1 max-w-md relative">
            <Search className="absolute left-3.5 w-4 h-4 text-slate-400 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search tools (e.g. PDF merge, resize image, HEIC)..."
              className="w-full bg-slate-800/80 border border-slate-700/60 rounded-xl pl-10 pr-4 py-1.5 text-sm text-white placeholder:text-slate-400 focus:ring-2 focus:ring-emerald-500 outline-none transition-all"
              aria-label="Search utility tools"
            />
          </form>

          {/* Top Desktop Controls */}
          <div className="hidden lg:flex items-center gap-3 text-xs font-medium">
            {/* Language Selector */}
            <div className="flex items-center gap-1 bg-slate-800/60 border border-slate-700/60 rounded-lg p-1">
              <Globe className="w-3.5 h-3.5 text-slate-400 ml-1.5" />
              <button
                onClick={() => setLang('en')}
                className={`px-2 py-1 rounded-md transition-colors ${lang === 'en' ? 'bg-emerald-500 text-slate-950 font-bold' : 'text-slate-300 hover:text-white'}`}
              >
                EN
              </button>
              <button
                onClick={() => setLang('es')}
                className={`px-2 py-1 rounded-md transition-colors ${lang === 'es' ? 'bg-emerald-500 text-slate-950 font-bold' : 'text-slate-300 hover:text-white'}`}
              >
                ES
              </button>
            </div>

            {/* Offline/Online Status Indicator */}
            <div
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-semibold ${
                isOnline
                  ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                  : 'bg-amber-500/10 text-amber-400 border-amber-500/30'
              }`}
              title={isOnline ? 'Network online: Local processing active' : 'Offline mode: Client processing operating locally'}
            >
              {isOnline ? <Wifi className="w-3.5 h-3.5" /> : <WifiOff className="w-3.5 h-3.5" />}
              <span>{isOnline ? 'Online' : 'Offline Mode'}</span>
            </div>
          </div>

          {/* Mobile Menu Toggle Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 rounded-lg bg-slate-800 border border-slate-700 text-slate-300 hover:text-white focus:ring-2 focus:ring-emerald-400"
            aria-label="Toggle mobile menu"
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-t border-slate-800 bg-slate-900/95 backdrop-blur-2xl px-4 py-6 space-y-4">
            <form onSubmit={handleSearchSubmit} className="relative">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search tools..."
                className="w-full bg-slate-800 border border-slate-700 rounded-xl pl-10 pr-4 py-2 text-sm text-white placeholder:text-slate-400 outline-none"
              />
            </form>

            <nav className="grid grid-cols-2 gap-2" aria-label="Mobile Navigation">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.path;
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center gap-2 p-2.5 rounded-xl text-sm font-medium transition-colors ${
                      isActive ? 'bg-emerald-500/15 text-emerald-400 font-bold border border-emerald-500/30' : 'text-slate-300 hover:bg-slate-800'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </nav>
          </div>
        )}
      </header>

      {/* Main Workstation Layout Shell */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex-1 flex flex-col lg:flex-row gap-8 w-full">
        
        {/* Accessible Left Navigation Sidebar */}
        <aside className="hidden lg:block w-64 shrink-0 space-y-6" aria-label="Workstation Navigation Sidebar">
          <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-4 space-y-2 sticky top-24">
            <div className="text-xs font-extrabold text-slate-400 uppercase tracking-wider px-3 py-1">
              Workstations
            </div>
            <nav className="space-y-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.path || (item.path !== '/dashboard' && location.pathname.startsWith(item.path));
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all ${
                      isActive
                        ? 'bg-emerald-500/15 text-emerald-400 font-bold border border-emerald-500/30 shadow-lg shadow-emerald-950/40'
                        : 'text-slate-300 hover:bg-slate-800/60 hover:text-white'
                    }`}
                  >
                    <Icon className="w-4 h-4 shrink-0" />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </nav>
          </div>
        </aside>

        {/* Primary Page Content Wrapper */}
        <main id="main-content" className="flex-1 min-w-0" tabIndex={-1}>
          
          {/* Breadcrumb Trail for Structural SEO & Navigation */}
          <nav aria-label="Breadcrumb" className="mb-6 flex items-center gap-2 text-xs text-slate-400 overflow-x-auto py-1">
            <Link to="/" className="hover:text-emerald-400 transition-colors">Home</Link>
            <ChevronRight className="w-3.5 h-3.5 shrink-0 text-slate-600" />
            <span className="text-slate-200 font-medium truncate">{currentTool.name}</span>
          </nav>

          {/* Render Route Children */}
          {children}
        </main>
      </div>

      {/* Accessible Footer */}
      <footer className="border-t border-slate-800/80 bg-slate-900/50 mt-16 py-12 px-4 text-slate-400 text-xs">
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 mb-8">
          <div className="space-y-3">
            <h4 className="font-extrabold text-slate-200 text-sm">ConvertVerse Workstation</h4>
            <p className="text-slate-400 leading-relaxed">
              100% serverless client-side document processing, PDF management, and image compression hub.
            </p>
          </div>

          <div className="space-y-3">
            <h4 className="font-extrabold text-slate-200 text-sm">Utility Suites</h4>
            <ul className="space-y-2">
              <li><Link to="/pdf-tools" className="hover:text-emerald-400">PDF Toolbox</Link></li>
              <li><Link to="/image-tools" className="hover:text-emerald-400">Image Tools</Link></li>
              <li><Link to="/converter" className="hover:text-emerald-400">Universal Converter</Link></li>
              <li><Link to="/secure-vault" className="hover:text-emerald-400">AI Secure Vault</Link></li>
            </ul>
          </div>

          <div className="space-y-3">
            <h4 className="font-extrabold text-slate-200 text-sm">Directory & Help</h4>
            <ul className="space-y-2">
              <li><Link to="/tools" className="hover:text-emerald-400">All Tools Directory</Link></li>
              <li><Link to="/categories" className="hover:text-emerald-400">Tool Categories</Link></li>
              <li><Link to="/help" className="hover:text-emerald-400">Help & Support</Link></li>
              <li><Link to="/blog" className="hover:text-emerald-400">Technical Blog</Link></li>
            </ul>
          </div>

          <div className="space-y-3">
            <h4 className="font-extrabold text-slate-200 text-sm">Legal & Contact</h4>
            <ul className="space-y-2">
              <li><Link to="/about" className="hover:text-emerald-400">About Us</Link></li>
              <li><Link to="/contact" className="hover:text-emerald-400">Contact Support</Link></li>
              <li><Link to="/privacy-policy" className="hover:text-emerald-400">Privacy Policy</Link></li>
              <li><Link to="/terms" className="hover:text-emerald-400">Terms of Service</Link></li>
            </ul>
          </div>
        </div>

        <div className="max-w-7xl mx-auto pt-8 border-t border-slate-800/60 text-center space-y-2">
          <p>&copy; 2026 ConvertVerse. All rights reserved. 100% Client-Side Privacy Guaranteed.</p>
        </div>
      </footer>
    </div>
  );
}
