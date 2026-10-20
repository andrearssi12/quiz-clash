'use client';

import React from 'react';
import { QuizGrid } from './QuizGrid';
import { LayoutGrid } from 'lucide-react';

export function QuizBoard() {
  return (
    <section className="w-full">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2 text-slate-300">
          <LayoutGrid className="w-5 h-5 text-indigo-400" />
          <h2 className="text-lg font-bold tracking-wide">ARENA KARTU SOAL</h2>
        </div>
        <p className="text-xs text-slate-400 hidden sm:block">
          Klik kartu soal untuk membuka pertanyaan & memilih kelompok penjawab
        </p>
      </div>

      <div className="bg-slate-950/40 p-4 sm:p-6 rounded-3xl border border-slate-800 shadow-xl backdrop-blur-sm">
        <QuizGrid />
      </div>
    </section>
  );
}
