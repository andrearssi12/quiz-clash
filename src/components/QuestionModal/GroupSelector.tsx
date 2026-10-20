'use client';

import React from 'react';
import { useQuiz } from '@/context/QuizContext';
import { Users, AlertTriangle } from 'lucide-react';

interface GroupSelectorProps {
  wrongAttempts?: string[];
}

export function GroupSelector({ wrongAttempts = [] }: GroupSelectorProps) {
  const { teams, selectedTeamId, setSelectedTeamId } = useQuiz();

  return (
    <div className="w-full bg-slate-900/90 p-4 rounded-2xl border border-slate-800">
      <div className="flex items-center justify-between mb-3">
        <label className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
          <Users className="w-4 h-4 text-indigo-400" />
          Pilih Kelompok Yang Merebut Soal:
        </label>
        {selectedTeamId && (
          <span className="text-xs text-emerald-400 font-medium">Kelompok Dipilih</span>
        )}
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
        {teams.map((team) => {
          const isSelected = selectedTeamId === team.id;
          const isPreviouslyWrong = wrongAttempts.includes(team.id);

          return (
            <button
              key={team.id}
              type="button"
              onClick={() => setSelectedTeamId(team.id)}
              className={`relative flex items-center gap-2 p-3 rounded-xl border text-left transition-all ${
                isSelected
                  ? 'bg-indigo-600/30 border-indigo-500 text-white shadow-md ring-2 ring-indigo-500/50'
                  : isPreviouslyWrong
                  ? 'bg-rose-950/20 border-rose-900/40 text-rose-300/80 hover:border-rose-700/60'
                  : 'bg-slate-800/60 border-slate-700/70 text-slate-300 hover:bg-slate-800 hover:border-slate-600'
              }`}
            >
              <span className={`w-3 h-3 rounded-full shrink-0 ${team.color.split(' ')[0]}`} />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold truncate">{team.name}</p>
                <p className="text-[11px] text-slate-400 font-mono">{team.score} Poin</p>
              </div>

              {isPreviouslyWrong && (
                <span title="Kelompok ini sudah pernah salah menjawab soal ini" className="text-rose-400">
                  <AlertTriangle className="w-3.5 h-3.5" />
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
