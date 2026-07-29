import React, { lazy, Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Loader2 } from 'lucide-react';

// Code-split Lazy Loaded Workstation Views
const Dashboard = lazy(() => import('../views/Dashboard'));
const PdfToolbox = lazy(() => import('../views/PdfToolbox'));
const ImageTools = lazy(() => import('../views/ImageTools'));
const UniversalCompressor = lazy(() => import('../views/UniversalCompressor'));
const ConverterCenter = lazy(() => import('../views/ConverterCenter'));
const PdfEditor = lazy(() => import('../views/PdfEditor'));
const PdfSecurity = lazy(() => import('../views/PdfSecurity'));
const FileRepairRecoveryCenter = lazy(() => import('../views/FileRepairRecoveryCenter'));
const RealTimeCollaboration = lazy(() => import('../views/RealTimeCollaboration'));
const AIContentCreatorStudio = lazy(() => import('../views/AIContentCreatorStudio'));
const AISecureVault = lazy(() => import('../views/AISecureVault'));
const SeoMediaOptimizer = lazy(() => import('../views/SeoMediaOptimizer'));
const BatchAutomationStudio = lazy(() => import('../views/BatchAutomationStudio'));

// Dedicated Information & Directory Views
const ContactView = lazy(() => import('../views/ContactView'));
const AboutView = lazy(() => import('../views/AboutView'));
const PrivacyPolicyView = lazy(() => import('../views/PrivacyPolicyView'));
const TermsView = lazy(() => import('../views/TermsView'));
const HelpView = lazy(() => import('../views/HelpView'));
const BlogView = lazy(() => import('../views/BlogView'));
const ToolsDirectoryView = lazy(() => import('../views/ToolsDirectoryView'));
const CategoriesView = lazy(() => import('../views/CategoriesView'));
const SearchView = lazy(() => import('../views/SearchView'));
const NotFoundView = lazy(() => import('../views/NotFoundView'));

function LoadingFallback() {
  return (
    <div className="min-h-[500px] flex flex-col items-center justify-center p-8 text-center" aria-live="polite" aria-busy="true">
      <Loader2 className="w-10 h-10 text-emerald-400 animate-spin mb-4" />
      <span className="text-slate-300 font-medium text-sm">Loading workstation module...</span>
    </div>
  );
}

interface AppRoutesProps {
  history: any[];
  setHistory: React.Dispatch<React.SetStateAction<any[]>>;
  onAddHistory: (item: any, fileBlob?: Blob) => Promise<void>;
}

export function AppRoutes({ history, setHistory, onAddHistory }: AppRoutesProps) {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <Routes>
        {/* Core Dashboard Workstation */}
        <Route path="/" element={<Dashboard setCurrentView={() => {}} setCurrentSubTab={() => {}} history={history} setHistory={setHistory} />} />
        <Route path="/dashboard" element={<Dashboard setCurrentView={() => {}} setCurrentSubTab={() => {}} history={history} setHistory={setHistory} />} />

        {/* PDF Suite Dedicated Routes */}
        <Route path="/pdf-tools" element={<PdfToolbox onAddHistory={onAddHistory} activeSubTab={null} setActiveSubTab={() => {}} />} />
        <Route path="/pdf-tools/merge-pdf" element={<PdfToolbox onAddHistory={onAddHistory} activeSubTab="merge" setActiveSubTab={() => {}} />} />
        <Route path="/pdf-tools/split-pdf" element={<PdfToolbox onAddHistory={onAddHistory} activeSubTab="split" setActiveSubTab={() => {}} />} />
        <Route path="/pdf-tools/compress-pdf" element={<PdfToolbox onAddHistory={onAddHistory} activeSubTab="compress" setActiveSubTab={() => {}} />} />
        <Route path="/pdf-editor" element={<PdfEditor onAddHistory={onAddHistory} activeSubTab={null} setActiveSubTab={() => {}} />} />
        <Route path="/pdf-security" element={<PdfSecurity onAddHistory={onAddHistory} activeSubTab={null} setActiveSubTab={() => {}} />} />

        {/* Image Suite Dedicated Routes */}
        <Route path="/image-tools" element={<ImageTools onAddHistory={onAddHistory} activeSubTab={null} setActiveSubTab={() => {}} />} />
        <Route path="/image-tools/resize-image" element={<ImageTools onAddHistory={onAddHistory} activeSubTab="resize" setActiveSubTab={() => {}} />} />
        <Route path="/image-tools/compress-image" element={<ImageTools onAddHistory={onAddHistory} activeSubTab="compress" setActiveSubTab={() => {}} />} />
        <Route path="/image-tools/remove-background" element={<ImageTools onAddHistory={onAddHistory} activeSubTab="scrub" setActiveSubTab={() => {}} />} />

        {/* Converter Dedicated Routes */}
        <Route path="/image-converter" element={<ConverterCenter onAddHistory={onAddHistory} activeSubTab={null} setActiveSubTab={() => {}} />} />
        <Route path="/converter" element={<ConverterCenter onAddHistory={onAddHistory} activeSubTab={null} setActiveSubTab={() => {}} />} />
        <Route path="/converters/png-to-jpg" element={<ConverterCenter onAddHistory={onAddHistory} activeSubTab="jpg" setActiveSubTab={() => {}} />} />
        <Route path="/converters/webp-to-png" element={<ConverterCenter onAddHistory={onAddHistory} activeSubTab="png" setActiveSubTab={() => {}} />} />
        <Route path="/universal-compressor" element={<UniversalCompressor onAddHistory={onAddHistory} />} />

        {/* Advanced Tool Modules */}
        <Route path="/file-repair" element={<FileRepairRecoveryCenter />} />
        <Route path="/collaboration" element={<RealTimeCollaboration />} />
        <Route path="/ai-content" element={<AIContentCreatorStudio />} />
        <Route path="/secure-vault" element={<AISecureVault />} />
        <Route path="/ai-secure-vault" element={<AISecureVault />} />
        <Route path="/seo-tools" element={<SeoMediaOptimizer />} />
        <Route path="/seo-media-optimizer" element={<SeoMediaOptimizer />} />
        <Route path="/batch-tools" element={<BatchAutomationStudio />} />
        <Route path="/batch-automation" element={<BatchAutomationStudio />} />

        {/* Directory & Search Routes */}
        <Route path="/tools" element={<ToolsDirectoryView />} />
        <Route path="/categories" element={<CategoriesView />} />
        <Route path="/search" element={<SearchView />} />
        <Route path="/blog" element={<BlogView />} />
        <Route path="/help" element={<HelpView />} />
        <Route path="/about" element={<AboutView />} />
        <Route path="/contact" element={<ContactView />} />
        <Route path="/privacy-policy" element={<PrivacyPolicyView />} />
        <Route path="/terms" element={<TermsView />} />

        {/* Legacy Hash Fallbacks */}
        <Route path="/pdf" element={<Navigate to="/pdf-tools" replace />} />
        <Route path="/resizer" element={<Navigate to="/image-tools/resize-image" replace />} />
        <Route path="/compressor" element={<Navigate to="/image-tools/compress-image" replace />} />

        {/* Catch-all 404 Route */}
        <Route path="*" element={<NotFoundView />} />
      </Routes>
    </Suspense>
  );
}
