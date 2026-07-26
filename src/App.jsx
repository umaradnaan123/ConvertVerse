import { useState, useEffect } from 'react';
import { LanguageProvider } from './hooks/useLanguage';
import { useLocalStorage } from './hooks/useLocalStorage';
import { ConnectivityProvider } from './hooks/ConnectivityProvider';
import ParticleCanvas from './components/ParticleCanvas';
import Layout from './components/Layout';

// View Components
import Dashboard from './views/Dashboard';
import PdfToolbox from './views/PdfToolbox';
import ConverterCenter from './views/ConverterCenter';
import PdfSecurity from './views/PdfSecurity';
import PdfEditor from './views/PdfEditor';
import ImageTools from './views/ImageTools';
import UniversalCompressor from './views/UniversalCompressor';
import AISmartOptimizer from './views/AISmartOptimizer';
import CloudlessStudio from './views/CloudlessStudio';
import AIDocToolkit from './views/AIDocToolkit';
import FileRepairRecoveryCenter from './views/FileRepairRecoveryCenter';
import RealTimeCollaboration from './views/RealTimeCollaboration';
import AIContentCreatorStudio from './views/AIContentCreatorStudio';
import AISecureVault from './views/AISecureVault';
import SeoMediaOptimizer from './views/SeoMediaOptimizer';
import BatchAutomationStudio from './views/BatchAutomationStudio';

import { saveHistoryFile } from './utils/historyDb';

const parseHash = () => {
  const hash = typeof window !== 'undefined' ? window.location.hash.slice(1) : '';
  if (!hash) return { view: 'dashboard', subTab: null };
  const parts = hash.split('/');
  return {
    view: parts[0],
    subTab: parts[1] || null
  };
};

function AppContent() {
  const [currentView, setCurrentView] = useState(() => parseHash().view);
  const [currentSubTab, setCurrentSubTab] = useState(() => parseHash().subTab);
  const [history, setHistory] = useLocalStorage('convertverse_history', []);

  // Sync URL hash when view or sub-tab changes
  useEffect(() => {
    const currentHash = window.location.hash.slice(1);
    const targetHash = currentSubTab ? `${currentView}/${currentSubTab}` : currentView;
    if (currentHash !== targetHash) {
      window.location.hash = targetHash;
    }
  }, [currentView, currentSubTab]);

  // Listen for window hash changes (history back/forward)
  useEffect(() => {
    const handleHashChange = () => {
      const { view, subTab } = parseHash();
      setCurrentView(view);
      setCurrentSubTab(subTab);
    };
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  // Async history logger trigger that saves the binary blob to IndexedDB
  const handleAddHistory = async (item, fileBlob) => {
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
    
    setHistory((prev) => [newItem, ...prev].slice(0, 50)); // limit cached history list to 50 items
  };

  return (
    <Layout currentView={currentView} setCurrentView={setCurrentView}>
      {/* 1. Dashboard View */}
      {currentView === 'dashboard' && (
        <Dashboard 
          setCurrentView={setCurrentView} 
          setCurrentSubTab={setCurrentSubTab}
          history={history} 
          setHistory={setHistory} 
        />
      )}

      {/* 2. Universal File Compressor View */}
      {currentView === 'universal-compressor' && (
        <UniversalCompressor 
          onAddHistory={handleAddHistory} 
        />
      )}

      {/* 3. AI Smart File Optimizer View */}
      {currentView === 'ai-smart-optimizer' && (
        <AISmartOptimizer />
      )}

      {/* 4. Universal Cloudless File Studio View */}
      {currentView === 'cloudless-file-studio' && (
        <CloudlessStudio />
      )}

      {/* 5. AI Document & Media Toolkit View */}
      {currentView === 'ai-document-toolkit' && (
        <AIDocToolkit />
      )}

      {/* 6. Smart AI File Repair & Recovery Center View */}
      {currentView === 'file-repair-recovery' && (
        <FileRepairRecoveryCenter />
      )}

      {/* 7. Real-Time Collaboration Workspace View */}
      {currentView === 'collaboration-workspace' && (
        <RealTimeCollaboration />
      )}

      {/* 8. Advanced AI Content Creator Studio View */}
      {currentView === 'ai-content-creator' && (
        <AIContentCreatorStudio />
      )}

      {/* 9. AI Secure Vault & Privacy Shield View */}
      {currentView === 'ai-secure-vault' && (
        <AISecureVault />
      )}

      {/* 10. Smart AI Website & SEO Media Optimizer View */}
      {currentView === 'seo-media-optimizer' && (
        <SeoMediaOptimizer />
      )}

      {/* 11. Universal Batch Automation Studio View */}
      {currentView === 'batch-automation' && (
        <BatchAutomationStudio />
      )}

      {/* 2. Unified Image Tools View */}
      {(currentView === 'image-tools' || currentView === 'resizer' || currentView === 'compressor') && (
        <ImageTools 
          onAddHistory={handleAddHistory} 
          activeSubTab={currentView === 'resizer' ? 'resize' : currentView === 'compressor' ? 'compress' : currentSubTab}
          setActiveSubTab={setCurrentSubTab}
        />
      )}

      {/* 4. PDF Toolbox View */}
      {currentView === 'pdf' && (
        <PdfToolbox 
          onAddHistory={handleAddHistory} 
          activeSubTab={currentSubTab}
          setActiveSubTab={setCurrentSubTab}
        />
      )}

      {/* 5. Converter Center View */}
      {currentView === 'converter' && (
        <ConverterCenter 
          onAddHistory={handleAddHistory} 
          activeSubTab={currentSubTab}
          setActiveSubTab={setCurrentSubTab}
        />
      )}

      {/* 6. PDF Editor View */}
      {currentView === 'pdf-editor' && (
        <PdfEditor 
          onAddHistory={handleAddHistory} 
          activeSubTab={currentSubTab}
          setActiveSubTab={setCurrentSubTab}
        />
      )}

      {/* 7. PDF Security View */}
      {currentView === 'pdf-security' && (
        <PdfSecurity 
          onAddHistory={handleAddHistory} 
          activeSubTab={currentSubTab}
          setActiveSubTab={setCurrentSubTab}
        />
      )}
    </Layout>
  );
}

export default function App() {
  return (
    <ConnectivityProvider>
      <LanguageProvider>
        {/* Dynamic Animated Particle Canvas Background */}
        <ParticleCanvas />
        
        {/* App Workspace wrapper */}
        <AppContent />
      </LanguageProvider>
    </ConnectivityProvider>
  );
}
