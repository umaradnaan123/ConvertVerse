import React from 'react';
import { ToolMetaData } from '../../constants/toolsData';
import { CheckCircle2, HelpCircle, BookOpen, Star, ShieldCheck } from 'lucide-react';

interface ToolSEOContentProps {
  tool: ToolMetaData;
}

export const ToolSEOContent: React.FC<ToolSEOContentProps> = ({ tool }) => {
  return (
    <article className="mt-16 pt-12 border-t border-slate-800/80 text-slate-300 space-y-12">
      {/* 1. Keyword-Rich H1 & Introduction */}
      <section className="space-y-4 max-w-4xl">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-100 tracking-tight">
          {tool.name}: Private Client-Side Online Workstation
        </h1>
        <p className="text-base sm:text-lg text-slate-400 leading-relaxed">
          {tool.seoDescription}
        </p>
        <div className="prose prose-invert max-w-none text-slate-300 leading-relaxed space-y-4">
          {tool.longContent.split('\n\n').map((paragraph, index) => (
            <p key={index}>{paragraph}</p>
          ))}
        </div>
      </section>

      {/* 2. Key Features List */}
      <section className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-6 sm:p-8 space-y-6">
        <h2 className="text-2xl font-bold text-slate-100 flex items-center gap-2.5">
          <Star className="w-6 h-6 text-amber-400" />
          Key Features & Technical Capabilities
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {tool.features.map((feature, idx) => (
            <div key={idx} className="flex items-start gap-3 p-3 rounded-xl bg-slate-800/40 border border-slate-700/40">
              <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
              <span className="text-sm font-medium text-slate-200">{feature}</span>
            </div>
          ))}
        </div>
      </section>

      {/* 3. Privacy & Performance Benefits */}
      <section className="space-y-6">
        <h2 className="text-2xl font-bold text-slate-100 flex items-center gap-2.5">
          <ShieldCheck className="w-6 h-6 text-emerald-400" />
          Why Choose Local Browser Processing?
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {tool.benefits.map((benefit, idx) => (
            <div key={idx} className="p-5 rounded-xl bg-slate-900/40 border border-slate-800/80 space-y-2">
              <span className="text-xs font-bold text-violet-400 uppercase tracking-wider">Benefit 0{idx + 1}</span>
              <p className="text-sm text-slate-300 font-medium leading-relaxed">{benefit}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 4. Step-by-Step Usage Instructions */}
      <section className="bg-gradient-to-br from-slate-900/80 to-slate-950/80 border border-slate-800/80 rounded-2xl p-6 sm:p-8 space-y-6">
        <h2 className="text-2xl font-bold text-slate-100 flex items-center gap-2.5">
          <BookOpen className="w-6 h-6 text-cyan-400" />
          How to Use {tool.name}
        </h2>
        <ol className="space-y-4">
          {tool.instructions.map((step, idx) => (
            <li key={idx} className="flex items-start gap-4">
              <span className="w-7 h-7 rounded-full bg-violet-600/20 border border-violet-500/40 text-violet-400 text-sm font-bold flex items-center justify-center shrink-0 mt-0.5">
                {idx + 1}
              </span>
              <p className="text-sm text-slate-300 pt-1 leading-relaxed">{step}</p>
            </li>
          ))}
        </ol>
      </section>

      {/* 5. Accessible FAQ Accordion Section */}
      {tool.faqs && tool.faqs.length > 0 && (
        <section className="space-y-6">
          <h2 className="text-2xl font-bold text-slate-100 flex items-center gap-2.5">
            <HelpCircle className="w-6 h-6 text-violet-400" />
            Frequently Asked Questions
          </h2>
          <div className="space-y-4">
            {tool.faqs.map((faq, idx) => (
              <details
                key={idx}
                className="group border border-slate-800/80 rounded-xl bg-slate-900/40 p-4 font-sans text-slate-200 transition-all [&[open]]:bg-slate-900/80"
              >
                <summary className="font-semibold cursor-pointer text-slate-100 flex items-center justify-between list-none focus:outline-none focus:text-violet-400">
                  <span>{faq.question}</span>
                  <span className="text-slate-500 group-open:rotate-180 transition-transform">▼</span>
                </summary>
                <p className="mt-3 text-sm text-slate-400 leading-relaxed border-t border-slate-800/60 pt-3">
                  {faq.answer}
                </p>
              </details>
            ))}
          </div>
        </section>
      )}
    </article>
  );
};
