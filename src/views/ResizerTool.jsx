import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Scale, Download, 
  Settings, Link, RefreshCw, AlertCircle
} from 'lucide-react';
import { useLanguage } from '../hooks/useLanguage';
import DragDropUpload from '../components/DragDropUpload';
import { 
  formatBytes, convertToPixels, convertFromPixels, 
  estimateOutputSize, resizeWithCanvas 
} from '../utils/imageProcessors';
import { downloadBlob } from '../utils/downloadHelper';

export default function ResizerTool({ onAddHistory }) {
  const { t } = useLanguage();
  const [selectedFile, setSelectedFile] = useState(null);
  const [imageSrc, setImageSrc] = useState(null);
  const [imageMeta, setImageMeta] = useState({ width: 0, height: 0, originalWidth: 0, originalHeight: 0 });

  // Inputs State
  const [activeUnit, setActiveUnit] = useState('px'); // px, pct, in, cm, mm
  const [widthInput, setWidthInput] = useState('');
  const [heightInput, setHeightInput] = useState('');
  const [maintainRatio, setMaintainRatio] = useState(true);
  const [quality, setQuality] = useState(85);
  const [dpi, setDpi] = useState(300);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isAiTipVisible, setIsAiTipVisible] = useState(true);

  const imgRef = useRef(null);

  // Load Image file metadata on selection
  const handleFilesSelected = (files) => {
    const file = files[0];
    if (!file) return;

    setSelectedFile(file);
    setIsProcessing(true);

    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const meta = {
          width: img.width,
          height: img.height,
          originalWidth: img.width,
          originalHeight: img.height,
          aspectRatio: img.width / img.height
        };
        setImageMeta(meta);
        setImageSrc(e.target.result);
        
        // Populate inputs based on default px values
        setWidthInput(img.width.toString());
        setHeightInput(img.height.toString());
        setIsProcessing(false);
      };
      img.src = e.target.result;
    };
    reader.readAsDataURL(file);
  };

  // Synchronize inputs based on Unit switch
  useEffect(() => {
    if (!imageSrc || !imageMeta.originalWidth || !imageMeta.originalHeight) return;

    const origW = imageMeta.originalWidth;
    const origH = imageMeta.originalHeight;

    const timer = setTimeout(() => {
      if (activeUnit === 'px') {
        setWidthInput(origW.toString());
        setHeightInput(origH.toString());
      } else if (activeUnit === 'pct') {
        setWidthInput('100');
        setHeightInput('100');
      } else {
        // physical units (in, cm, mm)
        const w = convertFromPixels(origW, activeUnit, dpi);
        const h = convertFromPixels(origH, activeUnit, dpi);
        setWidthInput(w.toString());
        setHeightInput(h.toString());
      }
    }, 0);

    return () => clearTimeout(timer);
  }, [activeUnit, dpi, imageSrc, imageMeta.originalWidth, imageMeta.originalHeight]);

  // Calculate target pixels based on currently typed metrics
  const getTargetDimensions = () => {
    if (!imageSrc || !widthInput || !heightInput) return { w: 0, h: 0 };

    if (activeUnit === 'px') {
      return {
        w: parseInt(widthInput, 10) || 0,
        h: parseInt(heightInput, 10) || 0
      };
    } else if (activeUnit === 'pct') {
      const pctW = parseFloat(widthInput) || 100;
      const pctH = parseFloat(heightInput) || 100;
      return {
        w: Math.round((imageMeta.originalWidth * pctW) / 100),
        h: Math.round((imageMeta.originalHeight * pctH) / 100)
      };
    } else {
      // Inches, cm, mm physical metrics
      return {
        w: convertToPixels(widthInput, activeUnit, dpi),
        h: convertToPixels(heightInput, activeUnit, dpi)
      };
    }
  };

  const { w: targetW, h: targetH } = getTargetDimensions();

  // Maintain aspect-ratio logic on type
  const handleDimensionChange = (val, dimension) => {
    if (dimension === 'width') {
      setWidthInput(val);
      if (maintainRatio && imageMeta.aspectRatio && val) {
        const parsed = parseFloat(val);
        if (!isNaN(parsed)) {
          const opposite = parsed / imageMeta.aspectRatio;
          setHeightInput(activeUnit === 'px' ? Math.round(opposite).toString() : opposite.toFixed(2));
        }
      }
    } else {
      setHeightInput(val);
      if (maintainRatio && imageMeta.aspectRatio && val) {
        const parsed = parseFloat(val);
        if (!isNaN(parsed)) {
          const opposite = parsed * imageMeta.aspectRatio;
          setWidthInput(activeUnit === 'px' ? Math.round(opposite).toString() : opposite.toFixed(2));
        }
      }
    }
  };

  // Compile estimates
  const estBytes = selectedFile ? estimateOutputSize(targetW, targetH, selectedFile.type, quality) : 0;
  const compRatio = selectedFile ? parseFloat(((selectedFile.size - estBytes) / selectedFile.size * 100).toFixed(1)) : 0;

  // Process Resize
  const handleResizeAndDownload = async () => {
    if (!selectedFile || !imageSrc || targetW <= 0 || targetH <= 0) return;

    setIsProcessing(true);
    try {
      const tempImg = new Image();
      tempImg.src = imageSrc;
      await new Promise(resolve => tempImg.onload = resolve);

      const targetMime = selectedFile.type || 'image/jpeg';
      const resizedBlob = await resizeWithCanvas(
        tempImg, 
        targetW, 
        targetH, 
        targetMime, 
        quality / 100
      );

      // Trigger download
      const fileExt = targetMime.split('/')[1] === 'jpeg' ? 'jpg' : targetMime.split('/')[1];
      const filename = selectedFile.name.replace(/\.[^/.]+$/, "") + `_resized.${fileExt}`;
      
      downloadBlob(resizedBlob, filename);

      // Log conversion inside Local History state
      onAddHistory({
        fileName: filename,
        fromFormat: selectedFile.name.split('.').pop(),
        toFormat: fileExt,
        size: resizedBlob.size
      }, resizedBlob);

      setIsProcessing(false);
    } catch (error) {
      console.error(error);
      setIsProcessing(false);
      alert("Error resizing image. Ensure resolution boundaries are supported.");
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* View Header */}
      <div className="space-y-2 text-center lg:text-left">
        <h2 className="text-3xl font-extrabold text-white flex items-center justify-center lg:justify-start gap-2.5">
          <Scale className="text-primary-400 animate-pulse" />
          {t('resizerTitle')}
        </h2>
        <p className="text-sm text-dark-400 max-w-2xl">{t('resizerSub')}</p>
      </div>

      <AnimatePresence mode="wait">
        {!selectedFile ? (
          <motion.div
            key="uploader"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
          >
            <DragDropUpload 
              onFilesSelected={handleFilesSelected}
              accept="image/*"
              multiple={false}
              accentColor="primary"
            />
          </motion.div>
        ) : (
          <motion.div
            key="workspace"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start"
          >
            {/* Left Image Preview Container */}
            <div className="lg:col-span-6 space-y-6">
              <div className="glass-panel p-4 rounded-3xl shadow-glass flex flex-col items-center justify-center relative overflow-hidden bg-black/30 min-h-[300px] border border-white/5">
                <img
                  ref={imgRef}
                  src={imageSrc}
                  alt="Source File Preview"
                  className="max-h-[380px] w-auto h-auto rounded-xl object-contain shadow-md relative z-10"
                />
                
                {/* Visual canvas dimension overlays */}
                <div className="absolute top-3 left-3 bg-black/60 border border-white/5 text-[10px] px-2.5 py-1 rounded-lg text-dark-200 font-mono z-20">
                  {imageMeta.originalWidth} x {imageMeta.originalHeight} px (Original)
                </div>
                
                <div className="absolute bottom-3 right-3 bg-primary-500/80 border border-primary-400/20 text-[10px] px-2.5 py-1 rounded-lg text-white font-mono z-20 shadow-glow-primary">
                  {targetW} x {targetH} px (Target)
                </div>

                <div className="absolute inset-0 glow-orb-1 opacity-5 pointer-events-none" />
              </div>

              {/* AI-powered local suggestion tags */}
              {isAiTipVisible && (
                <div className="p-4 rounded-2xl bg-primary-500/10 border border-primary-500/25 flex gap-3 relative overflow-hidden">
                  <div className="w-8 h-8 rounded-lg bg-primary-500/20 flex items-center justify-center text-primary-400 flex-shrink-0">
                    <AlertCircle size={16} />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-primary-300">{t('aiTipTitle')}</h4>
                    <p className="text-xs text-dark-400 mt-0.5 leading-relaxed">
                      {targetW > 1920 
                        ? t('aiTipHighRes') 
                        : selectedFile.type.includes('png') 
                          ? t('aiTipPngToWebp') 
                          : t('aiTipStandard')}
                    </p>
                  </div>
                  <button 
                    onClick={() => setIsAiTipVisible(false)}
                    className="absolute top-2 right-2 text-dark-500 hover:text-dark-300 text-xs"
                  >
                    ×
                  </button>
                </div>
              )}
            </div>

            {/* Right Adjustment panel */}
            <div className="lg:col-span-6 space-y-6">
              {/* Unit Selector Tabs */}
              <div className="glass-panel p-1 rounded-2xl border border-white/5 flex shadow-glass">
                {['px', 'pct', 'in', 'cm', 'mm'].map((unit) => (
                  <button
                    key={unit}
                    onClick={() => setActiveUnit(unit)}
                    className={`flex-1 text-center py-2.5 rounded-xl text-xs font-semibold uppercase tracking-wider transition-all ${
                      activeUnit === unit
                        ? 'bg-primary-500 text-white shadow-glow-primary'
                        : 'text-dark-400 hover:text-dark-200'
                    }`}
                  >
                    {unit}
                  </button>
                ))}
              </div>

              {/* Dimensions Input Panel */}
              <div className="glass-panel p-6 rounded-3xl border border-white/5 space-y-5 shadow-glass">
                <h3 className="font-semibold text-sm text-dark-300 uppercase tracking-widest flex items-center gap-2">
                  <Settings size={14} className="text-primary-400" />
                  Dimensions
                </h3>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-dark-400">{t('width')}</label>
                    <input
                      type="number"
                      value={widthInput}
                      onChange={(e) => handleDimensionChange(e.target.value, 'width')}
                      placeholder="e.g. 1920"
                      className="glass-input w-full text-sm font-semibold font-mono"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-dark-400">{t('height')}</label>
                    <input
                      type="number"
                      value={heightInput}
                      onChange={(e) => handleDimensionChange(e.target.value, 'height')}
                      placeholder="e.g. 1080"
                      className="glass-input w-full text-sm font-semibold font-mono"
                    />
                  </div>
                </div>

                {/* Aspect Ratio Lock */}
                <div className="flex items-center justify-between border-t border-white/5 pt-4 text-sm">
                  <span className="text-dark-300 font-medium flex items-center gap-2">
                    <Link size={15} className="text-primary-400" />
                    {t('aspectRatio')}
                  </span>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input 
                      type="checkbox" 
                      checked={maintainRatio} 
                      onChange={(e) => setMaintainRatio(e.target.checked)}
                      className="sr-only peer" 
                    />
                    <div className="w-9 h-5 bg-white/10 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-dark-300 after:border-gray-300 after:border after:rounded-full after:height-4 after:h-4 after:w-4 after:transition-all peer-checked:bg-primary-500 peer-checked:after:bg-white" />
                  </label>
                </div>

                {/* physical DPI slider (Only renders when cm, in, or mm is active) */}
                {['in', 'cm', 'mm'].includes(activeUnit) && (
                  <div className="border-t border-white/5 pt-4 space-y-2">
                    <div className="flex justify-between text-xs">
                      <span className="text-dark-400 font-medium">{t('dpi')} (DPI)</span>
                      <span className="font-bold text-primary-400 font-mono">{dpi} DPI</span>
                    </div>
                    <input
                      type="range"
                      min="72"
                      max="600"
                      step="1"
                      value={dpi}
                      onChange={(e) => setDpi(parseInt(e.target.value))}
                      className="w-full h-1 bg-white/15 rounded-lg appearance-none cursor-pointer accent-primary-500 focus:outline-none"
                    />
                    <div className="flex justify-between text-[10px] text-dark-500 font-mono">
                      <span>72 (Web)</span>
                      <span>150 (Screen)</span>
                      <span>300 (Print Quality)</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Compression Slider Panel */}
              <div className="glass-panel p-6 rounded-3xl border border-white/5 space-y-4 shadow-glass">
                <div className="flex justify-between text-sm">
                  <span className="text-dark-300 font-medium">{t('qualitySlider')}</span>
                  <span className="font-bold text-primary-400 font-mono">{quality}%</span>
                </div>
                <input
                  type="range"
                  min="10"
                  max="100"
                  step="1"
                  value={quality}
                  onChange={(e) => setQuality(parseInt(e.target.value))}
                  className="w-full h-1 bg-white/15 rounded-lg appearance-none cursor-pointer accent-primary-500 focus:outline-none"
                />
              </div>

              {/* Preview Real-time Stats Card */}
              <div className="glass-panel p-6 rounded-3xl border border-white/5 space-y-3.5 shadow-glass bg-gradient-to-br from-primary-500/5 to-secondary-500/5">
                <h4 className="font-bold text-xs uppercase tracking-widest text-dark-300">
                  {t('realtimePreview')}
                </h4>

                <div className="grid grid-cols-2 gap-4 text-xs">
                  <div>
                    <span className="block text-dark-400">{t('originalSize')}</span>
                    <span className="block text-sm font-bold text-white font-mono mt-0.5">
                      {formatBytes(selectedFile.size)}
                    </span>
                  </div>
                  <div>
                    <span className="block text-dark-400">{t('estimatedSize')}</span>
                    <span className="block text-sm font-bold text-primary-400 font-mono mt-0.5">
                      ~{formatBytes(estBytes)}
                    </span>
                  </div>
                  <div>
                    <span className="block text-dark-400">{t('compressionRatio')}</span>
                    <span className="block text-sm font-bold text-accent-400 font-mono mt-0.5">
                      {compRatio > 0 ? `${compRatio}% saved` : '0%'}
                    </span>
                  </div>
                  <div>
                    <span className="block text-dark-400">Target File Format</span>
                    <span className="block text-sm font-bold text-white mt-0.5 font-mono uppercase">
                      {selectedFile.type.split('/')[1]}
                    </span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3">
                <button
                  onClick={() => setSelectedFile(null)}
                  className="px-5 py-3.5 rounded-2xl bg-white/5 border border-white/10 dark:border-white/10 light:border-black/10 hover:bg-white/10 font-bold transition-all text-sm text-dark-200"
                >
                  Upload New
                </button>
                <button
                  onClick={handleResizeAndDownload}
                  disabled={isProcessing || targetW <= 0 || targetH <= 0}
                  className="flex-1 px-5 py-3.5 rounded-2xl bg-gradient-to-r from-primary-500 to-secondary-500 font-bold text-white shadow-glow-primary hover:opacity-90 active:scale-95 transition-all text-sm flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {isProcessing ? (
                    <>
                      <RefreshCw size={15} className="animate-spin" />
                      Processing Image...
                    </>
                  ) : (
                    <>
                      <Download size={15} />
                      {t('downloadResized')}
                    </>
                  )}
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
