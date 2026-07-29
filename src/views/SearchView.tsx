import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { TOOLS_REGISTRY } from '../constants/toolsData';
import { Search as SearchIcon, ArrowRight, LayoutGrid } from 'lucide-react';

export default function SearchView() {
  const [searchParams, setSearchParams] = useSearchParams();
  const queryParam = searchParams.get('q') || '';
  const [searchTerm, setSearchTerm] = useState(queryParam);

  useEffect(() => {
    setSearchTerm(queryParam);
  }, [queryParam]);

  const results = Object.values(TOOLS_REGISTRY).filter((tool) => {
    if (!searchTerm.trim()) return true;
    const term = searchTerm.toLowerCase();
    return (
      tool.name.toLowerCase().includes(term) ||
      tool.shortDescription.toLowerCase().includes(term) ||
      (tool.keywords && tool.keywords.some((k) => k.toLowerCase().includes(term)))
    );
  });

  return (
    <div className="max-w-5xl mx-auto py-12 px-4 space-y-8">
      <header className="text-center space-y-4">
        <h1 className="text-4xl font-extrabold text-white tracking-tight">Search Workstation Tools</h1>
        <p className="text-lg text-slate-300 max-w-2xl mx-auto">
          Find PDF splitters, image resizers, file converters, OCR scanners, and security utilities instantly.
        </p>
      </header>

      <div className="max-w-2xl mx-auto relative">
        <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setSearchParams(e.target.value ? { q: e.target.value } : {});
          }}
          placeholder="Search by tool name, file extension (PDF, PNG, HEIC), or keyword..."
          className="w-full bg-slate-800/90 border border-slate-700/80 rounded-xl pl-12 pr-4 py-3.5 text-white placeholder:text-slate-400 focus:ring-2 focus:ring-emerald-500 outline-none text-base shadow-lg"
        />
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between text-sm text-slate-400">
          <span>Found {results.length} matching tools</span>
          {searchTerm && <span>Search term: "{searchTerm}"</span>}
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {results.map((tool) => (
            <Link
              key={tool.id}
              to={tool.path}
              className="bg-slate-800/80 hover:bg-slate-800 border border-slate-700/60 hover:border-emerald-500/60 rounded-2xl p-6 transition-all group flex flex-col justify-between"
            >
              <div className="space-y-3">
                <h2 className="text-xl font-bold text-white group-hover:text-emerald-400 transition-colors">
                  {tool.name}
                </h2>
                <p className="text-slate-300 text-sm line-clamp-2">{tool.shortDescription}</p>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-700/50 flex items-center text-xs font-semibold text-emerald-400 group-hover:translate-x-1 transition-transform">
                Open Workstation <ArrowRight className="w-4 h-4 ml-1" />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
