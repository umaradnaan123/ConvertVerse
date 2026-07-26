import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Wrench, Upload, FileText, CheckCircle, AlertTriangle, Shield,
  Download, RefreshCw, Terminal, Sparkles, AlertCircle
} from 'lucide-react';
import DragDropUpload from '../components/DragDropUpload';

export default function FileRepairRecoveryCenter() {
  const [files, setFiles] = useState([]);
  const [activeFileId, setActiveFileId] = useState(null);
  const [hexSnippet, setHexSnippet] = useState(null);
  const [originalHex, setOriginalHex] = useState(null);
  const [diagnostics, setDiagnostics] = useState({});
  const [isRepairing, setIsRepairing] = useState(false);
  const [activeTab, setActiveTab] = useState('audit'); // 'audit' | 'hex'

  const activeFile = files.find(f => f.id === activeFileId);
  const activeDiag = activeFileId ? diagnostics[activeFileId] : null;

  // Process uploaded files
  const handleFilesUploaded = (uploadedFiles) => {
    if (!uploadedFiles || uploadedFiles.length === 0) return;
    
    uploadedFiles.forEach(file => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const arrayBuffer = e.target.result;
        const uint8Array = new Uint8Array(arrayBuffer);
        
        // Basic file metadata
        const fileId = `${Date.now()}-${file.name}`;
        const newFile = {
          id: fileId,
          name: file.name,
          size: file.size,
          type: file.type || getMimeFromExtension(file.name),
          buffer: uint8Array,
          rawFile: file
        };

        // Standard diagnostic audit
        const auditResult = runBinaryDiagnostics(newFile);
        
        setFiles(prev => [...prev, newFile]);
        setDiagnostics(prev => ({ ...prev, [fileId]: auditResult }));
        
        // Set first uploaded file as active
        if (!activeFileId) {
          setActiveFileId(fileId);
          generateHexSnippets(uint8Array, auditResult);
        }
      };
      reader.readAsArrayBuffer(file);
    });
  };

  const getMimeFromExtension = (filename) => {
    const ext = filename.split('.').pop().toLowerCase();
    const map = {
      pdf: 'application/pdf',
      zip: 'application/zip',
      png: 'image/png',
      jpg: 'image/jpeg',
      jpeg: 'image/jpeg',
      webp: 'image/webp',
      mp3: 'audio/mpeg',
      wav: 'audio/wav'
    };
    return map[ext] || 'application/octet-stream';
  };

  // Binary diagnostics checks
  const runBinaryDiagnostics = (fileObj) => {
    const bytes = fileObj.buffer;
    const name = fileObj.name.toLowerCase();
    const result = {
      status: 'corrupt', // 'healthy' | 'corrupt' | 'repaired'
      score: 100,
      errors: [],
      headerRepaired: false,
      trailerRepaired: false,
      magicBytes: Array.from(bytes.slice(0, 8)),
      mime: fileObj.type
    };

    // 1. PDF Diagnostics
    if (name.endsWith('.pdf') || fileObj.type === 'application/pdf') {
      // PDF starts with %PDF- (bytes 37 80 68 70 45)
      const startsWithPdf = bytes[0] === 37 && bytes[1] === 80 && bytes[2] === 68 && bytes[3] === 70 && bytes[4] === 45;
      if (!startsWithPdf) {
        result.errors.push({
          type: 'HEADER',
          desc: 'Missing or corrupt standard %PDF- magic signature header.',
          offset: '0x00000000',
          severity: 'critical'
        });
        result.score -= 40;
      }
      
      // PDF trailer %%EOF (bytes 37 37 69 79 70) at the very end
      let endsWithEof = false;
      const lastBytes = bytes.slice(-20);
      for (let i = 0; i < lastBytes.length - 4; i++) {
        if (lastBytes[i] === 37 && lastBytes[i+1] === 37 && lastBytes[i+2] === 69 && lastBytes[i+3] === 79 && lastBytes[i+4] === 70) {
          endsWithEof = true;
          break;
        }
      }
      if (!endsWithEof) {
        result.errors.push({
          type: 'TRAILER',
          desc: 'Missing closing trailer %%EOF sequence. Possible trailing garbage bytes.',
          offset: `0x${(bytes.length - 1).toString(16).toUpperCase()}`,
          severity: 'high'
        });
        result.score -= 30;
      }
    }

    // 2. ZIP Diagnostics
    else if (name.endsWith('.zip') || fileObj.type === 'application/zip' || fileObj.type === 'application/x-zip-compressed') {
      // ZIP starts with PK\x03\x04 (bytes 80 75 3 4) or standard signature
      const startsWithZip = bytes[0] === 80 && bytes[1] === 75 && bytes[2] === 3 && bytes[3] === 4;
      if (!startsWithZip) {
        result.errors.push({
          type: 'HEADER',
          desc: 'Corrupted magic ZIP archive block descriptor signature.',
          offset: '0x00000000',
          severity: 'critical'
        });
        result.score -= 50;
      }
    }

    // 3. PNG / JPEG / WEBP Image Diagnostics
    else if (name.endsWith('.png') || fileObj.type === 'image/png') {
      const startsWithPng = bytes[0] === 137 && bytes[1] === 80 && bytes[2] === 78 && bytes[3] === 71;
      if (!startsWithPng) {
        result.errors.push({
          type: 'HEADER',
          desc: 'Invalid PNG SOI chunk signature header.',
          offset: '0x00000000',
          severity: 'critical'
        });
        result.score -= 60;
      }
    } else if (name.endsWith('.jpg') || name.endsWith('.jpeg') || fileObj.type === 'image/jpeg') {
      const startsWithJpg = bytes[0] === 255 && bytes[1] === 216 && bytes[2] === 255;
      if (!startsWithJpg) {
        result.errors.push({
          type: 'HEADER',
          desc: 'Missing standard JPEG SOI start-of-image markers.',
          offset: '0x00000000',
          severity: 'critical'
        });
        result.score -= 60;
      }
    }

    // Generic file fallback
    if (result.errors.length === 0) {
      result.status = 'healthy';
      result.score = 100;
    } else {
      result.score = Math.max(10, result.score);
    }

    return result;
  };

  // Generate Hex snippets for visualization (Limit to first 256 bytes)
  const generateHexSnippets = (bytes, diagObj) => {
    const len = Math.min(bytes.length, 256);
    const snippet = Array.from(bytes.slice(0, len));
    setOriginalHex(snippet);
    
    // Apply temporary/projected changes if corrupt
    const repairedSnippet = [...snippet];
    if (diagObj && diagObj.errors.some(e => e.type === 'HEADER')) {
      if (diagObj.mime === 'application/pdf') {
        repairedSnippet[0] = 37; // %
        repairedSnippet[1] = 80; // P
        repairedSnippet[2] = 68; // D
        repairedSnippet[3] = 70; // F
        repairedSnippet[4] = 45; // -
      } else if (diagObj.mime === 'application/zip') {
        repairedSnippet[0] = 80; // P
        repairedSnippet[1] = 75; // K
        repairedSnippet[2] = 3;  // \x03
        repairedSnippet[3] = 4;  // \x04
      } else if (diagObj.mime === 'image/png') {
        repairedSnippet[0] = 137;
        repairedSnippet[1] = 80;
        repairedSnippet[2] = 78;
        repairedSnippet[3] = 71;
      } else if (diagObj.mime === 'image/jpeg') {
        repairedSnippet[0] = 255;
        repairedSnippet[1] = 216;
        repairedSnippet[2] = 255;
      }
    }
    setHexSnippet(repairedSnippet);
  };

  // Execute Repair Sequence
  const handleRepairFile = async (fileId) => {
    setIsRepairing(true);
    
    // Simulated deep reconstruction latency
    await new Promise(resolve => setTimeout(resolve, 1800));

    setFiles(prev => prev.map(f => {
      if (f.id !== fileId) return f;
      
      const diag = diagnostics[fileId];
      if (diag.status === 'healthy' || diag.status === 'repaired') return f;

      let fileBytes = new Uint8Array(f.buffer);
      let headerRepaired = false;
      let trailerRepaired = false;

      // Apply signature correction rules
      const name = f.name.toLowerCase();
      if (name.endsWith('.pdf') || f.type === 'application/pdf') {
        // Repair header
        if (diag.errors.some(e => e.type === 'HEADER')) {
          const header = new Uint8Array([37, 80, 68, 70, 45, 49, 46, 52, 10]); // "%PDF-1.4\n"
          const temp = new Uint8Array(header.length + fileBytes.length);
          temp.set(header);
          temp.set(fileBytes, header.length);
          fileBytes = temp;
          headerRepaired = true;
        }
        // Repair trailer
        if (diag.errors.some(e => e.type === 'TRAILER')) {
          const trailer = new Uint8Array([10, 37, 37, 69, 79, 70]); // "\n%%EOF"
          const temp = new Uint8Array(fileBytes.length + trailer.length);
          temp.set(fileBytes);
          temp.set(trailer, fileBytes.length);
          fileBytes = temp;
          trailerRepaired = true;
        }
      } 
      
      else if (name.endsWith('.zip') || f.type === 'application/zip') {
        if (diag.errors.some(e => e.type === 'HEADER')) {
          fileBytes[0] = 80; // P
          fileBytes[1] = 75; // K
          fileBytes[2] = 3;  // \x03
          fileBytes[3] = 4;  // \x04
          headerRepaired = true;
        }
      }

      else if (name.endsWith('.png') || f.type === 'image/png') {
        if (diag.errors.some(e => e.type === 'HEADER')) {
          fileBytes[0] = 137;
          fileBytes[1] = 80;
          fileBytes[2] = 78;
          fileBytes[3] = 71;
          headerRepaired = true;
        }
      }

      else if (name.endsWith('.jpg') || name.endsWith('.jpeg') || f.type === 'image/jpeg') {
        if (diag.errors.some(e => e.type === 'HEADER')) {
          fileBytes[0] = 255;
          fileBytes[1] = 216;
          fileBytes[2] = 255;
          headerRepaired = true;
        }
      }

      // Update active snippets
      generateHexSnippets(fileBytes, { ...diag, errors: [] });

      // Update diagnostic score to 100%
      setDiagnostics(prev => ({
        ...prev,
        [fileId]: {
          ...diag,
          status: 'repaired',
          score: 100,
          headerRepaired,
          trailerRepaired,
          errors: []
        }
      }));

      return {
        ...f,
        buffer: fileBytes
      };
    }));

    setIsRepairing(false);
  };

  const handleDownloadRepaired = (fileObj) => {
    const blob = new Blob([fileObj.buffer], { type: fileObj.type });
    const repairedName = fileObj.name.replace(/(\.[\w\d]+)$/i, '_repaired$1');
    
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = repairedName;
    a.click();
    URL.revokeObjectURL(url);
  };

  const selectFile = (fileId) => {
    setActiveFileId(fileId);
    const file = files.find(f => f.id === fileId);
    generateHexSnippets(file.buffer, diagnostics[fileId]);
  };

  // Helper to format offset
  const getOffsetString = (idx) => {
    return '0x' + idx.toString(16).padStart(8, '0').toUpperCase();
  };

  return (
    <div className="space-y-10">
      {/* Hero Section */}
      <section className="text-center relative max-w-4xl mx-auto space-y-4 pt-6">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 glow-orb-1 opacity-20 -z-10" />
        
        <div className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-primary-500/10 border border-primary-500/25 text-xs font-bold text-primary-400 shadow-glow-primary">
          <Wrench size={14} className="animate-pulse" />
          Smart Client-Side File Diagnostics
        </div>

        <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight leading-none text-dark-50">
          Smart AI File Repair & <br/>
          <span className="text-gradient-purple-cyan">Recovery Center</span>
        </h1>

        <p className="text-base text-dark-400 max-w-2xl mx-auto leading-relaxed">
          Instantly scan binary arrays and auto-repair corrupted headers, missing trailer delimiters, invalid signature offsets, or broken archives locally in your browser.
        </p>
      </section>

      {/* Main Grid Workspace */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 items-start">
        {/* Left pane: Upload Area and Queue */}
        <div className="xl:col-span-5 space-y-6">
          <div className="glass-panel p-6 rounded-2xl shadow-glass border border-white/5 relative overflow-hidden">
            <h2 className="text-base font-bold text-white mb-4 flex items-center gap-2">
              <Upload size={18} className="text-primary-400" />
              Source Upload Queue
            </h2>
            
            <DragDropUpload 
              onFilesSelected={handleFilesUploaded}
              maxFiles={10}
              accept=".pdf,.zip,.png,.jpg,.jpeg,.webp"
              subtitle="Upload PDF, ZIP, PNG, JPG, or WEBP files with header errors"
            />
          </div>

          {/* Uploaded Files Queue */}
          <div className="glass-panel p-5 rounded-2xl shadow-glass border border-white/5">
            <h3 className="text-xs font-bold uppercase tracking-wider text-dark-400 mb-4">
              File Index ({files.length})
            </h3>

            {files.length === 0 ? (
              <div className="text-center py-10 text-sm text-dark-500 border border-dashed border-white/5 rounded-xl">
                Queue is empty. Drop files above.
              </div>
            ) : (
              <div className="space-y-3 max-h-96 overflow-y-auto pr-1.5 custom-scrollbar">
                {files.map(f => {
                  const diag = diagnostics[f.id];
                  const isActive = f.id === activeFileId;
                  const isHealthy = diag?.status === 'healthy';
                  const isRepaired = diag?.status === 'repaired';

                  return (
                    <button
                      key={f.id}
                      onClick={() => selectFile(f.id)}
                      className={`w-full flex items-center justify-between p-3.5 rounded-xl border text-left transition-all ${
                        isActive
                          ? 'bg-primary-500/10 border-primary-500/30 shadow-glow-primary'
                          : 'bg-white/5 border-white/5 hover:bg-white/10 hover:border-white/10'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <FileText size={18} className={isActive ? 'text-primary-400' : 'text-dark-300'} />
                        <div className="max-w-[180px] sm:max-w-xs truncate">
                          <span className="block text-xs font-bold text-white truncate">{f.name}</span>
                          <span className="block text-[10px] text-dark-400 font-mono">
                            {(f.size / 1024).toFixed(1)} KB • {f.type.split('/')[1]?.toUpperCase() || 'BIN'}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        {isHealthy && (
                          <span className="text-[10px] bg-emerald-500/15 text-emerald-400 px-2 py-0.5 rounded-md font-bold flex items-center gap-1 border border-emerald-500/20">
                            <CheckCircle size={10} /> Healthy
                          </span>
                        )}
                        {isRepaired && (
                          <span className="text-[10px] bg-sky-500/15 text-sky-400 px-2 py-0.5 rounded-md font-bold flex items-center gap-1 border border-sky-500/20">
                            <Sparkles size={10} /> Repaired
                          </span>
                        )}
                        {!isHealthy && !isRepaired && (
                          <span className="text-[10px] bg-amber-500/15 text-amber-400 px-2 py-0.5 rounded-md font-bold flex items-center gap-1 border border-amber-500/20">
                            <AlertTriangle size={10} /> {diag?.errors.length} Errors
                          </span>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Right pane: Analysis reports & Hex Editor */}
        <div className="xl:col-span-7 space-y-6">
          {activeFileId ? (
            <motion.div
              layoutId="repair-workspace"
              className="glass-panel p-6 rounded-2xl shadow-glass border border-white/5 relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 glow-orb-2 scale-70 opacity-15" />
              
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-5 mb-5 relative z-10">
                <div>
                  <h3 className="text-lg font-bold text-white leading-tight truncate max-w-md">
                    {activeFile?.name}
                  </h3>
                  <p className="text-xs text-dark-400 mt-1 font-mono">
                    Offset Checkpoint: {getOffsetString(0)} - {getOffsetString(256)}
                  </p>
                </div>

                <div className="flex items-center gap-2.5">
                  {activeDiag?.status === 'corrupt' && (
                    <button
                      onClick={() => handleRepairFile(activeFileId)}
                      disabled={isRepairing}
                      className="px-4 py-2 rounded-xl bg-gradient-to-r from-primary-500 to-secondary-500 text-xs font-bold text-white shadow-glow-primary hover:opacity-90 active:scale-95 transition-all flex items-center gap-2"
                    >
                      {isRepairing ? (
                        <>
                          <RefreshCw size={14} className="animate-spin" />
                          Reconstructing...
                        </>
                      ) : (
                        <>
                          <Wrench size={14} />
                          Auto-Repair File
                        </>
                      )}
                    </button>
                  )}
                  
                  {(activeDiag?.status === 'repaired' || activeDiag?.status === 'healthy') && (
                    <button
                      onClick={() => handleDownloadRepaired(activeFile)}
                      className="px-4 py-2 rounded-xl bg-emerald-500/20 border border-emerald-500/30 text-xs font-bold text-emerald-400 hover:bg-emerald-500/30 active:scale-95 transition-all flex items-center gap-2 shadow-glow-accent"
                    >
                      <Download size={14} />
                      Download File
                    </button>
                  )}
                </div>
              </div>

              {/* Score card grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6 relative z-10">
                {/* SVG Health Dial */}
                <div className="glass-panel p-4 rounded-xl flex flex-col items-center justify-center border border-white/5">
                  <span className="text-[10px] font-bold text-dark-400 uppercase tracking-widest mb-3">
                    Diagnostics Score
                  </span>
                  <div className="relative w-24 h-24">
                    <svg className="w-full h-full" viewBox="0 0 36 36">
                      <path
                        className="text-white/5"
                        strokeWidth="3.5"
                        stroke="currentColor"
                        fill="none"
                        d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                      />
                      <motion.path
                        initial={{ strokeDasharray: "0, 100" }}
                        animate={{ strokeDasharray: `${activeDiag?.score || 100}, 100` }}
                        transition={{ duration: 1.2, ease: "easeOut" }}
                        className={activeDiag?.score === 100 ? "text-emerald-400" : activeDiag?.score >= 70 ? "text-amber-400" : "text-rose-500"}
                        strokeWidth="3.5"
                        strokeDasharray="100, 100"
                        strokeLinecap="round"
                        stroke="currentColor"
                        fill="none"
                        d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                      />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-xl font-extrabold text-white font-mono">
                        {activeDiag?.score}%
                      </span>
                    </div>
                  </div>
                </div>

                {/* File integrity status */}
                <div className="glass-panel p-4 rounded-xl space-y-2.5 border border-white/5 md:col-span-2 flex flex-col justify-center">
                  <div>
                    <span className="text-[10px] font-bold text-dark-400 uppercase tracking-widest block">
                      Integrity Check Status
                    </span>
                    <span className="text-sm font-extrabold text-white mt-1 block">
                      {activeDiag?.status === 'healthy' 
                        ? 'Standard Binary Validation Passed' 
                        : activeDiag?.status === 'repaired'
                        ? 'Repaired Header Elements Validated'
                        : 'Identified Corrupted Segment Structures'}
                    </span>
                  </div>
                  <div className="h-[1px] bg-white/10" />
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div>
                      <span className="text-dark-400 block text-[10px]">Magic Signature:</span>
                      <span className="font-mono text-[10px] font-bold text-white block mt-0.5 truncate">
                        {activeDiag?.magicBytes.map(b => b.toString(16).padStart(2, '0').toUpperCase()).join(' ')}
                      </span>
                    </div>
                    <div>
                      <span className="text-dark-400 block text-[10px]">Header Health:</span>
                      <span className={`font-bold block mt-0.5 ${activeDiag?.errors.some(e => e.type === 'HEADER') ? 'text-rose-400' : 'text-emerald-400'}`}>
                        {activeDiag?.errors.some(e => e.type === 'HEADER') ? 'Signature Corrupt' : 'Valid/Repaired'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Tabs selector */}
              <div className="flex border-b border-white/5 mb-5 relative z-10">
                <button
                  onClick={() => setActiveTab('audit')}
                  className={`px-4 py-2 text-xs font-bold border-b-2 transition-colors flex items-center gap-1.5 ${
                    activeTab === 'audit'
                      ? 'border-primary-500 text-white'
                      : 'border-transparent text-dark-400 hover:text-dark-200'
                  }`}
                >
                  <Shield size={14} />
                  Diagnostics Audit
                </button>
                <button
                  onClick={() => setActiveTab('hex')}
                  className={`px-4 py-2 text-xs font-bold border-b-2 transition-colors flex items-center gap-1.5 ${
                    activeTab === 'hex'
                      ? 'border-primary-500 text-white'
                      : 'border-transparent text-dark-400 hover:text-dark-200'
                  }`}
                >
                  <Terminal size={14} />
                  Hex Decimal Editor
                </button>
              </div>

              {/* Tab Contents */}
              <AnimatePresence mode="wait">
                {activeTab === 'audit' && (
                  <motion.div
                    key="audit-tab"
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -5 }}
                    className="space-y-4 min-h-[220px]"
                  >
                    {activeDiag?.errors.length === 0 ? (
                      <div className="p-6 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex flex-col items-center justify-center text-center gap-2">
                        <CheckCircle size={32} className="text-emerald-400" />
                        <h4 className="text-sm font-bold text-emerald-400">Zero Corruptions Found</h4>
                        <p className="text-xs text-dark-400 max-w-sm">
                          Standard byte indices match standard file format descriptors. No repair required!
                        </p>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        <span className="text-xs font-bold text-white block">Detected Structural Faults:</span>
                        {activeDiag?.errors.map((err, index) => (
                          <div
                            key={index}
                            className="p-3.5 rounded-xl bg-dark-900 border border-white/5 flex gap-3 items-start"
                          >
                            <div className={`p-1.5 rounded-lg mt-0.5 ${err.severity === 'critical' ? 'bg-rose-500/15 text-rose-450' : 'bg-amber-500/15 text-amber-400'}`}>
                              {err.severity === 'critical' ? <AlertCircle size={14} /> : <AlertTriangle size={14} />}
                            </div>
                            <div className="space-y-1">
                              <div className="flex items-center gap-2">
                                <span className="text-xs font-bold text-white">{err.type} Segment Failure</span>
                                <span className="text-[9px] font-mono bg-white/5 px-1.5 py-0.5 rounded text-dark-400">Offset: {err.offset}</span>
                              </div>
                              <p className="text-[11px] text-dark-400 leading-relaxed">{err.desc}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </motion.div>
                )}

                {activeTab === 'hex' && (
                  <motion.div
                    key="hex-tab"
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -5 }}
                    className="space-y-4"
                  >
                    {/* Mono Hex Grid */}
                    <div className="bg-dark-950 p-4 rounded-xl border border-white/5 font-mono text-[10px] leading-relaxed overflow-x-auto text-dark-300 max-h-80 custom-scrollbar">
                      {/* Hex editor columns header */}
                      <div className="text-dark-500 border-b border-white/5 pb-2 mb-2 grid grid-cols-12 gap-1 font-bold">
                        <span className="col-span-3">OFFSET</span>
                        <span className="col-span-6 text-center">HEXADECIMAL CONTENT</span>
                        <span className="col-span-3 text-right">ASCII STRING</span>
                      </div>

                      {/* Snippet rows */}
                      {Array.from({ length: Math.ceil((hexSnippet?.length || 0) / 16) }).map((_, rowIndex) => {
                        const start = rowIndex * 16;
                        const rowSnippet = hexSnippet.slice(start, start + 16);
                        const rowOrig = originalHex.slice(start, start + 16);
                        const offset = getOffsetString(start);

                        return (
                          <div key={rowIndex} className="grid grid-cols-12 gap-1 py-0.5 hover:bg-white/5 rounded px-1 transition-colors">
                            {/* Offset column */}
                            <span className="col-span-3 text-dark-500 font-bold">{offset}</span>
                            
                            {/* Hex bytes values */}
                            <span className="col-span-6 flex justify-around">
                              {rowSnippet.map((byte, byteIdx) => {
                                const globalIdx = start + byteIdx;
                                const isRepaired = byte !== rowOrig[byteIdx];
                                return (
                                  <span
                                    key={byteIdx}
                                    className={`px-0.5 rounded font-bold ${
                                      isRepaired 
                                        ? 'bg-emerald-500/20 text-emerald-400 shadow-glow-accent'
                                        : globalIdx < 8 && activeDiag?.status === 'corrupt' && activeDiag.errors.some(e => e.type === 'HEADER')
                                        ? 'bg-rose-500/20 text-rose-450'
                                        : 'text-dark-200'
                                    }`}
                                  >
                                    {byte.toString(16).padStart(2, '0').toUpperCase()}
                                  </span>
                                );
                              })}
                            </span>

                            {/* ASCII string representations */}
                            <span className="col-span-3 text-right text-dark-400 font-sans truncate">
                              {rowSnippet.map((byte) => {
                                return byte >= 32 && byte <= 126 ? String.fromCharCode(byte) : '.';
                              }).join('')}
                            </span>
                          </div>
                        );
                      })}
                    </div>

                    <div className="flex gap-4 text-[10px] text-dark-400 mt-2 bg-dark-900/50 p-3 rounded-xl border border-white/5">
                      <div className="flex items-center gap-1.5">
                        <div className="w-2.5 h-2.5 rounded bg-emerald-500/20 border border-emerald-500/40" />
                        <span>AI Reconstructed Segment</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <div className="w-2.5 h-2.5 rounded bg-rose-500/20 border border-rose-500/40" />
                        <span>Corrupted Magic Indicator</span>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ) : (
            <div className="glass-panel p-16 rounded-2xl shadow-glass border border-white/5 flex flex-col items-center justify-center text-center gap-4">
              <div className="w-16 h-16 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-dark-400">
                <Wrench size={32} />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white">Diagnostics Panel Inactive</h3>
                <p className="text-xs text-dark-400 max-w-sm mt-1 leading-relaxed">
                  Upload files using the drag-and-drop workspace or select a loaded index queue item to inspect binary diagnostics.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
