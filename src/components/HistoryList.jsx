import { motion, AnimatePresence } from 'framer-motion';
import { Trash2, Download, FileText, Calendar, ArrowRight } from 'lucide-react';
import { useLanguage } from '../hooks/useLanguage';
import { formatBytes } from '../utils/imageProcessors';
import { getHistoryFile, deleteHistoryFile, clearHistoryFiles } from '../utils/historyDb';
import { downloadBlob } from '../utils/downloadHelper';

export default function HistoryList({ history, setHistory }) {
  const { t } = useLanguage();

  const handleClearHistory = async () => {
    setHistory([]);
    await clearHistoryFiles();
  };

  const handleRemoveItem = async (id) => {
    setHistory(history.filter(item => item.id !== id));
    await deleteHistoryFile(id);
  };

  const handleDownload = async (id, fileName) => {
    try {
      const blob = await getHistoryFile(id);
      if (blob) {
        downloadBlob(blob, fileName);
      } else {
        alert("This file is no longer available in the local browser database.");
      }
    } catch (err) {
      console.error(err);
      alert("Failed to retrieve file from history.");
    }
  };

  return (
    <div className="glass-panel rounded-3xl p-6 shadow-glass relative overflow-hidden">
      <div className="flex items-center justify-between border-b border-white/5 pb-4 mb-4">
        <div>
          <h3 className="font-semibold text-lg text-dark-100 flex items-center gap-2">
            <Calendar size={18} className="text-primary-400" />
            {t('historyTitle')}
          </h3>
          <p className="text-xs text-dark-400">Your processed files are kept securely in browser cache</p>
        </div>
        {history.length > 0 && (
          <button
            onClick={handleClearHistory}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-red-500/10 hover:border-red-500/30 text-xs font-medium text-red-400 hover:bg-red-500/5 transition-all"
          >
            <Trash2 size={13} />
            {t('historyClear')}
          </button>
        )}
      </div>

      <AnimatePresence mode="popLayout">
        {history.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="py-10 text-center flex flex-col items-center justify-center"
          >
            <div className="p-3.5 rounded-full bg-white/5 border border-white/5 mb-3 text-dark-500">
              <FileText size={20} />
            </div>
            <p className="text-sm text-dark-400 max-w-sm">
              {t('historyEmpty')}
            </p>
          </motion.div>
        ) : (
          <motion.div className="flex flex-col gap-2.5 max-h-[300px] overflow-y-auto pr-1">
            {history.map((item) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
                className="p-3 rounded-2xl bg-white/5 border border-white/5 hover:border-white/10 flex items-center justify-between gap-4 transition-all"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-9 h-9 rounded-xl bg-primary-500/10 border border-primary-500/25 flex items-center justify-center text-primary-400 flex-shrink-0">
                    <FileText size={16} />
                  </div>
                  <div className="min-w-0">
                    <span className="block text-sm font-medium text-dark-200 truncate pr-2">
                      {item.fileName}
                    </span>
                    <span className="flex items-center gap-1 text-[11px] text-dark-400 font-mono mt-0.5">
                      {item.fromFormat.toUpperCase()}
                      <ArrowRight size={10} className="text-dark-500" />
                      {item.toFormat.toUpperCase()}
                      <span className="text-dark-500 mx-1">•</span>
                      {formatBytes(item.size)}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 flex-shrink-0">
                  <button
                    onClick={() => handleDownload(item.id, item.fileName)}
                    className="p-2 rounded-xl hover:bg-white/5 text-primary-400 hover:text-primary-300 transition-colors"
                    title="Redownload File"
                  >
                    <Download size={15} />
                  </button>
                  <button
                    onClick={() => handleRemoveItem(item.id)}
                    className="p-2 rounded-xl hover:bg-red-500/10 text-dark-500 hover:text-red-400 transition-colors"
                    title="Remove from history"
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
