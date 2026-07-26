import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Shrink, CheckCircle, Download, FileArchive, 
  Settings, RefreshCw, FileImage, Layers, Trash2, ArrowRight
} from 'lucide-react';
import JSZip from 'jszip';
import { useLanguage } from '../hooks/useLanguage';
import DragDropUpload from '../components/DragDropUpload';
import { formatBytes, compressImage } from '../utils/imageProcessors';
import { downloadBlob } from '../utils/downloadHelper';

export default function CompressorTool({ onAddHistory }) {
  const { t } = useLanguage();
  const [files, setFiles] = useState([]); // Array of objects: { id, file, originalSize, compressedFile, compressedSize, status, progress }
  const [quality, setQuality] = useState(60);
  const [activePreset, setActivePreset] = useState('balanced'); // max, balanced, high, custom
  const [isProcessing, setIsProcessing] = useState(false);

  // Before & After comparison states
  const [activeCompareId, setActiveCompareId] = useState(null);
  const [compareLeftSrc, setCompareLeftSrc] = useState(null);
  const [compareRightSrc, setCompareRightSrc] = useState(null);
  const [dividerPos, setDividerPos] = useState(50); // percentage 0-100

  const compareContainerRef = useRef(null);

  // Synchronize Preset changes with Quality values
  const applyPreset = (preset) => {
    setActivePreset(preset);
    if (preset === 'max') setQuality(20);
    else if (preset === 'balanced') setQuality(60);
    else if (preset === 'high') setQuality(85);
  };

  const handleCustomQualityChange = (val) => {
    setQuality(val);
    setActivePreset('custom');
  };

  // Queue files on selection
  const handleFilesSelected = (selectedFiles) => {
    const newItems = selectedFiles.map((file, idx) => ({
      id: `${Date.now()}-${idx}-${file.name}`,
      file,
      name: file.name,
      originalSize: file.size,
      compressedFile: null,
      compressedSize: 0,
      status: 'pending', // pending, processing, done, failed
      progress: 0
    }));

    setFiles((prev) => [...prev, ...newItems]);
  };

  // Perform Compression on the entire Queue
  const runCompressionQueue = async () => {
    if (files.length === 0 || isProcessing) return;
    setIsProcessing(true);

    // Compress sequentially or in small chunks
    for (let i = 0; i < files.length; i++) {
      const item = files[i];
      if (item.status === 'done') continue;

      setFiles(prev => prev.map(f => f.id === item.id ? { ...f, status: 'processing', progress: 20 } : f));

      try {
        const compressed = await compressImage(item.file, {
          initialQuality: quality / 100,
          maxSizeMB: 10,
          useWebWorker: true
        });

        // Trigger history log
        onAddHistory({
          fileName: compressed.name,
          fromFormat: item.name.split('.').pop(),
          toFormat: compressed.name.split('.').pop(),
          size: compressed.size
        }, compressed);

        setFiles(prev => prev.map(f => f.id === item.id ? { 
          ...f, 
          status: 'done', 
          progress: 100, 
          compressedFile: compressed, 
          compressedSize: compressed.size 
        } : f));

      } catch (error) {
        console.error(error);
        setFiles(prev => prev.map(f => f.id === item.id ? { ...f, status: 'failed', progress: 0 } : f));
      }
    }
    setIsProcessing(false);
  };

  const downloadSingleFile = (item) => {
    if (item.status !== 'done' || !item.compressedFile) return;
    downloadBlob(item.compressedFile, item.compressedFile.name);
  };

  // ZIP Download trigger
  const downloadAllAsZip = async () => {
    const completedItems = files.filter(f => f.status === 'done' && f.compressedFile);
    if (completedItems.length === 0) return;

    const zip = new JSZip();
    completedItems.forEach(item => {
      zip.file(item.name, item.compressedFile);
    });

    const content = await zip.generateAsync({ type: 'blob' });
    const filename = `convertverse_compressed_${Date.now()}.zip`;
    
    downloadBlob(content, filename);

    // Save ZIP package to history
    onAddHistory({
      fileName: filename,
      fromFormat: 'images',
      toFormat: 'zip',
      size: content.size
    }, content);
  };

  // Draggable Divider movement
  const handleComparisonMove = (clientX) => {
    const container = compareContainerRef.current;
    if (!container) return;

    const rect = container.getBoundingClientRect();
    const x = clientX - rect.left;
    const pct = Math.max(0, Math.min(100, (x / rect.width) * 100));
    setDividerPos(pct);
  };

  const handleTouchMove = (e) => {
    if (e.touches && e.touches[0]) {
      handleComparisonMove(e.touches[0].clientX);
    }
  };

  const handleMouseMove = (e) => {
    handleComparisonMove(e.clientX);
  };

  // Set up selected images for before-and-after comparison
  const openCompare = (item) => {
    if (item.status !== 'done' || !item.compressedFile) return;

    // Clean up previous comparison URLs to prevent memory leak
    if (compareLeftSrc) URL.revokeObjectURL(compareLeftSrc);
    if (compareRightSrc) URL.revokeObjectURL(compareRightSrc);

    setActiveCompareId(item.id);
    
    // Generate object URLs for display
    const leftUrl = URL.createObjectURL(item.file);
    const rightUrl = URL.createObjectURL(item.compressedFile);
    
    setCompareLeftSrc(leftUrl);
    setCompareRightSrc(rightUrl);
  };

  // Remove file from queue
  const removeFile = (id) => {
    setFiles(prev => prev.filter(f => f.id !== id));
    if (activeCompareId === id) {
      if (compareLeftSrc) URL.revokeObjectURL(compareLeftSrc);
      if (compareRightSrc) URL.revokeObjectURL(compareRightSrc);
      setActiveCompareId(null);
      setCompareLeftSrc(null);
      setCompareRightSrc(null);
    }
  };

  const clearQueue = () => {
    setFiles([]);
    if (compareLeftSrc) URL.revokeObjectURL(compareLeftSrc);
    if (compareRightSrc) URL.revokeObjectURL(compareRightSrc);
    setActiveCompareId(null);
    setCompareLeftSrc(null);
    setCompareRightSrc(null);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Page Header */}
      <div className="space-y-2 text-center lg:text-left">
        <h2 className="text-3xl font-extrabold text-white flex items-center justify-center lg:justify-start gap-2.5">
          <Shrink className="text-secondary-400 animate-pulse" />
          {t('compressorTitle')}
        </h2>
        <p className="text-sm text-dark-400 max-w-2xl">{t('compressorSub')}</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Side: Upload & Queue controls */}
        <div className="lg:col-span-7 space-y-6">
          <DragDropUpload 
            onFilesSelected={handleFilesSelected}
            accept="image/jpeg,image/png,image/webp"
            multiple={true}
            accentColor="secondary"
          />

          {/* Queue Container */}
          <AnimatePresence mode="popLayout">
            {files.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="glass-panel rounded-3xl p-6 border border-white/5 space-y-4 shadow-glass"
              >
                <div className="flex items-center justify-between border-b border-white/5 pb-4">
                  <h3 className="font-semibold text-sm text-dark-300 uppercase tracking-widest flex items-center gap-2">
                    <Layers size={14} className="text-secondary-400" />
                    {t('batchQueue')}
                  </h3>
                  <button
                    onClick={clearQueue}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-red-500/10 hover:border-red-500/30 text-xs font-semibold text-red-400 hover:bg-red-500/5 transition-all"
                  >
                    <Trash2 size={13} />
                    Clear Queue
                  </button>
                </div>

                <div className="flex flex-col gap-2 max-h-[300px] overflow-y-auto pr-1">
                  {files.map((item) => {
                    const pctSaved = item.compressedSize > 0 
                      ? Math.round(((item.originalSize - item.compressedSize) / item.originalSize) * 100)
                      : 0;

                    return (
                      <motion.div
                        key={item.id}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 10 }}
                        onClick={() => openCompare(item)}
                        className={`p-3.5 rounded-2xl bg-white/5 border border-white/5 flex items-center justify-between gap-4 transition-all relative ${
                          item.status === 'done' ? 'cursor-pointer hover:border-secondary-500/30' : ''
                        }`}
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <div className="w-9 h-9 rounded-xl bg-secondary-500/10 border border-secondary-500/25 flex items-center justify-center text-secondary-400 flex-shrink-0">
                            <FileImage size={16} />
                          </div>
                          <div className="min-w-0">
                            <span className="block text-sm font-semibold text-dark-200 truncate pr-2">
                              {item.name}
                            </span>
                            <span className="flex items-center gap-1.5 text-[11px] text-dark-400 font-mono mt-0.5">
                              {formatBytes(item.originalSize)}
                              {item.status === 'done' && (
                                <>
                                  <ArrowRight size={10} className="text-dark-500" />
                                  <span className="text-secondary-400 font-bold">{formatBytes(item.compressedSize)}</span>
                                  <span className="text-dark-500">•</span>
                                  <span className="text-accent-400 font-bold">-{pctSaved}% saved</span>
                                </>
                              )}
                            </span>
                          </div>
                        </div>

                        {/* Status chip */}
                        <div className="flex items-center gap-3">
                          {item.status === 'pending' && (
                            <span className="text-[10px] bg-white/5 text-dark-400 border border-white/5 px-2 py-0.5 rounded-lg font-bold uppercase tracking-wider">
                              Pending
                            </span>
                          )}
                          {item.status === 'processing' && (
                            <span className="text-[10px] bg-secondary-500/15 border border-secondary-500/20 text-secondary-400 px-2 py-0.5 rounded-lg font-bold flex items-center gap-1 uppercase tracking-wider animate-pulse">
                              <RefreshCw size={10} className="animate-spin" />
                              Active
                            </span>
                          )}
                          {item.status === 'done' && (
                            <span className="text-[10px] bg-accent-500/15 border border-accent-500/20 text-accent-400 px-2 py-0.5 rounded-lg font-bold flex items-center gap-1 uppercase tracking-wider">
                              <CheckCircle size={10} />
                              Ready
                            </span>
                          )}
                          
                          {item.status === 'done' && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                downloadSingleFile(item);
                              }}
                              className="p-1.5 rounded-xl hover:bg-accent-500/10 text-accent-400 hover:text-accent-300 transition-colors flex-shrink-0"
                              title="Download single file"
                            >
                              <Download size={14} />
                            </button>
                          )}
                          
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              removeFile(item.id);
                            }}
                            className="p-1.5 rounded-xl hover:bg-red-500/10 text-dark-500 hover:text-red-400 transition-colors flex-shrink-0"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>

                {/* Queue action buttons */}
                <div className="flex gap-3 pt-2">
                  <button
                    onClick={runCompressionQueue}
                    disabled={isProcessing || !files.some(f => f.status === 'pending')}
                    className="flex-1 px-5 py-3 rounded-2xl bg-gradient-to-r from-secondary-500 to-primary-500 font-bold text-white shadow-glow-secondary hover:opacity-90 active:scale-95 transition-all text-sm flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    {isProcessing ? (
                      <>
                        <RefreshCw size={15} className="animate-spin" />
                        Optimizing Queue...
                      </>
                    ) : (
                      <>
                        <Shrink size={15} />
                        Compress All Files
                      </>
                    )}
                  </button>

                  <button
                    onClick={downloadAllAsZip}
                    disabled={!files.some(f => f.status === 'done')}
                    className="px-5 py-3 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 font-bold transition-all text-sm text-dark-200 flex items-center justify-center gap-2 disabled:opacity-50"
                    title={t('downloadZip')}
                  >
                    <FileArchive size={15} />
                    ZIP
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Right Side: Options Adjustments & Visual Wipe Comparison */}
        <div className="lg:col-span-5 space-y-6">
          {/* Preset Quality Panel */}
          <div className="glass-panel p-6 rounded-3xl border border-white/5 space-y-5 shadow-glass">
            <h3 className="font-semibold text-sm text-dark-300 uppercase tracking-widest flex items-center gap-2">
              <Settings size={14} className="text-secondary-400" />
              Quality settings
            </h3>

            {/* Presets */}
            <div className="flex flex-col gap-2.5">
              <button
                onClick={() => applyPreset('max')}
                className={`w-full text-left px-4 py-3 rounded-2xl border text-sm font-semibold flex items-center justify-between transition-all ${
                  activePreset === 'max'
                    ? 'bg-secondary-500/10 border-secondary-500/30 text-secondary-400 shadow-glow-secondary'
                    : 'bg-white/5 border-transparent text-dark-400 hover:text-dark-200'
                }`}
              >
                <span>{t('presetMax')}</span>
                <span className="font-mono text-xs font-bold bg-black/30 px-2.5 py-0.5 rounded-lg border border-white/5">20% Quality</span>
              </button>

              <button
                onClick={() => applyPreset('balanced')}
                className={`w-full text-left px-4 py-3 rounded-2xl border text-sm font-semibold flex items-center justify-between transition-all ${
                  activePreset === 'balanced'
                    ? 'bg-secondary-500/10 border-secondary-500/30 text-secondary-400 shadow-glow-secondary'
                    : 'bg-white/5 border-transparent text-dark-400 hover:text-dark-200'
                }`}
              >
                <span>{t('presetBalanced')}</span>
                <span className="font-mono text-xs font-bold bg-black/30 px-2.5 py-0.5 rounded-lg border border-white/5 text-secondary-400">60% Quality</span>
              </button>

              <button
                onClick={() => applyPreset('high')}
                className={`w-full text-left px-4 py-3 rounded-2xl border text-sm font-semibold flex items-center justify-between transition-all ${
                  activePreset === 'high'
                    ? 'bg-secondary-500/10 border-secondary-500/30 text-secondary-400 shadow-glow-secondary'
                    : 'bg-white/5 border-transparent text-dark-400 hover:text-dark-200'
                }`}
              >
                <span>{t('presetHigh')}</span>
                <span className="font-mono text-xs font-bold bg-black/30 px-2.5 py-0.5 rounded-lg border border-white/5">85% Quality</span>
              </button>
            </div>

            {/* Custom slider */}
            <div className="space-y-3 pt-3 border-t border-white/5">
              <div className="flex justify-between text-xs">
                <span className="text-dark-400 font-semibold">Custom Scale</span>
                <span className="font-bold text-secondary-400 font-mono">{quality}%</span>
              </div>
              <input
                type="range"
                min="5"
                max="95"
                step="1"
                value={quality}
                onChange={(e) => handleCustomQualityChange(parseInt(e.target.value))}
                className="w-full h-1 bg-white/15 rounded-lg appearance-none cursor-pointer accent-secondary-500 focus:outline-none"
              />
            </div>
          </div>

          {/* Draggable Wipe comparison */}
          <AnimatePresence>
            {activeCompareId && compareLeftSrc && compareRightSrc && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="glass-panel p-4 rounded-3xl border border-white/5 space-y-4 shadow-glass"
              >
                <div>
                  <h4 className="font-bold text-xs uppercase tracking-widest text-dark-300">
                    {t('beforeAfter')}
                  </h4>
                  <p className="text-[11px] text-dark-500">{t('dragSlider')}</p>
                </div>

                <div 
                  ref={compareContainerRef}
                  onMouseMove={handleMouseMove}
                  onTouchMove={handleTouchMove}
                  className="compare-container relative aspect-[4/3] w-full rounded-2xl bg-black/20 overflow-hidden cursor-ew-resize border border-white/5"
                >
                  {/* Before (Original Image, Left layer) */}
                  <img
                    src={compareLeftSrc}
                    alt="Original"
                    className="absolute inset-0 w-full h-full object-cover pointer-events-none"
                  />

                  {/* After (Compressed Image, Right layer, clipped dynamically) */}
                  <div 
                    className="absolute inset-0 overflow-hidden pointer-events-none"
                    style={{ clipPath: `polygon(${dividerPos}% 0, 100% 0, 100% 100%, ${dividerPos}% 100%)` }}
                  >
                    <img
                      src={compareRightSrc}
                      alt="Compressed"
                      className="absolute inset-0 w-full h-full object-cover"
                    />
                  </div>

                  {/* Handles */}
                  <div 
                    className="compare-handle"
                    style={{ left: `${dividerPos}%` }}
                  >
                    <div className="compare-handle-button select-none shadow-lg">
                      ↔
                    </div>
                  </div>

                  {/* Visual Labels */}
                  <div className="absolute top-3.5 left-3.5 bg-black/60 border border-white/5 px-2.5 py-1 rounded-lg text-[9px] font-mono text-dark-300 font-bold">
                    Original
                  </div>
                  <div className="absolute top-3.5 right-3.5 bg-secondary-500/80 border border-secondary-400/25 px-2.5 py-1 rounded-lg text-[9px] font-mono text-white font-bold shadow-glow-secondary">
                    Compressed
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
