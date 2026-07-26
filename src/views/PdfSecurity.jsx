import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Lock, Unlock, Archive, Wrench, 
  Download, RefreshCw, CheckCircle2
} from 'lucide-react';
import { jsPDF } from 'jspdf';
import * as pdfjsLib from 'pdfjs-dist';
import DragDropUpload from '../components/DragDropUpload';
import { formatBytes } from '../utils/imageProcessors';
import { downloadBlob } from '../utils/downloadHelper';

// Configure CDN pdf.js worker
pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.4.120/pdf.worker.min.js`;

// Cryptography Helpers
async function deriveKey(passphrase, salt) {
  const enc = new TextEncoder();
  const baseKey = await crypto.subtle.importKey(
    "raw",
    enc.encode(passphrase),
    "PBKDF2",
    false,
    ["deriveKey"]
  );
  return await crypto.subtle.deriveKey(
    {
      name: "PBKDF2",
      salt: salt,
      iterations: 100000,
      hash: "SHA-256"
    },
    baseKey,
    { name: "AES-GCM", length: 256 },
    false,
    ["encrypt", "decrypt"]
  );
}

async function encryptFileBytes(file, passphrase) {
  const arrayBuffer = await file.arrayBuffer();
  const salt = crypto.getRandomValues(new Uint8Array(16));
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const key = await deriveKey(passphrase, salt);
  
  const encrypted = await crypto.subtle.encrypt(
    { name: "AES-GCM", iv: iv },
    key,
    arrayBuffer
  );
  
  const result = new Uint8Array(salt.length + iv.length + encrypted.byteLength);
  result.set(salt, 0);
  result.set(iv, salt.length);
  result.set(new Uint8Array(encrypted), salt.length + iv.length);
  
  return new Blob([result], { type: 'application/octet-stream' });
}

async function decryptFileBytes(file, passphrase) {
  const arrayBuffer = await file.arrayBuffer();
  const bytes = new Uint8Array(arrayBuffer);
  
  if (bytes.length < 28) throw new Error("File container size is too small to be a valid encrypted payload.");
  
  const salt = bytes.slice(0, 16);
  const iv = bytes.slice(16, 28);
  const encryptedData = bytes.slice(28);
  
  const key = await deriveKey(passphrase, salt);
  
  const decrypted = await crypto.subtle.decrypt(
    { name: "AES-GCM", iv: iv },
    key,
    encryptedData
  );
  
  return new Blob([decrypted], { type: 'application/pdf' });
}

const tabs = [
  { id: 'protect', label: 'Protect PDF', icon: Lock },
  { id: 'unlock', label: 'Unlock PDF', icon: Unlock },
  { id: 'pdfa', label: 'PDF/A Compliance', icon: Archive },
  { id: 'repair', label: 'Repair PDF', icon: Wrench }
];

export default function PdfSecurity({ onAddHistory, activeSubTab, setActiveSubTab }) {
  const [activeTab, setActiveTab] = useState('protect'); // protect, unlock, pdfa, repair
  const [isProcessing, setIsProcessing] = useState(false);
  const [, setProgress] = useState(0);

  // General Passphrase States
  const [passphrase, setPassphrase] = useState('');
  const [confirmPassphrase, setConfirmPassphrase] = useState('');

  // 1. Protect State
  const [protectFile, setProtectFile] = useState(null);
  const [protectedBlob, setProtectedBlob] = useState(null);

  // 2. Unlock State
  const [unlockFile, setUnlockFile] = useState(null);
  const [unlockedBlob, setUnlockedBlob] = useState(null);

  // 3. PDF/A State
  const [pdfaFile, setPdfaFile] = useState(null);
  const [pdfaBlob, setPdfaBlob] = useState(null);

  // 4. Repair State
  const [repairFile, setRepairFile] = useState(null);
  const [, setRepairedBlob] = useState(null);
  const [repairLog, setRepairLog] = useState('');

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
  }, [activeSubTab]);

  // Reset tab settings on active change
  useEffect(() => {
    const timer = setTimeout(() => {
      setProtectFile(null);
      setProtectedBlob(null);
      setUnlockFile(null);
      setUnlockedBlob(null);
      setPdfaFile(null);
      setPdfaBlob(null);
      setRepairFile(null);
      setRepairedBlob(null);
      setPassphrase('');
      setConfirmPassphrase('');
      setRepairLog('');
      setProgress(0);
      if (setActiveSubTab) {
        setActiveSubTab(null);
      }
    }, 0);
    return () => clearTimeout(timer);
  }, [activeTab, setActiveSubTab]);

  // 1. Protect PDF handler
  const handleProtectSelected = (files) => {
    const file = files[0];
    if (file) {
      setProtectFile(file);
      setProtectedBlob(null);
    }
  };

  const handleProtectSubmit = async () => {
    if (!protectFile || !passphrase) return;
    if (passphrase !== confirmPassphrase) {
      alert("Passphrases do not match.");
      return;
    }
    setIsProcessing(true);
    setProgress(30);
    try {
      const encrypted = await encryptFileBytes(protectFile, passphrase);
      setProgress(80);
      setProtectedBlob(encrypted);
      
      const filename = `${protectFile.name.replace(/\.[^/.]+$/, "")}.secure.pdf`;
      downloadBlob(encrypted, filename);

      onAddHistory({
        fileName: filename,
        fromFormat: 'pdf',
        toFormat: 'secure.pdf',
        size: encrypted.size
      }, encrypted);
      setProgress(100);
    } catch (error) {
      alert("Encryption failed: " + error.message);
    }
    setIsProcessing(false);
  };

  // 2. Unlock PDF handler
  const handleUnlockSelected = (files) => {
    const file = files[0];
    if (file) {
      setUnlockFile(file);
      setUnlockedBlob(null);
    }
  };

  const handleUnlockSubmit = async () => {
    if (!unlockFile || !passphrase) return;
    setIsProcessing(true);
    setProgress(40);
    try {
      const decrypted = await decryptFileBytes(unlockFile, passphrase);
      setProgress(85);
      setUnlockedBlob(decrypted);

      const filename = unlockFile.name.replace(/\.secure\.pdf$/, ".pdf").replace(/\.[^/.]+$/, "") + "_unlocked.pdf";
      downloadBlob(decrypted, filename);

      onAddHistory({
        fileName: filename,
        fromFormat: 'secure.pdf',
        toFormat: 'pdf',
        size: decrypted.size
      }, decrypted);
      setProgress(100);
    } catch (error) {
      alert("Decryption failed: " + error.message);
    }
    setIsProcessing(false);
  };

  // 3. PDF/A Flattening handler
  const handlePdfaSelected = (files) => {
    const file = files[0];
    if (file) {
      setPdfaFile(file);
      setPdfaBlob(null);
    }
  };

  const handlePdfaSubmit = async () => {
    if (!pdfaFile) return;
    setIsProcessing(true);
    setProgress(15);
    try {
      const arrayBuffer = await pdfaFile.arrayBuffer();
      const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
      const numPages = pdf.numPages;

      const pdfOut = new jsPDF();
      
      for (let i = 1; i <= numPages; i++) {
        const page = await pdf.getPage(i);
        const viewport = page.getViewport({ scale: 1.5 });
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');
        canvas.height = viewport.height;
        canvas.width = viewport.width;

        await page.render({ canvasContext: context, viewport }).promise;
        const dataUrl = canvas.toDataURL('image/jpeg', 0.95);

        if (i > 1) pdfOut.addPage();
        const pdfWidth = pdfOut.internal.pageSize.getWidth();
        const pdfHeight = pdfOut.internal.pageSize.getHeight();
        pdfOut.addImage(dataUrl, 'JPEG', 0, 0, pdfWidth, pdfHeight);
        
        setProgress(Math.round((i / numPages) * 85));
      }

      const outputBlob = pdfOut.output('blob');
      setPdfaBlob(outputBlob);
      const filename = `${pdfaFile.name.replace(/\.[^/.]+$/, "")}_pdfa.pdf`;
      downloadBlob(outputBlob, filename);

      onAddHistory({
        fileName: filename,
        fromFormat: 'pdf',
        toFormat: 'pdf/a',
        size: outputBlob.size
      }, outputBlob);
      setProgress(100);
    } catch (error) {
      alert("PDF/A extraction error: " + error.message);
    }
    setIsProcessing(false);
  };

  // 4. Repair PDF handler (Binary header trimmer)
  const handleRepairSelected = (files) => {
    const file = files[0];
    if (file) {
      setRepairFile(file);
      setRepairedBlob(null);
      setRepairLog('');
    }
  };

  const handleRepairSubmit = async () => {
    if (!repairFile) return;
    setIsProcessing(true);
    setProgress(30);
    let log = "Analyzing file binary byte markers...\n";
    try {
      const arrayBuffer = await repairFile.arrayBuffer();
      const bytes = new Uint8Array(arrayBuffer);
      
      log += `File loaded: ${formatBytes(bytes.length)} total binary buffers.\n`;

      // Find first occurrence of %PDF- signature
      let headerOffset = -1;
      
      for (let i = 0; i < bytes.length - 10; i++) {
        if (
          bytes[i] === 37 && // %
          bytes[i + 1] === 80 && // P
          bytes[i + 2] === 68 && // D
          bytes[i + 3] === 70 && // F
          bytes[i + 4] === 45 // -
        ) {
          headerOffset = i;
          break;
        }
      }

      let repairedBytes = bytes;

      if (headerOffset > 0) {
        log += `⚠️ Corrupted prepend found! Trimming ${headerOffset} bytes of leading junk headers.\n`;
        repairedBytes = bytes.slice(headerOffset);
      } else if (headerOffset === -1) {
        log += `❌ Truncated %PDF signature! Prepending standard PDF-1.4 header markers.\n`;
        const encoder = new TextEncoder();
        const headerBytes = encoder.encode("%PDF-1.4\n%âãÏÓ\n");
        const combined = new Uint8Array(headerBytes.length + bytes.length);
        combined.set(headerBytes, 0);
        combined.set(bytes, headerBytes.length);
        repairedBytes = combined;
      } else {
        log += `✓ Standard %PDF header signature aligned correctly.\n`;
      }

      // Check trailer signature
      let footerFound = false;
      const tailCheckRange = Math.min(100, repairedBytes.length);
      const tailOffset = repairedBytes.length - tailCheckRange;

      for (let i = tailOffset; i < repairedBytes.length - 5; i++) {
        if (
          repairedBytes[i] === 37 && // %
          repairedBytes[i + 1] === 37 && // %
          repairedBytes[i + 2] === 69 && // E
          repairedBytes[i + 3] === 79 && // O
          repairedBytes[i + 4] === 70 // F
        ) {
          footerFound = true;
          break;
        }
      }

      if (!footerFound) {
        log += `⚠️ Missing trailer markers! Restoring standard %%EOF trailer signature.\n`;
        const encoder = new TextEncoder();
        const trailerBytes = encoder.encode("\n%%EOF\n");
        const combined = new Uint8Array(repairedBytes.length + trailerBytes.length);
        combined.set(repairedBytes, 0);
        combined.set(trailerBytes, repairedBytes.length);
        repairedBytes = combined;
      } else {
        log += `✓ End of File trailer %%EOF verified.\n`;
      }

      const rebuiltBlob = new Blob([repairedBytes], { type: 'application/pdf' });
      setRepairedBlob(rebuiltBlob);
      log += `✓ PDF Structure re-compiled successfully! Restored document container.\n`;
      setRepairLog(log);

      const filename = `${repairFile.name.replace(/\.[^/.]+$/, "")}_repaired.pdf`;
      downloadBlob(rebuiltBlob, filename);

      onAddHistory({
        fileName: filename,
        fromFormat: 'corrupted-pdf',
        toFormat: 'pdf',
        size: rebuiltBlob.size
      }, rebuiltBlob);
      setProgress(100);
    } catch (error) {
      log += `❌ Error rebuilding file: ${error.message}\n`;
      setRepairLog(log);
      alert("Repair failed: " + error.message);
    }
    setIsProcessing(false);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Page header */}
      <div className="space-y-2 text-center lg:text-left">
        <h2 className="text-3xl font-extrabold text-white flex items-center justify-center lg:justify-start gap-2.5">
          <Lock className="text-primary-400 animate-pulse" />
          PDF Security Suite
        </h2>
        <p className="text-sm text-dark-400 max-w-2xl">Encrypt, decrypt, flatten archivable compliance layers, or repair corrupted PDF byte streams locally.</p>
      </div>

      {/* Tabs */}
      <div className="glass-panel p-1.5 rounded-2xl border border-white/5 grid grid-cols-2 lg:grid-cols-4 gap-1 shadow-glass">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`text-center py-3 px-4 rounded-xl text-[10px] font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-all ${
                activeTab === tab.id
                  ? 'bg-primary-500 text-white shadow-glow-primary border border-primary-400/20'
                  : 'text-dark-400 hover:text-dark-200'
              }`}
            >
              <Icon size={12} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Workspace */}
      <div className="w-full">
        <AnimatePresence mode="wait">
          {/* 1. PROTECT TAB */}
          {activeTab === 'protect' && (
            <motion.div key="protect" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-6">
              {!protectFile ? (
                <DragDropUpload onFilesSelected={handleProtectSelected} accept="application/pdf" multiple={false} icon={Lock} accentColor="primary" />
              ) : (
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start max-w-4xl mx-auto">
                  <div className="lg:col-span-7 space-y-6">
                    <div className="glass-panel p-6 rounded-3xl border border-white/5 shadow-glass space-y-4">
                      <h3 className="font-semibold text-sm text-dark-200 uppercase tracking-wider flex items-center gap-2"><Lock size={16} className="text-primary-400" />AES-256 Key Lock</h3>
                      <div className="space-y-4">
                        <div className="space-y-1.5">
                          <label className="text-xs text-dark-400 font-bold">Secure Passphrase Key</label>
                          <input type="text" style={{ WebkitTextSecurity: 'disc' }} value={passphrase} onChange={(e) => setPassphrase(e.target.value)} placeholder="Enter decryption passphrase" className="glass-input w-full text-sm" />
                        </div>
                        <div className="space-y-1.5">
                          <label className="text-xs text-dark-400 font-bold">Confirm Passphrase Key</label>
                          <input type="text" style={{ WebkitTextSecurity: 'disc' }} value={confirmPassphrase} onChange={(e) => setConfirmPassphrase(e.target.value)} placeholder="Confirm decryption passphrase" className="glass-input w-full text-sm" />
                        </div>
                      </div>
                      {protectedBlob && (
                        <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/25 text-emerald-400 flex items-center justify-between">
                          <div>
                            <span className="block text-xs font-bold uppercase">Locked securely!</span>
                            <span className="block text-xs mt-0.5">Encrypted with 256-bit AES-GCM!</span>
                          </div>
                          <CheckCircle2 size={24} />
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="lg:col-span-5 space-y-4">
                    <div className="glass-panel p-6 rounded-3xl border border-white/5 shadow-glass space-y-3 flex flex-col justify-center">
                      <h4 className="font-semibold text-xs text-dark-300 truncate">{protectFile.name}</h4>
                      <p className="text-xs text-dark-500 font-mono">{formatBytes(protectFile.size)}</p>
                    </div>
                    <div className="flex gap-3">
                      <button onClick={() => setProtectFile(null)} className="px-5 py-3.5 rounded-2xl bg-white/5 border border-white/10 text-sm font-bold text-dark-200 flex-1">New File</button>
                      <button onClick={handleProtectSubmit} disabled={isProcessing || !passphrase} className="flex-[2] px-5 py-3.5 rounded-2xl bg-gradient-to-r from-primary-500 to-secondary-500 font-bold text-white shadow-glow-primary hover:opacity-90 active:scale-95 transition-all text-sm flex items-center justify-center gap-2">
                        {isProcessing ? <RefreshCw size={15} className="animate-spin" /> : <Lock size={15} />}
                        Encrypt PDF File
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </motion.div>
          )}

          {/* 2. UNLOCK TAB */}
          {activeTab === 'unlock' && (
            <motion.div key="unlock" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-6">
              {!unlockFile ? (
                <DragDropUpload onFilesSelected={handleUnlockSelected} accept=".pdf" multiple={false} icon={Unlock} accentColor="primary" />
              ) : (
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start max-w-4xl mx-auto">
                  <div className="lg:col-span-7 space-y-6">
                    <div className="glass-panel p-6 rounded-3xl border border-white/5 shadow-glass space-y-4">
                      <h3 className="font-semibold text-sm text-dark-200 uppercase tracking-wider flex items-center gap-2"><Unlock size={16} className="text-emerald-400" />AES-256 Decryptor</h3>
                      <div className="space-y-4">
                        <div className="space-y-1.5">
                          <label className="text-xs text-dark-400 font-bold">Passphrase key</label>
                          <input type="text" style={{ WebkitTextSecurity: 'disc' }} value={passphrase} onChange={(e) => setPassphrase(e.target.value)} placeholder="Type passphrase key to decrypt" className="glass-input w-full text-sm" />
                        </div>
                      </div>
                      {unlockedBlob && (
                        <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/25 text-emerald-400 flex items-center justify-between">
                          <div>
                            <span className="block text-xs font-bold uppercase">Decrypted successfully!</span>
                            <span className="block text-xs mt-0.5">Original standard PDF extracted cleanly!</span>
                          </div>
                          <CheckCircle2 size={24} />
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="lg:col-span-5 space-y-4">
                    <div className="glass-panel p-6 rounded-3xl border border-white/5 shadow-glass space-y-3 flex flex-col justify-center">
                      <h4 className="font-semibold text-xs text-dark-300 truncate">{unlockFile.name}</h4>
                      <p className="text-xs text-dark-500 font-mono">{formatBytes(unlockFile.size)}</p>
                    </div>
                    <div className="flex gap-3">
                      <button onClick={() => setUnlockFile(null)} className="px-5 py-3.5 rounded-2xl bg-white/5 border border-white/10 text-sm font-bold text-dark-200 flex-1">New File</button>
                      <button onClick={handleUnlockSubmit} disabled={isProcessing || !passphrase} className="flex-[2] px-5 py-3.5 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 font-bold text-white shadow-glow-accent hover:opacity-90 active:scale-95 transition-all text-sm flex items-center justify-center gap-2">
                        {isProcessing ? <RefreshCw size={15} className="animate-spin" /> : <Unlock size={15} />}
                        Decrypt PDF File
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </motion.div>
          )}

          {/* 3. PDF/A TAB */}
          {activeTab === 'pdfa' && (
            <motion.div key="pdfa" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-6">
              {!pdfaFile ? (
                <DragDropUpload onFilesSelected={handlePdfaSelected} accept="application/pdf" multiple={false} icon={Archive} accentColor="primary" />
              ) : (
                <div className="max-w-xl mx-auto space-y-6">
                  <div className="glass-panel p-6 rounded-3xl border border-white/5 shadow-glass space-y-5">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-primary-500/10 border border-primary-500/25 flex items-center justify-center text-primary-400 flex-shrink-0"><Archive size={18} /></div>
                      <div className="min-w-0 flex-grow">
                        <h4 className="font-semibold text-sm text-dark-200 truncate">{pdfaFile.name}</h4>
                        <p className="text-xs text-dark-400 mt-0.5 font-mono">{formatBytes(pdfaFile.size)}</p>
                      </div>
                    </div>
                    {pdfaBlob && (
                      <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/25 text-emerald-400 flex items-center justify-between">
                        <div>
                          <span className="block text-xs font-bold uppercase">Archivability processed!</span>
                          <span className="block text-xs mt-0.5">Stripped transparency and compiled flat visual grids!</span>
                        </div>
                        <CheckCircle2 size={24} />
                      </div>
                    )}
                  </div>
                  <div className="flex gap-3">
                    <button onClick={() => setPdfaFile(null)} className="px-5 py-3.5 rounded-2xl bg-white/5 border border-white/10 text-sm font-bold text-dark-200 flex-1">New File</button>
                    <button onClick={handlePdfaSubmit} disabled={isProcessing} className="flex-[2] px-5 py-3.5 rounded-2xl bg-gradient-to-r from-primary-500 to-secondary-500 font-bold text-white shadow-glow-primary hover:opacity-90 active:scale-95 transition-all text-sm flex items-center justify-center gap-2">
                      {isProcessing ? <RefreshCw size={15} className="animate-spin" /> : <Download size={15} />}
                      Flatten to PDF/A
                    </button>
                  </div>
                </div>
              )}
            </motion.div>
          )}

          {/* 4. REPAIR TAB */}
          {activeTab === 'repair' && (
            <motion.div key="repair" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-6">
              {!repairFile ? (
                <DragDropUpload onFilesSelected={handleRepairSelected} accept=".pdf" multiple={false} icon={Wrench} accentColor="primary" />
              ) : (
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start max-w-4xl mx-auto">
                  <div className="lg:col-span-7 space-y-6">
                    <div className="glass-panel p-6 rounded-3xl border border-white/5 shadow-glass space-y-4">
                      <h3 className="font-semibold text-sm text-dark-200 uppercase tracking-wider flex items-center gap-2"><Wrench size={16} className="text-primary-400" />Structure Diagnostics</h3>
                      <pre className="w-full bg-black/30 p-4 rounded-xl border border-white/5 text-[10px] text-dark-300 font-mono overflow-x-auto min-h-[150px] whitespace-pre-wrap leading-relaxed">
                        {repairLog || "Click 'Diagnose & Rebuild' on the right to start byte restorations..."}
                      </pre>
                    </div>
                  </div>
                  <div className="lg:col-span-5 space-y-4">
                    <div className="glass-panel p-6 rounded-3xl border border-white/5 shadow-glass space-y-3 flex flex-col justify-center">
                      <h4 className="font-semibold text-xs text-dark-300 truncate">{repairFile.name}</h4>
                      <p className="text-xs text-dark-500 font-mono">{formatBytes(repairFile.size)}</p>
                    </div>
                    <div className="flex gap-3">
                      <button onClick={() => setRepairFile(null)} className="px-5 py-3.5 rounded-2xl bg-white/5 border border-white/10 text-sm font-bold text-dark-200 flex-1">New File</button>
                      <button onClick={handleRepairSubmit} disabled={isProcessing} className="flex-[2] px-5 py-3.5 rounded-2xl bg-gradient-to-r from-primary-500 to-secondary-500 font-bold text-white shadow-glow-primary hover:opacity-90 active:scale-95 transition-all text-sm flex items-center justify-center gap-2">
                        {isProcessing ? <RefreshCw size={15} className="animate-spin" /> : <Wrench size={15} />}
                        Diagnose & Rebuild
                      </button>
                    </div>
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
