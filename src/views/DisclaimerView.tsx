import React from 'react';
import { AlertTriangle, ShieldCheck, Scale } from 'lucide-react';

export default function DisclaimerView() {
  return (
    <div className="max-w-4xl mx-auto py-12 px-4 space-y-8 text-slate-300">
      <header className="space-y-4">
        <h1 className="text-4xl font-extrabold text-white tracking-tight">Legal Disclaimer & Terms Notice</h1>
        <p className="text-sm text-slate-400">Last Updated: July 26, 2026</p>
      </header>

      <section className="bg-slate-800/80 border border-slate-700/60 rounded-2xl p-6 space-y-4">
        <h2 className="text-2xl font-bold text-white flex items-center gap-2">
          <AlertTriangle className="w-6 h-6 text-amber-400" /> Client-Side Execution Notice
        </h2>
        <p className="leading-relaxed">
          ConvertVerse provides browser-based file conversion, PDF layout editing, OCR scanning, and media optimization tools "as-is" without warranty of any kind, express or implied.
        </p>
      </section>

      <div className="space-y-6">
        <div className="space-y-2">
          <h3 className="text-xl font-bold text-white flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-emerald-400" /> 1. No Data Retention
          </h3>
          <p>
            ConvertVerse operates entirely within your browser memory (RAM). We do not store, copy, or retain any user files. Users are solely responsible for keeping local backup copies of original files before processing.
          </p>
        </div>

        <div className="space-y-2">
          <h3 className="text-xl font-bold text-white flex items-center gap-2">
            <Scale className="w-5 h-5 text-emerald-400" /> 2. Limitation of Liability
          </h3>
          <p>
            In no event shall ConvertVerse or its developers be liable for any direct, indirect, incidental, or consequential damages arising out of the use of or inability to use this software utility.
          </p>
        </div>
      </div>
    </div>
  );
}
