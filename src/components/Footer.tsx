'use client';

import React from 'react';
import { Heart, Sparkles, Terminal } from 'lucide-react';

export function Footer() {
  return (
    <footer className="w-full mt-auto py-6 px-4 border-t border-slate-800/80 bg-gradient-to-b from-slate-950/40 via-slate-900/60 to-slate-950 backdrop-blur-md select-none">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Left: App Branding Tag */}
        <div className="flex items-center gap-2 text-xs text-slate-400">
          <span className="flex h-2 w-2 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          <span className="font-semibold text-slate-300 tracking-wide">QuizClash</span>
          <span className="text-slate-600">•</span>
          <span className="text-slate-500">Interactive Quiz Arena</span>
        </div>

        {/* Center / Right: Watermark badge */}
        <div className="flex items-center gap-2.5 px-4 py-2 rounded-2xl bg-slate-900/90 border border-slate-700/80 shadow-lg shadow-indigo-950/20 hover:border-indigo-500/50 transition-all duration-300 group">
          <div className="w-6 h-6 rounded-lg bg-gradient-to-tr from-amber-500 via-rose-500 to-indigo-600 flex items-center justify-center shadow-sm">
            <Sparkles className="w-3.5 h-3.5 text-white" />
          </div>

          <span className="text-xs text-slate-400 font-medium">Crafted with</span>
          <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500 animate-pulse" />
          <span className="text-xs text-slate-400 font-medium">by</span>

          <span className="text-xs font-bold tracking-wide bg-gradient-to-r from-amber-300 via-rose-300 to-indigo-300 bg-clip-text text-transparent group-hover:from-amber-200 group-hover:to-indigo-200 transition-all">
            Andrea Rossi
          </span>
        </div>

        {/* Right: Quick Spec Note */}
        <div className="text-[11px] text-slate-500 font-mono hidden sm:flex items-center gap-1.5">
          <Terminal className="w-3.5 h-3.5 text-slate-600" />
          <span>v1.0 • Next.js Realtime</span>
        </div>
      </div>
    </footer>
  );
}
