import React from 'react';
import { ShieldCheck, Lock, EyeOff, ServerOff } from 'lucide-react';

export default function PrivacyPolicyView() {
  return (
    <div className="max-w-4xl mx-auto py-12 px-4 space-y-8 text-slate-300">
      <header className="space-y-4">
        <h1 className="text-4xl font-extrabold text-white tracking-tight">Privacy Policy</h1>
        <p className="text-sm text-slate-400">Effective Date: July 26, 2026</p>
      </header>

      <section className="bg-slate-800/80 border border-slate-700/60 rounded-2xl p-6 space-y-4">
        <h2 className="text-2xl font-bold text-white flex items-center gap-2">
          <ShieldCheck className="w-6 h-6 text-emerald-400" /> Summary: Zero Data Collection
        </h2>
        <p className="leading-relaxed">
          ConvertVerse is engineered specifically as a client-side web application. We do not collect, store, transmit, or process your files on any external server. All computations take place locally inside your browser memory.
        </p>
      </section>

      <div className="space-y-6">
        <div className="space-y-2">
          <h3 className="text-xl font-bold text-white flex items-center gap-2">
            <ServerOff className="w-5 h-5 text-emerald-400" /> 1. No Server File Uploads
          </h3>
          <p>
            When you drag and drop a PDF, image, document, or archive file into ConvertVerse, the file is read into your browser's local RAM. No file buffers or metadata packets are transmitted over the internet to remote servers.
          </p>
        </div>

        <div className="space-y-2">
          <h3 className="text-xl font-bold text-white flex items-center gap-2">
            <EyeOff className="w-5 h-5 text-emerald-400" /> 2. Personal Information & Tracking
          </h3>
          <p>
            We do not require user registration, account creation, email sign-ups, or credit card details. ConvertVerse does not place tracking cookies or collect personally identifiable information (PII).
          </p>
        </div>

        <div className="space-y-2">
          <h3 className="text-xl font-bold text-white flex items-center gap-2">
            <Lock className="w-5 h-5 text-emerald-400" /> 3. Local Storage Usage
          </h3>
          <p>
            ConvertVerse uses standard browser `localStorage` and `IndexedDB` exclusively to preserve your theme preferences, recent conversion history log (stored locally on your device), and user settings. You can clear this data at any time through your browser settings.
          </p>
        </div>
      </div>
    </div>
  );
}
