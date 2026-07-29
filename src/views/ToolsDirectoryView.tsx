import React from 'react';
import { TOOLS_REGISTRY } from '../constants/toolsData';
import { Link } from 'react-router-dom';
import { ArrowRight, LayoutGrid, FileText, Image, ShieldCheck, RefreshCw, Sparkles, Workflow } from 'lucide-react';

const iconMap: Record<string, any> = {
  FileText,
  Image,
  ShieldCheck,
  RefreshCw,
  Sparkles,
  Workflow,
  LayoutDashboard: LayoutGrid
};

export default function ToolsDirectoryView() {
  const tools = Object.values(TOOLS_REGISTRY).filter((t) => t.category !== 'directory' && t.category !== 'legal');

  return (
    <div className="max-w-6xl mx-auto py-12 px-4 space-y-10">
      <header className="text-center space-y-4">
        <h1 className="text-4xl font-extrabold text-white tracking-tight">All ConvertVerse Utility Tools</h1>
        <p className="text-lg text-slate-300 max-w-2xl mx-auto">
          Explore our complete directory of 20+ free, client-side PDF, image, security, OCR, and format conversion tools.
        </p>
      </header>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {tools.map((tool) => {
          const Icon = iconMap[tool.iconName] || LayoutGrid;
          return (
            <Link
              key={tool.id}
              to={tool.path}
              className="bg-slate-800/80 hover:bg-slate-800 border border-slate-700/60 hover:border-emerald-500/60 rounded-2xl p-6 transition-all group flex flex-col justify-between"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="w-12 h-12 bg-emerald-500/10 border border-emerald-500/20 rounded-xl flex items-center justify-center text-emerald-400 group-hover:scale-110 transition-transform">
                    <Icon className="w-6 h-6" />
                  </div>
                  {tool.badge && (
                    <span className="bg-emerald-500/10 text-emerald-400 text-xs font-semibold px-2.5 py-1 rounded-md border border-emerald-500/20">
                      {tool.badge}
                    </span>
                  )}
                </div>

                <div>
                  <h2 className="text-xl font-bold text-white group-hover:text-emerald-400 transition-colors">
                    {tool.name}
                  </h2>
                  <p className="text-slate-300 text-sm mt-2 line-clamp-2">{tool.shortDescription}</p>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-700/50 flex items-center text-xs font-semibold text-emerald-400 group-hover:translate-x-1 transition-transform">
                Launch Workstation <ArrowRight className="w-4 h-4 ml-1" />
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
