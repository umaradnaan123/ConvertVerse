import React from 'react';
import { ShieldCheck, Cpu, Lock, Sparkles, Check } from 'lucide-react';

export default function AboutView() {
  return (
    <div className="max-w-4xl mx-auto py-12 px-4 space-y-10">
      <header className="text-center space-y-4">
        <h1 className="text-4xl font-extrabold text-white tracking-tight">About ConvertVerse</h1>
        <p className="text-lg text-slate-300 max-w-2xl mx-auto">
          Reinventing online document and media utilities through zero-knowledge, client-side browser computing.
        </p>
      </header>

      <section className="bg-slate-800/80 border border-slate-700/60 rounded-2xl p-8 space-y-6">
        <h2 className="text-2xl font-bold text-white flex items-center gap-3">
          <ShieldCheck className="w-7 h-7 text-emerald-400" /> Our Mission: Absolute Data Privacy
        </h2>
        <p className="text-slate-300 leading-relaxed">
          Traditional online file converters force users to upload confidential PDFs, contracts, scanned receipts, and personal photos to remote cloud servers. This exposes users to data breaches, unauthorized retention, and privacy compromises.
        </p>
        <p className="text-slate-300 leading-relaxed">
          ConvertVerse operates on a strict zero-knowledge architecture. Every operation—from PDF splitting and page merging to image compression, HEIC decoding, and AES-256 encryption—runs 100% locally inside your web browser sandbox.
        </p>
      </section>

      <div className="grid md:grid-cols-3 gap-6">
        <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-6 space-y-3">
          <Cpu className="w-8 h-8 text-emerald-400" />
          <h3 className="text-xl font-bold text-white">WebAssembly Powered</h3>
          <p className="text-slate-300 text-sm">High-speed binary compilation delivers desktop-class performance in browser memory.</p>
        </div>

        <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-6 space-y-3">
          <Lock className="w-8 h-8 text-emerald-400" />
          <h3 className="text-xl font-bold text-white">100% Serverless</h3>
          <p className="text-slate-300 text-sm">Your files never leave your device. Zero cloud storage or external API calls.</p>
        </div>

        <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-6 space-y-3">
          <Sparkles className="w-8 h-8 text-emerald-400" />
          <h3 className="text-xl font-bold text-white">Free & Unlimited</h3>
          <p className="text-slate-300 text-sm">No daily conversion limits, file size caps, or hidden registration paywalls.</p>
        </div>
      </div>

      <section className="bg-slate-900 border border-slate-800 rounded-2xl p-8 space-y-4">
        <h3 className="text-2xl font-bold text-white">Core Technology Stack</h3>
        <ul className="grid sm:grid-cols-2 gap-3 text-slate-300">
          <li className="flex items-center gap-2"><Check className="w-5 h-5 text-emerald-400" /> React 19 & Vite 6</li>
          <li className="flex items-center gap-2"><Check className="w-5 h-5 text-emerald-400" /> TypeScript & ES Modules</li>
          <li className="flex items-center gap-2"><Check className="w-5 h-5 text-emerald-400" /> PDF-Lib & PDF.js Engines</li>
          <li className="flex items-center gap-2"><Check className="w-5 h-5 text-emerald-400" /> Tesseract.js WebAssembly OCR</li>
          <li className="flex items-center gap-2"><Check className="w-5 h-5 text-emerald-400" /> Native Web Crypto API</li>
          <li className="flex items-center gap-2"><Check className="w-5 h-5 text-emerald-400" /> HTML5 Canvas & WebWorkers</li>
        </ul>
      </section>
    </div>
  );
}
