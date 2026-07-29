import React from 'react';
import { FileText, ArrowRight, ShieldCheck, Zap, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function BlogView() {
  const articles = [
    {
      id: 'client-side-privacy',
      title: 'Why Serverless Local File Processing is the Future of Privacy',
      snippet: 'Discover why uploading sensitive financial PDFs and contracts to third-party cloud converters poses serious security risks, and how WebAssembly enables 100% browser-only utilities.',
      category: 'Security & Privacy',
      date: 'July 26, 2026',
      readTime: '5 min read'
    },
    {
      id: 'metric-dpi-resizing',
      title: 'Understanding Physical Metric Print Resizing: Pixels, Inches, and 300 DPI',
      snippet: 'Learn how to mathematically convert physical dimensions (in, cm, mm) to exact pixel sizes for crystal-clear physical printing, passport photos, and posters.',
      category: 'Image Editing',
      date: 'July 20, 2026',
      readTime: '7 min read'
    },
    {
      id: 'web-vitals-image-optimization',
      title: 'How Heavy Images Hurt Core Web Vitals (and How to Fix LCP Scores)',
      snippet: 'A comprehensive guide to auditing image weights, converting legacy PNGs to modern WebP/AVIF, and generating responsive HTML picture stacks with lazy loading.',
      category: 'Web Performance',
      date: 'July 15, 2026',
      readTime: '6 min read'
    }
  ];

  return (
    <div className="max-w-5xl mx-auto py-12 px-4 space-y-10">
      <header className="text-center space-y-4">
        <h1 className="text-4xl font-extrabold text-white tracking-tight">ConvertVerse Technical Blog</h1>
        <p className="text-lg text-slate-300 max-w-2xl mx-auto">
          In-depth articles, web performance tutorials, and browser cryptographic guides.
        </p>
      </header>

      <div className="grid md:grid-cols-3 gap-8">
        {articles.map((art) => (
          <article key={art.id} className="bg-slate-800/80 border border-slate-700/60 rounded-2xl p-6 flex flex-col justify-between hover:border-emerald-500/50 transition-colors">
            <div className="space-y-4">
              <div className="flex items-center justify-between text-xs text-slate-400">
                <span className="bg-emerald-500/10 text-emerald-400 font-semibold px-2.5 py-1 rounded-md border border-emerald-500/20">{art.category}</span>
                <span>{art.readTime}</span>
              </div>
              <h2 className="text-xl font-bold text-white leading-snug">{art.title}</h2>
              <p className="text-slate-300 text-sm leading-relaxed">{art.snippet}</p>
            </div>

            <div className="pt-6 border-t border-slate-700/50 mt-6 flex items-center justify-between text-xs text-slate-400">
              <span>{art.date}</span>
              <Link to={`/blog/${art.id}`} className="text-emerald-400 font-semibold flex items-center gap-1 hover:underline">
                Read Article <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
