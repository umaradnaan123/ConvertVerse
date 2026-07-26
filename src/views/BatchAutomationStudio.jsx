import { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { 
  Play, Settings, Files, Trash2, Sliders, RefreshCw,
  FolderClosed, Download, FileText, Plus
} from 'lucide-react';
import JSZip from 'jszip';
import { downloadBlob } from '../utils/downloadHelper';

export default function BatchAutomationStudio() {
  const [pipelineSteps, setPipelineSteps] = useState([
    { id: 'rename', name: 'Auto Renamer Schema', enabled: true, icon: '🏷️' },
    { id: 'compress', name: 'Client Quality Compress', enabled: true, icon: '🗜️' },
    { id: 'watermark', name: 'Bulk Watermark Overlay', enabled: false, icon: '💧' }
  ]);

  // Batch queue states
  const [stagedFiles, setStagedFiles] = useState([]);
  const [processing, setProcessing] = useState(false);
  const [processedCount, setProcessedCount] = useState(0);
  const [savedBytesTotal, setSavedBytesTotal] = useState(0);
  const [outputZipBlob, setOutputZipBlob] = useState(null);

  // Configuration States
  const [renamePrefix, setRenamePrefix] = useState('convertverse_batch');
  const [compressLevel, setCompressLevel] = useState(75); // quality percent
  const [watermarkText, setWatermarkText] = useState('© Glow Enterprise');

  const fileInputRef = useRef(null);
  const canvasRef = useRef(null);

  const togglePipelineStep = (id) => {
    setPipelineSteps(prev => prev.map(step => 
      step.id === id ? { ...step, enabled: !step.enabled } : step
    ));
  };

  const handleBatchUpload = (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    setStagedFiles(prev => [
      ...prev,
      ...files.map(f => ({
        id: `${Date.now()}-${f.name}`,
        file: f,
        name: f.name,
        size: f.size,
        sizeFormatted: formatBytes(f.size),
        status: 'staged', // staged, processing, completed, error
        outSizeFormatted: '-'
      }))
    ]);
    setOutputZipBlob(null);
  };

  const clearStagedQueue = () => {
    setStagedFiles([]);
    setProcessedCount(0);
    setSavedBytesTotal(0);
    setOutputZipBlob(null);
  };

  const deleteQueueItem = (id) => {
    setStagedFiles(prev => prev.filter(f => f.id !== id));
  };

  // ----------------------------------------------------
  // BATCH AUTOMATION PIPELINE EXECUTOR
  // ----------------------------------------------------
  const executeBatchPipeline = async () => {
    if (stagedFiles.length === 0) return;
    setProcessing(true);
    setProcessedCount(0);
    
    let totalSavedBytes = 0;
    const zip = new JSZip();
    const updatedQueue = [...stagedFiles];

    try {
      for (let i = 0; i < updatedQueue.length; i++) {
        const item = updatedQueue[i];
        
        // Mark processing state
        item.status = 'processing';
        setStagedFiles([...updatedQueue]);

        // Mock short delay for smooth UI progression
        await new Promise(r => setTimeout(r, 400));

        let currentBlob = item.file;
        let currentName = item.name;

        // Step 1: Auto Renamer
        const renameStep = pipelineSteps.find(s => s.id === 'rename');
        if (renameStep?.enabled) {
          const ext = item.name.split('.').pop() || '';
          currentName = `${renamePrefix}_${i + 1}.${ext}`;
        }

        // Step 2 & 3: Compress or Watermark (Requires Image Canvas Processing)
        const compressStep = pipelineSteps.find(s => s.id === 'compress');
        const watermarkStep = pipelineSteps.find(s => s.id === 'watermark');
        const isImage = item.file.type.startsWith('image/');

        if (isImage && (compressStep?.enabled || watermarkStep?.enabled)) {
          currentBlob = await new Promise((resolve) => {
            const img = new Image();
            img.onload = () => {
              const canvas = canvasRef.current;
              const ctx = canvas.getContext('2d');
              
              canvas.width = img.naturalWidth || img.width;
              canvas.height = img.naturalHeight || img.height;

              ctx.drawImage(img, 0, 0);

              // Apply Text Watermark Overlay
              if (watermarkStep?.enabled) {
                ctx.save();
                ctx.fillStyle = 'rgba(255, 255, 255, 0.45)';
                ctx.font = `bold ${Math.max(14, canvas.width * 0.035)}px sans-serif`;
                ctx.textAlign = 'right';
                
                // Shadow background for legibility
                ctx.shadowColor = 'rgba(0,0,0,0.3)';
                ctx.shadowBlur = 4;
                ctx.fillText(watermarkText, canvas.width - 20, canvas.height - 20);
                ctx.restore();
              }

              // Apply Quality Compression
              const qualityFactor = compressStep?.enabled ? (compressLevel / 100) : 0.9;
              canvas.toBlob((blob) => {
                resolve(blob || item.file);
              }, 'image/jpeg', qualityFactor);
            };

            const reader = new FileReader();
            reader.onload = (e) => {
              img.src = e.target.result;
            };
            reader.readAsDataURL(item.file);
          });
        }

        // Save file to zip
        zip.file(currentName, currentBlob);

        // Update item details
        item.status = 'completed';
        item.outSizeFormatted = formatBytes(currentBlob.size);
        
        // Track byte efficiency savings
        const delta = Math.max(0, item.size - currentBlob.size);
        totalSavedBytes += delta;

        setProcessedCount(i + 1);
        setStagedFiles([...updatedQueue]);
      }

      // Generate export bundle
      const zipBlob = await zip.generateAsync({ type: 'blob' });
      setOutputZipBlob(zipBlob);
      setSavedBytesTotal(totalSavedBytes);
    } catch (err) {
      console.error(err);
      alert('Pipeline execution halted due to system buffer issues.');
    } finally {
      setProcessing(false);
    }
  };

  const formatBytes = (bytes, decimals = 2) => {
    if (bytes === 0 || isNaN(bytes)) return '0 Bytes';
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
  };

  return (
    <div className="py-4 space-y-8 flex-grow flex flex-col justify-between min-h-[500px]">
      <div className="flex flex-col gap-6">
        
        {/* Title Header */}
        <div>
          <h2 className="text-xl font-extrabold text-white flex items-center gap-2">
            <Files className="text-emerald-400" size={24} />
            Universal Batch Automation Studio
          </h2>
          <p className="text-xs text-dark-400 mt-1">
            Build custom browser-based automation workflows to process hundreds of files simultaneously. Rename schemas, watermark stacks, and compress packages instantly.
          </p>
        </div>

        {/* -------------------- MAIN AUTOMATION WORKSPACE GRID -------------------- */}
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">
          
          {/* Column 1: Pipeline Stage Editor Configurations */}
          <div className="xl:col-span-4 space-y-5">
            
            {/* Visual stage togglers */}
            <div className="glass-panel p-5 rounded-2xl border border-white/5 space-y-4">
              <span className="text-xs font-bold text-white block flex items-center gap-2">
                <Settings size={14} className="text-emerald-400" />
                Workflow Pipeline Constructor
              </span>
              
              <div className="flex flex-col gap-2">
                {pipelineSteps.map((step) => (
                  <div
                    key={step.id}
                    onClick={() => togglePipelineStep(step.id)}
                    className={`p-3 rounded-xl border flex justify-between items-center cursor-pointer transition-all ${
                      step.enabled
                        ? 'bg-emerald-500/10 border-emerald-500/35 text-white'
                        : 'bg-white/5 border-transparent text-dark-400 hover:text-dark-200'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-base">{step.icon}</span>
                      <span className="text-xs font-bold">{step.name}</span>
                    </div>
                    <div className={`w-3.5 h-3.5 rounded-full border-2 ${step.enabled ? 'bg-emerald-400 border-emerald-400' : 'border-dark-500'}`} />
                  </div>
                ))}
              </div>
            </div>

            {/* Stage settings configurations */}
            <div className="glass-panel p-5 rounded-2xl border border-white/5 space-y-4">
              <span className="text-xs font-bold text-white block flex items-center gap-2">
                <Sliders size={14} className="text-emerald-400" />
                Selected Action Parameters
              </span>

              {/* Action 1: Rename Input */}
              {pipelineSteps.find(s => s.id === 'rename')?.enabled && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className="space-y-1.5 text-xs"
                >
                  <label className="text-dark-300 font-semibold">Renaming Schema Prefix</label>
                  <input
                    type="text"
                    value={renamePrefix}
                    onChange={(e) => setRenamePrefix(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-white font-mono"
                    placeholder="batch_prefix"
                  />
                  <span className="text-[9px] text-dark-450 block">Renames to: prefix_1.ext, prefix_2.ext...</span>
                </motion.div>
              )}

              {/* Action 2: Compression factor */}
              {pipelineSteps.find(s => s.id === 'compress')?.enabled && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className="space-y-2 pt-2 border-t border-white/5 text-xs"
                >
                  <div className="flex justify-between font-bold">
                    <span className="text-dark-300">Compression Quality Limit</span>
                    <span className="text-emerald-400 font-mono">{compressLevel}%</span>
                  </div>
                  <input
                    type="range"
                    min="10"
                    max="90"
                    step="5"
                    value={compressLevel}
                    onChange={(e) => setCompressLevel(parseInt(e.target.value))}
                    className="w-full accent-emerald-500"
                  />
                </motion.div>
              )}

              {/* Action 3: Text Watermark */}
              {pipelineSteps.find(s => s.id === 'watermark')?.enabled && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className="space-y-1.5 pt-2 border-t border-white/5 text-xs"
                >
                  <label className="text-dark-300 font-semibold">Bulk Watermark String</label>
                  <input
                    type="text"
                    value={watermarkText}
                    onChange={(e) => setWatermarkText(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-white"
                  />
                </motion.div>
              )}
            </div>

          </div>

          {/* Column 2: Upload Queue and processing panel */}
          <div className="xl:col-span-8 space-y-6">
            
            <div className="glass-panel p-5 rounded-2xl border border-white/5 space-y-5">
              <div className="flex justify-between items-center border-b border-white/5 pb-3">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-white">Execution Staging Queue ({stagedFiles.length} items)</span>
                </div>

                <div className="flex gap-2">
                  {stagedFiles.length > 0 && (
                    <button
                      onClick={clearStagedQueue}
                      className="bg-white/5 hover:bg-white/10 border border-white/10 text-white font-bold py-1.5 px-3 rounded-lg text-[10px] transition-all"
                    >
                      Clear Queue
                    </button>
                  )}
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/20 text-emerald-400 font-bold py-1.5 px-3 rounded-lg text-[10px] flex items-center gap-1 transition-all"
                  >
                    <Plus size={11} /> Stage Files
                  </button>
                  <input
                    type="file"
                    ref={fileInputRef}
                    multiple
                    onChange={handleBatchUpload}
                    className="hidden"
                  />
                </div>
              </div>

              {stagedFiles.length === 0 ? (
                <div className="py-24 text-center text-xs text-dark-400">
                  <FolderClosed className="text-dark-500 mx-auto mb-2 animate-bounce" size={28} />
                  Queue stage is empty. Click **Stage Files** above to select hundreds of files to process simultaneously.
                </div>
              ) : (
                <div className="space-y-4">
                  {/* File List queue table */}
                  <div className="space-y-2 overflow-y-auto max-h-[300px] pr-1.5 scrollbar-hide">
                    {stagedFiles.map((item) => (
                      <div key={item.id} className="bg-white/5 border border-white/5 rounded-xl p-3 flex justify-between items-center text-[11px]">
                        <div className="flex items-center gap-3 min-w-0 pr-4">
                          <div className="w-7 h-7 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center flex-shrink-0">
                            <FileText size={13} />
                          </div>
                          <span className="font-bold text-white truncate">{item.name}</span>
                        </div>

                        <div className="flex items-center gap-3 flex-shrink-0">
                          <span className="font-mono text-dark-450">{item.sizeFormatted}</span>
                          
                          {/* Output status indicators */}
                          {item.status === 'staged' && (
                            <span className="text-[9px] bg-white/5 border border-white/10 px-2 py-0.5 rounded font-bold text-dark-300 uppercase">
                              Staged
                            </span>
                          )}
                          {item.status === 'processing' && (
                            <span className="text-[9px] bg-primary-500/15 border border-primary-500/25 px-2 py-0.5 rounded font-bold text-primary-400 uppercase flex items-center gap-1">
                              <RefreshCw className="animate-spin" size={9} />
                              Running
                            </span>
                          )}
                          {item.status === 'completed' && (
                            <span className="text-[9px] bg-emerald-500/15 border border-emerald-500/25 px-2 py-0.5 rounded font-bold text-emerald-400 uppercase">
                              {item.outSizeFormatted} Done
                            </span>
                          )}

                          <button
                            onClick={() => deleteQueueItem(item.id)}
                            disabled={processing}
                            className="p-1 hover:bg-white/5 rounded text-dark-500 hover:text-red-400 transition-all disabled:opacity-40"
                          >
                            <Trash2 size={12} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Processing Status indicators */}
                  {processing && (
                    <div className="bg-emerald-500/[0.03] border border-emerald-500/10 rounded-xl p-4 flex flex-col items-center justify-center gap-2 text-center text-xs">
                      <RefreshCw className="animate-spin text-emerald-400" size={24} />
                      <span className="text-white font-bold block mt-1">Executing Automation Workflow Pipeline...</span>
                      <span className="text-[10px] text-dark-400 font-mono">
                        Processed {processedCount} of {stagedFiles.length} staging files
                      </span>
                    </div>
                  )}

                  {/* Pipeline trigger and ZIP Download */}
                  <div className="flex gap-4 pt-3 border-t border-white/5">
                    <button
                      onClick={executeBatchPipeline}
                      disabled={processing || stagedFiles.length === 0}
                      className="flex-grow bg-emerald-500 hover:bg-emerald-600 text-white font-bold py-3 px-4 rounded-xl text-xs flex items-center justify-center gap-1.5 transition-all disabled:opacity-50 shadow-glow-accent"
                    >
                      <Play size={13} />
                      Execute Workflow Pipeline
                    </button>

                    {outputZipBlob && (
                      <button
                        onClick={() => downloadBlob(outputZipBlob, 'convertverse_batch_archive.zip')}
                        className="bg-emerald-500/15 hover:bg-emerald-500/25 border border-emerald-500/20 text-emerald-400 font-bold py-3 px-5 rounded-xl text-xs flex items-center justify-center gap-1.5 transition-all"
                      >
                        <Download size={13} /> Download ZIP Bundle
                      </button>
                    )}
                  </div>

                  {/* Byte savings stats */}
                  {outputZipBlob && savedBytesTotal > 0 && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="bg-emerald-500/[0.03] border border-emerald-500/10 rounded-xl p-3 text-center text-[10px] font-mono text-emerald-400"
                    >
                      ✨ High-Efficiency Compression: Saved **{formatBytes(savedBytesTotal)}** bandwidth globally!
                    </motion.div>
                  )}
                </div>
              )}
            </div>

          </div>

        </div>

      </div>
      
      <canvas ref={canvasRef} className="hidden" />
    </div>
  );
}
