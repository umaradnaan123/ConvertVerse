import { useState, useEffect, useRef, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FileCode, Merge, Columns, Shuffle, FileText, 
  RotateCw, Trash2, ArrowUp, ArrowDown, Download, 
  RefreshCw, CheckCircle2,
  Hash, Camera, ShieldCheck, PlayCircle
} from 'lucide-react';
import * as pdfjsLib from 'pdfjs-dist';
import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';
import { jsPDF } from 'jspdf';
import { useLanguage } from '../hooks/useLanguage';
import DragDropUpload from '../components/DragDropUpload';
import { formatBytes } from '../utils/imageProcessors';
import { mergePdfs, splitPdf, rearrangePdf, compressPdf } from '../utils/pdfProcessors';
import { downloadBlob } from '../utils/downloadHelper';

// Configure CDN pdf.js worker to prevent Vite build worker issues
pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.4.120/pdf.worker.min.js`;

export default function PdfToolbox({ onAddHistory, activeSubTab, setActiveSubTab }) {
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState('merge'); // merge, split, rearrange, compress, numbering, scan
  const [isProcessing, setIsProcessing] = useState(false);

  // Merge State
  const [mergeFiles, setMergeFiles] = useState([]);

  // Split State
  const [splitFile, setSplitFile] = useState(null);
  const [splitRange, setSplitRange] = useState('');
  const [splitPagePreviews, setSplitPagePreviews] = useState([]);
  const [selectedPages, setSelectedPages] = useState([]);

  // Rearrange/Organize State
  const [editFile, setEditFile] = useState(null);
  const [editPageConfigs, setEditPageConfigs] = useState([]);

  // Compress State
  const [compressFile, setCompressFile] = useState(null);
  const [compressionSavings, setCompressionSavings] = useState(null);
  const [compressedBlob, setCompressedBlob] = useState(null);

  // Page Numbering State
  const [numberFile, setNumberFile] = useState(null);
  const [numberBlob, setNumberBlob] = useState(null);
  const [numPosition, setNumPosition] = useState('bottom-center');
  const [numTemplate, setNumTemplate] = useState('Page {n} of {m}');
  const [numColor, setNumColor] = useState('darkgrey');
  const [numSize, setNumSize] = useState(11);

  // Camera Scanner State
  const [scannerActive, setScannerActive] = useState(false);
  const [capturedPages, setCapturedPages] = useState([]); // Array of strings (dataUrls)
  const [scannerFilter, setScannerFilter] = useState('grayscale'); // none, grayscale, threshold
  
  const videoRef = useRef(null);
  const streamRef = useRef(null);

  // Tab configurations
  const tabs = useMemo(() => [
    { id: 'merge', label: t('pdfTabMerge'), icon: Merge },
    { id: 'split', label: t('pdfTabSplit'), icon: Columns },
    { id: 'rearrange', label: t('pdfTabRearrange'), icon: Shuffle },
    { id: 'compress', label: t('pdfTabCompress'), icon: FileCode },
    { id: 'numbering', label: "Page Numbers", icon: Hash },
    { id: 'scan', label: "Scan Document", icon: Camera }
  ], [t]);

  // Route bind from dashboard
  useEffect(() => {
    if (activeSubTab) {
      const match = tabs.find(t => t.id === activeSubTab);
      if (match) {
        const timer = setTimeout(() => {
          setActiveTab(match.id);
        }, 0);
        return () => clearTimeout(timer);
      }
    }
  }, [activeSubTab, tabs]);

  // Clean file states and WebRTC streams on activeTab change
  useEffect(() => {
    const timer = setTimeout(() => {
      setMergeFiles([]);
      setSplitFile(null);
      setSplitRange('');
      setSplitPagePreviews([]);
      setSelectedPages([]);
      setEditFile(null);
      setEditPageConfigs([]);
      setCompressFile(null);
      setCompressionSavings(null);
      setCompressedBlob(null);
      setNumberFile(null);
      setNumberBlob(null);
      stopScanner();
      setCapturedPages([]);
      if (setActiveSubTab) {
        setActiveSubTab(null);
      }
    }, 0);
    return () => clearTimeout(timer);
  }, [activeTab, setActiveSubTab]);

  // Clean WebRTC streams on dismount
  useEffect(() => {
    return () => {
      stopScanner();
    };
  }, []);

  // 1. Merge PDF handlers
  const handleMergeFilesSelected = (files) => {
    setMergeFiles((prev) => [...prev, ...files]);
  };

  const removeMergeFile = (index) => {
    setMergeFiles(prev => prev.filter((_, idx) => idx !== index));
  };

  const moveMergeFile = (index, direction) => {
    const nextIndex = index + direction;
    if (nextIndex < 0 || nextIndex >= mergeFiles.length) return;
    const items = [...mergeFiles];
    const temp = items[index];
    items[index] = items[nextIndex];
    items[nextIndex] = temp;
    setMergeFiles(items);
  };

  const handleMergeSubmit = async () => {
    if (mergeFiles.length < 2) return;
    setIsProcessing(true);
    try {
      const mergedBlob = await mergePdfs(mergeFiles);
      const filename = `convertverse_${Date.now()}_merged.pdf`;
      downloadBlob(mergedBlob, filename);
      onAddHistory({
        fileName: filename,
        fromFormat: 'pdf',
        toFormat: 'pdf',
        size: mergedBlob.size
      }, mergedBlob);
    } catch (error) {
      alert("Merge failure: " + error.message);
    }
    setIsProcessing(false);
  };

  // Thumbnail generators
  const renderPdfThumbnails = async (file, callback) => {
    try {
      setIsProcessing(true);
      const arrayBuffer = await file.arrayBuffer();
      const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
      const numPages = pdf.numPages;
      const pagesList = [];

      for (let i = 1; i <= numPages; i++) {
        const page = await pdf.getPage(i);
        const viewport = page.getViewport({ scale: 0.35 });
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');
        canvas.height = viewport.height;
        canvas.width = viewport.width;
        await page.render({ canvasContext: context, viewport }).promise;
        pagesList.push({
          id: `${Date.now()}-page-${i}`,
          originalIndex: i - 1,
          rotation: 0,
          previewUrl: canvas.toDataURL()
        });
      }
      callback(pagesList);
    } catch (error) {
      alert("Failed loading PDF previews: " + error.message);
    }
    setIsProcessing(false);
  };

  // 2. Split PDF handlers
  const handleSplitFileSelected = (files) => {
    const file = files[0];
    if (!file) return;
    setSplitFile(file);
    renderPdfThumbnails(file, (previews) => {
      setSplitPagePreviews(previews);
    });
  };

  const togglePageSelection = (index) => {
    setSelectedPages(prev => 
      prev.includes(index) ? prev.filter(i => i !== index) : [...prev, index]
    );
  };

  useEffect(() => {
    if (selectedPages.length === 0) {
      if (splitRange !== '') {
        const timer = setTimeout(() => setSplitRange(''), 0);
        return () => clearTimeout(timer);
      }
      return;
    }
    const sorted = [...selectedPages].sort((a, b) => a - b).map(i => i + 1);
    const newRange = sorted.join(', ');
    if (splitRange !== newRange) {
      const timer = setTimeout(() => setSplitRange(newRange), 0);
      return () => clearTimeout(timer);
    }
  }, [selectedPages, splitRange]);

  const handleSplitSubmit = async () => {
    if (!splitFile || !splitRange) return;
    setIsProcessing(true);
    try {
      const splitBlob = await splitPdf(splitFile, splitRange);
      const filename = `${splitFile.name.replace(/\.[^/.]+$/, "")}_split.pdf`;
      downloadBlob(splitBlob, filename);
      onAddHistory({
        fileName: filename,
        fromFormat: 'pdf',
        toFormat: 'pdf',
        size: splitBlob.size
      }, splitBlob);
    } catch (error) {
      alert("Split failure: " + error.message);
    }
    setIsProcessing(false);
  };

  // 3. Rearrange/Organize PDF handlers
  const handleEditFileSelected = (files) => {
    const file = files[0];
    if (!file) return;
    setEditFile(file);
    renderPdfThumbnails(file, (configs) => {
      setEditPageConfigs(configs);
    });
  };

  const rotatePage = (id) => {
    setEditPageConfigs(prev => 
      prev.map(p => p.id === id ? { ...p, rotation: (p.rotation + 90) % 360 } : p)
    );
  };

  const deletePage = (id) => {
    setEditPageConfigs(prev => prev.filter(p => p.id !== id));
  };

  const movePageInEditor = (index, direction) => {
    const nextIndex = index + direction;
    if (nextIndex < 0 || nextIndex >= editPageConfigs.length) return;
    const items = [...editPageConfigs];
    const temp = items[index];
    items[index] = items[nextIndex];
    items[nextIndex] = temp;
    setEditPageConfigs(items);
  };

  const handleRearrangeSubmit = async () => {
    if (!editFile || editPageConfigs.length === 0) return;
    setIsProcessing(true);
    try {
      const outputBlob = await rearrangePdf(editFile, editPageConfigs);
      const filename = `${editFile.name.replace(/\.[^/.]+$/, "")}_edited.pdf`;
      downloadBlob(outputBlob, filename);
      onAddHistory({
        fileName: filename,
        fromFormat: 'pdf',
        toFormat: 'pdf',
        size: outputBlob.size
      }, outputBlob);
    } catch (error) {
      alert("Organize failure: " + error.message);
    }
    setIsProcessing(false);
  };

  // 4. Compress PDF handlers
  const handleCompressFileSelected = (files) => {
    const file = files[0];
    if (!file) return;
    setCompressFile(file);
    setCompressionSavings(null);
    setCompressedBlob(null);
  };

  const handleCompressSubmit = async () => {
    if (!compressFile) return;
    setIsProcessing(true);
    try {
      const result = await compressPdf(compressFile);
      const savings = Math.max(5, Math.round(((compressFile.size - result.size) / compressFile.size) * 100));
      setCompressedBlob(result);
      setCompressionSavings(savings);
      const filename = `${compressFile.name.replace(/\.[^/.]+$/, "")}_compressed.pdf`;
      onAddHistory({
        fileName: filename,
        fromFormat: 'pdf',
        toFormat: 'pdf',
        size: result.size
      }, result);
    } catch (error) {
      alert("Compress failure: " + error.message);
    }
    setIsProcessing(false);
  };

  // 5. Page Numbering (pdf-lib vector drawing engine)
  const handleNumberFileSelected = (files) => {
    const file = files[0];
    if (file) {
      setNumberFile(file);
      setNumberBlob(null);
    }
  };

  const handleNumberingSubmit = async () => {
    if (!numberFile) return;
    setIsProcessing(true);
    try {
      const arrayBuffer = await numberFile.arrayBuffer();
      const pdfDoc = await PDFDocument.load(arrayBuffer);
      const pages = pdfDoc.getPages();
      const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
      const total = pages.length;

      let rVal = 0.2, gVal = 0.2, bVal = 0.2;
      if (numColor === 'black') { rVal = 0; gVal = 0; bVal = 0; }
      if (numColor === 'blue') { rVal = 0.26; gVal = 0.22; bVal = 0.8; }

      for (let i = 0; i < total; i++) {
        const page = pages[i];
        const { width, height } = page.getSize();
        const num = i + 1;
        const text = numTemplate.replace('{n}', num).replace('{m}', total);
        const textWidth = font.widthOfTextAtSize(text, numSize);
        
        let x = width / 2 - textWidth / 2;
        let y = 30; // default margin

        if (numPosition === 'bottom-left') x = 30;
        else if (numPosition === 'bottom-right') x = width - textWidth - 30;
        else if (numPosition === 'top-left') { x = 30; y = height - 40; }
        else if (numPosition === 'top-center') { x = width / 2 - textWidth / 2; y = height - 40; }
        else if (numPosition === 'top-right') { x = width - textWidth - 30; y = height - 40; }

        page.drawText(text, {
          x, y,
          size: numSize,
          font,
          color: rgb(rVal, gVal, bVal)
        });
      }

      const numberedBytes = await pdfDoc.save();
      const numberedBlob = new Blob([numberedBytes], { type: 'application/pdf' });
      setNumberBlob(numberedBlob);
      const filename = `${numberFile.name.replace(/\.[^/.]+$/, "")}_numbered.pdf`;
      downloadBlob(numberedBlob, filename);
      onAddHistory({
        fileName: filename,
        fromFormat: 'pdf',
        toFormat: 'pdf',
        size: numberedBlob.size
      }, numberedBlob);
    } catch (error) {
      alert("Numbering failure: " + error.message);
    }
    setIsProcessing(false);
  };

  // 6. Camera visual scanning handlers (WebRTC)
  async function startScanner() {
    try {
      setScannerActive(true);
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment' }
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (error) {
      alert("Could not access devices camera: " + error.message);
      setScannerActive(false);
    }
  }

  function stopScanner() {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    setScannerActive(false);
  }

  const capturePage = () => {
    if (!videoRef.current) return;
    const video = videoRef.current;
    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth || 640;
    canvas.height = video.videoHeight || 480;
    
    const context = canvas.getContext('2d');
    context.drawImage(video, 0, 0, canvas.width, canvas.height);
    
    // Apply contrast enhancers before saving
    let imgData = canvas.toDataURL('image/jpeg', 0.95);
    
    if (scannerFilter !== 'none') {
      const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
      const data = imageData.data;
      
      for (let i = 0; i < data.length; i += 4) {
        const r = data[i], g = data[i + 1], b = data[i + 2];
        let v = 0.2126 * r + 0.7152 * g + 0.0722 * b; // standard grayscale conversion
        
        if (scannerFilter === 'threshold') {
          // B&W High contrast threshold
          v = (v > 120) ? 255 : 0;
          data[i] = v; data[i + 1] = v; data[i + 2] = v;
        } else if (scannerFilter === 'grayscale') {
          data[i] = v; data[i + 1] = v; data[i + 2] = v;
        }
      }
      context.putImageData(imageData, 0, 0);
      imgData = canvas.toDataURL('image/jpeg', 0.95);
    }

    setCapturedPages(prev => [...prev, imgData]);
  };

  const removeCapturedPage = (index) => {
    setCapturedPages(prev => prev.filter((_, idx) => idx !== index));
  };

  const handleSaveScannerDoc = async () => {
    if (capturedPages.length === 0) return;
    setIsProcessing(true);
    try {
      const pdf = new jsPDF();
      for (let i = 0; i < capturedPages.length; i++) {
        if (i > 0) pdf.addPage();
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = pdf.internal.pageSize.getHeight();
        pdf.addImage(capturedPages[i], 'JPEG', 5, 5, pdfWidth - 10, pdfHeight - 10);
      }
      const pdfBlob = pdf.output('blob');
      const filename = `scan_${Date.now()}.pdf`;
      downloadBlob(pdfBlob, filename);
      onAddHistory({
        fileName: filename,
        fromFormat: 'scan',
        toFormat: 'pdf',
        size: pdfBlob.size
      }, pdfBlob);
      setCapturedPages([]);
    } catch (error) {
      alert("Scanner compiling failure: " + error.message);
    }
    setIsProcessing(false);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Header */}
      <div className="space-y-2 text-center lg:text-left">
        <h2 className="text-3xl font-extrabold text-white flex items-center justify-center lg:justify-start gap-2.5">
          <FileCode className="text-emerald-400 animate-pulse" />
          {t('pdfTitle')}
        </h2>
        <p className="text-sm text-dark-400 max-w-2xl">{t('pdfSub')}</p>
      </div>

      {/* Toolbox Tabs */}
      <div className="glass-panel p-1.5 rounded-2xl border border-white/5 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-1 shadow-glass">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`text-center py-3 px-4 rounded-xl text-[10px] font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-all ${
                activeTab === tab.id
                  ? 'bg-emerald-500 text-white shadow-glow-accent'
                  : 'text-dark-400 hover:text-dark-200'
              }`}
            >
              <Icon size={12} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Main Tab Workspace rendering */}
      <div className="w-full">
        <AnimatePresence mode="wait">
          {/* 1. PDF MERGE TAB */}
          {activeTab === 'merge' && (
            <motion.div key="merge" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-6">
              <DragDropUpload onFilesSelected={handleMergeFilesSelected} accept="application/pdf" multiple={true} icon={Merge} accentColor="accent" />
              {mergeFiles.length > 0 && (
                <div className="glass-panel rounded-3xl p-6 border border-white/5 space-y-4 shadow-glass max-w-2xl mx-auto">
                  <div className="border-b border-white/5 pb-3">
                    <h3 className="font-semibold text-sm text-dark-300 uppercase tracking-widest">Files to Merge ({mergeFiles.length})</h3>
                  </div>
                  <div className="flex flex-col gap-2">
                    {mergeFiles.map((file, index) => (
                      <div key={index} className="p-3 rounded-2xl bg-white/5 border border-white/5 flex items-center justify-between gap-4">
                        <div className="flex items-center gap-3 min-w-0">
                          <span className="w-7 h-7 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-[10px] font-bold text-emerald-400 flex items-center justify-center">{index + 1}</span>
                          <div className="min-w-0">
                            <span className="block text-sm font-semibold text-dark-200 truncate pr-2">{file.name}</span>
                            <span className="block text-[11px] text-dark-400 font-mono">{formatBytes(file.size)}</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-1">
                          <button onClick={() => moveMergeFile(index, -1)} disabled={index === 0} className="p-1.5 hover:bg-white/5 text-dark-400 disabled:opacity-30"><ArrowUp size={15} /></button>
                          <button onClick={() => moveMergeFile(index, 1)} disabled={index === mergeFiles.length - 1} className="p-1.5 hover:bg-white/5 text-dark-400 disabled:opacity-30"><ArrowDown size={15} /></button>
                          <button onClick={() => removeMergeFile(index)} className="p-1.5 hover:bg-red-500/10 text-dark-500 hover:text-red-400"><Trash2 size={15} /></button>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="pt-2 flex gap-3">
                    <button onClick={() => setMergeFiles([])} className="px-5 py-3.5 rounded-2xl bg-white/5 border border-white/10 text-sm font-bold text-dark-200">Clear All</button>
                    <button onClick={handleMergeSubmit} disabled={isProcessing || mergeFiles.length < 2} className="flex-1 px-5 py-3.5 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 font-bold text-white shadow-glow-accent hover:opacity-90 active:scale-95 transition-all text-sm flex items-center justify-center gap-2">
                      {isProcessing ? <RefreshCw size={15} className="animate-spin" /> : <Download size={15} />}
                      {t('pdfMergeBtn')}
                    </button>
                  </div>
                </div>
              )}
            </motion.div>
          )}

          {/* 2. PDF SPLIT TAB */}
          {activeTab === 'split' && (
            <motion.div key="split" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-6">
              {!splitFile ? (
                <DragDropUpload onFilesSelected={handleSplitFileSelected} accept="application/pdf" multiple={false} icon={Columns} accentColor="accent" />
              ) : (
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                  <div className="lg:col-span-8 space-y-4">
                    <div className="glass-panel p-6 rounded-3xl border border-white/5 space-y-4 shadow-glass max-h-[550px] overflow-y-auto">
                      <h3 className="font-bold text-sm text-dark-300 uppercase tracking-widest">Select Page Cards</h3>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                        {splitPagePreviews.map((p, idx) => {
                          const isSelected = selectedPages.includes(p.originalIndex);
                          return (
                            <div key={p.id} onClick={() => togglePageSelection(p.originalIndex)} className={`p-2.5 rounded-2xl border transition-all cursor-pointer relative overflow-hidden bg-black/20 ${isSelected ? 'border-emerald-500 bg-emerald-500/5 shadow-glow-accent' : 'border-white/5 hover:border-white/10'}`}>
                              <img src={p.previewUrl} alt={`Page ${idx + 1}`} className="w-full h-auto rounded-lg object-contain" />
                              <div className={`absolute top-2 left-2 w-6 h-6 rounded-full flex items-center justify-center font-bold text-xs ${isSelected ? 'bg-emerald-500 text-white shadow-md' : 'bg-black/60 text-dark-300'}`}>{idx + 1}</div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                  <div className="lg:col-span-4 space-y-6">
                    <div className="glass-panel p-6 rounded-3xl border border-white/5 space-y-4 shadow-glass">
                      <h3 className="font-semibold text-sm text-dark-300 uppercase tracking-widest flex items-center gap-2"><Columns size={14} className="text-emerald-400" />Split Settings</h3>
                      <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-dark-400">Page Ranges</label>
                        <input type="text" value={splitRange} onChange={(e) => setSplitRange(e.target.value)} placeholder={t('pdfPageRangePlaceholder')} className="glass-input w-full text-sm font-semibold font-mono" />
                      </div>
                    </div>
                    <div className="flex gap-3">
                      <button onClick={() => setSplitFile(null)} className="px-5 py-3.5 rounded-2xl bg-white/5 border border-white/10 text-sm font-bold text-dark-200">New File</button>
                      <button onClick={handleSplitSubmit} disabled={isProcessing || !splitRange} className="flex-1 px-5 py-3.5 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 font-bold text-white shadow-glow-accent hover:opacity-90 active:scale-95 transition-all text-sm flex items-center justify-center gap-2">
                        {isProcessing ? <RefreshCw size={15} className="animate-spin" /> : <Download size={15} />}
                        {t('pdfSplitBtn')}
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </motion.div>
          )}

          {/* 3. PDF REARRANGE TAB */}
          {activeTab === 'rearrange' && (
            <motion.div key="rearrange" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-6">
              {!editFile ? (
                <DragDropUpload onFilesSelected={handleEditFileSelected} accept="application/pdf" multiple={false} icon={Shuffle} accentColor="accent" />
              ) : (
                <div className="space-y-6">
                  <div className="glass-panel p-6 rounded-3xl border border-white/5 space-y-4 shadow-glass max-h-[500px] overflow-y-auto">
                    <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 gap-5">
                      {editPageConfigs.map((p, idx) => (
                        <div key={p.id} className="p-2.5 rounded-2xl border border-white/5 bg-black/20 flex flex-col justify-between gap-3 relative transition-all">
                          <div className="relative aspect-[3/4] w-full rounded-lg overflow-hidden flex items-center justify-center">
                            <img src={p.previewUrl} alt={`Page`} className="max-h-full max-w-full object-contain transition-transform duration-300" style={{ transform: `rotate(${p.rotation}deg)` }} />
                            <div className="absolute top-2 left-2 bg-black/60 text-dark-300 w-6 h-6 rounded-full flex items-center justify-center font-bold text-xs">{idx + 1}</div>
                          </div>
                          <div className="flex items-center gap-1 justify-center border-t border-white/5 pt-2 text-xs">
                            <button onClick={() => rotatePage(p.id)} className="p-1 bg-white/5 text-dark-300 hover:text-emerald-400 rounded-md font-semibold flex items-center gap-1"><RotateCw size={11} />Rot</button>
                            <button onClick={() => deletePage(p.id)} className="p-1 bg-white/5 text-dark-300 hover:text-red-400 rounded-md font-semibold flex items-center gap-1"><Trash2 size={11} />Del</button>
                          </div>
                          <div className="flex gap-1 justify-between w-full text-[10px]">
                            <button onClick={() => movePageInEditor(idx, -1)} disabled={idx === 0} className="flex-1 text-center py-0.5 rounded bg-white/5 disabled:opacity-20 hover:text-emerald-400 font-bold">◀</button>
                            <button onClick={() => movePageInEditor(idx, 1)} disabled={idx === editPageConfigs.length - 1} className="flex-1 text-center py-0.5 rounded bg-white/5 disabled:opacity-20 hover:text-emerald-400 font-bold">▶</button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <button onClick={() => setEditFile(null)} className="px-5 py-3.5 rounded-2xl bg-white/5 border border-white/10 text-sm font-bold text-dark-200">Discard</button>
                    <button onClick={handleRearrangeSubmit} disabled={isProcessing || editPageConfigs.length === 0} className="flex-1 px-5 py-3.5 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 font-bold text-white shadow-glow-accent hover:opacity-90 active:scale-95 transition-all text-sm flex items-center justify-center gap-2">
                      {isProcessing ? <RefreshCw size={15} className="animate-spin" /> : <Download size={15} />}
                      {t('pdfRearrangeBtn')}
                    </button>
                  </div>
                </div>
              )}
            </motion.div>
          )}

          {/* 4. PDF COMPRESS TAB */}
          {activeTab === 'compress' && (
            <motion.div key="compress" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-6">
              {!compressFile ? (
                <DragDropUpload onFilesSelected={handleCompressFileSelected} accept="application/pdf" multiple={false} icon={FileCode} accentColor="accent" />
              ) : (
                <div className="max-w-xl mx-auto space-y-6">
                  <div className="glass-panel p-6 rounded-3xl border border-white/5 shadow-glass space-y-5">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/25 flex items-center justify-center text-emerald-400 flex-shrink-0"><FileText size={18} /></div>
                      <div className="min-w-0 flex-grow">
                        <h4 className="font-semibold text-sm text-dark-200 truncate">{compressFile.name}</h4>
                        <p className="text-xs text-dark-400 mt-0.5 font-mono">{formatBytes(compressFile.size)}</p>
                      </div>
                    </div>
                    {compressionSavings !== null && (
                      <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/25 text-emerald-400 flex items-center justify-between">
                        <div>
                          <span className="block text-xs font-bold uppercase tracking-wider">Compression complete!</span>
                          <span className="block text-sm font-semibold mt-0.5">Physical size reduced by ~{compressionSavings}%!</span>
                        </div>
                        <CheckCircle2 size={24} />
                      </div>
                    )}
                  </div>
                  <div className="flex gap-3">
                    <button onClick={() => setCompressFile(null)} className="px-5 py-3.5 rounded-2xl bg-white/5 border border-white/10 text-sm font-bold text-dark-200 flex-1">Upload New</button>
                    {compressedBlob ? (
                      <button onClick={() => downloadBlob(compressedBlob, `${compressFile.name.replace(/\.[^/.]+$/, "")}_compressed.pdf`)} className="flex-[2] px-5 py-3.5 rounded-2xl bg-emerald-500 font-bold text-white shadow-glow-accent hover:opacity-90 active:scale-95 transition-all text-sm flex items-center justify-center gap-2">
                        <Download size={15} /> Download PDF
                      </button>
                    ) : (
                      <button onClick={handleCompressSubmit} disabled={isProcessing} className="flex-[2] px-5 py-3.5 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 font-bold text-white shadow-glow-accent hover:opacity-90 active:scale-95 transition-all text-sm flex items-center justify-center gap-2">
                        {isProcessing ? <RefreshCw size={15} className="animate-spin" /> : <RefreshCw size={15} />}
                        {t('pdfCompressBtn')}
                      </button>
                    )}
                  </div>
                </div>
              )}
            </motion.div>
          )}

          {/* 5. PAGE NUMBERING TAB */}
          {activeTab === 'numbering' && (
            <motion.div key="numbering" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-6">
              {!numberFile ? (
                <DragDropUpload onFilesSelected={handleNumberFileSelected} accept="application/pdf" multiple={false} icon={Hash} accentColor="accent" />
              ) : (
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start max-w-4xl mx-auto">
                  <div className="lg:col-span-7 space-y-6">
                    <div className="glass-panel p-6 rounded-3xl border border-white/5 shadow-glass space-y-4">
                      <h3 className="font-semibold text-sm text-dark-200 uppercase tracking-wider flex items-center gap-2"><Hash size={16} className="text-emerald-400" />Page Number Layout Settings</h3>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1">
                          <label className="text-xs text-dark-400 font-bold">Position</label>
                          <select value={numPosition} onChange={(e) => setNumPosition(e.target.value)} className="w-full bg-dark-900 border border-white/10 rounded-xl p-2.5 outline-none text-xs text-dark-200 font-semibold cursor-pointer">
                            <option value="bottom-left">Bottom Left</option>
                            <option value="bottom-center">Bottom Center</option>
                            <option value="bottom-right">Bottom Right</option>
                            <option value="top-left">Top Left</option>
                            <option value="top-center">Top Center</option>
                            <option value="top-right">Top Right</option>
                          </select>
                        </div>
                        <div className="space-y-1">
                          <label className="text-xs text-dark-400 font-bold">Text format</label>
                          <select value={numTemplate} onChange={(e) => setNumTemplate(e.target.value)} className="w-full bg-dark-900 border border-white/10 rounded-xl p-2.5 outline-none text-xs text-dark-200 font-semibold cursor-pointer">
                            <option value="Page {n} of {m}">Page N of M</option>
                            <option value="Page {n}">Page N</option>
                            <option value="{n}">{`{n}`}</option>
                          </select>
                        </div>
                        <div className="space-y-1">
                          <label className="text-xs text-dark-400 font-bold">Font Color</label>
                          <select value={numColor} onChange={(e) => setNumColor(e.target.value)} className="w-full bg-dark-900 border border-white/10 rounded-xl p-2.5 outline-none text-xs text-dark-200 font-semibold cursor-pointer">
                            <option value="darkgrey">Dark Grey</option>
                            <option value="black">Deep Black</option>
                            <option value="blue">Royal Indigo</option>
                          </select>
                        </div>
                        <div className="space-y-1">
                          <label className="text-xs text-dark-400 font-bold">Font Size (pt)</label>
                          <select value={numSize} onChange={(e) => setNumSize(parseInt(e.target.value))} className="w-full bg-dark-900 border border-white/10 rounded-xl p-2.5 outline-none text-xs text-dark-200 font-semibold cursor-pointer">
                            <option value="9">9 pt</option>
                            <option value="11">11 pt</option>
                            <option value="13">13 pt</option>
                          </select>
                        </div>
                      </div>
                      {numberBlob && (
                        <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/25 text-emerald-400 flex items-center justify-between">
                          <div>
                            <span className="block text-xs font-bold uppercase">Vector numbering complete!</span>
                            <span className="block text-xs mt-0.5">Custom numbers generated client-side cleanly!</span>
                          </div>
                          <CheckCircle2 size={24} />
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="lg:col-span-5 space-y-4">
                    <div className="glass-panel p-6 rounded-3xl border border-white/5 shadow-glass space-y-3 flex flex-col justify-center">
                      <h4 className="font-semibold text-xs text-dark-300 truncate">{numberFile.name}</h4>
                      <p className="text-xs text-dark-500 font-mono">{formatBytes(numberFile.size)}</p>
                    </div>
                    <div className="flex gap-3">
                      <button onClick={() => setNumberFile(null)} className="px-5 py-3.5 rounded-2xl bg-white/5 border border-white/10 text-sm font-bold text-dark-200 flex-1">New File</button>
                      <button onClick={handleNumberingSubmit} disabled={isProcessing} className="flex-[2] px-5 py-3.5 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 font-bold text-white shadow-glow-accent hover:opacity-90 active:scale-95 transition-all text-sm flex items-center justify-center gap-2">
                        {isProcessing ? <RefreshCw size={15} className="animate-spin" /> : <Download size={15} />}
                        Draw Page Numbers
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </motion.div>
          )}

          {/* 6. CAMERA SCANNER TAB */}
          {activeTab === 'scan' && (
            <motion.div key="scan" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-6 max-w-4xl mx-auto">
              {!scannerActive && capturedPages.length === 0 ? (
                <div className="glass-panel p-10 rounded-3xl border border-white/5 text-center flex flex-col items-center justify-center min-h-[300px]">
                  <Camera size={44} className="text-emerald-400 mb-4 animate-bounce" />
                  <h4 className="font-bold text-white mb-2">WebRTC Document Camera Scanner</h4>
                  <p className="text-xs text-dark-400 max-w-md mb-6">Capture paper logs, forms, or recipes using your local camera webcam. Crops and applies contrast shaders locally.</p>
                  <button onClick={startScanner} className="px-6 py-3.5 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 font-bold text-white shadow-glow-accent hover:opacity-90 active:scale-95 transition-all text-sm flex items-center gap-2">
                    <PlayCircle size={16} /> Open Device Camera
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                  <div className="lg:col-span-7 space-y-4">
                    {scannerActive && (
                      <div className="glass-panel p-4 rounded-3xl border border-white/5 shadow-glass bg-black/40 overflow-hidden relative aspect-video flex items-center justify-center">
                        <video ref={videoRef} autoPlay playsInline className="w-full h-full object-cover rounded-2xl" />
                        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-2 bg-black/70 p-2 rounded-2xl border border-white/10 backdrop-blur">
                          <button onClick={capturePage} className="px-5 py-2.5 rounded-xl bg-emerald-500 text-white font-bold text-xs shadow-md active:scale-95 transition-all">Capture Slide</button>
                          <button onClick={stopScanner} className="px-3 py-2.5 rounded-xl bg-white/10 text-dark-300 font-semibold text-xs hover:text-white transition-all">Close Feed</button>
                        </div>
                      </div>
                    )}
                    
                    {/* Controls Shaders */}
                    {scannerActive && (
                      <div className="glass-panel p-4 rounded-3xl border border-white/5 shadow-glass flex items-center justify-between gap-4">
                        <span className="text-xs font-semibold text-dark-300">Scanner Image filter</span>
                        <select value={scannerFilter} onChange={(e) => setScannerFilter(e.target.value)} className="bg-dark-900 border border-white/10 rounded-xl px-3 py-1.5 outline-none font-medium cursor-pointer text-xs text-dark-200">
                          <option value="none">None (Full Color)</option>
                          <option value="grayscale">Grayscale</option>
                          <option value="threshold">B&W (High Contrast)</option>
                        </select>
                      </div>
                    )}

                    {capturedPages.length > 0 && (
                      <div className="glass-panel p-6 rounded-3xl border border-white/5 shadow-glass space-y-4">
                        <h3 className="font-semibold text-sm text-dark-300 uppercase tracking-widest">Captured Pages ({capturedPages.length})</h3>
                        <div className="grid grid-cols-3 sm:grid-cols-4 gap-4 max-h-[250px] overflow-y-auto pr-1">
                          {capturedPages.map((src, idx) => (
                            <div key={idx} className="relative p-1 border border-white/10 rounded-xl bg-black/25 group overflow-hidden">
                              <img src={src} alt="Captured" className="w-full h-auto object-contain rounded-lg" />
                              <button onClick={() => removeCapturedPage(idx)} className="absolute top-1.5 right-1.5 p-1 bg-red-500/90 text-white rounded-md text-[10px] opacity-0 group-hover:opacity-100 transition-opacity">✖</button>
                              <div className="absolute bottom-1.5 left-1.5 bg-black/60 text-[9px] font-bold text-white px-1.5 py-0.5 rounded-md">Page {idx + 1}</div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="lg:col-span-5 space-y-6">
                    <div className="glass-panel p-6 rounded-3xl border border-white/5 shadow-glass space-y-4">
                      <h3 className="font-semibold text-sm text-dark-300 uppercase tracking-widest flex items-center gap-2"><ShieldCheck size={14} className="text-emerald-400" />Capture Suite</h3>
                      <p className="text-xs text-dark-400 leading-relaxed">Ensure camera feed is illuminated clearly. Captured photos remain solely in visual state memory blocks.</p>
                      
                      {!scannerActive && capturedPages.length > 0 && (
                        <button onClick={startScanner} className="w-full py-3 rounded-2xl bg-white/5 border border-white/10 text-xs font-semibold text-dark-200">Re-open Camera Feed</button>
                      )}
                    </div>
                    
                    <button onClick={handleSaveScannerDoc} disabled={capturedPages.length === 0 || isProcessing} className="w-full px-5 py-3.5 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 font-bold text-white shadow-glow-accent hover:opacity-90 active:scale-95 transition-all text-sm flex items-center justify-center gap-2 disabled:opacity-50">
                      {isProcessing ? <RefreshCw size={15} className="animate-spin" /> : <Download size={15} />}
                      Compile Scan as PDF
                    </button>
                  </div>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
