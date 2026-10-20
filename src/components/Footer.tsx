import React from 'react';
import { Heart } from 'lucide-react';

export function Footer() {
  return (
    <footer className="w-full py-4 px-4 border-t border-slate-900 bg-slate-950/90 text-center select-none">
      <div className="max-w-7xl mx-auto flex items-center justify-center gap-1.5 text-xs text-slate-500">
        <span>Made with</span>
        <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500 inline" />
        <span>by</span>
        <span className="font-semibold text-slate-300 hover:text-white transition-colors">
          Andrea Rossi
        </span>
      </div>
    </footer>
  );
}
