'use client';

import React from 'react';
import { useQuiz } from '@/context/QuizContext';
import { Sparkles, RotateCcw, Settings, Trophy } from 'lucide-react';

export function Header() {
  const { title, resetQuizState, returnToSetup } = useQuiz();

  return (
    <header className="sticky top-0 z-30 w-full backdrop-blur-md bg-slate-900/80 border-b border-slate-800 shadow-sm transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-500 via-rose-500 to-indigo-600 flex items-center justify-center shadow-md">
            <Trophy className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold bg-gradient-to-r from-amber-400 via-rose-300 to-indigo-300 bg-clip-text text-transparent flex items-center gap-2">
              {title}
              <span className="text-xs px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 font-mono border border-indigo-500/30">
                PROYEKSI / ARENA
              </span>
            </h1>
            <p className="text-xs text-slate-400 hidden sm:block">
              Sistem Kuis Interaktif Rebutan Kelompok
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={resetQuizState}
            className="flex items-center space-x-1 px-3 py-1.5 text-xs font-semibold rounded-lg bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white border border-slate-700 transition"
            title="Reset Soal & Skor"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span className="hidden md:inline">Reset Kuis</span>
          </button>

          <button
            onClick={returnToSetup}
            className="flex items-center space-x-1 px-3 py-1.5 text-xs font-semibold rounded-lg bg-indigo-600/30 text-indigo-300 hover:bg-indigo-600/50 border border-indigo-500/40 transition"
            title="Ganti Bank Soal / Atur Tim"
          >
            <Settings className="w-3.5 h-3.5" />
            <span className="hidden md:inline">Atur Kuis</span>
          </button>
        </div>
      </div>
    </header>
  );
}
