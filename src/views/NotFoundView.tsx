import React from 'react';
import { Link } from 'react-router-dom';
import { AlertCircle, Home, ArrowLeft } from 'lucide-react';

export default function NotFoundView() {
  return (
    <div className="min-h-[600px] flex flex-col items-center justify-center p-8 text-center space-y-6">
      <div className="w-20 h-20 bg-rose-500/10 border border-rose-500/20 rounded-3xl flex items-center justify-center text-rose-400">
        <AlertCircle className="w-10 h-10" />
      </div>

      <div className="space-y-2 max-w-md">
        <h1 className="text-4xl font-extrabold text-white">404 - Page Not Found</h1>
        <p className="text-slate-300 text-sm">
          The workstation route you are looking for does not exist or has been moved to a new clean URL.
        </p>
      </div>

      <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
        <Link
          to="/"
          className="bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-semibold px-6 py-3 rounded-xl transition-colors flex items-center gap-2"
        >
          <Home className="w-4 h-4" /> Go to Dashboard
        </Link>
        <Link
          to="/tools"
          className="bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold px-6 py-3 rounded-xl border border-slate-700 transition-colors flex items-center gap-2"
        >
          <ArrowLeft className="w-4 h-4" /> Browse All Tools
        </Link>
      </div>
    </div>
  );
}
