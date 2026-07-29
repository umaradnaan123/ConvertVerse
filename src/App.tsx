import React, { useState } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { LanguageProvider } from './hooks/useLanguage';
import { useLocalStorage } from './hooks/useLocalStorage';
import { ConnectivityProvider } from './hooks/ConnectivityProvider';
import { ToastProvider } from './components/common/Toast';
import { ErrorBoundary } from './components/common/ErrorBoundary';
import ParticleCanvas from './components/ParticleCanvas';
import { MainLayout } from './layouts/MainLayout';
import { HelmetSEOManager } from './seo/HelmetSEOManager';
import { AppRoutes } from './routes/AppRoutes';
import { saveHistoryFile } from './utils/historyDb';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,
      refetchOnWindowFocus: false
    }
  }
});

function AppContent() {
  const [history, setHistory] = useLocalStorage<any[]>('convertverse_history', []);

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

  return (
    <>
      <HelmetSEOManager />
      <MainLayout>
        <ErrorBoundary>
          <AppRoutes history={history} setHistory={setHistory} onAddHistory={handleAddHistory} />
        </ErrorBoundary>
      </MainLayout>
    </>
  );
}

export default function App() {
  return (
    <HelmetProvider>
      <QueryClientProvider client={queryClient}>
        <ConnectivityProvider>
          <LanguageProvider>
            <ToastProvider>
              <BrowserRouter>
                <ParticleCanvas />
                <AppContent />
              </BrowserRouter>
            </ToastProvider>
          </LanguageProvider>
        </ConnectivityProvider>
      </QueryClientProvider>
    </HelmetProvider>
  );
}
