import React, { useState, useEffect, lazy, Suspense } from 'react';
import { LanguageProvider } from './hooks/useLanguage';
import { useLocalStorage } from './hooks/useLocalStorage';
import { ConnectivityProvider } from './hooks/ConnectivityProvider';
import { ToastProvider } from './components/common/Toast';
import { ErrorBoundary } from './components/common/ErrorBoundary';
import ParticleCanvas from './components/ParticleCanvas';
import { MainLayout } from './layouts/MainLayout';
import { SEOHead } from './seo/SEOHead';
import { ToolSEOContent } from './components/common/ToolSEOContent';
import { TOOLS_REGISTRY, resolveToolByPath } from './constants/toolsData';
import { saveHistoryFile } from './utils/historyDb';
import { Loader2 } from 'lucide-react';

// Code-split Lazy Loaded Tool Views
const Dashboard = lazy(() => import('./views/Dashboard'));
const PdfToolbox = lazy(() => import('./views/PdfToolbox'));
const ImageTools = lazy(() => import('./views/ImageTools'));
const UniversalCompressor = lazy(() => import('./views/UniversalCompressor'));
const AISmartOptimizer = lazy(() => import('./views/AISmartOptimizer'));
const CloudlessStudio = lazy(() => import('./views/CloudlessStudio'));
const AIDocToolkit = lazy(() => import('./views/AIDocToolkit'));
const FileRepairRecoveryCenter = lazy(() => import('./views/FileRepairRecoveryCenter'));
const RealTimeCollaboration = lazy(() => import('./views/RealTimeCollaboration'));
const AIContentCreatorStudio = lazy(() => import('./views/AIContentCreatorStudio'));
const AISecureVault = lazy(() => import('./views/AISecureVault'));
const SeoMediaOptimizer = lazy(() => import('./views/SeoMediaOptimizer'));
const BatchAutomationStudio = lazy(() => import('./views/BatchAutomationStudio'));
const ConverterCenter = lazy(() => import('./views/ConverterCenter'));
const PdfSecurity = lazy(() => import('./views/PdfSecurity'));
const PdfEditor = lazy(() => import('./views/PdfEditor'));

function LoadingFallback() {
  return (
    <div className="min-h-[500px] flex flex-col items-center justify-center p-8 text-center" aria-live="polite" aria-busy="true">
      <Loader2 className="w-10 h-10 text-violet-500 animate-spin mb-4" />
      <span className="text-slate-300 font-medium text-sm">Loading workstation module...</span>
    </div>
  );
}

function AppContent() {
  // Initial path resolution from window.location.pathname
  const getInitialTool = () => {
    if (typeof window === 'undefined') return 'dashboard';
    
    // Check if legacy hash was used, convert to clean path
    if (window.location.hash) {
      const legacyHash = window.location.hash.slice(1).split('/')[0];
      const legacyMap: Record<string, string> = {
        'dashboard': '/',
        'pdf': '/pdf-tools',
        'merge-pdf': '/merge-pdf',
        'split-pdf': '/split-pdf',
        'image-tools': '/image-tools',
        'compress-image': '/compress-image',
        'resize-image': '/resize-image',
        'resizer': '/resize-image',
        'compressor': '/compress-image',
        'universal-compressor': '/universal-compressor',
        'ai-secure-vault': '/ai-secure-vault',
        'seo-media-optimizer': '/seo-media-optimizer',
        'converter': '/converter',
        'ai-document-toolkit': '/ai-document-toolkit',
        'batch-automation': '/batch-automation',
        'about': '/about',
        'privacy-policy': '/privacy-policy',
        'terms': '/terms',
        'faq': '/faq'
      };
      const cleanPath = legacyMap[legacyHash] || '/';
      window.history.replaceState({}, '', cleanPath);
      return resolveToolByPath(cleanPath).id;
    }

    return resolveToolByPath(window.location.pathname).id;
  };

  const [currentView, setCurrentView] = useState<string>(getInitialTool);
  const [currentSubTab, setCurrentSubTab] = useState<string | null>(null);
  const [history, setHistory] = useLocalStorage<any[]>('convertverse_history', []);

  // Handle route navigation with History API
  const handleNavigateView = (viewId: string) => {
    const tool = TOOLS_REGISTRY[viewId] || TOOLS_REGISTRY['dashboard'];
    setCurrentView(tool.id);
    if (typeof window !== 'undefined' && window.location.pathname !== tool.path) {
      window.history.pushState({ viewId: tool.id }, '', tool.path);
    }
  };

  // Listen for browser Back/Forward popstate events
  useEffect(() => {
    const handlePopState = () => {
      const tool = resolveToolByPath(window.location.pathname);
      setCurrentView(tool.id);
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const handleAddHistory = async (item: any, fileBlob?: Blob) => {
    if (!item) return;

    const itemId = `${Date.now()}-${item.fileName}`;
    const newItem = {
      id: itemId,
      timestamp: Date.now(),
      fileName: item.fileName,
      fromFormat: item.fromFormat,
      toFormat: item.toFormat,
      size: item.size
    };

    if (fileBlob instanceof Blob) {
      await saveHistoryFile(itemId, fileBlob);
    }

    setHistory((prev: any[]) => [newItem, ...prev].slice(0, 50));
  };

  const toolMeta = TOOLS_REGISTRY[currentView] || TOOLS_REGISTRY['dashboard'];

  return (
    <>
      <SEOHead currentView={currentView} currentSubTab={currentSubTab} />
      <MainLayout currentView={currentView} setCurrentView={handleNavigateView}>
        <ErrorBoundary>
          <Suspense fallback={<LoadingFallback />}>
            {/* View Switching */}
            {currentView === 'dashboard' && (
              <Dashboard
                setCurrentView={handleNavigateView}
                setCurrentSubTab={setCurrentSubTab}
                history={history}
                setHistory={setHistory}
              />
            )}

            {(currentView === 'pdf' || currentView === 'merge-pdf' || currentView === 'split-pdf') && (
              <PdfToolbox
                onAddHistory={handleAddHistory}
                activeSubTab={currentView === 'merge-pdf' ? 'merge' : currentView === 'split-pdf' ? 'split' : currentSubTab}
                setActiveSubTab={setCurrentSubTab}
              />
            )}

            {(currentView === 'image-tools' || currentView === 'resize-image' || currentView === 'compress-image' || currentView === 'resizer' || currentView === 'compressor') && (
              <ImageTools
                onAddHistory={handleAddHistory}
                activeSubTab={currentView === 'resize-image' || currentView === 'resizer' ? 'resize' : currentView === 'compress-image' || currentView === 'compressor' ? 'compress' : currentSubTab}
                setActiveSubTab={setCurrentSubTab}
              />
            )}

            {currentView === 'universal-compressor' && (
              <UniversalCompressor onAddHistory={handleAddHistory} />
            )}

            {currentView === 'ai-secure-vault' && (
              <AISecureVault />
            )}

            {currentView === 'seo-media-optimizer' && (
              <SeoMediaOptimizer />
            )}

            {currentView === 'converter' && (
              <ConverterCenter
                onAddHistory={handleAddHistory}
                activeSubTab={currentSubTab}
                setActiveSubTab={setCurrentSubTab}
              />
            )}

            {currentView === 'ai-document-toolkit' && (
              <AIDocToolkit />
            )}

            {currentView === 'batch-automation' && (
              <BatchAutomationStudio />
            )}

            {currentView === 'ai-smart-optimizer' && (
              <AISmartOptimizer />
            )}

            {currentView === 'cloudless-file-studio' && (
              <CloudlessStudio />
            )}

            {currentView === 'file-repair-recovery' && (
              <FileRepairRecoveryCenter />
            )}

            {currentView === 'collaboration-workspace' && (
              <RealTimeCollaboration />
            )}

            {currentView === 'ai-content-creator' && (
              <AIContentCreatorStudio />
            )}

            {currentView === 'pdf-editor' && (
              <PdfEditor
                onAddHistory={handleAddHistory}
                activeSubTab={currentSubTab}
                setActiveSubTab={setCurrentSubTab}
              />
            )}

            {currentView === 'pdf-security' && (
              <PdfSecurity
                onAddHistory={handleAddHistory}
                activeSubTab={currentSubTab}
                setActiveSubTab={setCurrentSubTab}
              />
            )}

            {/* Keyword-Rich SEO Content Section per Tool */}
            <ToolSEOContent tool={toolMeta} />
          </Suspense>
        </ErrorBoundary>
      </MainLayout>
    </>
  );
}

export default function App() {
  return (
    <ConnectivityProvider>
      <LanguageProvider>
        <ToastProvider>
          <ParticleCanvas />
          <AppContent />
        </ToastProvider>
      </LanguageProvider>
    </ConnectivityProvider>
  );
}
