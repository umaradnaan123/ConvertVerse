import React, { lazy, Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Loader2 } from 'lucide-react';

// Code-split Lazy Loaded Workstation Views
const Dashboard = lazy(() => import('../views/Dashboard'));
const PdfToolbox = lazy(() => import('../views/PdfToolbox'));
const ImageTools = lazy(() => import('../views/ImageTools'));
const UniversalCompressor = lazy(() => import('../views/UniversalCompressor'));
const ConverterCenter = lazy(() => import('../views/ConverterCenter'));
const ConvertersLandingView = lazy(() => import('../views/ConvertersLandingView'));
const UnitConvertersView = lazy(() => import('../views/UnitConvertersView'));
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
const BlogArticleView = lazy(() => import('../views/BlogArticleView'));
const DisclaimerView = lazy(() => import('../views/DisclaimerView'));
const AuthorsView = lazy(() => import('../views/AuthorsView'));
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

        {/* Converters Directory & Unit Category Routes */}
        <Route path="/converters" element={<ConvertersLandingView />} />
        <Route path="/converters/length" element={<UnitConvertersView />} />
        <Route path="/converters/weight" element={<UnitConvertersView />} />
        <Route path="/converters/temperature" element={<UnitConvertersView />} />
        <Route path="/converters/area" element={<UnitConvertersView />} />
        <Route path="/converters/volume" element={<UnitConvertersView />} />
        <Route path="/converters/time" element={<UnitConvertersView />} />
        <Route path="/converters/speed" element={<UnitConvertersView />} />
        <Route path="/converters/data" element={<UnitConvertersView />} />
        <Route path="/converters/energy" element={<UnitConvertersView />} />
        <Route path="/converters/pressure" element={<UnitConvertersView />} />
        <Route path="/converters/:category" element={<UnitConvertersView />} />

        {/* PDF Suite Primary Canonical Routes */}
        <Route path="/pdf-tools" element={<PdfToolbox onAddHistory={onAddHistory} activeSubTab={null} setActiveSubTab={() => {}} />} />
        <Route path="/pdf-merge" element={<PdfToolbox onAddHistory={onAddHistory} activeSubTab="merge" setActiveSubTab={() => {}} />} />
        <Route path="/pdf-split" element={<PdfToolbox onAddHistory={onAddHistory} activeSubTab="split" setActiveSubTab={() => {}} />} />
        <Route path="/pdf-compress" element={<PdfToolbox onAddHistory={onAddHistory} activeSubTab="compress" setActiveSubTab={() => {}} />} />
        <Route path="/pdf-to-word" element={<PdfToolbox onAddHistory={onAddHistory} activeSubTab="compress" setActiveSubTab={() => {}} />} />
        <Route path="/word-to-pdf" element={<PdfToolbox onAddHistory={onAddHistory} activeSubTab="merge" setActiveSubTab={() => {}} />} />
        <Route path="/pdf-editor" element={<PdfEditor onAddHistory={onAddHistory} activeSubTab={null} setActiveSubTab={() => {}} />} />
        <Route path="/pdf-security" element={<PdfSecurity onAddHistory={onAddHistory} activeSubTab={null} setActiveSubTab={() => {}} />} />

        {/* PDF Alias Redirects (HTTP 301 Edge Target) */}
        <Route path="/pdf-tools/merge-pdf" element={<Navigate to="/pdf-merge" replace />} />
        <Route path="/pdf-tools/split-pdf" element={<Navigate to="/pdf-split" replace />} />
        <Route path="/pdf-tools/compress-pdf" element={<Navigate to="/pdf-compress" replace />} />
        <Route path="/watermark-pdf" element={<Navigate to="/batch-tools" replace />} />
        <Route path="/unlock-pdf" element={<Navigate to="/pdf-security" replace />} />
        <Route path="/protect-pdf" element={<Navigate to="/pdf-security" replace />} />

        {/* Image Suite Primary Canonical Routes */}
        <Route path="/image-tools" element={<ImageTools onAddHistory={onAddHistory} activeSubTab={null} setActiveSubTab={() => {}} />} />
        <Route path="/resize-image" element={<ImageTools onAddHistory={onAddHistory} activeSubTab="resize" setActiveSubTab={() => {}} />} />
        <Route path="/image-compressor" element={<ImageTools onAddHistory={onAddHistory} activeSubTab="compress" setActiveSubTab={() => {}} />} />
        <Route path="/image-tools/remove-background" element={<ImageTools onAddHistory={onAddHistory} activeSubTab="scrub" setActiveSubTab={() => {}} />} />

        {/* Image Alias Redirects (HTTP 301 Edge Target) */}
        <Route path="/image-tools/resize-image" element={<Navigate to="/resize-image" replace />} />
        <Route path="/crop-image" element={<Navigate to="/resize-image" replace />} />
        <Route path="/image-tools/compress-image" element={<Navigate to="/image-compressor" replace />} />

        {/* Converter Primary & Alias Redirects */}
        <Route path="/image-converter" element={<ConverterCenter onAddHistory={onAddHistory} activeSubTab={null} setActiveSubTab={() => {}} />} />
        <Route path="/converter" element={<Navigate to="/image-converter" replace />} />
        <Route path="/png-to-jpg" element={<ConverterCenter onAddHistory={onAddHistory} activeSubTab="jpg" setActiveSubTab={() => {}} />} />
        <Route path="/converters/png-to-jpg" element={<Navigate to="/png-to-jpg" replace />} />
        <Route path="/jpg-to-png" element={<ConverterCenter onAddHistory={onAddHistory} activeSubTab="png" setActiveSubTab={() => {}} />} />
        <Route path="/webp-to-png" element={<ConverterCenter onAddHistory={onAddHistory} activeSubTab="png" setActiveSubTab={() => {}} />} />
        <Route path="/converters/webp-to-png" element={<Navigate to="/webp-to-png" replace />} />
        <Route path="/universal-compressor" element={<UniversalCompressor onAddHistory={onAddHistory} />} />

        {/* Advanced Tool Modules */}
        <Route path="/file-repair" element={<FileRepairRecoveryCenter />} />
        <Route path="/collaboration" element={<RealTimeCollaboration />} />
        <Route path="/ai-content" element={<AIContentCreatorStudio />} />
        <Route path="/secure-vault" element={<AISecureVault />} />
        <Route path="/ai-secure-vault" element={<Navigate to="/secure-vault" replace />} />
        <Route path="/seo-tools" element={<SeoMediaOptimizer />} />
        <Route path="/seo-media-optimizer" element={<Navigate to="/seo-tools" replace />} />
        <Route path="/batch-tools" element={<BatchAutomationStudio />} />
        <Route path="/batch-automation" element={<Navigate to="/batch-tools" replace />} />

        {/* Directory & EEAT Routes */}
        <Route path="/tools" element={<ToolsDirectoryView />} />
        <Route path="/categories" element={<CategoriesView />} />
        <Route path="/search" element={<SearchView />} />
        <Route path="/blog" element={<BlogView />} />
        <Route path="/blog/:articleId" element={<BlogArticleView />} />
        <Route path="/help" element={<HelpView />} />
        <Route path="/faq" element={<Navigate to="/help" replace />} />
        <Route path="/about" element={<AboutView />} />
        <Route path="/contact" element={<ContactView />} />
        <Route path="/disclaimer" element={<DisclaimerView />} />
        <Route path="/authors" element={<AuthorsView />} />
        <Route path="/privacy-policy" element={<PrivacyPolicyView />} />
        <Route path="/privacy" element={<Navigate to="/privacy-policy" replace />} />
        <Route path="/terms" element={<TermsView />} />

        {/* Legacy Hash Fallbacks */}
        <Route path="/pdf" element={<Navigate to="/pdf-tools" replace />} />
        <Route path="/resizer" element={<Navigate to="/resize-image" replace />} />
        <Route path="/compressor" element={<Navigate to="/image-compressor" replace />} />

        {/* Catch-all 404 Route */}
        <Route path="*" element={<NotFoundView />} />
      </Routes>
    </Suspense>
  );
}
