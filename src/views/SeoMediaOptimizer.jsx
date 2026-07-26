import { useState, useRef, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { 
  Sparkles, Image, Share2, Layers, Download,
  Check, Copy, Play, Layout, RefreshCw
} from 'lucide-react';
import JSZip from 'jszip';
import { downloadBlob } from '../utils/downloadHelper';

const formatBytes = (bytes, decimals = 2) => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
};

export default function SeoMediaOptimizer() {
  const [activeTab, setActiveTab] = useState('audit');

  // Input states
  const [uploadedImage, setUploadedImage] = useState(null);
  const [imageMetadata, setImageMetadata] = useState(null);
  const [seoTitle, setSeoTitle] = useState('ConvertVerse Digital Platform');
  const [seoDescription, setSeoDescription] = useState('Experience lightning-fast browser-based document manipulation tools with zero uploads.');

  // Responsive Generator states
  const [compressing, setCompressing] = useState(false);
  const [responsiveZipFile, setResponsiveZipFile] = useState(null);
  
  // Favicon States
  const [generatingFavicons, setGeneratingFavicons] = useState(false);
  const [faviconPack, setFaviconPack] = useState(null);

  // General audit score states
  const [auditScore, setAuditScore] = useState(0);
  const [auditFindings, setAuditFindings] = useState([]);
  const [altTextSuggestion, setAltTextSuggestion] = useState('');
  const [lazyLoadTag, setLazyLoadTag] = useState('');
  const [copiedText, setCopiedText] = useState('');

  const fileInputRef = useRef(null);
  const canvasRef = useRef(null);

  const handleImageUploaded = useCallback((e) => {
    const file = e.target.files[0];
    if (!file) return;

    const img = new window.Image();
    img.onload = () => {
      setUploadedImage(img);
      setImageMetadata({
        name: file.name,
        size: file.size,
        sizeFormatted: formatBytes(file.size),
        width: img.naturalWidth || img.width,
        height: img.naturalHeight || img.height,
        ext: file.name.split('.').pop().toLowerCase()
      });
      setResponsiveZipFile(null);
      setFaviconPack(null);
    };
    
    const reader = new FileReader();
    reader.onload = (event) => {
      img.src = event.target.result;
    };
    reader.readAsDataURL(file);
  }, []);

  // ----------------------------------------------------
  // LIGHTHOUSE-STYLE AUDITOR ENGINE
  // ----------------------------------------------------
  const runSeoAudit = useCallback(() => {
    if (!imageMetadata) return;

    let score = 95;
    const findings = [];
    const ext = imageMetadata.ext;

    // 1. File Size Audit
    const sizeKB = imageMetadata.size / 1024;
    if (sizeKB > 350) {
      score -= 25;
      findings.push({
        type: 'warning',
        metric: 'Core Web Vitals LCP Threat',
        title: 'Large Payload Detected',
        desc: `File is ${formatBytes(imageMetadata.size)}. Search engine index spiders penalize files larger than 150KB due to slow page render speeds. Convert to WebP or optimize dimensions.`
      });
    } else if (sizeKB > 120) {
      score -= 10;
      findings.push({
        type: 'info',
        metric: 'Mobile Optimization Alert',
        title: 'Heavier Image Size',
        desc: `File size is ${formatBytes(imageMetadata.size)}. Safe for desktop but may degrade performance slightly on 3G mobile networks.`
      });
    } else {
      findings.push({
        type: 'success',
        metric: 'Core Web Vitals Compliant',
        title: 'Excellent Payload Size',
        desc: 'Lightweight assets guarantee fast, mobile-friendly network responses.'
      });
    }

    // 2. Format Audit
    if (['png', 'bmp', 'tiff'].includes(ext)) {
      score -= 20;
      findings.push({
        type: 'warning',
        metric: 'Modern Image Standard',
        title: 'Legacy format container',
        desc: `PNG and legacy containers do not support state-of-the-art compression matrices. Save this asset as WebP to save up to 80% payload bandwidth.`
      });
    } else {
      findings.push({
        type: 'success',
        metric: 'Next-Gen Format active',
        title: 'Optimized Image Container',
        desc: `Asset uses a modern file standard (${ext.toUpperCase()}) for optimal network load.`
      });
    }

    // 3. Aspect Ratio Audit
    const isWidescreen = Math.abs((imageMetadata.width / imageMetadata.height) - 1.777) < 0.2;
    if (isWidescreen) {
      findings.push({
        type: 'success',
        metric: 'Open Graph Match',
        title: 'Aspect Widescreen Fit',
        desc: 'Dimensions map cleanly onto Facebook/LinkedIn Open Graph card ratios (1.91:1).'
      });
    }

    // 4. Generate suggestion Alt-text tags and HTML blocks
    const parsedName = imageMetadata.name.replace(/\.[^/.]+$/, "").replace(/[-_]+/g, ' ');
    const altText = `${parsedName} digital layout vector image for seo keywords`;
    setAltTextSuggestion(altText);

    // Generate lazy load HTML tags matching responsive outputs
    const htmlBlock = `<picture>\n  <source srcset="mobile-${imageMetadata.name.replace(/\.[^/.]+$/, '')}.webp" media="(max-width: 480px)" type="image/webp">\n  <source srcset="tablet-${imageMetadata.name.replace(/\.[^/.]+$/, '')}.webp" media="(max-width: 800px)" type="image/webp">\n  <img src="desktop-${imageMetadata.name.replace(/\.[^/.]+$/, '')}.webp" alt="${altText}" loading="lazy" width="${imageMetadata.width}" height="${imageMetadata.height}">\n</picture>`;
    setLazyLoadTag(htmlBlock);

    setAuditScore(Math.max(10, score));
    setAuditFindings(findings);
  }, [imageMetadata]);

  // Trigger metrics analysis when image changes or custom SEO parameters tweak
  useEffect(() => {
    if (uploadedImage) {
      const timer = setTimeout(() => {
        runSeoAudit();
      }, 0);
      return () => clearTimeout(timer);
    }
  }, [uploadedImage, runSeoAudit]);

  // ----------------------------------------------------
  // MULTI-SIZE RESPONSIVE COMPILER
  // ----------------------------------------------------
  const generateResponsivePackage = async () => {
    if (!uploadedImage) return;
    setCompressing(true);

    const sizes = [
      { name: 'mobile', width: 480 },
      { name: 'tablet', width: 800 },
      { name: 'desktop', width: 1200 }
    ];

    const zip = new JSZip();

    try {
      for (const size of sizes) {
        // Only scale down, don't upscale beyond original width
        const targetW = Math.min(size.width, imageMetadata.width);
        const ratio = imageMetadata.height / imageMetadata.width;
        const targetH = targetW * ratio;

        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        canvas.width = targetW;
        canvas.height = targetH;

        ctx.drawImage(uploadedImage, 0, 0, targetW, targetH);

        const blob = await new Promise((resolve) => {
          canvas.toBlob((b) => resolve(b), 'image/webp', 0.85);
        });

        const shortName = imageMetadata.name.replace(/\.[^/.]+$/, '');
        zip.file(`${size.name}-${shortName}.webp`, blob);
      }

      const zipBlob = await zip.generateAsync({ type: 'blob' });
      setResponsiveZipFile({
        blob: zipBlob,
        name: `responsive-bundle-${imageMetadata.name.replace(/\.[^/.]+$/, '')}.zip`
      });
    } catch (err) {
      console.error(err);
    } finally {
      setCompressing(false);
    }
  };

  // ----------------------------------------------------
  // APP FAVICON MATRIX BUILDER
  // ----------------------------------------------------
  const compileFaviconIcons = async () => {
    if (!uploadedImage) return;
    setGeneratingFavicons(true);

    const iconSizes = [16, 32, 180];
    const zip = new JSZip();

    try {
      for (const size of iconSizes) {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        
        // Square crop from the center
        const origW = imageMetadata.width;
        const origH = imageMetadata.height;
        const sizeSquare = Math.min(origW, origH);
        const sx = (origW - sizeSquare) / 2;
        const sy = (origH - sizeSquare) / 2;

        canvas.width = size;
        canvas.height = size;

        ctx.drawImage(uploadedImage, sx, sy, sizeSquare, sizeSquare, 0, 0, size, size);

        const blob = await new Promise((resolve) => {
          canvas.toBlob((b) => resolve(b), 'image/png');
        });

        const namePrefix = size === 180 ? 'apple-touch-icon' : `favicon-${size}x${size}`;
        zip.file(`${namePrefix}.png`, blob);
      }

      const zipBlob = await zip.generateAsync({ type: 'blob' });
      setFaviconPack({
        blob: zipBlob,
        name: `favicon-icons-package.zip`
      });
    } catch (err) {
      console.error(err);
    } finally {
      setGeneratingFavicons(false);
    }
  };

  const copyToClipboard = (text, key) => {
    navigator.clipboard.writeText(text);
    setCopiedText(key);
    setTimeout(() => setCopiedText(''), 2000);
  };

  return (
    <div className="py-4 space-y-8 flex-grow flex flex-col justify-between min-h-[500px]">
      <div className="flex flex-col gap-6">
        
        {/* Title Header */}
        <div>
          <h2 className="text-xl font-extrabold text-white flex items-center gap-2">
            <Sparkles className="text-primary-400 animate-pulse" size={24} />
            Smart AI Website & SEO Media Optimizer
          </h2>
          <p className="text-xs text-dark-400 mt-1">
            Build mobile-ready widescreen social cards, favicons, alt tags, responsive image packages, and Lighthouse scores instantly inside your browser.
          </p>
        </div>

        {/* Tab selector row */}
        <div className="flex border-b border-white/5 gap-1 bg-black/10 p-1 rounded-xl max-w-lg overflow-x-auto scrollbar-hide">
          <button
            onClick={() => setActiveTab('audit')}
            className={`py-2 px-3 rounded-lg text-xs font-bold whitespace-nowrap transition-all ${
              activeTab === 'audit' ? 'bg-primary-500/15 text-primary-400 border border-primary-500/25' : 'text-dark-400 hover:text-dark-200'
            }`}
          >
            Lighthouse Media Score
          </button>
          <button
            onClick={() => setActiveTab('responsive')}
            className={`py-2 px-3 rounded-lg text-xs font-bold whitespace-nowrap transition-all ${
              activeTab === 'responsive' ? 'bg-primary-500/15 text-primary-400 border border-primary-500/25' : 'text-dark-400 hover:text-dark-200'
            }`}
          >
            Responsive Image Pack
          </button>
          <button
            onClick={() => setActiveTab('ogcard')}
            className={`py-2 px-3 rounded-lg text-xs font-bold whitespace-nowrap transition-all ${
              activeTab === 'ogcard' ? 'bg-primary-500/15 text-primary-400 border border-primary-500/25' : 'text-dark-400 hover:text-dark-200'
            }`}
          >
            Social Open Graph
          </button>
          <button
            onClick={() => setActiveTab('favicon')}
            className={`py-2 px-3 rounded-lg text-xs font-bold whitespace-nowrap transition-all ${
              activeTab === 'favicon' ? 'bg-primary-500/15 text-primary-400 border border-primary-500/25' : 'text-dark-400 hover:text-dark-200'
            }`}
          >
            App Favicon Builder
          </button>
        </div>

        {/* Image staging selector bar */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
          
          {/* LEFT: DROPZONE SCREEN */}
          <div className="lg:col-span-1 space-y-5">
            <div
              onClick={() => fileInputRef.current?.click()}
              className="glass-panel border-2 border-dashed border-white/10 rounded-2xl p-6 flex flex-col items-center justify-center cursor-pointer hover:border-primary-500/30 bg-black/15 transition-all text-center min-h-[160px]"
            >
              <Image size={24} className="text-primary-400 mb-2 animate-bounce" />
              <h5 className="font-bold text-white text-xs">Stage Asset Image</h5>
              <p className="text-[10px] text-dark-400 mt-1">Supports PNG, JPG, JPEG, WEBP and BMP formats.</p>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleImageUploaded}
                accept="image/*"
                className="hidden"
              />
            </div>

            {imageMetadata && (
              <div className="glass-panel p-4 rounded-xl border border-white/5 text-[10px] font-mono space-y-2">
                <span className="text-xs font-bold text-white font-sans block mb-1">STAGED ASSET DETAILS</span>
                <div className="flex justify-between">
                  <span className="text-dark-455">FILE:</span>
                  <span className="text-white truncate max-w-[120px]">{imageMetadata.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-dark-455">DIMENSIONS:</span>
                  <span className="text-white">{imageMetadata.width}x{imageMetadata.height}px</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-dark-455">SIZE:</span>
                  <span className="text-white">{imageMetadata.sizeFormatted}</span>
                </div>
              </div>
            )}
          </div>

          {/* RIGHT: MAIN DYNAMIC WORKSPACES */}
          <div className="lg:col-span-2 space-y-6">
            {!uploadedImage ? (
              <div className="glass-panel p-10 rounded-2xl border border-white/5 flex flex-col items-center justify-center min-h-[250px] text-center">
                <Layout className="text-dark-500 animate-pulse mb-3" size={28} />
                <h5 className="font-bold text-white text-xs">No Staged Media</h5>
                <p className="text-[10px] text-dark-400 max-w-xs leading-relaxed mt-1">
                  Upload a cover or website template image on the left to start building Lighthouse audits, social Open Graph graphics, favicons, and responsive stacks.
                </p>
              </div>
            ) : (
              <>
                {/* -------------------- TAB 1: AUDIT -------------------- */}
                {activeTab === 'audit' && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    
                    {/* Score panel */}
                    <div className="glass-panel p-5 rounded-2xl border border-white/5 space-y-5">
                      <div className="flex items-center gap-4">
                        <div className="relative w-16 h-16 flex items-center justify-center">
                          <svg className="absolute w-full h-full transform -rotate-90">
                            <circle cx="32" cy="32" r="26" className="stroke-white/5 fill-transparent" strokeWidth="5" />
                            <circle 
                              cx="32" 
                              cy="32" 
                              r="26" 
                              className={`fill-transparent transition-all duration-500 ${
                                auditScore > 85 ? 'stroke-emerald-400' : 'stroke-amber-400'
                              }`} 
                              strokeWidth="5" 
                              strokeDasharray={163.3} 
                              strokeDashoffset={163.3 - (163.3 * auditScore) / 100}
                            />
                          </svg>
                          <span className="text-xs font-bold text-white font-mono">{auditScore}</span>
                        </div>
                        <div>
                          <h4 className="font-bold text-sm text-white">Lighthouse Performance Audit</h4>
                          <span className="text-[9px] text-dark-400 font-mono">CORE WEB VITALS METRIC TARGETS</span>
                        </div>
                      </div>

                      <div className="divide-y divide-white/5 text-xs">
                        {auditFindings.map((finding, idx) => (
                          <div key={idx} className="py-3 space-y-1">
                            <div className="flex justify-between items-center font-bold">
                              <span className="text-white text-[11px]">{finding.title}</span>
                              <span className={`text-[9px] ${
                                finding.type === 'warning' ? 'text-red-400' : finding.type === 'info' ? 'text-amber-400' : 'text-emerald-400'
                              }`}>{finding.metric}</span>
                            </div>
                            <p className="text-[10px] text-dark-300 leading-relaxed">{finding.desc}</p>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* SEO alt tags code */}
                    <div className="glass-panel p-5 rounded-2xl border border-white/5 space-y-4">
                      <div>
                        <span className="text-xs font-bold text-white block">Alt Tag suggest & code blocks</span>
                        <p className="text-[10px] text-dark-400 mt-0.5">Optimizes web accessibility layout rankings.</p>
                      </div>

                      <div className="space-y-3.5 text-xs">
                        <div className="space-y-1.5">
                          <span className="text-[10px] text-dark-400 font-bold block">RECOMMENDED ALT-TEXT TARGET</span>
                          <div className="bg-black/20 border border-white/5 rounded-xl p-3 flex justify-between items-center font-mono text-[10px] text-primary-300">
                            <span className="truncate max-w-[160px]">{altTextSuggestion}</span>
                            <button
                              onClick={() => copyToClipboard(altTextSuggestion, 'alt')}
                              className="p-1 hover:bg-white/5 rounded text-dark-400 hover:text-white transition-all flex-shrink-0"
                            >
                              {copiedText === 'alt' ? <Check size={11} className="text-emerald-400" /> : <Copy size={11} />}
                            </button>
                          </div>
                        </div>

                        <div className="space-y-1.5">
                          <span className="text-[10px] text-dark-400 font-bold block">LAZY-LOAD RESPONSIVE PICTURE BLOCK</span>
                          <div className="relative">
                            <pre className="bg-black/35 border border-white/5 rounded-xl p-3 text-[9px] font-mono text-dark-300 overflow-x-auto whitespace-pre leading-relaxed select-all">
                              {lazyLoadTag}
                            </pre>
                            <button
                              onClick={() => copyToClipboard(lazyLoadTag, 'html')}
                              className="absolute top-2 right-2 p-1.5 bg-black/45 border border-white/10 rounded-lg text-dark-400 hover:text-white transition-all"
                            >
                              {copiedText === 'html' ? <Check size={11} className="text-emerald-400" /> : <Copy size={11} />}
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>

                  </div>
                )}

                {/* -------------------- TAB 2: RESPONSIVE COMPILER -------------------- */}
                {activeTab === 'responsive' && (
                  <div className="glass-panel p-5 rounded-2xl border border-white/5 space-y-4">
                    <div>
                      <span className="block text-xs font-bold text-white flex items-center gap-1.5">
                        <Layers size={13} className="text-primary-400" />
                        Responsive Bundle Pack Compiler
                      </span>
                      <p className="text-[10px] text-dark-400 mt-0.5">Generates Mobile (480w), Tablet (800w), and Desktop (1200w) target outputs in WebP in a single ZIP.</p>
                    </div>

                    <div className="bg-black/15 p-4 rounded-xl text-xs space-y-3.5">
                      <p className="text-dark-300 leading-relaxed text-[11px]">
                        💡 Browser will render scaling calculations inside canvas buffers locally. WebP conversion compresses size up to 85% compared to raw PNG files while retaining crisp borders.
                      </p>
                      
                      <button
                        onClick={generateResponsivePackage}
                        disabled={compressing}
                        className="w-full bg-primary-500 hover:bg-primary-600 text-white font-bold py-2.5 px-4 rounded-xl text-xs flex items-center justify-center gap-1.5 transition-all shadow-glow-primary"
                      >
                        {compressing ? <RefreshCw className="animate-spin" size={13} /> : <Play size={13} />}
                        Compile 3-Size WebP ZIP package
                      </button>
                    </div>

                    {responsiveZipFile && (
                      <motion.div
                        initial={{ scale: 0.95, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="bg-emerald-500/[0.03] border border-emerald-500/10 rounded-xl p-3 flex justify-between items-center text-xs"
                      >
                        <div className="flex items-center gap-2 min-w-0">
                          <Check className="text-emerald-400" size={14} />
                          <span className="font-bold text-white truncate max-w-[180px]">{responsiveZipFile.name}</span>
                        </div>
                        <button
                          onClick={() => downloadBlob(responsiveZipFile.blob, responsiveZipFile.name)}
                          className="bg-emerald-500/15 hover:bg-emerald-500/25 border border-emerald-500/20 text-emerald-400 font-bold py-1.5 px-3 rounded-lg text-[10px] flex items-center gap-1 transition-all"
                        >
                          <Download size={11} /> Save Responsive ZIP
                        </button>
                      </motion.div>
                    )}
                  </div>
                )}

                {/* -------------------- TAB 3: SOCIAL OPEN GRAPH CARD -------------------- */}
                {activeTab === 'ogcard' && (
                  <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                    
                    {/* Control input parameters */}
                    <div className="md:col-span-5 space-y-4">
                      <div className="glass-panel p-4.5 rounded-xl border border-white/5 space-y-3.5">
                        <span className="text-[10px] font-bold text-white uppercase block">OG Metadata properties</span>
                        
                        <div className="space-y-1.5 text-xs">
                          <label className="text-dark-350 font-semibold">Open Graph title</label>
                          <input
                            type="text"
                            value={seoTitle}
                            onChange={(e) => setSeoTitle(e.target.value)}
                            className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-white font-sans"
                          />
                        </div>

                        <div className="space-y-1.5 text-xs">
                          <label className="text-dark-350 font-semibold">Open Graph description</label>
                          <textarea
                            value={seoDescription}
                            onChange={(e) => setSeoDescription(e.target.value)}
                            rows={3}
                            className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-white font-sans text-[11px] resize-none"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Live Open Graph Preview Box */}
                    <div className="md:col-span-7">
                      <div className="glass-panel p-5 rounded-2xl border border-white/5 space-y-4">
                        <span className="text-xs font-bold text-white block">LinkedIn / Facebook Card preview</span>
                        
                        {/* Interactive Open Graph Visual */}
                        <div className="border border-white/10 bg-[#0f172a] rounded-xl overflow-hidden shadow-lg">
                          <div className="relative aspect-[1.91/1] w-full overflow-hidden flex items-center justify-center bg-gradient-to-tr from-primary-800 to-dark-900">
                            {/* Staged Image */}
                            <img
                              src={uploadedImage.src}
                              className="w-full h-full object-cover opacity-85"
                              alt="Social Open Graph preview"
                            />
                            
                            {/* Glass overlay */}
                            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent flex flex-col justify-end p-4">
                              <span className="text-[9px] bg-primary-500 text-white font-mono font-bold px-2 py-0.5 rounded-full self-start mb-2 uppercase">
                                CONVERTVERSE ENGINE
                              </span>
                              <h4 className="text-xs font-bold text-white line-clamp-1">{seoTitle}</h4>
                              <p className="text-[9px] text-dark-300 line-clamp-2 mt-0.5">{seoDescription}</p>
                            </div>
                          </div>
                          
                          <div className="p-3 bg-white/5 border-t border-white/5 text-[9px] font-mono text-dark-400">
                            <span className="block text-primary-400">https://convertverse.ai</span>
                            <span className="block mt-0.5">Meta property="og:image" Content Loaded</span>
                          </div>
                        </div>
                      </div>
                    </div>

                  </div>
                )}

                {/* -------------------- TAB 4: FAVICON BUILDER -------------------- */}
                {activeTab === 'favicon' && (
                  <div className="glass-panel p-5 rounded-2xl border border-white/5 space-y-4">
                    <div>
                      <span className="block text-xs font-bold text-white flex items-center gap-1.5">
                        <Share2 size={13} className="text-primary-400" />
                        Universal App Favicon Bundler
                      </span>
                      <p className="text-[10px] text-dark-400 mt-0.5">Compiles standard browser favicons (16x16, 32x32) and high-res Apple Touch Icons (180x180) from staged squares.</p>
                    </div>

                    <div className="bg-black/15 p-4 rounded-xl text-xs space-y-3.5">
                      <p className="text-dark-300 leading-relaxed text-[11px]">
                        💡 System will extract a centralized square bounding slice from your staged image and compile PNG modules at three scale vectors automatically.
                      </p>
                      
                      <button
                        onClick={compileFaviconIcons}
                        disabled={generatingFavicons}
                        className="w-full bg-primary-500 hover:bg-primary-600 text-white font-bold py-2.5 px-4 rounded-xl text-xs flex items-center justify-center gap-1.5 transition-all shadow-glow-primary"
                      >
                        {generatingFavicons ? <RefreshCw className="animate-spin" size={13} /> : <Play size={13} />}
                        Build Favicon Package Bundler
                      </button>
                    </div>

                    {faviconPack && (
                      <motion.div
                        initial={{ scale: 0.95, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="bg-emerald-500/[0.03] border border-emerald-500/10 rounded-xl p-3 flex justify-between items-center text-xs"
                      >
                        <div className="flex items-center gap-2 min-w-0">
                          <Check className="text-emerald-400" size={14} />
                          <span className="font-bold text-white truncate max-w-[180px]">{faviconPack.name}</span>
                        </div>
                        <button
                          onClick={() => downloadBlob(faviconPack.blob, faviconPack.name)}
                          className="bg-emerald-500/15 hover:bg-emerald-500/25 border border-emerald-500/20 text-emerald-400 font-bold py-1.5 px-3 rounded-lg text-[10px] flex items-center gap-1 transition-all"
                        >
                          <Download size={11} /> Save Favicon Package
                        </button>
                      </motion.div>
                    )}
                  </div>
                )}
              </>
            )}
          </div>

        </div>

      </div>

      <canvas ref={canvasRef} className="hidden" />
    </div>
  );
}
