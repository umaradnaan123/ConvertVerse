import React from 'react';
import { UserCheck, ShieldCheck, Award, Code2 } from 'lucide-react';

export default function AuthorsView() {
  const authors = [
    {
      name: 'Adnaan Umar',
      role: 'Lead Architect & Senior Full-Stack Engineer',
      bio: 'Specialist in WebAssembly, browser crypto, and client-side performance engineering. Lead developer of ConvertVerse.',
      expertise: ['WebAssembly', 'React / TypeScript', 'Web Workers', 'Browser Security']
    },
    {
      name: 'ConvertVerse Technical Review Board',
      role: 'Security Auditors & SEO Engineers',
      bio: 'A collective of performance specialists and security auditors ensuring WCAG 2.2 AA compliance, Core Web Vitals optimization, and 100% serverless privacy.',
      expertise: ['Technical SEO', 'Core Web Vitals', 'Cryptographic Security', 'Accessibility']
    }
  ];

  return (
    <div className="max-w-4xl mx-auto py-12 px-4 space-y-10">
      <header className="text-center space-y-4">
        <h1 className="text-4xl font-extrabold text-white tracking-tight">Authors & Engineering Team</h1>
        <p className="text-lg text-slate-300 max-w-2xl mx-auto">
          Meet the software architects, security auditors, and technical writers behind ConvertVerse.
        </p>
      </header>

      <div className="space-y-6">
        {authors.map((author, idx) => (
          <div key={idx} className="bg-slate-800/80 border border-slate-700/60 rounded-2xl p-8 space-y-4">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl flex items-center justify-center text-emerald-400">
                <UserCheck className="w-8 h-8" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white">{author.name}</h2>
                <p className="text-emerald-400 font-semibold text-sm">{author.role}</p>
              </div>
            </div>

            <p className="text-slate-300 leading-relaxed">{author.bio}</p>

            <div className="pt-4 border-t border-slate-700/50 flex flex-wrap gap-2">
              {author.expertise.map((exp, i) => (
                <span key={i} className="bg-slate-900 text-slate-300 text-xs font-medium px-3 py-1.5 rounded-lg border border-slate-700">
                  {exp}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
