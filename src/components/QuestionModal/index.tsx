'use client';

import React, { useState, useEffect } from 'react';
import { useQuiz } from '@/context/QuizContext';
import { GroupSelector } from './GroupSelector';
import { OptionList } from './OptionList';
import { X, Send, Eye, EyeOff, AlertCircle, CheckCircle2 } from 'lucide-react';

export function QuestionModal() {
  const {
    questions,
    activeQuestionId,
    isModalOpen,
    closeQuestionModal,
    selectedTeamId,
    submitAnswer,
  } = useQuiz();

  const [selectedOption, setSelectedOption] = useState<'A' | 'B' | 'C' | 'D' | null>(null);
  const [showKeyAnswer, setShowKeyAnswer] = useState(false);
  const [feedback, setFeedback] = useState<{ isError: boolean; message: string } | null>(null);

  const activeQuestion = questions.find((q) => q.id === activeQuestionId);

  // Reset internal states when active question changes
  useEffect(() => {
    setSelectedOption(null);
    setShowKeyAnswer(false);
    setFeedback(null);
  }, [activeQuestionId]);

  if (!isModalOpen || !activeQuestion) return null;

  const handleSubmit = () => {
    if (!selectedTeamId) {
      setFeedback({
        isError: true,
        message: 'Harap pilih kelompok yang merebut soal terlebih dahulu!',
      });
      return;
    }

    if (!selectedOption) {
      setFeedback({
        isError: true,
        message: 'Harap pilih salah satu opsi jawaban!',
      });
      return;
    }

    const res = submitAnswer(selectedOption);
    if (!res.isCorrect) {
      setFeedback({
        isError: true,
        message: `Jawaban ${selectedOption} SALAH! Soal masih terbuka dan dapat direbut oleh kelompok lain.`,
      });
      setSelectedOption(null);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in overflow-y-auto">
      <div className="relative w-full max-w-3xl bg-slate-900 border border-slate-700/80 rounded-3xl shadow-2xl p-6 sm:p-8 flex flex-col gap-6 my-8">
        {/* Header Section */}
        <div className="flex items-start justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <span className="px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 font-mono font-bold text-sm border border-amber-500/30">
              #{activeQuestion.id} • {activeQuestion.points} POIN
            </span>
            {activeQuestion.status === 'wrong' && (
              <span className="px-3 py-1 rounded-full bg-rose-500/20 text-rose-300 text-xs font-semibold border border-rose-500/30">
                Pernah Salah Jawab
              </span>
            )}
          </div>

          <button
            onClick={closeQuestionModal}
            className="p-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Question Statement */}
        <div className="bg-slate-950/50 p-6 rounded-2xl border border-slate-800/80">
          <h2 className="text-xl sm:text-2xl font-bold text-white leading-relaxed tracking-wide">
            {activeQuestion.question}
          </h2>
        </div>

        {/* Group Selector for Rebutan */}
        <GroupSelector wrongAttempts={activeQuestion.wrongAttempts} />

        {/* Options List */}
        <div>
          <label className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2 block">
            Pilihan Jawaban:
          </label>
          <OptionList
            question={activeQuestion}
            selectedOption={selectedOption}
            onSelectOption={(opt) => {
              setSelectedOption(opt);
              setFeedback(null);
            }}
          />
        </div>

        {/* Host Secret Key Helper */}
        <div className="flex items-center justify-between text-xs text-slate-400 pt-2 border-t border-slate-800/80">
          <button
            type="button"
            onClick={() => setShowKeyAnswer(!showKeyAnswer)}
            className="flex items-center gap-1.5 hover:text-slate-200 transition"
          >
            {showKeyAnswer ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            <span>{showKeyAnswer ? 'Sembunyikan Kunci Jawaban' : 'Intip Kunci Jawaban (Host)'}</span>
          </button>

          {showKeyAnswer && (
            <span className="font-mono font-bold text-amber-400 bg-amber-400/10 px-2 py-0.5 rounded border border-amber-400/20">
              Kunci: Opsi {activeQuestion.answer}
            </span>
          )}
        </div>

        {/* Feedback Message */}
        {feedback && (
          <div
            className={`flex items-center gap-2 p-3.5 rounded-xl text-sm font-medium border ${
              feedback.isError
                ? 'bg-rose-950/40 text-rose-300 border-rose-800/60'
                : 'bg-emerald-950/40 text-emerald-300 border-emerald-800/60'
            }`}
          >
            {feedback.isError ? (
              <AlertCircle className="w-5 h-5 shrink-0" />
            ) : (
              <CheckCircle2 className="w-5 h-5 shrink-0" />
            )}
            <span>{feedback.message}</span>
          </div>
        )}

        {/* Footer Buttons */}
        <div className="flex items-center justify-end gap-3 pt-2">
          <button
            type="button"
            onClick={closeQuestionModal}
            className="px-5 py-2.5 rounded-xl bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white font-medium text-sm transition"
          >
            Tutup
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-indigo-500 to-indigo-600 hover:from-indigo-400 hover:to-indigo-500 text-white font-bold text-sm shadow-lg shadow-indigo-600/30 transition transform active:scale-95"
          >
            <Send className="w-4 h-4" />
            Submit Evaluasi
          </button>
        </div>
      </div>
    </div>
  );
}
