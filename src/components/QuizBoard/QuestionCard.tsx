'use client';

import React from 'react';
import { QuestionStatus } from '@/types';
import { CheckCircle2, XCircle, HelpCircle } from 'lucide-react';

interface QuestionCardProps {
  id: string;
  points: number;
  status: QuestionStatus;
  answeredBy?: string;
  wrongCount?: number;
  onClick: () => void;
}

export function QuestionCard({
  id,
  points,
  status,
  answeredBy,
  wrongCount = 0,
  onClick,
}: QuestionCardProps) {
  const isCorrect = status === 'correct';
  const isWrong = status === 'wrong';

  return (
    <button
      onClick={onClick}
      disabled={isCorrect}
      className={`group relative w-full aspect-[4/3] rounded-2xl border-2 p-4 flex flex-col items-center justify-center text-center transition-all duration-300 transform select-none ${
        isCorrect
          ? 'bg-emerald-950/40 border-emerald-500/60 shadow-lg shadow-emerald-950/30 cursor-not-allowed opacity-90'
          : isWrong
          ? 'bg-rose-950/40 border-rose-500/70 hover:border-rose-400 hover:scale-105 active:scale-95 shadow-lg shadow-rose-950/30'
          : 'bg-slate-900/80 border-slate-700 hover:border-indigo-500 hover:scale-105 active:scale-95 hover:shadow-xl hover:shadow-indigo-500/10'
      }`}
    >
      {/* Top Badge Indicators */}
      <div className="absolute top-3 left-3 text-xs font-mono font-bold text-slate-400">
        #{id}
      </div>

      {isCorrect && (
        <div className="absolute top-3 right-3 flex items-center text-emerald-400">
          <CheckCircle2 className="w-5 h-5" />
        </div>
      )}

      {isWrong && (
        <div className="absolute top-3 right-3 flex items-center gap-1 text-rose-400">
          <XCircle className="w-5 h-5" />
          {wrongCount > 0 && (
            <span className="text-[10px] font-bold bg-rose-950 px-1.5 py-0.2 rounded-full border border-rose-500/40">
              x{wrongCount}
            </span>
          )}
        </div>
      )}

      {!isCorrect && !isWrong && (
        <div className="absolute top-3 right-3 text-slate-500 group-hover:text-indigo-400 transition">
          <HelpCircle className="w-4 h-4" />
        </div>
      )}

      {/* Main Display: Points or Answered Badge */}
      {isCorrect ? (
        <div className="flex flex-col items-center animate-fade-in">
          <span className="text-2xl sm:text-3xl font-black text-emerald-300 font-mono">
            +{points}
          </span>
          <div className="mt-2 text-xs font-medium px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-200 border border-emerald-500/30 truncate max-w-[140px]">
            {answeredBy || 'Terjawab'}
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center">
          <span
            className={`text-3xl sm:text-4xl font-extrabold font-mono tracking-tight transition ${
              isWrong
                ? 'text-rose-300 group-hover:text-rose-200'
                : 'text-amber-400 group-hover:text-amber-300'
            }`}
          >
            {points}
          </span>
          <span className="text-xs uppercase font-semibold text-slate-400 tracking-wider mt-1">
            Poin
          </span>

          {isWrong && (
            <span className="mt-2 text-[11px] font-semibold text-rose-300 bg-rose-500/20 px-2 py-0.5 rounded-full border border-rose-500/30">
              Rebutan Lagi!
            </span>
          )}
        </div>
      )}
    </button>
  );
}
