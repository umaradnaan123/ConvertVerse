import { useState, useEffect, useRef, useCallback } from 'react';
import { motion } from 'framer-motion';
import { 
  FolderOpen, ShieldCheck, Trash2, Plus, Download, 
  Key, AlertCircle, File, Check, RefreshCw
} from 'lucide-react';
import JSZip from 'jszip';
import { downloadBlob } from '../utils/downloadHelper';
import { saveHistoryFile, getHistoryFile } from '../utils/historyDb';

const formatBytes = (bytes, decimals = 2) => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
};

export default function CloudlessStudio() {
  const [tabs, setTabs] = useState([
    { id: 'zip-manager', name: 'ZIP Archive Manager', active: true },
    { id: 'watermark-canvas', name: 'Draft Version Control', active: false }
  ]);
  const [keyboardShortcutOverlay, setKeyboardShortcutOverlay] = useState(false);

  // ZIP Manager States
  const [zipFiles, setZipFiles] = useState([]);
  const [zipName, setZipName] = useState('convertverse-archive.zip');
  const [readingZip, setReadingZip] = useState(false);
  const fileInputRef = useRef(null);
  const draftFileInputRef = useRef(null);

  // Draft Version States
  const [activeVersion, setActiveVersion] = useState(1);
  const [versionsList, setVersionsList] = useState([
    { version: 1, label: 'Version 1 (Base Original)', size: 'Empty Draft', blob: null }
  ]);
  const [savingDraft, setSavingDraft] = useState(false);

  const deleteZipItem = (index) => {
    setZipFiles(prev => prev.filter((_, idx) => idx !== index));
  };

  const compileAndDownloadZip = useCallback(async () => {
    if (zipFiles.length === 0) return;
    const zip = new JSZip();
    
    zipFiles.forEach(f => {
      zip.file(f.name, f.blob);
    });

    const outputBlob = await zip.generateAsync({
      type: 'blob',
      compression: 'DEFLATE',
      compressionOptions: { level: 9 }
    });

    downloadBlob(outputBlob, zipName);
  }, [zipFiles, zipName]);

  const downloadDraftVersion = useCallback(() => {
    const currentVer = versionsList.find(v => v.version === activeVersion);
    if (currentVer && currentVer.blob) {
      downloadBlob(currentVer.blob, `version-${activeVersion}-${currentVer.blob.name}`);
    }
  }, [versionsList, activeVersion]);

  const triggerActiveTabDownload = useCallback(() => {
    const activeTab = tabs.find(t => t.active);
    if (activeTab?.id === 'zip-manager') {
      compileAndDownloadZip();
    } else {
      downloadDraftVersion();
    }
  }, [tabs, compileAndDownloadZip, downloadDraftVersion]);

  const resetActiveTab = useCallback(() => {
    const activeTab = tabs.find(t => t.active);
    if (activeTab?.id === 'zip-manager') {
      setZipFiles([]);
    } else {
      setVersionsList([{ version: 1, label: 'Version 1 (Base Original)', size: 'Empty Draft', blob: null }]);
      setActiveVersion(1);
    }
  }, [tabs]);

  // Keyboard Binds hook (Ctrl+S for save, Ctrl+O for open, Esc to clear)
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault();
        triggerActiveTabDownload();
      }
      if ((e.ctrlKey || e.metaKey) && e.key === 'o') {
        e.preventDefault();
        if (tabs.find(t => t.active)?.id === 'zip-manager') {
          fileInputRef.current?.click();
        } else {
          draftFileInputRef.current?.click();
        }
      }
      if (e.key === 'Escape') {
        e.preventDefault();
        resetActiveTab();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [tabs, triggerActiveTabDownload, resetActiveTab]);

  const handleTabSwitch = (tabId) => {
    setTabs(prev => prev.map(t => ({ ...t, active: t.id === tabId })));
  };

  // ----------------------------------------------------
  // ZIP COMPILER PIPELINE (JSZip)
  // ----------------------------------------------------
  const handleZipUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.name.endsWith('.zip')) {
      setReadingZip(true);
      setZipName(file.name);
      try {
        const zip = await JSZip.loadAsync(file);
        const filesArray = [];
        const promises = [];

        zip.forEach((relativePath, zipEntry) => {
          if (!zipEntry.dir) {
            const promise = zipEntry.async('blob').then(blob => {
              filesArray.push({
                name: relativePath,
                size: blob.size,
                sizeFormatted: formatBytes(blob.size),
                blob: blob
              });
            });
            promises.push(promise);
          }
        });

        await Promise.all(promises);
        setZipFiles(filesArray);
      } catch (err) {
        console.error('Failed reading zip:', err);
      } finally {
        setReadingZip(false);
      }
    } else {
      // Append normal files to list
      const files = Array.from(e.target.files);
      setZipFiles(prev => [
        ...prev,
        ...files.map(f => ({
          name: f.name,
          size: f.size,
          sizeFormatted: formatBytes(f.size),
          blob: f
        }))
      ]);
    }
  };

  // ----------------------------------------------------
  // DRAFT PERSISTENCE & VERSION ROLLBACK (IndexedDB)
  // ----------------------------------------------------
  const handleDraftUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setSavingDraft(true);
    const key = `draft_v${versionsList.length + 1}`;
    
    // Save draft blob inside IndexedDB wrapper
    await saveHistoryFile(key, file);

    const newVersion = {
      version: versionsList.length + 1,
      label: `Version ${versionsList.length + 1} (${file.name})`,
      size: formatBytes(file.size),
      blob: file,
      dbKey: key
    };

    setVersionsList(prev => [...prev, newVersion]);
    setActiveVersion(newVersion.version);
    setSavingDraft(false);
  };

  const loadVersionState = async (ver) => {
    if (!ver.dbKey) return;
    setSavingDraft(true);
    
    // Retrieve draft from IndexedDB
    const blob = await getHistoryFile(ver.dbKey);
    if (blob) {
      setActiveVersion(ver.version);
    }
    setSavingDraft(false);
  };

  return (
    <div className="py-4 space-y-8 flex-grow flex flex-col justify-between min-h-[500px]">
      <div className="flex flex-col gap-6">
        
        {/* Dynamic header routing options */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h2 className="text-xl font-extrabold text-white flex items-center gap-2">
              <ShieldCheck className="text-primary-400" size={22} />
              Universal Cloudless File Studio
            </h2>
            <p className="text-xs text-dark-400 mt-1">
              Browser-first workspace. Zip directories, rollback versions, and configure keys entirely in-browser.
            </p>
          </div>

          <button
            onClick={() => setKeyboardShortcutOverlay(prev => !prev)}
            className="bg-white/5 hover:bg-white/10 border border-white/10 text-white font-bold py-1.5 px-3 rounded-lg text-[10px] flex items-center gap-1.5 transition-all"
          >
            <Key size={11} /> Keyboard Binds HUD
          </button>
        </div>

        {/* HUD Binds panel */}
        {keyboardShortcutOverlay && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            className="bg-primary-500/[0.03] border border-primary-500/10 rounded-2xl p-4 grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs"
          >
            <div className="flex justify-between items-center bg-black/20 p-2.5 rounded-xl">
              <span className="text-dark-300">Open File Dialog</span>
              <kbd className="bg-white/15 text-white px-2 py-0.5 rounded font-mono font-bold text-[10px]">Ctrl+O</kbd>
            </div>
            <div className="flex justify-between items-center bg-black/20 p-2.5 rounded-xl">
              <span className="text-dark-300">Download Active Workspace</span>
              <kbd className="bg-white/15 text-white px-2 py-0.5 rounded font-mono font-bold text-[10px]">Ctrl+S</kbd>
            </div>
            <div className="flex justify-between items-center bg-black/20 p-2.5 rounded-xl">
              <span className="text-dark-300">Clear Current Tab</span>
              <kbd className="bg-white/15 text-white px-2 py-0.5 rounded font-mono font-bold text-[10px]">ESC</kbd>
            </div>
          </motion.div>
        )}

        {/* Tab Selection Row */}
        <div className="flex border-b border-white/5 gap-1 bg-black/10 p-1 rounded-xl max-w-md">
          {tabs.map((t) => (
            <button
              key={t.id}
              onClick={() => handleTabSwitch(t.id)}
              className={`flex-grow py-2 px-3 rounded-lg text-xs font-bold transition-all ${
                t.active
                  ? 'bg-primary-500/15 text-primary-400 border border-primary-500/25'
                  : 'text-dark-400 hover:text-dark-200 border border-transparent'
              }`}
            >
              {t.name}
            </button>
          ))}
        </div>

        {/* Tab 1: ZIP Archive Manager */}
        {tabs.find(t => t.active)?.id === 'zip-manager' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
            
            {/* Input uploader */}
            <div className="lg:col-span-1 space-y-5">
              <div
                onClick={() => fileInputRef.current?.click()}
                className="glass-panel border-2 border-dashed border-white/10 rounded-2xl p-6 flex flex-col items-center justify-center cursor-pointer hover:border-primary-500/30 bg-black/15 transition-all text-center min-h-[160px]"
              >
                <FolderOpen size={24} className="text-primary-400 mb-2.5 animate-pulse" />
                <h5 className="font-bold text-white text-xs">Load Files or Existing ZIP</h5>
                <p className="text-[10px] text-dark-400 mt-1">Select an existing ZIP to unpack, or staging files to pack.</p>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleZipUpload}
                  className="hidden"
                />
              </div>

              <div className="glass-panel p-4.5 rounded-2xl border border-white/5 space-y-4">
                <div>
                  <span className="block text-xs font-bold text-white">ZIP Archive Configurations</span>
                  <p className="text-[10px] text-dark-400 mt-0.5">Define metadata targets before compiler pack.</p>
                </div>
                <div className="space-y-1.5 text-xs">
                  <label className="text-dark-300 font-semibold">ZIP Output Filename</label>
                  <input
                    type="text"
                    value={zipName}
                    onChange={(e) => setZipName(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-white font-mono"
                  />
                </div>
                <button
                  onClick={compileAndDownloadZip}
                  disabled={zipFiles.length === 0}
                  className="w-full bg-emerald-500 hover:bg-emerald-600 text-white font-bold py-2.5 px-4 rounded-xl text-xs flex items-center justify-center gap-1.5 transition-all disabled:opacity-50 shadow-glow-accent"
                >
                  <Download size={13} />
                  Compile & Download ZIP
                </button>
              </div>
            </div>

            {/* Tree listing tree directory */}
            <div className="lg:col-span-2">
              <div className="glass-panel p-5 rounded-2xl border border-white/5 space-y-4 min-h-[300px]">
                <div className="flex justify-between items-center border-b border-white/5 pb-3">
                  <span className="text-xs font-bold text-white">Archive Directory Listing ({zipFiles.length} items)</span>
                  {zipFiles.length > 0 && (
                    <span className="text-[10px] text-primary-400 font-mono font-bold uppercase tracking-wider">
                      Deflate Packing Level 9 Active
                    </span>
                  )}
                </div>

                {readingZip ? (
                  <div className="flex flex-col items-center justify-center py-20 space-y-3">
                    <RefreshCw className="animate-spin text-primary-400" size={24} />
                    <span className="text-xs text-dark-400 font-mono">Uncompressing headers...</span>
                  </div>
                ) : zipFiles.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-20 text-center">
                    <AlertCircle className="text-dark-500 mb-2 animate-bounce" size={28} />
                    <p className="text-xs text-dark-400 max-w-xs leading-relaxed">
                      Staged file lists are empty. Upload files on the left selector to build your cloudless ZIP directory.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-2 max-h-[360px] overflow-y-auto pr-1.5 scrollbar-hide">
                    {zipFiles.map((file, idx) => (
                      <div key={idx} className="bg-white/5 border border-white/5 rounded-xl p-3 flex justify-between items-center text-xs">
                        <div className="flex items-center gap-3 min-w-0 pr-4">
                          <div className="w-8 h-8 rounded-lg bg-primary-500/10 border border-primary-500/20 text-primary-400 flex items-center justify-center flex-shrink-0">
                            <File size={14} />
                          </div>
                          <span className="font-bold text-white truncate">{file.name}</span>
                        </div>
                        <div className="flex items-center gap-3 flex-shrink-0">
                          <span className="font-mono text-dark-400 font-semibold">{file.sizeFormatted}</span>
                          <button
                            onClick={() => deleteZipItem(idx)}
                            className="p-1.5 bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 text-red-400 rounded-lg transition-all"
                          >
                            <Trash2 size={12} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

          </div>
        )}

        {/* Tab 2: Draft Version Control */}
        {tabs.find(t => t.active)?.id === 'watermark-canvas' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
            
            {/* Version control Timeline list */}
            <div className="lg:col-span-1 space-y-5">
              <div className="glass-panel p-4.5 rounded-2xl border border-white/5 space-y-4">
                <div>
                  <span className="block text-xs font-bold text-white">IndexedDB Draft Manager</span>
                  <p className="text-[10px] text-dark-400 mt-0.5">Saves intermediate file checkpoints in local storage.</p>
                </div>

                <div
                  onClick={() => draftFileInputRef.current?.click()}
                  className="bg-white/5 hover:bg-white/10 border border-white/10 p-3.5 rounded-xl flex items-center justify-center gap-2 cursor-pointer transition-all text-xs font-bold text-white text-center"
                >
                  <Plus size={14} /> Add Version Draft
                </div>
                <input
                  type="file"
                  ref={draftFileInputRef}
                  onChange={handleDraftUpload}
                  className="hidden"
                />

                <div className="divide-y divide-white/5 text-xs">
                  {versionsList.map((ver) => (
                    <div
                      key={ver.version}
                      onClick={() => loadVersionState(ver)}
                      className={`py-3 flex justify-between items-center cursor-pointer transition-all ${
                        activeVersion === ver.version ? 'text-primary-400 font-bold' : 'text-dark-300 hover:text-white'
                      }`}
                    >
                      <div className="flex items-center gap-2 min-w-0 pr-4">
                        <div className={`w-1.5 h-1.5 rounded-full ${activeVersion === ver.version ? 'bg-primary-400 animate-pulse' : 'bg-dark-500'}`} />
                        <span className="truncate">{ver.label}</span>
                      </div>
                      <span className="font-mono text-[10px] text-dark-400 flex-shrink-0">{ver.size}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Stage details */}
            <div className="lg:col-span-2">
              <div className="glass-panel p-5 rounded-2xl border border-white/5 space-y-5 min-h-[300px] flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-center border-b border-white/5 pb-3 mb-4">
                    <span className="text-xs font-bold text-white">Active Version Workspace State</span>
                    <span className="text-[10px] bg-primary-500/10 border border-primary-500/20 text-primary-400 px-2 py-0.5 rounded font-bold font-mono">
                      V{activeVersion} Active
                    </span>
                  </div>

                  {savingDraft ? (
                    <div className="flex flex-col items-center justify-center py-20 space-y-3">
                      <RefreshCw className="animate-spin text-primary-400" size={24} />
                      <span className="text-xs text-dark-400 font-mono">Accessing IndexedDB buffers...</span>
                    </div>
                  ) : !versionsList.find(v => v.version === activeVersion)?.blob ? (
                    <div className="flex flex-col items-center justify-center py-20 text-center">
                      <AlertCircle className="text-dark-500 mb-2" size={28} />
                      <p className="text-xs text-dark-400 max-w-xs leading-relaxed">
                        No active draft loaded in this version bucket. Click "Add Version Draft" on the left to start snapshotting assets.
                      </p>
                    </div>
                  ) : (
                    <div className="bg-white/5 border border-white/5 rounded-xl p-4.5 space-y-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center flex-shrink-0">
                          <Check size={18} />
                        </div>
                        <div>
                          <span className="block font-bold text-white text-sm">
                            {versionsList.find(v => v.version === activeVersion)?.blob.name}
                          </span>
                          <span className="block text-[10px] text-dark-400 font-mono mt-0.5 uppercase">
                            Size: {versionsList.find(v => v.version === activeVersion)?.size}
                          </span>
                        </div>
                      </div>
                      <p className="text-[11px] text-dark-300 leading-relaxed bg-black/15 border border-white/5 p-3 rounded-lg">
                        💡 Checked out from local memory. You can continue editing this draft, watermark it, or compile it into separate outputs. IndexedDB caching ensures it stays safe across page reloads.
                      </p>
                    </div>
                  )}
                </div>

                {versionsList.find(v => v.version === activeVersion)?.blob && (
                  <button
                    onClick={downloadDraftVersion}
                    className="w-full bg-emerald-500 hover:bg-emerald-600 text-white font-bold py-3 px-4 rounded-xl text-xs flex items-center justify-center gap-2 transition-all shadow-glow-accent mt-4"
                  >
                    <Download size={14} />
                    Download Draft Checkpoint
                  </button>
                )}
              </div>
            </div>

          </div>
        )}

      </div>
    </div>
  );
}
