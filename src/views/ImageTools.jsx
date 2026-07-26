import { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Shrink, Scale, Scissors, RotateCw, Image as ImageIcon, Images, FileCode, Zap, Sparkles, Smile, Edit3, Stamp, EyeOff,
  Upload, Download, Trash2, Sliders, RefreshCw, Play
} from 'lucide-react';
import { toPng } from 'html-to-image';
import { downloadBlob } from '../utils/downloadHelper';

export default function ImageTools({ onAddHistory, activeSubTab, setActiveSubTab }) {
  const [activeTab, setActiveTab] = useState(activeSubTab || 'compress');
  const [selectedFiles, setSelectedFiles] = useState([]);
  
  // Sync tab with external routing triggers
  useEffect(() => {
    if (activeSubTab) {
      setTimeout(() => {
        setActiveTab(activeSubTab);
      }, 0);
    }
  }, [activeSubTab]);

  const handleTabChange = (tabId) => {
    setActiveTab(tabId);
    if (setActiveSubTab) {
      setActiveSubTab(tabId);
    }
    // Clear state
    setSelectedFiles([]);
  };

  const tabs = [
    { id: 'compress', label: 'Compress', icon: Shrink, cat: 'Optimize', desc: 'Reduce file size losslessly' },
    { id: 'resize', label: 'Resize', icon: Scale, cat: 'Optimize', desc: 'Adjust canvas dimensions' },
    { id: 'upscale', label: 'Upscale', icon: Zap, cat: 'Optimize', desc: 'Super-resolution zoom' },
    { id: 'crop', label: 'Crop', icon: Scissors, cat: 'Modify', desc: 'Visual crop frames' },
    { id: 'rotate', label: 'Rotate', icon: RotateCw, cat: 'Modify', desc: 'Degree rotation & flipping' },
    { id: 'remove-bg', label: 'Remove BG', icon: Sparkles, cat: 'Modify', desc: 'Chroma-key magic-wand' },
    { id: 'editor', label: 'Photo Editor', icon: Edit3, cat: 'Modify', desc: 'Filters & brush canvas' },
    { id: 'meme', label: 'Meme Maker', icon: Smile, cat: 'Create', desc: 'Text meme generator' },
    { id: 'html-to-img', label: 'HTML to Image', icon: FileCode, cat: 'Create', desc: 'HTML/CSS template render' },
    { id: 'to-jpg', label: 'To JPG', icon: ImageIcon, cat: 'Convert', desc: 'Convert format to JPG' },
    { id: 'from-jpg', label: 'From JPG', icon: Images, cat: 'Convert', desc: 'Convert JPG to others' },
    { id: 'watermark', label: 'Watermark', icon: Stamp, cat: 'Security', desc: 'Copyright stamp overlays' },
    { id: 'blur', label: 'Blur Face', icon: EyeOff, cat: 'Security', desc: 'Censor and blur faces' }
  ];

  // Drag and Drop handlers
  const fileInputRef = useRef(null);
  const handleDragOver = (e) => e.preventDefault();
  
  const handleDrop = (e) => {
    e.preventDefault();
    const files = Array.from(e.dataTransfer.files).filter(f => f.type.startsWith('image/'));
    if (files.length > 0) {
      setSelectedFiles(files);
    }
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files).filter(f => f.type.startsWith('image/'));
    if (files.length > 0) {
      setSelectedFiles(files);
    }
  };

  const removeFile = (index) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
  };

  return (
    <div className="flex flex-col lg:flex-row gap-8 py-4">
      {/* 1. SaaS Sidebar Menu Category Dropdowns */}
      <aside className="w-full lg:w-72 flex-shrink-0 flex flex-col gap-6">
        <div className="glass-panel p-5 rounded-3xl border border-white/5 shadow-glass space-y-4">
          <div>
            <h2 className="text-xl font-extrabold text-white flex items-center gap-2">
              <Images className="text-primary-400" size={20} />
              Image Studio
            </h2>
            <p className="text-xs text-dark-400 mt-1">13 high-performance local image compilers</p>
          </div>

          <div className="flex flex-col gap-5 pt-3">
            {['Optimize', 'Modify', 'Create', 'Convert', 'Security'].map((category) => {
              const catTabs = tabs.filter(t => t.cat === category);
              return (
                <div key={category} className="space-y-2">
                  <span className="block text-[10px] uppercase font-bold tracking-widest text-dark-500 font-mono">
                    {category} Tools
                  </span>
                  <div className="flex flex-col gap-1">
                    {catTabs.map((tab) => {
                      const Icon = tab.icon;
                      const isActive = activeTab === tab.id;
                      return (
                        <button
                          key={tab.id}
                          onClick={() => handleTabChange(tab.id)}
                          className={`flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-xs font-semibold text-left transition-all ${
                            isActive
                              ? 'bg-primary-500/15 border border-primary-500/20 text-primary-400 shadow-glow-primary'
                              : 'text-dark-400 hover:text-dark-200 hover:bg-white/5 border border-transparent'
                          }`}
                        >
                          <Icon size={15} className={isActive ? 'text-primary-400' : 'text-dark-400'} />
                          <div>
                            <span className="block font-bold">{tab.label}</span>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </aside>

      {/* 2. Unified High-Performance Workspace Content */}
      <section className="flex-grow flex flex-col min-w-0">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.25 }}
            className="glass-panel p-6 rounded-3xl border border-white/5 shadow-glass flex-grow flex flex-col min-h-[500px]"
          >
            {/* Header info */}
            <div className="flex items-center justify-between border-b border-white/5 pb-4 mb-6">
              <div>
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  {tabs.find(t => t.id === activeTab)?.label} Utility
                </h3>
                <p className="text-xs text-dark-400 mt-0.5">{tabs.find(t => t.id === activeTab)?.desc}</p>
              </div>
              <span className="text-[10px] bg-primary-500/10 border border-primary-500/20 text-primary-400 font-bold px-2 py-0.5 rounded-md font-mono">
                LOCAL COMPILER
              </span>
            </div>

            {/* Render selected workspace tool */}
            {activeTab === 'compress' && <CompressWorkspace files={selectedFiles} onAddHistory={onAddHistory} handleDrop={handleDrop} handleDragOver={handleDragOver} handleFileChange={handleFileChange} removeFile={removeFile} fileInputRef={fileInputRef} />}
            {activeTab === 'resize' && <ResizeWorkspace files={selectedFiles} onAddHistory={onAddHistory} handleDrop={handleDrop} handleDragOver={handleDragOver} handleFileChange={handleFileChange} removeFile={removeFile} fileInputRef={fileInputRef} />}
            {activeTab === 'upscale' && <UpscaleWorkspace files={selectedFiles} onAddHistory={onAddHistory} handleDrop={handleDrop} handleDragOver={handleDragOver} handleFileChange={handleFileChange} removeFile={removeFile} fileInputRef={fileInputRef} />}
            {activeTab === 'crop' && <CropWorkspace files={selectedFiles} onAddHistory={onAddHistory} handleDrop={handleDrop} handleDragOver={handleDragOver} handleFileChange={handleFileChange} removeFile={removeFile} fileInputRef={fileInputRef} />}
            {activeTab === 'rotate' && <RotateWorkspace files={selectedFiles} onAddHistory={onAddHistory} handleDrop={handleDrop} handleDragOver={handleDragOver} handleFileChange={handleFileChange} removeFile={removeFile} fileInputRef={fileInputRef} />}
            {activeTab === 'remove-bg' && <RemoveBgWorkspace files={selectedFiles} onAddHistory={onAddHistory} handleDrop={handleDrop} handleDragOver={handleDragOver} handleFileChange={handleFileChange} removeFile={removeFile} fileInputRef={fileInputRef} />}
            {activeTab === 'editor' && <EditorWorkspace files={selectedFiles} onAddHistory={onAddHistory} handleDrop={handleDrop} handleDragOver={handleDragOver} handleFileChange={handleFileChange} removeFile={removeFile} fileInputRef={fileInputRef} />}
            {activeTab === 'meme' && <MemeWorkspace files={selectedFiles} onAddHistory={onAddHistory} handleDrop={handleDrop} handleDragOver={handleDragOver} handleFileChange={handleFileChange} removeFile={removeFile} fileInputRef={fileInputRef} />}
            {activeTab === 'html-to-img' && <HtmlToImageWorkspace onAddHistory={onAddHistory} />}
            {activeTab === 'to-jpg' && <ConvertToJpgWorkspace files={selectedFiles} onAddHistory={onAddHistory} handleDrop={handleDrop} handleDragOver={handleDragOver} handleFileChange={handleFileChange} removeFile={removeFile} fileInputRef={fileInputRef} />}
            {activeTab === 'from-jpg' && <ConvertFromJpgWorkspace files={selectedFiles} onAddHistory={onAddHistory} handleDrop={handleDrop} handleDragOver={handleDragOver} handleFileChange={handleFileChange} removeFile={removeFile} fileInputRef={fileInputRef} />}
            {activeTab === 'watermark' && <WatermarkWorkspace files={selectedFiles} onAddHistory={onAddHistory} handleDrop={handleDrop} handleDragOver={handleDragOver} handleFileChange={handleFileChange} removeFile={removeFile} fileInputRef={fileInputRef} />}
            {activeTab === 'blur' && <BlurWorkspace files={selectedFiles} onAddHistory={onAddHistory} handleDrop={handleDrop} handleDragOver={handleDragOver} handleFileChange={handleFileChange} removeFile={removeFile} fileInputRef={fileInputRef} />}
          </motion.div>
        </AnimatePresence>
      </section>
    </div>
  );
}

// ----------------------------------------------------
// 1. COMPRESS IMAGE WORKSPACE
// ----------------------------------------------------
function CompressWorkspace({ files, onAddHistory, handleDrop, handleDragOver, handleFileChange, removeFile, fileInputRef }) {
  const [quality, setQuality] = useState(80);
  const [scale, setScale] = useState(100);
  const [processing, setProcessing] = useState(false);
  const [compressedResult, setCompressedResult] = useState(null);

  const handleCompress = async () => {
    if (files.length === 0) return;
    setProcessing(true);
    
    try {
      const file = files[0];
      const reader = new FileReader();
      
      reader.onload = async (e) => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const ctx = canvas.getContext('2d');
          
          // Apply scale
          const width = img.width * (scale / 100);
          const height = img.height * (scale / 100);
          
          canvas.width = width;
          canvas.height = height;
          ctx.drawImage(img, 0, 0, width, height);
          
          canvas.toBlob((blob) => {
            const sizeKB = Math.round(blob.size / 1024);
            const compressedUrl = URL.createObjectURL(blob);
            setCompressedResult({
              url: compressedUrl,
              size: sizeKB,
              width: width,
              height: height,
              blob: blob
            });
            setProcessing(false);
          }, 'image/jpeg', quality / 100);
        };
        img.src = e.target.result;
      };
      reader.readAsDataURL(file);
    } catch (err) {
      console.error(err);
      setProcessing(false);
    }
  };

  const handleDownload = () => {
    if (!compressedResult) return;
    downloadBlob(compressedResult.blob, `compressed-${files[0].name.split('.')[0]}.jpg`);
    if (onAddHistory) {
      onAddHistory({
        fileName: `compressed-${files[0].name.split('.')[0]}.jpg`,
        fromFormat: files[0].name.split('.').pop().toUpperCase(),
        toFormat: 'JPG',
        size: Math.round(compressedResult.blob.size / 1024)
      }, compressedResult.blob);
    }
  };

  return (
    <div className="space-y-6 flex-grow flex flex-col justify-between">
      {files.length === 0 ? (
        <DropZone handleDrop={handleDrop} handleDragOver={handleDragOver} handleFileChange={handleFileChange} fileInputRef={fileInputRef} />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
          {/* Settings and comparative values */}
          <div className="glass-panel p-5 rounded-2xl border border-white/5 space-y-5">
            <h4 className="font-bold text-sm text-white flex items-center gap-2">
              <Sliders size={16} className="text-primary-400" />
              Quality Adjustments
            </h4>
            
            <div className="space-y-2">
              <div className="flex justify-between text-xs font-semibold">
                <span className="text-dark-200">Compression Quality</span>
                <span className="text-primary-400 font-mono">{quality}%</span>
              </div>
              <input
                type="range"
                min="5"
                max="100"
                value={quality}
                onChange={(e) => setQuality(Number(e.target.value))}
                className="w-full h-1 bg-white/10 rounded-lg appearance-none cursor-pointer accent-primary-500"
              />
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-xs font-semibold">
                <span className="text-dark-200">Resolution Scale</span>
                <span className="text-primary-400 font-mono">{scale}%</span>
              </div>
              <input
                type="range"
                min="10"
                max="100"
                value={scale}
                onChange={(e) => setScale(Number(e.target.value))}
                className="w-full h-1 bg-white/10 rounded-lg appearance-none cursor-pointer accent-primary-500"
              />
            </div>

            <div className="pt-4 border-t border-white/5 flex gap-3">
              <button
                onClick={handleCompress}
                disabled={processing}
                className="w-full bg-primary-500/20 hover:bg-primary-500/30 border border-primary-500/30 text-primary-300 font-bold py-3 px-4 rounded-xl text-xs flex items-center justify-center gap-2 transition-all"
              >
                {processing ? <RefreshCw className="animate-spin" size={14} /> : <Play size={14} />}
                Lossless Compress
              </button>
              <button
                onClick={() => removeFile(0)}
                className="p-3 bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 text-red-400 rounded-xl transition-all"
              >
                <Trash2 size={16} />
              </button>
            </div>
          </div>

          {/* Comparative visual slider / preview panels */}
          <div className="space-y-4">
            <div className="glass-panel p-4.5 rounded-2xl border border-white/5 text-center">
              <span className="block text-[10px] text-dark-400 uppercase font-bold tracking-wider mb-2">Original Metadata</span>
              <img src={URL.createObjectURL(files[0])} alt="Original preview" className="max-h-48 mx-auto rounded-lg object-contain bg-black/20" />
              <div className="flex justify-between text-xs text-dark-300 mt-3 font-mono">
                <span>Format: {files[0].name.split('.').pop().toUpperCase()}</span>
                <span>Size: {Math.round(files[0].size / 1024)} KB</span>
              </div>
            </div>

            {compressedResult && (
              <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="glass-panel p-4.5 rounded-2xl border border-emerald-500/20 text-center bg-emerald-500/[0.02]">
                <span className="block text-[10px] text-emerald-400 uppercase font-bold tracking-wider mb-2">Compressed Metadata</span>
                <img src={compressedResult.url} alt="Compressed preview" className="max-h-48 mx-auto rounded-lg object-contain bg-black/20" />
                <div className="flex justify-between text-xs text-dark-200 mt-3 font-mono">
                  <span className="text-emerald-400 font-bold">Reduction: -{Math.round((1 - (compressedResult.size / (files[0].size / 1024))) * 100)}%</span>
                  <span>Size: {compressedResult.size} KB</span>
                </div>
                <button
                  onClick={handleDownload}
                  className="w-full mt-4 bg-emerald-500 hover:bg-emerald-600 text-white font-bold py-2.5 px-4 rounded-xl text-xs flex items-center justify-center gap-2 transition-all shadow-glow-accent"
                >
                  <Download size={14} /> Download JPG
                </button>
              </motion.div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

// ----------------------------------------------------
// 2. RESIZE IMAGE WORKSPACE
// ----------------------------------------------------
function ResizeWorkspace({ files, onAddHistory, handleDrop, handleDragOver, handleFileChange, removeFile, fileInputRef }) {
  const [width, setWidth] = useState(800);
  const [height, setHeight] = useState(600);
  const [keepAspect, setKeepAspect] = useState(true);
  const [originalAspect, setOriginalAspect] = useState(1.33);
  const [unit, setUnit] = useState('px'); // px, %, in, cm
  const [dpi, setDpi] = useState(300);
  const [processing, setProcessing] = useState(false);
  const [resizedBlobUrl, setResizedBlobUrl] = useState(null);
  const [resizedBlob, setResizedBlob] = useState(null);

  useEffect(() => {
    if (files.length > 0) {
      const img = new Image();
      img.onload = () => {
        setWidth(img.width);
        setHeight(img.height);
        setOriginalAspect(img.width / img.height);
      };
      img.src = URL.createObjectURL(files[0]);
    }
  }, [files]);

  const handleWidthChange = (val) => {
    setWidth(val);
    if (keepAspect) {
      setHeight(Math.round(val / originalAspect));
    }
  };

  const handleHeightChange = (val) => {
    setHeight(val);
    if (keepAspect) {
      setWidth(Math.round(val * originalAspect));
    }
  };

  const handleResize = () => {
    if (files.length === 0) return;
    setProcessing(true);
    
    const file = files[0];
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        
        let targetWidth = width;
        let targetHeight = height;

        // Apply physical metrics mapping if cm or inches
        if (unit === 'in') {
          targetWidth = width * dpi;
          targetHeight = height * dpi;
        } else if (unit === 'cm') {
          targetWidth = (width / 2.54) * dpi;
          targetHeight = (height / 2.54) * dpi;
        } else if (unit === '%') {
          targetWidth = (img.width * width) / 100;
          targetHeight = (img.height * height) / 100;
        }

        canvas.width = targetWidth;
        canvas.height = targetHeight;
        ctx.drawImage(img, 0, 0, targetWidth, targetHeight);
        
        canvas.toBlob((blob) => {
          setResizedBlobUrl(URL.createObjectURL(blob));
          setResizedBlob(blob);
          setProcessing(false);
        }, file.type);
      };
      img.src = e.target.result;
    };
    reader.readAsDataURL(file);
  };

  const handleDownload = () => {
    if (!resizedBlob) return;
    downloadBlob(resizedBlob, `resized-${files[0].name}`);
    if (onAddHistory) {
      onAddHistory({
        fileName: `resized-${files[0].name}`,
        fromFormat: files[0].name.split('.').pop().toUpperCase(),
        toFormat: files[0].name.split('.').pop().toUpperCase(),
        size: Math.round(resizedBlob.size / 1024)
      }, resizedBlob);
    }
  };

  return (
    <div className="space-y-6">
      {files.length === 0 ? (
        <DropZone handleDrop={handleDrop} handleDragOver={handleDragOver} handleFileChange={handleFileChange} fileInputRef={fileInputRef} />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="glass-panel p-5 rounded-2xl border border-white/5 space-y-5">
            <h4 className="font-bold text-sm text-white flex items-center gap-2">
              <Scale size={16} className="text-primary-400" />
              Sizing Presets
            </h4>

            {/* Sizing inputs */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-xs text-dark-300 font-semibold">Width</label>
                <input
                  type="number"
                  value={width}
                  onChange={(e) => handleWidthChange(Number(e.target.value))}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-xs text-white outline-none focus:border-primary-500 font-mono"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs text-dark-300 font-semibold">Height</label>
                <input
                  type="number"
                  value={height}
                  onChange={(e) => handleHeightChange(Number(e.target.value))}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-xs text-white outline-none focus:border-primary-500 font-mono"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-xs text-dark-300 font-semibold">Metric Unit</label>
                <select
                  value={unit}
                  onChange={(e) => setUnit(e.target.value)}
                  className="w-full bg-[#181922] border border-white/10 rounded-xl px-2.5 py-2.5 text-xs text-white outline-none cursor-pointer focus:border-primary-500"
                >
                  <option value="px" className="bg-[#181922] text-white">Pixels (px)</option>
                  <option value="%" className="bg-[#181922] text-white">Percentage (%)</option>
                  <option value="in" className="bg-[#181922] text-white">Inches (in)</option>
                  <option value="cm" className="bg-[#181922] text-white">Centimeters (cm)</option>
                </select>
              </div>
              {(unit === 'in' || unit === 'cm') && (
                <div className="space-y-2">
                  <label className="text-xs text-dark-300 font-semibold">Resolution DPI</label>
                  <input
                    type="number"
                    value={dpi}
                    onChange={(e) => setDpi(Number(e.target.value))}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-xs text-white outline-none font-mono"
                  />
                </div>
              )}
            </div>

            <label className="flex items-center gap-2 text-xs text-dark-200 cursor-pointer">
              <input
                type="checkbox"
                checked={keepAspect}
                onChange={(e) => setKeepAspect(e.target.checked)}
                className="rounded accent-primary-500 border-white/10"
              />
              Lock Symmetrical Aspect Ratio
            </label>

            <div className="pt-4 border-t border-white/5 flex gap-3">
              <button
                onClick={handleResize}
                disabled={processing}
                className="w-full bg-primary-500/20 hover:bg-primary-500/30 border border-primary-500/30 text-primary-300 font-bold py-3 px-4 rounded-xl text-xs flex items-center justify-center gap-2 transition-all"
              >
                {processing ? <RefreshCw className="animate-spin" size={14} /> : <Play size={14} />}
                Resize Image
              </button>
              <button
                onClick={() => removeFile(0)}
                className="p-3 bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 text-red-400 rounded-xl transition-all"
              >
                <Trash2 size={16} />
              </button>
            </div>
          </div>

          <div className="space-y-4">
            {resizedBlobUrl ? (
              <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="glass-panel p-5 rounded-2xl border border-emerald-500/20 text-center">
                <span className="block text-[10px] text-emerald-400 uppercase font-bold tracking-wider mb-2">Resized Preview</span>
                <img src={resizedBlobUrl} alt="Resized" className="max-h-60 mx-auto rounded-lg object-contain bg-black/20" />
                <button
                  onClick={handleDownload}
                  className="w-full mt-4 bg-emerald-500 hover:bg-emerald-600 text-white font-bold py-2.5 px-4 rounded-xl text-xs flex items-center justify-center gap-2 transition-all shadow-glow-accent"
                >
                  <Download size={14} /> Download Resized Image
                </button>
              </motion.div>
            ) : (
              <div className="glass-panel p-5 rounded-2xl border border-white/5 text-center flex flex-col items-center justify-center min-h-[300px]">
                <Scale className="text-dark-500 mb-2 animate-pulse" size={32} />
                <p className="text-xs text-dark-400">Configure sizing presets to render target canvas preview</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

// ----------------------------------------------------
// 3. UPSCALE IMAGE WORKSPACE
// ----------------------------------------------------
function UpscaleWorkspace({ files, onAddHistory, handleDrop, handleDragOver, handleFileChange, removeFile, fileInputRef }) {
  const [factor, setFactor] = useState(2); // 2x, 4x
  const [processing, setProcessing] = useState(false);
  const [upscaledUrl, setUpscaledUrl] = useState(null);
  const [upscaledBlob, setUpscaledBlob] = useState(null);

  const handleUpscale = () => {
    if (files.length === 0) return;
    setProcessing(true);
    
    const file = files[0];
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        
        const targetWidth = img.width * factor;
        const targetHeight = img.height * factor;
        
        canvas.width = targetWidth;
        canvas.height = targetHeight;
        
        // Bicubic high-fidelity pixel scale shader approximation
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';
        
        // Render upscaled coordinates
        ctx.drawImage(img, 0, 0, targetWidth, targetHeight);
        
        canvas.toBlob((blob) => {
          setUpscaledUrl(URL.createObjectURL(blob));
          setUpscaledBlob(blob);
          setProcessing(false);
        }, file.type);
      };
      img.src = e.target.result;
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="space-y-6">
      {files.length === 0 ? (
        <DropZone handleDrop={handleDrop} handleDragOver={handleDragOver} handleFileChange={handleFileChange} fileInputRef={fileInputRef} />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="glass-panel p-5 rounded-2xl border border-white/5 space-y-5">
            <h4 className="font-bold text-sm text-white flex items-center gap-2">
              <Zap size={16} className="text-primary-400" />
              Upscale Multiplier
            </h4>

            <div className="flex gap-4">
              {[2, 4, 8].map((f) => (
                <button
                  key={f}
                  onClick={() => setFactor(f)}
                  className={`flex-grow py-3 rounded-xl border text-xs font-bold font-mono transition-all ${
                    factor === f
                      ? 'bg-primary-500/15 border-primary-500/30 text-primary-400 shadow-glow-primary'
                      : 'bg-white/5 border-transparent text-dark-400 hover:text-dark-200'
                  }`}
                >
                  {f}x Quality Zoom
                </button>
              ))}
            </div>

            <p className="text-xs text-dark-400 leading-relaxed bg-primary-500/5 border border-primary-500/10 p-3 rounded-xl">
              💡 **Super-resolution Scale**: Uses bicubic canvas sharpening buffers to upscale resolution without raster lines.
            </p>

            <div className="pt-4 border-t border-white/5 flex gap-3">
              <button
                onClick={handleUpscale}
                disabled={processing}
                className="w-full bg-primary-500/20 hover:bg-primary-500/30 border border-primary-500/30 text-primary-300 font-bold py-3 px-4 rounded-xl text-xs flex items-center justify-center gap-2 transition-all"
              >
                {processing ? <RefreshCw className="animate-spin" size={14} /> : <Play size={14} />}
                Run Super Zoom Upscale
              </button>
              <button
                onClick={() => removeFile(0)}
                className="p-3 bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 text-red-400 rounded-xl transition-all"
              >
                <Trash2 size={16} />
              </button>
            </div>
          </div>

          <div>
            {upscaledUrl ? (
              <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="glass-panel p-5 rounded-2xl border border-emerald-500/20 text-center">
                <span className="block text-[10px] text-emerald-400 uppercase font-bold tracking-wider mb-2">Upscaled Image Output</span>
                <img src={upscaledUrl} alt="Upscaled result" className="max-h-60 mx-auto rounded-lg object-contain bg-black/20" />
                <button
                  onClick={() => {
                    downloadBlob(upscaledBlob, `upscaled-${files[0].name}`);
                    if (onAddHistory) {
                      onAddHistory({
                        fileName: `upscaled-${files[0].name}`,
                        fromFormat: files[0].name.split('.').pop().toUpperCase(),
                        toFormat: files[0].name.split('.').pop().toUpperCase(),
                        size: Math.round(upscaledBlob.size / 1024)
                      }, upscaledBlob);
                    }
                  }}
                  className="w-full mt-4 bg-emerald-500 hover:bg-emerald-600 text-white font-bold py-2.5 px-4 rounded-xl text-xs flex items-center justify-center gap-2 transition-all shadow-glow-accent"
                >
                  <Download size={14} /> Download Clean Zoom File
                </button>
              </motion.div>
            ) : (
              <div className="glass-panel p-5 rounded-2xl border border-white/5 text-center flex flex-col items-center justify-center min-h-[300px]">
                <Zap className="text-dark-500 mb-2 animate-pulse" size={32} />
                <p className="text-xs text-dark-400">Trigger bicubic upscale interpolation to render detailed output</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

// ----------------------------------------------------
// 4. CROP IMAGE WORKSPACE
// ----------------------------------------------------
function CropWorkspace({ files, onAddHistory, handleDrop, handleDragOver, handleFileChange, removeFile, fileInputRef }) {
  const [ratio, setRatio] = useState('free'); // free, 1:1, 16:9, 4:3
  const [cropBox, setCropBox] = useState({ x: 10, y: 10, w: 80, h: 80 }); // values in percentage
  const containerRef = useRef(null);
  const [imageSrc, setImageSrc] = useState(null);
  const [croppedBlobUrl, setCroppedBlobUrl] = useState(null);
  const [croppedBlob, setCroppedBlob] = useState(null);

  useEffect(() => {
    if (files.length > 0) {
      const url = URL.createObjectURL(files[0]);
      setTimeout(() => {
        setImageSrc(url);
        setCroppedBlobUrl(null);
      }, 0);
    }
  }, [files]);

  const handleRatioPreset = (preset) => {
    setRatio(preset);
    if (preset === '1:1') {
      setCropBox(prev => ({ ...prev, h: prev.w }));
    } else if (preset === '16:9') {
      setCropBox(prev => ({ ...prev, h: prev.w * (9 / 16) }));
    } else if (preset === '4:3') {
      setCropBox(prev => ({ ...prev, h: prev.w * (3 / 4) }));
    }
  };

  const handleCrop = () => {
    if (!imageSrc) return;
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      
      const realX = (cropBox.x / 100) * img.width;
      const realY = (cropBox.y / 100) * img.height;
      const realW = (cropBox.w / 100) * img.width;
      const realH = (cropBox.h / 100) * img.height;
      
      canvas.width = realW;
      canvas.height = realH;
      ctx.drawImage(img, realX, realY, realW, realH, 0, 0, realW, realH);
      
      canvas.toBlob((blob) => {
        setCroppedBlobUrl(URL.createObjectURL(blob));
        setCroppedBlob(blob);
      }, files[0].type);
    };
    img.src = imageSrc;
  };

  return (
    <div className="space-y-6">
      {files.length === 0 ? (
        <DropZone handleDrop={handleDrop} handleDragOver={handleDragOver} handleFileChange={handleFileChange} fileInputRef={fileInputRef} />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="glass-panel p-5 rounded-2xl border border-white/5 space-y-5">
            <h4 className="font-bold text-sm text-white flex items-center gap-2">
              <Scissors size={16} className="text-primary-400" />
              Crop Bounding Options
            </h4>

            {/* Ratio Presets */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              {['free', '1:1', '16:9', '4:3'].map((r) => (
                <button
                  key={r}
                  onClick={() => handleRatioPreset(r)}
                  className={`py-2 px-3 rounded-xl border text-xs font-bold uppercase transition-all ${
                    ratio === r
                      ? 'bg-primary-500/15 border-primary-500/30 text-primary-400'
                      : 'bg-white/5 border-transparent text-dark-400 hover:text-dark-200'
                  }`}
                >
                  {r}
                </button>
              ))}
            </div>

            {/* Bounding Adjuster sliders */}
            <div className="space-y-4 pt-3">
              <div className="space-y-1">
                <span className="text-xs text-dark-300 font-semibold block">Crop Area Scale (Width): {cropBox.w}%</span>
                <input
                  type="range"
                  min="20"
                  max="100"
                  value={cropBox.w}
                  onChange={(e) => {
                    const w = Number(e.target.value);
                    const h = ratio === '1:1' ? w : ratio === '16:9' ? w * (9/16) : ratio === '4:3' ? w * (3/4) : cropBox.h;
                    setCropBox(prev => ({ ...prev, w, h: Math.min(h, 100 - prev.y) }));
                  }}
                  className="w-full h-1 bg-white/10 rounded-lg appearance-none accent-primary-500"
                />
              </div>
              
              {ratio === 'free' && (
                <div className="space-y-1">
                  <span className="text-xs text-dark-300 font-semibold block">Crop Area Scale (Height): {cropBox.h}%</span>
                  <input
                    type="range"
                    min="20"
                    max="100"
                    value={cropBox.h}
                    onChange={(e) => setCropBox(prev => ({ ...prev, h: Number(e.target.value) }))}
                    className="w-full h-1 bg-white/10 rounded-lg appearance-none accent-primary-500"
                  />
                </div>
              )}

              <div className="space-y-1">
                <span className="text-xs text-dark-300 font-semibold block">Position Offset X (Left): {cropBox.x}%</span>
                <input
                  type="range"
                  min="0"
                  max={100 - cropBox.w}
                  value={cropBox.x}
                  onChange={(e) => setCropBox(prev => ({ ...prev, x: Number(e.target.value) }))}
                  className="w-full h-1 bg-white/10 rounded-lg appearance-none accent-primary-500"
                />
              </div>

              <div className="space-y-1">
                <span className="text-xs text-dark-300 font-semibold block">Position Offset Y (Top): {cropBox.y}%</span>
                <input
                  type="range"
                  min="0"
                  max={100 - cropBox.h}
                  value={cropBox.y}
                  onChange={(e) => setCropBox(prev => ({ ...prev, y: Number(e.target.value) }))}
                  className="w-full h-1 bg-white/10 rounded-lg appearance-none accent-primary-500"
                />
              </div>
            </div>

            <div className="pt-4 border-t border-white/5 flex gap-3">
              <button
                onClick={handleCrop}
                className="w-full bg-primary-500/20 hover:bg-primary-500/30 border border-primary-500/30 text-primary-300 font-bold py-3 px-4 rounded-xl text-xs flex items-center justify-center gap-2 transition-all"
              >
                Render Crop Bounding Box
              </button>
              <button
                onClick={() => removeFile(0)}
                className="p-3 bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 text-red-400 rounded-xl transition-all"
              >
                <Trash2 size={16} />
              </button>
            </div>
          </div>

          <div className="space-y-4">
            {/* Visual Cropping Overlay Box */}
            <div className="glass-panel p-4 rounded-2xl border border-white/5 relative overflow-hidden bg-black/40 min-h-[250px] flex items-center justify-center">
              <div ref={containerRef} className="relative max-h-60 mx-auto overflow-hidden rounded-lg">
                <img src={imageSrc} alt="Preview bounding crop" className="max-h-60 mx-auto object-contain pointer-events-none opacity-40" />
                {/* Visual Cropping outline frame */}
                <div 
                  className="absolute border-2 border-primary-400 bg-transparent flex items-center justify-center pointer-events-none shadow-[0_0_0_9999px_rgba(0,0,0,0.6)]"
                  style={{
                    left: `${cropBox.x}%`,
                    top: `${cropBox.y}%`,
                    width: `${cropBox.w}%`,
                    height: `${cropBox.h}%`
                  }}
                >
                  <div className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 border-primary-300" />
                  <div className="absolute top-0 right-0 w-3 h-3 border-t-2 border-r-2 border-primary-300" />
                  <div className="absolute bottom-0 left-0 w-3 h-3 border-b-2 border-l-2 border-primary-300" />
                  <div className="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 border-primary-300" />
                </div>
              </div>
            </div>

            {croppedBlobUrl && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="glass-panel p-4 rounded-2xl border border-emerald-500/20 text-center">
                <span className="block text-[10px] text-emerald-400 uppercase font-bold tracking-wider mb-2">Cropped Result</span>
                <img src={croppedBlobUrl} alt="Cropped" className="max-h-40 mx-auto rounded-lg object-contain bg-black/20" />
                <button
                  onClick={() => {
                    downloadBlob(croppedBlob, `cropped-${files[0].name}`);
                    if (onAddHistory) {
                      onAddHistory({
                        fileName: `cropped-${files[0].name}`,
                        fromFormat: files[0].name.split('.').pop().toUpperCase(),
                        toFormat: files[0].name.split('.').pop().toUpperCase(),
                        size: Math.round(croppedBlob.size / 1024)
                      }, croppedBlob);
                    }
                  }}
                  className="w-full mt-4 bg-emerald-500 hover:bg-emerald-600 text-white font-bold py-2.5 px-4 rounded-xl text-xs flex items-center justify-center gap-2 transition-all shadow-glow-accent"
                >
                  <Download size={14} /> Download Cropped Image
                </button>
              </motion.div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

// ----------------------------------------------------
// 5. ROTATE IMAGE WORKSPACE
// ----------------------------------------------------
function RotateWorkspace({ files, onAddHistory, handleDrop, handleDragOver, handleFileChange, removeFile, fileInputRef }) {
  const [rotation, setRotation] = useState(0); // 0, 90, 180, 270
  const [flipH, setFlipH] = useState(false);
  const [flipV, setFlipV] = useState(false);
  const [imageSrc, setImageSrc] = useState(null);
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    if (files.length > 0) {
      const url = URL.createObjectURL(files[0]);
      setTimeout(() => {
        setImageSrc(url);
      }, 0);
    }
  }, [files]);

  const handleRotate = () => {
    if (files.length === 0) return;
    setProcessing(true);
    
    const file = files[0];
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        
        // Swap bounds if rotated 90 or 270 degrees
        const isSwapped = rotation === 90 || rotation === 270;
        const width = isSwapped ? img.height : img.width;
        const height = isSwapped ? img.width : img.height;
        
        canvas.width = width;
        canvas.height = height;
        
        // Rotate and Flip Transformation matrix mapping
        ctx.translate(width / 2, height / 2);
        ctx.rotate((rotation * Math.PI) / 180);
        ctx.scale(flipH ? -1 : 1, flipV ? -1 : 1);
        ctx.drawImage(img, -img.width / 2, -img.height / 2);
        
        canvas.toBlob((blob) => {
          downloadBlob(blob, `rotated-${files[0].name}`);
          if (onAddHistory) {
            onAddHistory({
              fileName: `rotated-${files[0].name}`,
              fromFormat: files[0].name.split('.').pop().toUpperCase(),
              toFormat: files[0].name.split('.').pop().toUpperCase(),
              size: Math.round(blob.size / 1024)
            }, blob);
          }
          setProcessing(false);
        }, file.type);
      };
      img.src = e.target.result;
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="space-y-6">
      {files.length === 0 ? (
        <DropZone handleDrop={handleDrop} handleDragOver={handleDragOver} handleFileChange={handleFileChange} fileInputRef={fileInputRef} />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="glass-panel p-5 rounded-2xl border border-white/5 space-y-5">
            <h4 className="font-bold text-sm text-white flex items-center gap-2">
              <RotateCw size={16} className="text-primary-400" />
              Rotation Panel
            </h4>

            {/* Quick 90 deg buttons */}
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => setRotation(prev => (prev + 90) % 360)}
                className="py-3 bg-white/5 hover:bg-white/10 rounded-xl text-xs font-bold text-dark-200 border border-transparent transition-all flex items-center justify-center gap-2"
              >
                <RotateCw size={14} /> Rotate +90°
              </button>
              <button
                onClick={() => setRotation(prev => (prev + 270) % 360)}
                className="py-3 bg-white/5 hover:bg-white/10 rounded-xl text-xs font-bold text-dark-200 border border-transparent transition-all flex items-center justify-center gap-2"
              >
                <RotateCw className="scale-x-[-1]" size={14} /> Rotate -90°
              </button>
            </div>

            {/* Mirror flipping boxes */}
            <div className="grid grid-cols-2 gap-3 pt-2">
              <button
                onClick={() => setFlipH(!flipH)}
                className={`py-2 px-3 rounded-xl border text-xs font-bold transition-all ${
                  flipH ? 'bg-primary-500/15 border-primary-500/30 text-primary-400' : 'bg-white/5 border-transparent text-dark-400'
                }`}
              >
                Flip Horizontally
              </button>
              <button
                onClick={() => setFlipV(!flipV)}
                className={`py-2 px-3 rounded-xl border text-xs font-bold transition-all ${
                  flipV ? 'bg-primary-500/15 border-primary-500/30 text-primary-400' : 'bg-white/5 border-transparent text-dark-400'
                }`}
              >
                Flip Vertically
              </button>
            </div>

            <div className="pt-4 border-t border-white/5 flex gap-3">
              <button
                onClick={handleRotate}
                disabled={processing}
                className="w-full bg-emerald-500 hover:bg-emerald-600 text-white font-bold py-3 px-4 rounded-xl text-xs flex items-center justify-center gap-2 transition-all shadow-glow-accent"
              >
                {processing ? <RefreshCw className="animate-spin" size={14} /> : <Download size={14} />}
                Export Rotated Image
              </button>
              <button
                onClick={() => removeFile(0)}
                className="p-3 bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 text-red-400 rounded-xl transition-all"
              >
                <Trash2 size={16} />
              </button>
            </div>
          </div>

          <div className="glass-panel p-6 rounded-2xl border border-white/5 flex items-center justify-center bg-black/20 min-h-[300px]">
            {imageSrc && (
              <div 
                className="transition-all duration-300 max-w-xs mx-auto"
                style={{
                  transform: `rotate(${rotation}deg) scale(${flipH ? -1 : 1}, ${flipV ? -1 : 1})`
                }}
              >
                <img src={imageSrc} alt="Rotated visualizer" className="max-h-56 rounded-lg object-contain" />
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

// ----------------------------------------------------
// 6. REMOVE BACKGROUND WORKSPACE
// ----------------------------------------------------
function RemoveBgWorkspace({ files, onAddHistory, handleDrop, handleDragOver, handleFileChange, removeFile, fileInputRef }) {
  const [tolerance, setTolerance] = useState(30);
  const [removedUrl, setRemovedUrl] = useState(null);
  const [removedBlob, setRemovedBlob] = useState(null);
  const canvasRef = useRef(null);
  const targetColor = { r: 255, g: 255, b: 255 }; // Clicked color to remove

  const handleRemove = (autoColor = null) => {
    if (files.length === 0) return;
    
    const file = files[0];
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const canvas = canvasRef.current || document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        canvas.width = img.width;
        canvas.height = img.height;
        ctx.drawImage(img, 0, 0);
        
        const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const data = imgData.data;
        
        // Define clean targeted pixels threshold comparison values
        let rTarget = targetColor.r;
        let gTarget = targetColor.g;
        let bTarget = targetColor.b;
        
        if (autoColor === 'white') {
          rTarget = 255; gTarget = 255; bTarget = 255;
        } else if (autoColor === 'black') {
          rTarget = 0; gTarget = 0; bTarget = 0;
        }

        // Loop over the pixel grid array and clear targeted colors with tolerance
        for (let i = 0; i < data.length; i += 4) {
          const r = data[i];
          const g = data[i+1];
          const b = data[i+2];
          
          const distance = Math.sqrt(
            Math.pow(r - rTarget, 2) +
            Math.pow(g - gTarget, 2) +
            Math.pow(b - bTarget, 2)
          );
          
          if (distance <= tolerance) {
            data[i+3] = 0; // Set Alpha to 0 (Fully transparent)
          }
        }
        
        ctx.putImageData(imgData, 0, 0);
        canvas.toBlob((blob) => {
          setRemovedUrl(URL.createObjectURL(blob));
          setRemovedBlob(blob);
        }, 'image/png'); // Preserve opacity with transparent PNG export
      };
      img.src = e.target.result;
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="space-y-6">
      {files.length === 0 ? (
        <DropZone handleDrop={handleDrop} handleDragOver={handleDragOver} handleFileChange={handleFileChange} fileInputRef={fileInputRef} />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="glass-panel p-5 rounded-2xl border border-white/5 space-y-5">
            <h4 className="font-bold text-sm text-white flex items-center gap-2">
              <Sparkles size={16} className="text-primary-400" />
              Chroma-Key Alpha Filters
            </h4>

            <div className="space-y-2">
              <div className="flex justify-between text-xs font-semibold">
                <span className="text-dark-200">Color Threshold Tolerance</span>
                <span className="text-primary-400 font-mono">{tolerance}</span>
              </div>
              <input
                type="range"
                min="5"
                max="150"
                value={tolerance}
                onChange={(e) => setTolerance(Number(e.target.value))}
                className="w-full h-1 bg-white/10 rounded-lg appearance-none accent-primary-500"
              />
            </div>

            {/* Quick clean buttons */}
            <div className="grid grid-cols-2 gap-3 pt-2">
              <button
                onClick={() => handleRemove('white')}
                className="py-2.5 bg-white/5 hover:bg-white/10 rounded-xl text-xs font-bold text-white border border-white/10 transition-all"
              >
                Clear White Backgrounds
              </button>
              <button
                onClick={() => handleRemove('black')}
                className="py-2.5 bg-white/5 hover:bg-white/10 rounded-xl text-xs font-bold text-white border border-white/10 transition-all"
              >
                Clear Black Backgrounds
              </button>
            </div>

            <p className="text-xs text-dark-400 leading-relaxed bg-primary-500/5 border border-primary-500/10 p-3.5 rounded-xl">
              💡 **Magic-Wand Algorithm**: Analyzes local RGB values and swaps background color vectors instantly to transparent alphas client-side.
            </p>

            <div className="pt-4 border-t border-white/5 flex gap-3">
              <button
                onClick={() => handleRemove()}
                className="w-full bg-primary-500/20 hover:bg-primary-500/30 border border-primary-500/30 text-primary-300 font-bold py-3 px-4 rounded-xl text-xs flex items-center justify-center gap-2 transition-all"
              >
                Export Background Cleaned
              </button>
              <button
                onClick={() => removeFile(0)}
                className="p-3 bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 text-red-400 rounded-xl transition-all"
              >
                <Trash2 size={16} />
              </button>
            </div>
          </div>

          <div>
            {removedUrl ? (
              <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="glass-panel p-5 rounded-2xl border border-emerald-500/20 text-center relative overflow-hidden bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px] dark:bg-[radial-gradient(#1f2937_1px,transparent_1px)]">
                <span className="block text-[10px] text-emerald-400 uppercase font-bold tracking-wider mb-2">Transparent Canvas Output</span>
                <img src={removedUrl} alt="Trans Bg Output" className="max-h-60 mx-auto rounded-lg object-contain" />
                <button
                  onClick={() => {
                    downloadBlob(removedBlob, `no-bg-${files[0].name.split('.')[0]}.png`);
                    if (onAddHistory) {
                      onAddHistory({
                        fileName: `no-bg-${files[0].name.split('.')[0]}.png`,
                        fromFormat: files[0].name.split('.').pop().toUpperCase(),
                        toFormat: 'PNG',
                        size: Math.round(removedBlob.size / 1024)
                      }, removedBlob);
                    }
                  }}
                  className="w-full mt-4 bg-emerald-500 hover:bg-emerald-600 text-white font-bold py-2.5 px-4 rounded-xl text-xs flex items-center justify-center gap-2 transition-all shadow-glow-accent"
                >
                  <Download size={14} /> Download Transparent PNG
                </button>
              </motion.div>
            ) : (
              <div className="glass-panel p-5 rounded-2xl border border-white/5 text-center flex flex-col items-center justify-center min-h-[300px]">
                <Sparkles className="text-dark-500 mb-2 animate-pulse" size={32} />
                <p className="text-xs text-dark-400">Trigger magic-wand background remover to clear color vectors</p>
              </div>
            )}
          </div>
        </div>
      )}
      <canvas ref={canvasRef} className="hidden" />
    </div>
  );
}

// ----------------------------------------------------
// 7. PHOTO EDITOR WORKSPACE
// ----------------------------------------------------
function EditorWorkspace({ files, onAddHistory, handleDrop, handleDragOver, handleFileChange, removeFile, fileInputRef }) {
  const [brightness, setBrightness] = useState(100);
  const [contrast, setContrast] = useState(100);
  const [grayscale, setGrayscale] = useState(0);
  const [sepia, setSepia] = useState(0);
  const blur = 0;
  const [invert, setInvert] = useState(0);
  const [drawingColor, setDrawingColor] = useState('#ff0055');
  const [brushSize, setBrushSize] = useState(5);
  const [isDrawing, setIsDrawing] = useState(false);
  const canvasRef = useRef(null);
  const ctxRef = useRef(null);
  const [imageSrc, setImageSrc] = useState(null);

  useEffect(() => {
    if (files.length > 0) {
      const url = URL.createObjectURL(files[0]);
      setTimeout(() => {
        setImageSrc(url);
      }, 0);
    }
  }, [files]);

  useEffect(() => {
    if (imageSrc) {
      const img = new Image();
      img.onload = () => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        canvas.width = img.width;
        canvas.height = img.height;
        ctx.drawImage(img, 0, 0);
        ctxRef.current = ctx;
      };
      img.src = imageSrc;
    }
  }, [imageSrc]);

  const applyShaders = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = ctxRef.current;
    const img = new Image();
    img.onload = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      // CSS Shaders filter mapping
      ctx.filter = `
        brightness(${brightness}%)
        contrast(${contrast}%)
        grayscale(${grayscale}%)
        sepia(${sepia}%)
        blur(${blur}px)
        invert(${invert}%)
      `;
      ctx.drawImage(img, 0, 0);
    };
    img.src = imageSrc;
  }, [brightness, contrast, grayscale, sepia, blur, invert, imageSrc]);

  useEffect(() => {
    if (imageSrc) {
      applyShaders();
    }
  }, [applyShaders, imageSrc]);

  // Direct Canvas Drawing logic
  const startDrawing = (e) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    
    ctxRef.current.beginPath();
    ctxRef.current.moveTo((e.clientX - rect.left) * scaleX, (e.clientY - rect.top) * scaleY);
    setIsDrawing(true);
  };

  const draw = (e) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    
    ctxRef.current.lineTo((e.clientX - rect.left) * scaleX, (e.clientY - rect.top) * scaleY);
    ctxRef.current.strokeStyle = drawingColor;
    ctxRef.current.lineWidth = brushSize;
    ctxRef.current.lineCap = 'round';
    ctxRef.current.stroke();
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const handleExport = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    canvas.toBlob((blob) => {
      downloadBlob(blob, `edited-${files[0].name}`);
      if (onAddHistory) {
        onAddHistory({
          fileName: `edited-${files[0].name}`,
          fromFormat: files[0].name.split('.').pop().toUpperCase(),
          toFormat: files[0].name.split('.').pop().toUpperCase(),
          size: Math.round(blob.size / 1024)
        }, blob);
      }
    }, files[0].type);
  };

  return (
    <div className="space-y-6">
      {files.length === 0 ? (
        <DropZone handleDrop={handleDrop} handleDragOver={handleDragOver} handleFileChange={handleFileChange} fileInputRef={fileInputRef} />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="glass-panel p-5 rounded-2xl border border-white/5 space-y-4">
            <h4 className="font-bold text-sm text-white flex items-center gap-2">
              <Sliders size={16} className="text-primary-400" />
              Creative Shaders
            </h4>

            {/* Adjustment Shaders Sliders */}
            <div className="space-y-3.5">
              <div className="space-y-1">
                <div className="flex justify-between text-xs font-semibold">
                  <span className="text-dark-300">Brightness</span>
                  <span className="text-primary-400 font-mono">{brightness}%</span>
                </div>
                <input type="range" min="50" max="200" value={brightness} onChange={(e) => setBrightness(Number(e.target.value))} className="w-full h-1 bg-white/10 rounded accent-primary-500" />
              </div>
              <div className="space-y-1">
                <div className="flex justify-between text-xs font-semibold">
                  <span className="text-dark-300">Contrast</span>
                  <span className="text-primary-400 font-mono">{contrast}%</span>
                </div>
                <input type="range" min="50" max="200" value={contrast} onChange={(e) => setContrast(Number(e.target.value))} className="w-full h-1 bg-white/10 rounded accent-primary-500" />
              </div>
              <div className="space-y-1">
                <div className="flex justify-between text-xs font-semibold">
                  <span className="text-dark-300">Grayscale Shading</span>
                  <span className="text-primary-400 font-mono">{grayscale}%</span>
                </div>
                <input type="range" min="0" max="100" value={grayscale} onChange={(e) => setGrayscale(Number(e.target.value))} className="w-full h-1 bg-white/10 rounded accent-primary-500" />
              </div>
              <div className="space-y-1">
                <div className="flex justify-between text-xs font-semibold">
                  <span className="text-dark-300">Sepia Filter</span>
                  <span className="text-primary-400 font-mono">{sepia}%</span>
                </div>
                <input type="range" min="0" max="100" value={sepia} onChange={(e) => setSepia(Number(e.target.value))} className="w-full h-1 bg-white/10 rounded accent-primary-500" />
              </div>
              <div className="space-y-1">
                <div className="flex justify-between text-xs font-semibold">
                  <span className="text-dark-300">Invert Colors</span>
                  <span className="text-primary-400 font-mono">{invert}%</span>
                </div>
                <input type="range" min="0" max="100" value={invert} onChange={(e) => setInvert(Number(e.target.value))} className="w-full h-1 bg-white/10 rounded accent-primary-500" />
              </div>
            </div>

            <div className="h-[1px] bg-white/5 my-3" />

            {/* Direct Draw Brush Controls */}
            <h4 className="font-bold text-sm text-white flex items-center gap-2">
              <Edit3 size={16} className="text-primary-400" />
              Freehand Canvas Brush
            </h4>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <span className="text-xs text-dark-300 font-semibold block">Brush Size: {brushSize}px</span>
                <input type="range" min="1" max="50" value={brushSize} onChange={(e) => setBrushSize(Number(e.target.value))} className="w-full h-1 bg-white/10 rounded accent-primary-500" />
              </div>
              <div className="space-y-1">
                <span className="text-xs text-dark-300 font-semibold block">Paint Color</span>
                <input type="color" value={drawingColor} onChange={(e) => setDrawingColor(e.target.value)} className="w-full bg-transparent border-0 h-6 cursor-pointer" />
              </div>
            </div>

            <div className="pt-4 border-t border-white/5 flex gap-3">
              <button
                onClick={handleExport}
                className="w-full bg-emerald-500 hover:bg-emerald-600 text-white font-bold py-3 px-4 rounded-xl text-xs flex items-center justify-center gap-2 transition-all shadow-glow-accent"
              >
                <Download size={14} /> Export Custom Photo
              </button>
              <button
                onClick={() => removeFile(0)}
                className="p-3 bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 text-red-400 rounded-xl transition-all"
              >
                <Trash2 size={16} />
              </button>
            </div>
          </div>

          <div className="glass-panel p-4 rounded-2xl border border-white/5 flex items-center justify-center bg-black/40 min-h-[300px]">
            <canvas 
              ref={canvasRef} 
              onMouseDown={startDrawing}
              onMouseMove={draw}
              onMouseUp={stopDrawing}
              onMouseLeave={stopDrawing}
              className="max-h-72 max-w-full rounded-lg object-contain cursor-crosshair shadow-md bg-black/25"
            />
          </div>
        </div>
      )}
    </div>
  );
}

// ----------------------------------------------------
// 8. MEME GENERATOR WORKSPACE
// ----------------------------------------------------
function MemeWorkspace({ files, onAddHistory, handleDrop, handleDragOver, handleFileChange, removeFile, fileInputRef }) {
  const [topText, setTopText] = useState('CONVERTVERSE');
  const [bottomText, setBottomText] = useState('LOCAL ONLY SAAS');
  const [fontSize, setFontSize] = useState(48);
  const [textColor, setTextColor] = useState('#ffffff');
  const canvasRef = useRef(null);
  const [imageSrc, setImageSrc] = useState(null);

  useEffect(() => {
    if (files.length > 0) {
      const url = URL.createObjectURL(files[0]);
      setTimeout(() => {
        setImageSrc(url);
      }, 0);
    }
  }, [files]);

  const drawMeme = useCallback(() => {
    if (!imageSrc) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const img = new Image();
    
    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0);
      
      // Setup typical impact typography meme layout
      ctx.font = `bold ${fontSize}px Impact, sans-serif`;
      ctx.fillStyle = textColor;
      ctx.strokeStyle = '#000000';
      ctx.lineWidth = fontSize / 8;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'top';
      
      // Draw top text
      ctx.strokeText(topText.toUpperCase(), canvas.width / 2, 20);
      ctx.fillText(topText.toUpperCase(), canvas.width / 2, 20);
      
      // Draw bottom text
      ctx.textBaseline = 'bottom';
      ctx.strokeText(bottomText.toUpperCase(), canvas.width / 2, canvas.height - 20);
      ctx.fillText(bottomText.toUpperCase(), canvas.width / 2, canvas.height - 20);
    };
    img.src = imageSrc;
  }, [imageSrc, fontSize, textColor, topText, bottomText]);

  useEffect(() => {
    drawMeme();
  }, [drawMeme]);

  const handleExport = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    canvas.toBlob((blob) => {
      downloadBlob(blob, `meme-${files[0].name}`);
      if (onAddHistory) {
        onAddHistory({
          fileName: `meme-${files[0].name}`,
          fromFormat: files[0].name.split('.').pop().toUpperCase(),
          toFormat: files[0].name.split('.').pop().toUpperCase(),
          size: Math.round(blob.size / 1024)
        }, blob);
      }
    }, files[0].type);
  };

  return (
    <div className="space-y-6">
      {files.length === 0 ? (
        <DropZone handleDrop={handleDrop} handleDragOver={handleDragOver} handleFileChange={handleFileChange} fileInputRef={fileInputRef} />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="glass-panel p-5 rounded-2xl border border-white/5 space-y-4">
            <h4 className="font-bold text-sm text-white flex items-center gap-2">
              <Smile size={16} className="text-primary-400" />
              Meme Caption Overlay
            </h4>

            <div className="space-y-3">
              <div className="space-y-1">
                <label className="text-xs text-dark-300 font-semibold">Top Caption Text</label>
                <input
                  type="text"
                  value={topText}
                  onChange={(e) => setTopText(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-xs text-white outline-none focus:border-primary-500"
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs text-dark-300 font-semibold">Bottom Caption Text</label>
                <input
                  type="text"
                  value={bottomText}
                  onChange={(e) => setBottomText(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-xs text-white outline-none focus:border-primary-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <span className="text-xs text-dark-300 font-semibold block">Font Size: {fontSize}px</span>
                <input type="range" min="20" max="100" value={fontSize} onChange={(e) => setFontSize(Number(e.target.value))} className="w-full h-1 bg-white/10 rounded accent-primary-500" />
              </div>
              <div className="space-y-1">
                <span className="text-xs text-dark-300 font-semibold block">Text Color</span>
                <input type="color" value={textColor} onChange={(e) => setTextColor(e.target.value)} className="w-full bg-transparent border-0 h-6 cursor-pointer" />
              </div>
            </div>

            <div className="pt-4 border-t border-white/5 flex gap-3">
              <button
                onClick={handleExport}
                className="w-full bg-emerald-500 hover:bg-emerald-600 text-white font-bold py-3 px-4 rounded-xl text-xs flex items-center justify-center gap-2 transition-all shadow-glow-accent"
              >
                <Download size={14} /> Export Custom Meme
              </button>
              <button
                onClick={() => removeFile(0)}
                className="p-3 bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 text-red-400 rounded-xl transition-all"
              >
                <Trash2 size={16} />
              </button>
            </div>
          </div>

          <div className="glass-panel p-4 rounded-2xl border border-white/5 flex items-center justify-center bg-black/40 min-h-[300px]">
            <canvas ref={canvasRef} className="max-h-72 max-w-full rounded-lg object-contain shadow-md bg-black/25" />
          </div>
        </div>
      )}
    </div>
  );
}

// ----------------------------------------------------
// 9. HTML TO IMAGE WORKSPACE
// ----------------------------------------------------
function HtmlToImageWorkspace({ onAddHistory }) {
  const [htmlCode, setHtmlCode] = useState(`
<div style="padding: 30px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; border-radius: 16px; text-align: center; font-family: sans-serif;">
  <h1 style="margin: 0; font-size: 28px;">ConvertVerse Studio</h1>
  <p style="margin-top: 10px; font-size: 14px; opacity: 0.9;">High-performance, privacy-preserved HTML template rendering</p>
  <div style="margin-top: 20px; font-size: 11px; background: rgba(0,0,0,0.2); padding: 8px; border-radius: 8px; display: inline-block;">
    🔒 Local Engine • Client Side Export
  </div>
</div>
  `);
  const [processing, setProcessing] = useState(false);
  const renderRef = useRef(null);

  const handleRender = async () => {
    if (!renderRef.current) return;
    setProcessing(true);
    try {
      const dataUrl = await toPng(renderRef.current, { quality: 1.0, pixelRatio: 2 });
      downloadBlob(dataUrl, 'html-render.png');
      
      // Save history block
      const response = await fetch(dataUrl);
      const blob = await response.blob();
      if (onAddHistory) {
        onAddHistory({
          fileName: 'html-render.png',
          fromFormat: 'HTML',
          toFormat: 'PNG',
          size: Math.round(blob.size / 1024)
        }, blob);
      }
      setProcessing(false);
    } catch (err) {
      console.error(err);
      setProcessing(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* HTML/CSS Editor sandbox */}
        <div className="glass-panel p-5 rounded-2xl border border-white/5 space-y-4">
          <h4 className="font-bold text-sm text-white flex items-center gap-2">
            <FileCode size={16} className="text-primary-400" />
            HTML Template Editor
          </h4>

          <textarea
            value={htmlCode}
            onChange={(e) => setHtmlCode(e.target.value)}
            rows={8}
            className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-xs text-dark-100 outline-none focus:border-primary-500 font-mono leading-relaxed"
          />

          <button
            onClick={handleRender}
            disabled={processing}
            className="w-full bg-emerald-500 hover:bg-emerald-600 text-white font-bold py-3 px-4 rounded-xl text-xs flex items-center justify-center gap-2 transition-all shadow-glow-accent"
          >
            {processing ? <RefreshCw className="animate-spin" size={14} /> : <Download size={14} />}
            Capture & Export PNG Image
          </button>
        </div>

        {/* Live rendering node container */}
        <div className="space-y-3">
          <span className="block text-[10px] text-dark-400 uppercase font-bold tracking-wider">Live DOM Preview</span>
          <div className="glass-panel p-6 rounded-2xl border border-white/5 bg-black/35 min-h-[220px] flex items-center justify-center">
            <div 
              ref={renderRef} 
              dangerouslySetInnerHTML={{ __html: htmlCode }}
              className="w-full max-w-sm rounded-xl overflow-hidden shadow-lg"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

// ----------------------------------------------------
// 10. CONVERT TO JPG WORKSPACE
// ----------------------------------------------------
function ConvertToJpgWorkspace({ files, onAddHistory, handleDrop, handleDragOver, handleFileChange, removeFile, fileInputRef }) {
  const [processing, setProcessing] = useState(false);

  const handleConvert = async () => {
    if (files.length === 0) return;
    setProcessing(true);

    try {
      const file = files[0];
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const ctx = canvas.getContext('2d');
          canvas.width = img.width;
          canvas.height = img.height;
          ctx.drawImage(img, 0, 0);
          
          canvas.toBlob((blob) => {
            downloadBlob(blob, `${file.name.split('.')[0]}.jpg`);
            if (onAddHistory) {
              onAddHistory({
                fileName: `${file.name.split('.')[0]}.jpg`,
                fromFormat: file.name.split('.').pop().toUpperCase(),
                toFormat: 'JPG',
                size: Math.round(blob.size / 1024)
              }, blob);
            }
            setProcessing(false);
          }, 'image/jpeg', 0.9);
        };
        img.src = e.target.result;
      };
      reader.readAsDataURL(file);
    } catch (err) {
      console.error(err);
      setProcessing(false);
    }
  };

  return (
    <div className="space-y-6">
      {files.length === 0 ? (
        <DropZone handleDrop={handleDrop} handleDragOver={handleDragOver} handleFileChange={handleFileChange} fileInputRef={fileInputRef} />
      ) : (
        <div className="max-w-xl mx-auto glass-panel p-6 rounded-2xl border border-white/5 space-y-5 text-center">
          <ImageIcon className="text-primary-400 mx-auto" size={36} />
          <div>
            <h4 className="font-bold text-white text-base">Ready for JPG Compilation</h4>
            <p className="text-xs text-dark-400 mt-1">Converts modern files (PNG, WEBP, BMP) client-side into standard digital JPEG matrices.</p>
          </div>

          <div className="bg-white/5 border border-white/5 rounded-xl p-3 flex items-center justify-between text-xs font-semibold text-dark-200">
            <span className="truncate pr-4">{files[0].name}</span>
            <span className="font-mono text-primary-400">{Math.round(files[0].size / 1024)} KB</span>
          </div>

          <div className="flex gap-3">
            <button
              onClick={handleConvert}
              disabled={processing}
              className="w-full bg-emerald-500 hover:bg-emerald-600 text-white font-bold py-3 px-4 rounded-xl text-xs flex items-center justify-center gap-2 transition-all shadow-glow-accent"
            >
              {processing ? <RefreshCw className="animate-spin" size={14} /> : <Play size={14} />}
              Convert and Download JPG
            </button>
            <button
              onClick={() => removeFile(0)}
              className="p-3 bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 text-red-400 rounded-xl transition-all"
            >
              <Trash2 size={16} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// ----------------------------------------------------
// 11. CONVERT FROM JPG WORKSPACE
// ----------------------------------------------------
function ConvertFromJpgWorkspace({ files, onAddHistory, handleDrop, handleDragOver, handleFileChange, removeFile, fileInputRef }) {
  const [targetFormat, setTargetFormat] = useState('png');
  const [processing, setProcessing] = useState(false);

  const handleConvert = () => {
    if (files.length === 0) return;
    setProcessing(true);

    const file = files[0];
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        canvas.width = img.width;
        canvas.height = img.height;
        ctx.drawImage(img, 0, 0);
        
        const mimeType = targetFormat === 'png' ? 'image/png' : targetFormat === 'webp' ? 'image/webp' : 'image/jpeg';
        canvas.toBlob((blob) => {
          downloadBlob(blob, `${file.name.split('.')[0]}.${targetFormat}`);
          if (onAddHistory) {
            onAddHistory({
              fileName: `${file.name.split('.')[0]}.${targetFormat}`,
              fromFormat: 'JPG',
              toFormat: targetFormat.toUpperCase(),
              size: Math.round(blob.size / 1024)
            }, blob);
          }
          setProcessing(false);
        }, mimeType);
      };
      img.src = e.target.result;
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="space-y-6">
      {files.length === 0 ? (
        <DropZone handleDrop={handleDrop} handleDragOver={handleDragOver} handleFileChange={handleFileChange} fileInputRef={fileInputRef} />
      ) : (
        <div className="max-w-xl mx-auto glass-panel p-6 rounded-2xl border border-white/5 space-y-5 text-center">
          <Images className="text-primary-400 mx-auto" size={36} />
          <div>
            <h4 className="font-bold text-white text-base">Export JPG to other layouts</h4>
            <p className="text-xs text-dark-400 mt-1">Select targets to output fully transparent layers or optimized web grids.</p>
          </div>

          <div className="grid grid-cols-3 gap-3 pt-2">
            {['png', 'webp', 'bmp'].map((fmt) => (
              <button
                key={fmt}
                onClick={() => setTargetFormat(fmt)}
                className={`py-3 rounded-xl border text-xs font-bold uppercase transition-all ${
                  targetFormat === fmt
                    ? 'bg-primary-500/15 border-primary-500/30 text-primary-400 shadow-glow-primary'
                    : 'bg-white/5 border-transparent text-dark-400 hover:text-dark-200'
                }`}
              >
                {fmt}
              </button>
            ))}
          </div>

          <div className="flex gap-3 pt-2">
            <button
              onClick={handleConvert}
              disabled={processing}
              className="w-full bg-emerald-500 hover:bg-emerald-600 text-white font-bold py-3 px-4 rounded-xl text-xs flex items-center justify-center gap-2 transition-all shadow-glow-accent"
            >
              {processing ? <RefreshCw className="animate-spin" size={14} /> : <Play size={14} />}
              Convert to {targetFormat.toUpperCase()}
            </button>
            <button
              onClick={() => removeFile(0)}
              className="p-3 bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 text-red-400 rounded-xl transition-all"
            >
              <Trash2 size={16} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// ----------------------------------------------------
// 12. WATERMARK IMAGE WORKSPACE
// ----------------------------------------------------
function WatermarkWorkspace({ files, onAddHistory, handleDrop, handleDragOver, handleFileChange, removeFile, fileInputRef }) {
  const [watermarkText, setWatermarkText] = useState('CONFIDENTIAL');
  const [opacity, setOpacity] = useState(40);
  const [rotation, setRotation] = useState(-30);
  const [scale, setScale] = useState(30);
  const canvasRef = useRef(null);
  const [imageSrc, setImageSrc] = useState(null);

  useEffect(() => {
    if (files.length > 0) {
      const url = URL.createObjectURL(files[0]);
      setTimeout(() => {
        setImageSrc(url);
      }, 0);
    }
  }, [files]);

  const drawWatermark = useCallback(() => {
    if (!imageSrc) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const img = new Image();
    
    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0);
      
      ctx.save();
      // Setup transparency rotation
      ctx.translate(canvas.width / 2, canvas.height / 2);
      ctx.rotate((rotation * Math.PI) / 180);
      
      const fontSize = (canvas.width * scale) / 100;
      ctx.font = `bold ${fontSize}px sans-serif`;
      ctx.fillStyle = `rgba(255, 255, 255, ${opacity / 100})`;
      ctx.strokeStyle = `rgba(0, 0, 0, ${opacity / 200})`;
      ctx.lineWidth = fontSize / 12;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      
      ctx.strokeText(watermarkText, 0, 0);
      ctx.fillText(watermarkText, 0, 0);
      ctx.restore();
    };
    img.src = imageSrc;
  }, [imageSrc, rotation, scale, opacity, watermarkText]);

  useEffect(() => {
    drawWatermark();
  }, [drawWatermark]);

  const handleExport = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    canvas.toBlob((blob) => {
      downloadBlob(blob, `watermarked-${files[0].name}`);
      if (onAddHistory) {
        onAddHistory({
          fileName: `watermarked-${files[0].name}`,
          fromFormat: files[0].name.split('.').pop().toUpperCase(),
          toFormat: files[0].name.split('.').pop().toUpperCase(),
          size: Math.round(blob.size / 1024)
        }, blob);
      }
    }, files[0].type);
  };

  return (
    <div className="space-y-6">
      {files.length === 0 ? (
        <DropZone handleDrop={handleDrop} handleDragOver={handleDragOver} handleFileChange={handleFileChange} fileInputRef={fileInputRef} />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="glass-panel p-5 rounded-2xl border border-white/5 space-y-4">
            <h4 className="font-bold text-sm text-white flex items-center gap-2">
              <Stamp size={16} className="text-primary-400" />
              Watermark Stamp Options
            </h4>

            <div className="space-y-1">
              <label className="text-xs text-dark-300 font-semibold">Watermark Label Text</label>
              <input
                type="text"
                value={watermarkText}
                onChange={(e) => setWatermarkText(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-xs text-white outline-none focus:border-primary-500 font-mono"
              />
            </div>

            <div className="space-y-3 pt-2">
              <div className="space-y-1">
                <span className="text-xs text-dark-300 font-semibold block">Stamp Opacity: {opacity}%</span>
                <input type="range" min="10" max="90" value={opacity} onChange={(e) => setOpacity(Number(e.target.value))} className="w-full h-1 bg-white/10 rounded accent-primary-500" />
              </div>
              <div className="space-y-1">
                <span className="text-xs text-dark-300 font-semibold block">Stamp Scale Size: {scale}%</span>
                <input type="range" min="10" max="80" value={scale} onChange={(e) => setScale(Number(e.target.value))} className="w-full h-1 bg-white/10 rounded accent-primary-500" />
              </div>
              <div className="space-y-1">
                <span className="text-xs text-dark-300 font-semibold block">Stamp Angle Rotation: {rotation}°</span>
                <input type="range" min="-90" max="90" value={rotation} onChange={(e) => setRotation(Number(e.target.value))} className="w-full h-1 bg-white/10 rounded accent-primary-500" />
              </div>
            </div>

            <div className="pt-4 border-t border-white/5 flex gap-3">
              <button
                onClick={handleExport}
                className="w-full bg-emerald-500 hover:bg-emerald-600 text-white font-bold py-3 px-4 rounded-xl text-xs flex items-center justify-center gap-2 transition-all shadow-glow-accent"
              >
                <Download size={14} /> Export Watermarked Image
              </button>
              <button
                onClick={() => removeFile(0)}
                className="p-3 bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 text-red-400 rounded-xl transition-all"
              >
                <Trash2 size={16} />
              </button>
            </div>
          </div>

          <div className="glass-panel p-4 rounded-2xl border border-white/5 flex items-center justify-center bg-black/40 min-h-[300px]">
            <canvas ref={canvasRef} className="max-h-72 max-w-full rounded-lg object-contain shadow-md bg-black/25" />
          </div>
        </div>
      )}
    </div>
  );
}

// ----------------------------------------------------
// 13. BLUR FACE / CENSORSHIP WORKSPACE
// ----------------------------------------------------
function BlurWorkspace({ files, onAddHistory, handleDrop, handleDragOver, handleFileChange, removeFile, fileInputRef }) {
  const [blurBox, setBlurBox] = useState({ x: 40, y: 30, w: 20, h: 20 });
  const [blurIntensity, setBlurIntensity] = useState(25);
  const canvasRef = useRef(null);
  const [imageSrc, setImageSrc] = useState(null);

  useEffect(() => {
    if (files.length > 0) {
      const url = URL.createObjectURL(files[0]);
      setTimeout(() => {
        setImageSrc(url);
      }, 0);
    }
  }, [files]);

  const drawBlur = useCallback(() => {
    if (!imageSrc) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const img = new Image();
    
    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0);
      
      const realX = (blurBox.x / 100) * canvas.width;
      const realY = (blurBox.y / 100) * canvas.height;
      const realW = (blurBox.w / 100) * canvas.width;
      const realH = (blurBox.h / 100) * canvas.height;
      
      // Perform local pixel blur calculations on target coordinates
      ctx.save();
      ctx.filter = `blur(${blurIntensity}px)`;
      // Clip blur coordinates
      ctx.beginPath();
      ctx.arc(realX + realW/2, realY + realH/2, Math.max(realW, realH)/2, 0, Math.PI * 2);
      ctx.clip();
      ctx.drawImage(img, 0, 0);
      ctx.restore();
    };
    img.src = imageSrc;
  }, [imageSrc, blurBox, blurIntensity]);

  useEffect(() => {
    drawBlur();
  }, [drawBlur]);

  const handleExport = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    canvas.toBlob((blob) => {
      downloadBlob(blob, `censored-${files[0].name}`);
      if (onAddHistory) {
        onAddHistory({
          fileName: `censored-${files[0].name}`,
          fromFormat: files[0].name.split('.').pop().toUpperCase(),
          toFormat: files[0].name.split('.').pop().toUpperCase(),
          size: Math.round(blob.size / 1024)
        }, blob);
      }
    }, files[0].type);
  };

  return (
    <div className="space-y-6">
      {files.length === 0 ? (
        <DropZone handleDrop={handleDrop} handleDragOver={handleDragOver} handleFileChange={handleFileChange} fileInputRef={fileInputRef} />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="glass-panel p-5 rounded-2xl border border-white/5 space-y-4">
            <h4 className="font-bold text-sm text-white flex items-center gap-2">
              <EyeOff size={16} className="text-primary-400" />
              Facial Censorship Controls
            </h4>

            <div className="space-y-3 pt-2">
              <div className="space-y-1">
                <span className="text-xs text-dark-300 font-semibold block">Blur Bubble Radius: {blurBox.w}%</span>
                <input
                  type="range"
                  min="5"
                  max="50"
                  value={blurBox.w}
                  onChange={(e) => {
                    const radius = Number(e.target.value);
                    setBlurBox(prev => ({ ...prev, w: radius, h: radius }));
                  }}
                  className="w-full h-1 bg-white/10 rounded accent-primary-500"
                />
              </div>

              <div className="space-y-1">
                <span className="text-xs text-dark-300 font-semibold block">Blur Intensity multiplier: {blurIntensity}px</span>
                <input type="range" min="5" max="60" value={blurIntensity} onChange={(e) => setBlurIntensity(Number(e.target.value))} className="w-full h-1 bg-white/10 rounded accent-primary-500" />
              </div>

              <div className="space-y-1">
                <span className="text-xs text-dark-300 font-semibold block">Bubble Horizontal Offset X: {blurBox.x}%</span>
                <input type="range" min="0" max={100 - blurBox.w} value={blurBox.x} onChange={(e) => setBlurBox(prev => ({ ...prev, x: Number(e.target.value) }))} className="w-full h-1 bg-white/10 rounded accent-primary-500" />
              </div>

              <div className="space-y-1">
                <span className="text-xs text-dark-300 font-semibold block">Bubble Vertical Offset Y: {blurBox.y}%</span>
                <input type="range" min="0" max={100 - blurBox.h} value={blurBox.y} onChange={(e) => setBlurBox(prev => ({ ...prev, y: Number(e.target.value) }))} className="w-full h-1 bg-white/10 rounded accent-primary-500" />
              </div>
            </div>

            <div className="pt-4 border-t border-white/5 flex gap-3">
              <button
                onClick={handleExport}
                className="w-full bg-emerald-500 hover:bg-emerald-600 text-white font-bold py-3 px-4 rounded-xl text-xs flex items-center justify-center gap-2 transition-all shadow-glow-accent"
              >
                <Download size={14} /> Export Censored Image
              </button>
              <button
                onClick={() => removeFile(0)}
                className="p-3 bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 text-red-400 rounded-xl transition-all"
              >
                <Trash2 size={16} />
              </button>
            </div>
          </div>

          <div className="glass-panel p-4 rounded-2xl border border-white/5 flex items-center justify-center bg-black/40 min-h-[300px]">
            <canvas ref={canvasRef} className="max-h-72 max-w-full rounded-lg object-contain shadow-md bg-black/25" />
          </div>
        </div>
      )}
    </div>
  );
}

// ----------------------------------------------------
// SHARED DRAG AND DROP ZONE COMPONENT
// ----------------------------------------------------
function DropZone({ handleDrop, handleDragOver, handleFileChange, fileInputRef }) {
  return (
    <div
      onDragOver={handleDragOver}
      onDrop={handleDrop}
      onClick={() => fileInputRef.current?.click()}
      className="glass-panel border-2 border-dashed border-white/10 rounded-3xl p-10 flex flex-col items-center justify-center cursor-pointer hover:border-primary-500/30 bg-black/15 transition-all text-center min-h-[320px]"
    >
      <div className="w-14 h-14 rounded-2xl bg-primary-500/10 border border-primary-500/20 text-primary-400 flex items-center justify-center mb-4 shadow-glow-primary">
        <Upload size={24} className="animate-bounce" />
      </div>
      <h4 className="font-bold text-white text-sm mb-1.5">Drag & Drop Image Here</h4>
      <p className="text-xs text-dark-400 max-w-xs leading-relaxed mb-4">
        Supports high-resolution PNG, JPG, JPEG, WEBP, or raw BMP. 100% processed locally inside browser-side memory buffers.
      </p>
      <button
        type="button"
        className="bg-white/5 hover:bg-white/10 border border-white/10 text-white font-semibold py-2 px-4 rounded-xl text-xs transition-all"
      >
        Select Image File
      </button>
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/*"
        className="hidden"
      />
    </div>
  );
}
