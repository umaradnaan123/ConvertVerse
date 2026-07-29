import React from 'react';
import { FileText, CheckCircle } from 'lucide-react';

export default function TermsView() {
  return (
    <div className="max-w-4xl mx-auto py-12 px-4 space-y-8 text-slate-300">
      <header className="space-y-4">
        <h1 className="text-4xl font-extrabold text-white tracking-tight">Terms of Service</h1>
        <p className="text-sm text-slate-400">Effective Date: July 26, 2026</p>
      </header>

      <section className="bg-slate-800/80 border border-slate-700/60 rounded-2xl p-6 space-y-4">
        <h2 className="text-2xl font-bold text-white flex items-center gap-2">
          <FileText className="w-6 h-6 text-emerald-400" /> Fair-Use Utility Terms
        </h2>
        <p className="leading-relaxed">
          By accessing or using the ConvertVerse website and workstation utilities, you agree to these terms of service.
        </p>
      </section>

      <div className="space-y-6">
        <div className="space-y-2">
          <h3 className="text-xl font-bold text-white flex items-center gap-2">
            <CheckCircle className="w-5 h-5 text-emerald-400" /> 1. Free & Commercial Usage
          </h3>
          <p>
            ConvertVerse is provided free of charge for both personal and commercial document/image processing. You are free to use all tools for business workflows, artwork creation, and document compilation.
          </p>
        </div>

        <div className="space-y-2">
          <h3 className="text-xl font-bold text-white flex items-center gap-2">
            <CheckCircle className="w-5 h-5 text-emerald-400" /> 2. Client-Side Execution & Responsibility
          </h3>
          <p>
            Since all processing occurs locally on your machine using your browser's resources, you remain sole owner of your files. ConvertVerse bears no responsibility for hardware memory limits or browser crashes during large file processing.
          </p>
        </div>
      </div>
    </div>
  );
}
