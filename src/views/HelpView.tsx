import React from 'react';
import { HelpCircle, ChevronRight, Zap, Shield, Cpu } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function HelpView() {
  const faqs = [
    {
      q: 'How does ConvertVerse convert and edit files without uploading them?',
      a: 'ConvertVerse utilizes modern browser technologies such as WebAssembly, PDF-Lib, Tesseract.js, and HTML5 Canvas. The computations run directly in your computer memory (RAM).'
    },
    {
      q: 'Why is client-side conversion faster than cloud tools?',
      a: 'Cloud tools require uploading heavy multi-megabyte files over your network, waiting for server queues, and downloading the results. ConvertVerse processes files instantly on your CPU.'
    },
    {
      q: 'What are the supported browser requirements?',
      a: 'ConvertVerse works on modern desktop and mobile browsers supporting WebAssembly and HTML5 Canvas, including Google Chrome, Mozilla Firefox, Apple Safari, and Microsoft Edge.'
    },
    {
      q: 'Are there any hidden file size caps or payment requirements?',
      a: 'No. ConvertVerse is 100% free with no file limits, paywalls, or mandatory user accounts.'
    }
  ];

  return (
    <div className="max-w-4xl mx-auto py-12 px-4 space-y-10">
      <header className="text-center space-y-4">
        <h1 className="text-4xl font-extrabold text-white tracking-tight">Help & Support Center</h1>
        <p className="text-lg text-slate-300 max-w-2xl mx-auto">
          Find answers to common operational questions, browser requirements, and troubleshooting tips.
        </p>
      </header>

      <div className="grid md:grid-cols-3 gap-6">
        <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-6 space-y-3">
          <Zap className="w-8 h-8 text-emerald-400" />
          <h2 className="text-xl font-bold text-white">Performance Specs</h2>
          <p className="text-slate-300 text-sm">ConvertVerse uses WebWorkers to execute multi-threaded image and PDF operations without freezing the main UI.</p>
        </div>

        <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-6 space-y-3">
          <Shield className="w-8 h-8 text-emerald-400" />
          <h2 className="text-xl font-bold text-white">Data Confidentiality</h2>
          <p className="text-slate-300 text-sm">Your files never leave your device memory. 100% privacy guaranteed.</p>
        </div>

        <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-6 space-y-3">
          <Cpu className="w-8 h-8 text-emerald-400" />
          <h2 className="text-xl font-bold text-white">Browser Memory</h2>
          <p className="text-slate-300 text-sm">Maximum file processing sizes depend on your available physical device RAM.</p>
        </div>
      </div>

      <section className="bg-slate-800/80 border border-slate-700/60 rounded-2xl p-8 space-y-6">
        <h2 className="text-2xl font-bold text-white flex items-center gap-2">
          <HelpCircle className="w-6 h-6 text-emerald-400" /> Frequently Asked Questions
        </h2>

        <div className="space-y-4">
          {faqs.map((faq, idx) => (
            <div key={idx} className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-2">
              <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                <ChevronRight className="w-5 h-5 text-emerald-400 shrink-0" />
                {faq.q}
              </h3>
              <p className="text-slate-300 text-sm pl-7 leading-relaxed">{faq.a}</p>
            </div>
          ))}
        </div>
      </section>

      <div className="text-center pt-4">
        <p className="text-slate-300 text-sm">
          Need additional assistance? <Link to="/contact" className="text-emerald-400 underline font-medium">Contact our support team</Link>.
        </p>
      </div>
    </div>
  );
}
