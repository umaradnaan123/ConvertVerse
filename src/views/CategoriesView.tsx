import React from 'react';
import { TOOLS_REGISTRY } from '../constants/toolsData';
import { Link } from 'react-router-dom';
import { FileText, Image, RefreshCw, ShieldCheck, Cpu, Workflow, ArrowRight } from 'lucide-react';

const categories = [
  { id: 'pdf', name: 'PDF Suite', description: 'Merge, split, edit, compress, rotate, and password protect PDF documents.', icon: FileText },
  { id: 'image', name: 'Image Tools', description: 'Compress JPEGs/PNGs, resize by DPI metrics, convert HEIC, and scrub EXIF data.', icon: Image },
  { id: 'converter', name: 'Converters', description: 'Convert between PNG, JPG, WebP, AVIF, PDF, TXT, JSON, and Word files.', icon: RefreshCw },
  { id: 'security', name: 'AI Vault & Security', description: 'AES-256 PBKDF2 encryption, face censor blur, and self-destruct sharing.', icon: ShieldCheck },
  { id: 'ai', name: 'AI & Document OCR', description: 'Optical Character Recognition (OCR), Web Vitals audit, and social OG card designer.', icon: Cpu },
  { id: 'automation', name: 'Batch Automation', description: 'Sequential workflow builder to watermark, rename, resize, and zip assets.', icon: Workflow }
];

export default function CategoriesView() {
  return (
    <div className="max-w-6xl mx-auto py-12 px-4 space-y-10">
      <header className="text-center space-y-4">
        <h1 className="text-4xl font-extrabold text-white tracking-tight">Tool Categories Index</h1>
        <p className="text-lg text-slate-300 max-w-2xl mx-auto">
          Explore ConvertVerse utilities organized by functional software suite.
        </p>
      </header>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {categories.map((cat) => {
          const Icon = cat.icon;
          const catTools = Object.values(TOOLS_REGISTRY).filter((t) => t.category === cat.id);

          return (
            <div key={cat.id} className="bg-slate-800/80 border border-slate-700/60 rounded-2xl p-6 space-y-6">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-emerald-500/10 border border-emerald-500/20 rounded-xl flex items-center justify-center text-emerald-400">
                  <Icon className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-white">{cat.name}</h2>
                  <span className="text-xs text-slate-400 font-medium">{catTools.length} Tools Available</span>
                </div>
              </div>

              <p className="text-slate-300 text-sm leading-relaxed">{cat.description}</p>

              <div className="space-y-2 pt-4 border-t border-slate-700/50">
                {catTools.slice(0, 4).map((tool) => (
                  <Link
                    key={tool.id}
                    to={tool.path}
                    className="flex items-center justify-between text-slate-300 hover:text-emerald-400 text-sm py-1 font-medium transition-colors"
                  >
                    <span>{tool.name}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
