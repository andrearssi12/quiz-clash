'use client';

import React from 'react';
import { useQuiz } from '@/context/QuizContext';
import { TeamScoreCard } from './TeamScoreCard';
import { Users } from 'lucide-react';

export function ScoreBoard() {
  const { teams } = useQuiz();

  // Find max score to determine current leader (if > 0)
  const maxScore = Math.max(...teams.map((t) => t.score));

  return (
    <section className="w-full mb-8">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2 text-slate-300">
          <Users className="w-5 h-5 text-indigo-400" />
          <h2 className="text-lg font-bold tracking-wide">PAPAN SKOR KELOMPOK</h2>
        </div>
        <div className="text-xs text-slate-400">
          Total Kelompok: <span className="font-semibold text-slate-200">{teams.length}</span>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
        {teams.map((team) => (
          <TeamScoreCard
            key={team.id}
            team={team}
            isLeader={maxScore > 0 && team.score === maxScore}
          />
        ))}
      </div>
    </section>
  );
}
