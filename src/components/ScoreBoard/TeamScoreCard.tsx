'use client';

import React from 'react';
import { Team } from '@/types';
import { useQuiz } from '@/context/QuizContext';
import { Plus, Minus, Crown } from 'lucide-react';

interface TeamScoreCardProps {
  team: Team;
  isLeader?: boolean;
}

export function TeamScoreCard({ team, isLeader }: TeamScoreCardProps) {
  const { updateTeamScore } = useQuiz();

  return (
    <div
      className={`relative overflow-hidden rounded-2xl border p-4 sm:p-5 flex flex-col justify-between transition-all duration-300 shadow-md ${
        isLeader
          ? 'bg-slate-800/90 border-amber-500/50 shadow-amber-500/10'
          : 'bg-slate-900/60 border-slate-800/80 hover:border-slate-700'
      }`}
    >
      {/* Top Header */}
      <div className="flex items-center justify-between gap-2 mb-2">
        <div className="flex items-center gap-2">
          <span className={`w-3.5 h-3.5 rounded-full ${team.color.split(' ')[0]}`} />
          <h3 className="font-bold text-slate-100 text-base sm:text-lg truncate max-w-[130px]">
            {team.name}
          </h3>
        </div>
        {isLeader && (
          <span className="flex items-center gap-1 text-xs px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 font-medium border border-amber-500/30">
            <Crown className="w-3 h-3 text-amber-400" />
            Memimpin
          </span>
        )}
      </div>

      {/* Main Score Area */}
      <div className="my-2 flex items-baseline justify-between">
        <span className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white font-mono">
          {team.score.toLocaleString('id-ID')}
        </span>
        <span className="text-xs uppercase font-semibold text-slate-400 tracking-wider">
          Poin
        </span>
      </div>

      {/* Quick Manual Adjustments */}
      <div className="flex items-center justify-end gap-1.5 pt-2 border-t border-slate-800/50">
        <button
          onClick={() => updateTeamScore(team.id, -50)}
          className="p-1 rounded-md bg-slate-800 hover:bg-rose-900/40 text-slate-400 hover:text-rose-300 transition"
          title="Kurangi 50 Poin"
        >
          <Minus className="w-3.5 h-3.5" />
        </button>
        <button
          onClick={() => updateTeamScore(team.id, 50)}
          className="p-1 rounded-md bg-slate-800 hover:bg-emerald-900/40 text-slate-400 hover:text-emerald-300 transition"
          title="Tambah 50 Poin"
        >
          <Plus className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}
