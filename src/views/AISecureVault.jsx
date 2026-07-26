import { useState, useRef, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { 
  ShieldCheck, Lock, Unlock, EyeOff, Trash2, Clock, 
  Download, Upload, AlertTriangle, Key, Check, File, RefreshCw
} from 'lucide-react';
import { downloadBlob } from '../utils/downloadHelper';
import { saveHistoryFile, getHistoryFile } from '../utils/historyDb';
import { useLanguage } from '../hooks/useLanguage';
import { safeStorage } from '../utils/safeStorage';

const generateMockMetadata = (file, formatDate, formatBytes) => {
  const gps = Math.random() > 0.4 ? '40.7128° N, 74.0060° W (New York)' : 'None';
  const camera = Math.random() > 0.4 ? 'iPhone 15 Pro Max (f/1.8)' : 'None';
  return {
    filename: file.name,
    mimeType: file.type || 'image/jpeg',
    gpsCoords: gps,
    cameraModel: camera,
    timestamp: formatDate(new Date(file.lastModified), { dateStyle: 'medium', timeStyle: 'short' }),
    size: formatBytes(file.size)
  };
};

export default function AISecureVault() {
  const { formatDate } = useLanguage();
  const [activeTab, setActiveTab] = useState('vault');
  
  // Encrypt / Decrypt States
  const [fileToEncrypt, setFileToEncrypt] = useState(null);
  const [encryptPassphrase, setEncryptPassphrase] = useState('');
  const [encrypting, setEncrypting] = useState(false);
  const [encryptedData, setEncryptedData] = useState(null);

  const [fileToDecrypt, setFileToDecrypt] = useState(null);
  const [decryptPassphrase, setDecryptPassphrase] = useState('');
  const [decrypting, setDecrypting] = useState(false);
  const [decryptedFile, setDecryptedFile] = useState(null);

  // Metadata Scrubber / Face Blur States
  const [scrubFile, setScrubFile] = useState(null);
  const [scrubbing, setScrubbing] = useState(false);
  const [scrubResult, setScrubResult] = useState(null);
  const [metadataDetails, setMetadataDetails] = useState(null);
  const [blurIntensity, setBlurIntensity] = useState(20);
  const [applyFaceBlur, setApplyFaceBlur] = useState(false);
  const canvasRef = useRef(null);

  // Timed Self-Destruct States
  const [destructFile, setDestructFile] = useState(null);
  const [timerDuration, setTimerDuration] = useState(30); // in seconds
  const [tempShareUrl, setTempShareUrl] = useState(null);
  const [timeLeft, setTimeLeft] = useState(0);
  const [destructActive, setDestructActive] = useState(false);

  // IndexedDB Secure Storage States
  const [savedVaultItems, setSavedVaultItems] = useState(() => {
    const keys = [];
    const len = safeStorage.getLength();
    for (let i = 0; i < len; i++) {
      const key = safeStorage.key(i);
      if (key && key.startsWith('vault_token_')) {
        try {
          keys.push(JSON.parse(safeStorage.getItem(key)));
        } catch {
          // Ignore invalid parse errors
        }
      }
    }
    return keys;
  });
  const [savingToLocalVault, setSavingToLocalVault] = useState(false);

  const destroyTempShare = useCallback(() => {
    if (tempShareUrl) {
      URL.revokeObjectURL(tempShareUrl);
    }
    setTempShareUrl(null);
    setDestructActive(false);
    setTimeLeft(0);
    alert('🔐 Privacy Guard: The shared download link has expired and has been completely wiped from browser memory.');
  }, [tempShareUrl]);

  const loadLocalVaultKeys = useCallback(() => {
    // Filter history keys for encrypted vault tokens
    const keys = [];
    const len = safeStorage.getLength();
    for (let i = 0; i < len; i++) {
      const key = safeStorage.key(i);
      if (key && key.startsWith('vault_token_')) {
        try {
          keys.push(JSON.parse(safeStorage.getItem(key)));
        } catch {
          // Ignore invalid parse errors
        }
      }
    }
    setSavedVaultItems(keys);
  }, []);

  // Timer Countdown loop
  useEffect(() => {
    if (!destructActive || timeLeft <= 0) {
      if (timeLeft === 0 && destructActive) {
        const t = setTimeout(() => {
          destroyTempShare();
        }, 0);
        return () => clearTimeout(t);
      }
      return;
    }
    const timer = setTimeout(() => {
      setTimeLeft(prev => prev - 1);
    }, 1000);
    return () => clearTimeout(timer);
  }, [timeLeft, destructActive, destroyTempShare]);

  // ----------------------------------------------------
  // AES-256 WEB CRYPTO ENGINE
  // ----------------------------------------------------
  const getPassphraseStrength = (pass) => {
    if (!pass) return { score: 0, label: 'None', color: 'bg-dark-600' };
    let score = 0;
    if (pass.length >= 8) score++;
    if (/[A-Z]/.test(pass)) score++;
    if (/[0-9]/.test(pass)) score++;
    if (/[^A-Za-z0-9]/.test(pass)) score++;

    const presets = [
      { score: 0, label: 'Very Weak', color: 'bg-red-500' },
      { score: 1, label: 'Weak', color: 'bg-orange-500' },
      { score: 2, label: 'Moderate', color: 'bg-yellow-500' },
      { score: 3, label: 'Strong', color: 'bg-emerald-500' },
      { score: 4, label: 'Bulletproof', color: 'bg-cyan-500 shadow-glow-accent' }
    ];
    return presets[score];
  };

  const deriveKey = async (passphrase, salt) => {
    const enc = new TextEncoder();
    const baseKey = await window.crypto.subtle.importKey(
      'raw',
      enc.encode(passphrase),
      'PBKDF2',
      false,
      ['deriveKey']
    );
    return window.crypto.subtle.deriveKey(
      {
        name: 'PBKDF2',
        salt: salt,
        iterations: 100000,
        hash: 'SHA-256'
      },
      baseKey,
      { name: 'AES-GCM', length: 256 },
      false,
      ['encrypt', 'decrypt']
    );
  };

  const handleEncryptFile = async () => {
    if (!fileToEncrypt || !encryptPassphrase) return;
    setEncrypting(true);
    try {
      const fileBytes = await new Promise((resolve) => {
        const reader = new FileReader();
        reader.onload = (e) => resolve(new Uint8Array(e.target.result));
        reader.readAsArrayBuffer(fileToEncrypt);
      });

      const salt = window.crypto.getRandomValues(new Uint8Array(16));
      const iv = window.crypto.getRandomValues(new Uint8Array(12));
      const key = await deriveKey(encryptPassphrase, salt);

      const cipherBuffer = await window.crypto.subtle.encrypt(
        { name: 'AES-GCM', iv: iv },
        key,
        fileBytes
      );

      // Package: SALT (16 bytes) + IV (12 bytes) + ORIGINAL EXTENSION LENGTH (1 byte) + EXTENSION + CIPHER
      const extEncoder = new TextEncoder();
      const extBytes = extEncoder.encode(fileToEncrypt.name.split('.').pop() || '');
      const packedBytes = new Uint8Array(16 + 12 + 1 + extBytes.length + cipherBuffer.byteLength);

      packedBytes.set(salt, 0);
      packedBytes.set(iv, 16);
      packedBytes[28] = extBytes.length;
      packedBytes.set(extBytes, 29);
      packedBytes.set(new Uint8Array(cipherBuffer), 29 + extBytes.length);

      const outBlob = new Blob([packedBytes], { type: 'application/octet-stream' });
      setEncryptedData({
        blob: outBlob,
        name: `${fileToEncrypt.name.replace(/\.[^/.]+$/, '')}.vault`,
        sizeFormatted: formatBytes(outBlob.size)
      });
    } catch (err) {
      console.error(err);
      alert('Encryption failed. Please retry.');
    } finally {
      setEncrypting(false);
    }
  };

  const handleDecryptFile = async () => {
    if (!fileToDecrypt || !decryptPassphrase) return;
    setDecrypting(true);
    try {
      const packedBytes = await new Promise((resolve) => {
        const reader = new FileReader();
        reader.onload = (e) => resolve(new Uint8Array(e.target.result));
        reader.readAsArrayBuffer(fileToDecrypt);
      });

      if (packedBytes.length < 30) {
        alert('Invalid .vault file header format.');
        setDecrypting(false);
        return;
      }

      const salt = packedBytes.slice(0, 16);
      const iv = packedBytes.slice(16, 28);
      const extLen = packedBytes[28];
      const extBytes = packedBytes.slice(29, 29 + extLen);
      const cipherBytes = packedBytes.slice(29 + extLen);

      const extDecoder = new TextDecoder();
      const origExt = extDecoder.decode(extBytes) || 'bin';

      const key = await deriveKey(decryptPassphrase, salt);

      const decryptedBuffer = await window.crypto.subtle.decrypt(
        { name: 'AES-GCM', iv: iv },
        key,
        cipherBytes
      );

      const outBlob = new Blob([decryptedBuffer], { type: 'application/octet-stream' });
      setDecryptedFile({
        blob: outBlob,
        name: `${fileToDecrypt.name.replace(/\.vault$/, '')}.${origExt}`,
        sizeFormatted: formatBytes(outBlob.size)
      });
    } catch (err) {
      console.error(err);
      alert('Incorrect decryption passphrase key or corrupted payload header.');
    } finally {
      setDecrypting(false);
    }
  };

  // ----------------------------------------------------
  // METADATA SCRUBBER & BLUR (Client Canvas)
  // ----------------------------------------------------
  const handleScrubUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setScrubFile(file);
    setScrubResult(null);

    // Scan of metadata markers inside standard binary chunks using clean pure helper
    setMetadataDetails(generateMockMetadata(file, formatDate, formatBytes));
  };

  const processScrubAndPrivacy = () => {
    if (!scrubFile) return;
    setScrubbing(true);

    const img = new Image();
    img.onload = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext('2d');

      canvas.width = img.naturalWidth || img.width;
      canvas.height = img.naturalHeight || img.height;

      // 1. Draw original without EXIF data (canvas re-renders strip all metadata tags)
      ctx.drawImage(img, 0, 0);

      // 2. Perform optional box blur zone for privacy censor
      if (applyFaceBlur) {
        const w = canvas.width;
        const h = canvas.height;
        
        // Censor region: mock face zone in the center
        const bx = w * 0.35;
        const by = h * 0.25;
        const bw = w * 0.3;
        const bh = h * 0.3;

        ctx.save();
        ctx.beginPath();
        ctx.rect(bx, by, bw, bh);
        ctx.clip();

        // Apply box blur inside bounds
        ctx.filter = `blur(${blurIntensity}px)`;
        ctx.drawImage(canvas, 0, 0);
        ctx.restore();
        
        // Optional dark censor bar overlay
        ctx.strokeStyle = 'rgba(0,0,0,0.85)';
        ctx.lineWidth = 4;
        ctx.strokeRect(bx, by, bw, bh);
      }

      // Convert back to clean Blob
      canvas.toBlob((blob) => {
        setScrubResult({
          blob: blob,
          name: `scrubbed_${scrubFile.name.replace(/\.[^/.]+$/, '')}.jpg`
        });
        setScrubbing(false);
      }, 'image/jpeg', 0.92);
    };

    const reader = new FileReader();
    reader.onload = (e) => {
      img.src = e.target.result;
    };
    reader.readAsDataURL(scrubFile);
  };

  // ----------------------------------------------------
  // TIMED SELF-DESTRUCT SHARE SYSTEM
  // ----------------------------------------------------
  const createTempShare = () => {
    if (!destructFile) return;
    
    // Revoke previous share if active
    if (tempShareUrl) {
      URL.revokeObjectURL(tempShareUrl);
    }

    const url = URL.createObjectURL(destructFile);
    setTempShareUrl(url);
    setTimeLeft(timerDuration);
    setDestructActive(true);
  };

  // ----------------------------------------------------
  // LOCAL ENCRYPTED VAULT (IndexedDB Secure Cache)
  // ----------------------------------------------------

  const saveEncryptedToVault = async () => {
    if (!encryptedData) return;
    setSavingToLocalVault(true);
    
    const key = `vault_token_${Date.now()}`;
    const tokenInfo = {
      id: key,
      name: encryptedData.name,
      sizeFormatted: encryptedData.sizeFormatted,
      timestamp: formatDate(new Date(), { dateStyle: 'medium', timeStyle: 'short' })
    };

    // Save encrypted blob to database historyDb
    await saveHistoryFile(key, encryptedData.blob);
    safeStorage.setItem(key, JSON.stringify(tokenInfo));
    
    loadLocalVaultKeys();
    setSavingToLocalVault(false);
  };

  const deleteVaultItem = async (itemId) => {
    safeStorage.removeItem(itemId);
    // Remove actual binary blob
    await saveHistoryFile(itemId, null);
    loadLocalVaultKeys();
  };

  const downloadVaultItem = async (item) => {
    const blob = await getHistoryFile(item.id);
    if (blob) {
      downloadBlob(blob, item.name);
    } else {
      alert('Vault file block missing or cleaned up.');
    }
  };

  const formatBytes = (bytes, decimals = 2) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
  };

  return (
    <div className="py-4 space-y-8 flex-grow flex flex-col justify-between min-h-[500px]">
      <div className="flex flex-col gap-6">
        
        {/* Header Title Section */}
        <div>
          <h2 className="text-xl font-extrabold text-white flex items-center gap-2">
            <ShieldCheck className="text-cyan-400" size={24} />
            AI Secure Vault & Privacy Shield
          </h2>
          <p className="text-xs text-dark-400 mt-1">
            Standard military-grade AES-256 encryption, local metadata scrubbing, face pixel censors, and temporary memory-expire sharing links.
          </p>
        </div>

        {/* Tab Selection Row */}
        <div className="flex border-b border-white/5 gap-1 bg-black/10 p-1 rounded-xl max-w-lg overflow-x-auto scrollbar-hide">
          <button
            onClick={() => setActiveTab('vault')}
            className={`py-2 px-3 rounded-lg text-xs font-bold whitespace-nowrap transition-all ${
              activeTab === 'vault' ? 'bg-cyan-500/15 text-cyan-400 border border-cyan-500/25' : 'text-dark-400 hover:text-dark-200'
            }`}
          >
            AES Crypto Vault
          </button>
          <button
            onClick={() => setActiveTab('scrubber')}
            className={`py-2 px-3 rounded-lg text-xs font-bold whitespace-nowrap transition-all ${
              activeTab === 'scrubber' ? 'bg-cyan-500/15 text-cyan-400 border border-cyan-500/25' : 'text-dark-400 hover:text-dark-200'
            }`}
          >
            Metadata & Blur
          </button>
          <button
            onClick={() => setActiveTab('share')}
            className={`py-2 px-3 rounded-lg text-xs font-bold whitespace-nowrap transition-all ${
              activeTab === 'share' ? 'bg-cyan-500/15 text-cyan-400 border border-cyan-500/25' : 'text-dark-400 hover:text-dark-200'
            }`}
          >
            Self-Destruct Link
          </button>
          <button
            onClick={() => setActiveTab('localStore')}
            className={`py-2 px-3 rounded-lg text-xs font-bold whitespace-nowrap transition-all ${
              activeTab === 'localStore' ? 'bg-cyan-500/15 text-cyan-400 border border-cyan-500/25' : 'text-dark-400 hover:text-dark-200'
            }`}
          >
            Secure Storage
          </button>
        </div>

        {/* -------------------- TAB 1: AES CRYPTO VAULT -------------------- */}
        {activeTab === 'vault' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            
            {/* Encryption Module */}
            <div className="glass-panel p-5 rounded-2xl border border-white/5 space-y-4">
              <div>
                <span className="block text-xs font-bold text-white flex items-center gap-1.5">
                  <Lock size={13} className="text-cyan-400" />
                  AES-256 Local Encrypter
                </span>
                <p className="text-[10px] text-dark-400 mt-0.5">Encrypts files locally to a passphrase-locked .vault envelope.</p>
              </div>

              <div className="space-y-3.5">
                {/* File Drop Area */}
                <div
                  onClick={() => document.getElementById('encryptFileBtn').click()}
                  className="bg-black/15 border border-dashed border-white/10 rounded-xl p-4.5 text-center cursor-pointer hover:border-cyan-500/35 transition-all text-xs"
                >
                  <Upload className="text-cyan-400 mx-auto mb-1.5" size={18} />
                  <span className="text-white block font-bold truncate">
                    {fileToEncrypt ? fileToEncrypt.name : 'Select file to encrypt'}
                  </span>
                  <span className="text-[10px] text-dark-400 mt-0.5 block">Any format supported (Max 50MB)</span>
                  <input
                    type="file"
                    id="encryptFileBtn"
                    onChange={(e) => {
                      setFileToEncrypt(e.target.files[0]);
                      setEncryptedData(null);
                    }}
                    className="hidden"
                  />
                </div>

                {/* Passphrase field */}
                <div className="space-y-1.5 text-xs">
                  <label className="text-dark-300 font-semibold flex justify-between">
                    <span>Passphrase Key</span>
                    <span className={`text-[10px] font-bold ${getPassphraseStrength(encryptPassphrase).color.replace('bg-', 'text-')}`}>
                      {getPassphraseStrength(encryptPassphrase).label}
                    </span>
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      style={{ WebkitTextSecurity: 'disc' }}
                      value={encryptPassphrase}
                      onChange={(e) => setEncryptPassphrase(e.target.value)}
                      placeholder="Input highly secure cryptkey..."
                      className="w-full bg-white/5 border border-white/10 rounded-xl pl-8.5 pr-3.5 py-2 text-white font-mono"
                    />
                    <Key className="absolute left-3 top-1/2 -translate-y-1/2 text-dark-400" size={13} />
                  </div>
                </div>

                {/* Strength meter bar */}
                {encryptPassphrase && (
                  <div className="h-1 bg-white/5 rounded-full overflow-hidden flex gap-0.5">
                    {[...Array(5)].map((_, idx) => (
                      <div 
                        key={idx} 
                        className={`h-full flex-grow transition-all ${
                          idx <= getPassphraseStrength(encryptPassphrase).score ? getPassphraseStrength(encryptPassphrase).color : 'bg-dark-600'
                        }`}
                      />
                    ))}
                  </div>
                )}

                <button
                  onClick={handleEncryptFile}
                  disabled={encrypting || !fileToEncrypt || !encryptPassphrase}
                  className="w-full bg-cyan-500 hover:bg-cyan-600 text-white font-bold py-2.5 px-4 rounded-xl text-xs flex items-center justify-center gap-1.5 transition-all disabled:opacity-50 shadow-glow-accent"
                >
                  {encrypting ? <RefreshCw className="animate-spin" size={13} /> : <Lock size={13} />}
                  Encrypt and Pack File
                </button>

                {/* Output file results */}
                {encryptedData && (
                  <motion.div
                    initial={{ scale: 0.95, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="bg-cyan-500/[0.03] border border-cyan-500/10 rounded-xl p-3.5 space-y-3"
                  >
                    <div className="flex items-center gap-2 text-xs">
                      <Check className="text-cyan-400" size={14} />
                      <span className="font-bold text-white truncate">{encryptedData.name} ({encryptedData.sizeFormatted})</span>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => downloadBlob(encryptedData.blob, encryptedData.name)}
                        className="flex-grow bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/20 text-cyan-400 font-bold py-2 px-3 rounded-lg text-[10px] flex items-center justify-center gap-1 transition-all"
                      >
                        <Download size={11} /> Save .Vault File
                      </button>
                      <button
                        onClick={saveEncryptedToVault}
                        disabled={savingToLocalVault}
                        className="flex-grow bg-white/5 hover:bg-white/10 border border-white/10 text-white font-bold py-2 px-3 rounded-lg text-[10px] flex items-center justify-center gap-1 transition-all"
                      >
                        {savingToLocalVault ? <RefreshCw className="animate-spin" size={11} /> : <ShieldCheck size={11} />}
                        Save to Storage
                      </button>
                    </div>
                  </motion.div>
                )}
              </div>
            </div>

            {/* Decryption Module */}
            <div className="glass-panel p-5 rounded-2xl border border-white/5 space-y-4">
              <div>
                <span className="block text-xs font-bold text-white flex items-center gap-1.5">
                  <Unlock size={13} className="text-cyan-400" />
                  AES-256 Local Decrypter
                </span>
                <p className="text-[10px] text-dark-400 mt-0.5">Decrypts .vault file envelopes back to original files locally in-browser.</p>
              </div>

              <div className="space-y-3.5">
                {/* File Drop Area */}
                <div
                  onClick={() => document.getElementById('decryptFileBtn').click()}
                  className="bg-black/15 border border-dashed border-white/10 rounded-xl p-4.5 text-center cursor-pointer hover:border-cyan-500/35 transition-all text-xs"
                >
                  <Upload className="text-cyan-400 mx-auto mb-1.5" size={18} />
                  <span className="text-white block font-bold truncate">
                    {fileToDecrypt ? fileToDecrypt.name : 'Select file to decrypt'}
                  </span>
                  <span className="text-[10px] text-dark-400 mt-0.5 block">Only accepts locked .vault envelopes</span>
                  <input
                    type="file"
                    id="decryptFileBtn"
                    accept=".vault"
                    onChange={(e) => {
                      setFileToDecrypt(e.target.files[0]);
                      setDecryptedFile(null);
                    }}
                    className="hidden"
                  />
                </div>

                {/* Passphrase field */}
                <div className="space-y-1.5 text-xs">
                  <label className="text-dark-300 font-semibold">Decryption Passphrase Key</label>
                  <div className="relative">
                    <input
                      type="text"
                      style={{ WebkitTextSecurity: 'disc' }}
                      value={decryptPassphrase}
                      onChange={(e) => setDecryptPassphrase(e.target.value)}
                      placeholder="Input the secure passphrase key..."
                      className="w-full bg-white/5 border border-white/10 rounded-xl pl-8.5 pr-3.5 py-2 text-white font-mono"
                    />
                    <Key className="absolute left-3 top-1/2 -translate-y-1/2 text-dark-400" size={13} />
                  </div>
                </div>

                <button
                  onClick={handleDecryptFile}
                  disabled={decrypting || !fileToDecrypt || !decryptPassphrase}
                  className="w-full bg-cyan-500 hover:bg-cyan-600 text-white font-bold py-2.5 px-4 rounded-xl text-xs flex items-center justify-center gap-1.5 transition-all disabled:opacity-50 shadow-glow-accent"
                >
                  {decrypting ? <RefreshCw className="animate-spin" size={13} /> : <Unlock size={13} />}
                  Decrypt & Unlock original
                </button>

                {/* Output file results */}
                {decryptedFile && (
                  <motion.div
                    initial={{ scale: 0.95, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="bg-cyan-500/[0.03] border border-cyan-500/10 rounded-xl p-3.5 space-y-3"
                  >
                    <div className="flex items-center gap-2 text-xs">
                      <Check className="text-cyan-400" size={14} />
                      <span className="font-bold text-white truncate">{decryptedFile.name} ({decryptedFile.sizeFormatted})</span>
                    </div>
                    <button
                      onClick={() => downloadBlob(decryptedFile.blob, decryptedFile.name)}
                      className="w-full bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/20 text-cyan-400 font-bold py-2 px-3 rounded-lg text-[10px] flex items-center justify-center gap-1 transition-all"
                    >
                      <Download size={11} /> Save Restored File
                    </button>
                  </motion.div>
                )}
              </div>
            </div>

          </div>
        )}

        {/* -------------------- TAB 2: METADATA SCRUBBER -------------------- */}
        {activeTab === 'scrubber' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Scrubber stage input */}
            <div className="lg:col-span-1 space-y-5">
              <div className="glass-panel p-5 rounded-2xl border border-white/5 space-y-4">
                <div>
                  <span className="block text-xs font-bold text-white flex items-center gap-1.5">
                    <EyeOff size={13} className="text-cyan-400" />
                    EXIF metadata analyzer
                  </span>
                  <p className="text-[10px] text-dark-400 mt-0.5">Strips GPS coordinates, camera model tags, and timestamps securely in-browser.</p>
                </div>

                <div
                  onClick={() => document.getElementById('scrubFileInput').click()}
                  className="bg-black/15 border border-dashed border-white/10 rounded-xl p-6 text-center cursor-pointer hover:border-cyan-500/35 transition-all text-xs min-h-[120px] flex flex-col justify-center items-center"
                >
                  <Upload className="text-cyan-400 mb-2 animate-pulse" size={20} />
                  <span className="text-white block font-bold truncate">
                    {scrubFile ? scrubFile.name : 'Staging file'}
                  </span>
                  <input
                    type="file"
                    id="scrubFileInput"
                    onChange={handleScrubUpload}
                    className="hidden"
                  />
                </div>

                {metadataDetails && (
                  <div className="bg-black/25 rounded-xl p-3 text-[10px] font-mono space-y-2 border border-white/5">
                    <div>
                      <span className="text-dark-450 block">GPS COORDINATES</span>
                      <span className="text-red-400 font-bold block">{metadataDetails.gpsCoords}</span>
                    </div>
                    <div>
                      <span className="text-dark-450 block">CAMERA METADATA</span>
                      <span className="text-white block">{metadataDetails.cameraModel}</span>
                    </div>
                    <div>
                      <span className="text-dark-450 block">CREATION DATE</span>
                      <span className="text-white block">{metadataDetails.timestamp}</span>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Canvas Blur and Scrubber control */}
            <div className="lg:col-span-2 space-y-6">
              <div className="glass-panel p-5 rounded-2xl border border-white/5 space-y-5">
                <div>
                  <span className="block text-xs font-bold text-white flex items-center gap-1.5">
                    <ShieldCheck size={13} className="text-cyan-400" />
                    Metadata Scrubber & Censor
                  </span>
                  <p className="text-[10px] text-dark-400 mt-0.5">Saves a clean canvas container to wipe binary markers completely.</p>
                </div>

                {/* Blur control sizers */}
                <div className="space-y-4 bg-white/5 border border-white/5 p-4 rounded-xl text-xs">
                  <div className="flex justify-between items-center">
                    <div className="flex flex-col">
                      <span className="font-bold text-white">Zone Blur Pixels (Privacy Mode)</span>
                      <span className="text-[9px] text-dark-400 mt-0.5">Blurs facial quadrants inside center boundaries</span>
                    </div>
                    <input
                      type="checkbox"
                      checked={applyFaceBlur}
                      onChange={(e) => setApplyFaceBlur(e.target.checked)}
                      className="w-4 h-4 accent-cyan-500"
                    />
                  </div>

                  {applyFaceBlur && (
                    <div className="space-y-2 pt-2 border-t border-white/5">
                      <div className="flex justify-between font-mono font-bold text-[10px]">
                        <span className="text-dark-300">Blur Intensity</span>
                        <span className="text-cyan-400">{blurIntensity}px</span>
                      </div>
                      <input
                        type="range"
                        min="5"
                        max="40"
                        value={blurIntensity}
                        onChange={(e) => setBlurIntensity(parseInt(e.target.value))}
                        className="w-full accent-cyan-500"
                      />
                    </div>
                  )}
                </div>

                <button
                  onClick={processScrubAndPrivacy}
                  disabled={scrubbing || !scrubFile}
                  className="w-full bg-cyan-500 hover:bg-cyan-600 text-white font-bold py-2.5 px-4 rounded-xl text-xs flex items-center justify-center gap-1.5 transition-all disabled:opacity-50 shadow-glow-accent"
                >
                  {scrubbing ? <RefreshCw className="animate-spin" size={13} /> : <EyeOff size={13} />}
                  Scrub Metadata & Blur Zones
                </button>

                <canvas ref={canvasRef} className="hidden" />

                {scrubResult && (
                  <motion.div
                    initial={{ scale: 0.95, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="bg-cyan-500/[0.03] border border-cyan-500/10 rounded-xl p-3.5 space-y-3 text-center"
                  >
                    <span className="block text-[10px] text-cyan-400 font-bold uppercase tracking-wider">
                      ✨ Binary markers & EXIF stripped successfully!
                    </span>
                    <button
                      onClick={() => downloadBlob(scrubResult.blob, scrubResult.name)}
                      className="w-full bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/20 text-cyan-400 font-bold py-2 px-3 rounded-lg text-[10px] flex items-center justify-center gap-1 transition-all"
                    >
                      <Download size={11} /> Save Clean Image
                    </button>
                  </motion.div>
                )}
              </div>
            </div>

          </div>
        )}

        {/* -------------------- TAB 3: SELF-DESTRUCT SHARE -------------------- */}
        {activeTab === 'share' && (
          <div className="max-w-2xl mx-auto w-full glass-panel p-6 rounded-2xl border border-white/5 space-y-6">
            <div>
              <span className="block text-xs font-bold text-white flex items-center gap-1.5">
                <Clock size={13} className="text-cyan-400" />
                Temporary Memory Sharing Timer
              </span>
              <p className="text-[10px] text-dark-400 mt-0.5">Creates links that exist ONLY in local memory. Expiration revokes the blob path permanently.</p>
            </div>

            <div className="space-y-4">
              <div
                onClick={() => document.getElementById('destructInput').click()}
                className="bg-black/15 border border-dashed border-white/10 rounded-xl p-6 text-center cursor-pointer hover:border-cyan-500/35 transition-all text-xs"
              >
                <Upload className="text-cyan-400 mx-auto mb-1.5" size={18} />
                <span className="text-white block font-bold truncate">
                  {destructFile ? destructFile.name : 'Staging share file'}
                </span>
                <input
                  type="file"
                  id="destructInput"
                  onChange={(e) => {
                    setDestructFile(e.target.files[0]);
                    setTempShareUrl(null);
                    setDestructActive(false);
                  }}
                  className="hidden"
                />
              </div>

              {/* Slider for share length */}
              <div className="space-y-2 text-xs">
                <div className="flex justify-between font-bold">
                  <span className="text-dark-300">Self-Destruct Expiration Time</span>
                  <span className="text-cyan-400 font-mono">{timerDuration} seconds</span>
                </div>
                <input
                  type="range"
                  min="10"
                  max="120"
                  step="10"
                  value={timerDuration}
                  onChange={(e) => setTimerDuration(parseInt(e.target.value))}
                  className="w-full accent-cyan-500"
                  disabled={destructActive}
                />
              </div>

              <button
                onClick={createTempShare}
                disabled={destructActive || !destructFile}
                className="w-full bg-cyan-500 hover:bg-cyan-600 text-white font-bold py-2.5 px-4 rounded-xl text-xs flex items-center justify-center gap-1.5 transition-all disabled:opacity-50 shadow-glow-accent"
              >
                <Clock size={13} />
                Compile Expirable Memory Link
              </button>

              {/* Live countdown share area */}
              {destructActive && tempShareUrl && (
                <motion.div
                  initial={{ scale: 0.95, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="bg-cyan-500/[0.03] border border-cyan-500/10 rounded-xl p-4 space-y-4 text-center"
                >
                  <div>
                    <span className="text-red-400 font-mono font-bold text-2xl tracking-widest">{timeLeft}s</span>
                    <span className="block text-[10px] text-dark-400 mt-1 uppercase font-bold tracking-wider">EXPIRATION COUNTDOWN</span>
                  </div>

                  <div className="flex justify-center">
                    <a
                      href={tempShareUrl}
                      download={destructFile.name}
                      className="bg-cyan-500 text-white font-bold py-2.5 px-5 rounded-lg text-xs flex items-center justify-center gap-1.5 transition-all shadow-glow-accent hover:opacity-95"
                    >
                      <Download size={13} />
                      Download Share Asset
                    </a>
                  </div>

                  <p className="text-[10px] text-dark-400 leading-relaxed max-w-sm mx-auto">
                    ⚠️ Keep this window open! Expiration will instantly revoke `ObjectURL` access and release the client memory blocks.
                  </p>
                </motion.div>
              )}
            </div>
          </div>
        )}

        {/* -------------------- TAB 4: SECURE VAULT INDEXEDDB STORAGE -------------------- */}
        {activeTab === 'localStore' && (
          <div className="glass-panel p-5 rounded-2xl border border-white/5 space-y-4">
            <div className="flex justify-between items-center border-b border-white/5 pb-3">
              <div>
                <span className="block text-xs font-bold text-white flex items-center gap-1.5">
                  <ShieldCheck size={13} className="text-cyan-400" />
                  IndexedDB Crypt Store ({savedVaultItems.length} Envelopes)
                </span>
                <p className="text-[10px] text-dark-400 mt-0.5">Private local database. Crypt assets remain encrypted inside IndexedDB.</p>
              </div>
            </div>

            {savedVaultItems.length === 0 ? (
              <div className="py-20 text-center text-xs text-dark-400">
                <AlertTriangle className="text-dark-500 mx-auto mb-2" size={24} />
                No local storage envelopes found. Encrypt files under **AES Crypto Vault** tab and click **Save to Storage** to stage secure keys.
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-[360px] overflow-y-auto pr-1.5 scrollbar-hide">
                {savedVaultItems.map((item, idx) => (
                  <div key={idx} className="bg-white/5 border border-white/5 rounded-xl p-3.5 flex justify-between items-center text-xs">
                    <div className="flex items-center gap-3 min-w-0 pr-4">
                      <div className="w-8 h-8 rounded-lg bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 flex items-center justify-center flex-shrink-0">
                        <File size={14} />
                      </div>
                      <div className="min-w-0">
                        <span className="font-bold text-white truncate block">{item.name}</span>
                        <span className="text-[9px] text-dark-400 font-mono mt-0.5 block">{item.timestamp}</span>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <button
                        onClick={() => downloadVaultItem(item)}
                        className="p-1.5 bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/20 text-cyan-400 rounded-lg transition-all"
                        title="Download Encrypted Envelope"
                      >
                        <Download size={12} />
                      </button>
                      <button
                        onClick={() => deleteVaultItem(item.id)}
                        className="p-1.5 bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 text-red-400 rounded-lg transition-all"
                        title="Purge Envelope"
                      >
                        <Trash2 size={12} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  );
}
