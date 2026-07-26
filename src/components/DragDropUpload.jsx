import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { UploadCloud, X } from 'lucide-react';
import { useLanguage } from '../hooks/useLanguage';

export default function DragDropUpload({
  onFilesSelected,
  accept = "*",
  multiple = true,
  maxSizeMB = 50,
  icon: Icon = UploadCloud,
  accentColor = "primary"
}) {
  const { t } = useLanguage();
  const [isDragActive, setIsDragActive] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);
  const fileInputRef = useRef(null);

  // Translate tailwind colors
  const accentClasses = {
    primary: "border-primary-500/30 hover:border-primary-500 hover:shadow-glow-primary bg-primary-500/5",
    secondary: "border-secondary-500/30 hover:border-secondary-500 hover:shadow-glow-secondary bg-secondary-500/5",
    accent: "border-accent-500/30 hover:border-accent-500 hover:shadow-glow-accent bg-accent-500/5"
  };

  const ringClasses = {
    primary: "ring-primary-500/20",
    secondary: "ring-secondary-500/20",
    accent: "ring-accent-500/20"
  };

  const validateAndSelectFiles = useCallback((filesList) => {
    setErrorMsg(null);
    const validFiles = [];

    // Simple wildcard accept validator helper
    const checkAccept = (file, acceptString) => {
      if (acceptString === "*" || acceptString === "*/*") return true;
      const mime = file.type;
      const name = file.name;
      const extensions = acceptString.split(',').map(ext => ext.trim());
      
      return extensions.some(ext => {
        if (ext.startsWith('.')) {
          return name.toLowerCase().endsWith(ext.toLowerCase());
        }
        if (ext.endsWith('/*')) {
          const baseMime = ext.split('/')[0];
          return mime.startsWith(baseMime + '/');
        }
        return mime === ext;
      });
    };

    for (const file of filesList) {
      // Validate File Size
      const sizeMB = file.size / (1024 * 1024);
      if (sizeMB > maxSizeMB) {
        setErrorMsg(`${t('validationError')} (${file.name} exceeds ${maxSizeMB}MB)`);
        continue;
      }

      // Validate Extension
      if (accept !== "*" && !checkAccept(file, accept)) {
        setErrorMsg(`${t('validationError')} (${file.name} has unsupported format)`);
        continue;
      }

      validFiles.push(file);
    }

    if (validFiles.length > 0) {
      if (!multiple) {
        onFilesSelected([validFiles[0]]);
      } else {
        onFilesSelected(validFiles);
      }
    }
  }, [accept, maxSizeMB, multiple, onFilesSelected, t]);

  // Clipboard Paste Support
  useEffect(() => {
    const handlePaste = (e) => {
      const clipboardItems = e.clipboardData?.items;
      if (!clipboardItems) return;

      const pastedFiles = [];
      for (let i = 0; i < clipboardItems.length; i++) {
        const item = clipboardItems[i];
        if (item.kind === 'file') {
          const file = item.getAsFile();
          if (file) pastedFiles.push(file);
        }
      }

      if (pastedFiles.length > 0) {
        validateAndSelectFiles(pastedFiles);
      }
    };

    window.addEventListener('paste', handlePaste);
    return () => window.removeEventListener('paste', handlePaste);
  }, [validateAndSelectFiles]);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setIsDragActive(true);
    } else if (e.type === "dragleave") {
      setIsDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      validateAndSelectFiles(Array.from(e.dataTransfer.files));
    }
  };

  const handleFileInputChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      validateAndSelectFiles(Array.from(e.target.files));
    }
  };

  const triggerFileInput = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };



  return (
    <div className="w-full">
      <motion.div
        whileHover={{ scale: 0.995 }}
        whileTap={{ scale: 0.99 }}
        onClick={triggerFileInput}
        onDragEnter={handleDrag}
        onDragOver={handleDrag}
        onDragLeave={handleDrag}
        onDrop={handleDrop}
        className={`glass-panel border-2 border-dashed cursor-pointer rounded-3xl p-10 flex flex-col items-center justify-center text-center transition-all relative overflow-hidden ${
          isDragActive 
            ? `border-primary-500 shadow-glow-primary ring-4 ${ringClasses[accentColor]}` 
            : accentClasses[accentColor]
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept={accept}
          multiple={multiple}
          onChange={handleFileInputChange}
          className="hidden"
        />

        <motion.div
          animate={isDragActive ? { y: -8, scale: 1.05 } : { y: 0, scale: 1 }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
          className="p-5 rounded-2xl bg-white/5 border border-white/5 mb-4 shadow-glass relative z-10"
        >
          <Icon className="w-10 h-10 text-primary-400" />
        </motion.div>

        <h3 className="text-lg font-semibold text-dark-100 mb-1.5 relative z-10">
          {t('uploadAreaTitle')}
        </h3>
        <p className="text-xs text-dark-400 max-w-md mb-2 relative z-10">
          {t('uploadAreaSub')}
        </p>
        
        <span className="inline-flex items-center gap-1.5 text-[11px] px-2.5 py-1 rounded-full bg-white/5 border border-white/5 text-dark-400 font-medium font-mono relative z-10">
          ⌨️ Ctrl + V to Paste Clipboard Images
        </span>

        {/* Ambient Gradient Glows in upload area */}
        <div className="absolute -bottom-20 -left-20 w-48 h-48 bg-primary-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -top-20 -right-20 w-48 h-48 bg-secondary-500/10 rounded-full blur-3xl pointer-events-none" />
      </motion.div>

      {/* Error Alert Display */}
      <AnimatePresence>
        {errorMsg && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="mt-4 p-4 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm flex items-center justify-between"
          >
            <span>{errorMsg}</span>
            <button onClick={() => setErrorMsg(null)} className="p-1 rounded-lg hover:bg-white/5 text-red-400/70 hover:text-red-400 transition-colors">
              <X size={16} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
