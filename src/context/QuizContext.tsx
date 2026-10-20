'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Question, Team, QuizState } from '@/types';
import { DEFAULT_TEAMS, SAMPLE_QUESTIONS } from '@/lib/parseData';
import confetti from 'canvas-confetti';

interface QuizContextType extends QuizState {
  setQuestions: (questions: Question[]) => void;
  setTeams: (teams: Team[]) => void;
  addTeam: (name: string) => void;
  removeTeam: (id: string) => void;
  updateTeamScore: (id: string, delta: number) => void;
  openQuestionModal: (id: string) => void;
  closeQuestionModal: () => void;
  setSelectedTeamId: (id: string | null) => void;
  submitAnswer: (chosenOption: 'A' | 'B' | 'C' | 'D') => { isCorrect: boolean };
  resetQuizState: () => void;
  startWithSampleData: () => void;
  completeSetup: () => void;
}

const QuizContext = createContext<QuizContextType | undefined>(undefined);

const TEAM_COLOR_PALETTES = [
  'bg-emerald-500 border-emerald-600 text-white',
  'bg-sky-500 border-sky-600 text-white',
  'bg-amber-500 border-amber-600 text-white',
  'bg-rose-500 border-rose-600 text-white',
  'bg-purple-500 border-purple-600 text-white',
  'bg-indigo-500 border-indigo-600 text-white',
  'bg-pink-500 border-pink-600 text-white',
  'bg-teal-500 border-teal-600 text-white',
];

export function QuizProvider({ children }: { children: ReactNode }) {
  const [questions, setQuestionsState] = useState<Question[]>(SAMPLE_QUESTIONS);
  const [teams, setTeamsState] = useState<Team[]>(DEFAULT_TEAMS);
  const [title, setTitle] = useState<string>('QuizClash Arena');
  const [activeQuestionId, setActiveQuestionId] = useState<string | null>(null);
  const [selectedTeamId, setSelectedTeamId] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [isSetupComplete, setIsSetupComplete] = useState<boolean>(false);

  // Attempt to restore state from local storage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem('quizclash_state');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.questions) setQuestionsState(parsed.questions);
        if (parsed.teams) setTeamsState(parsed.teams);
        if (parsed.title) setTitle(parsed.title);
        if (typeof parsed.isSetupComplete === 'boolean') setIsSetupComplete(parsed.isSetupComplete);
      }
    } catch {
      // Ignore fallback
    }
  }, []);

  // Save changes to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(
        'quizclash_state',
        JSON.stringify({
          title,
          questions,
          teams,
          isSetupComplete,
        })
      );
    } catch {
      // Ignore
    }
  }, [title, questions, teams, isSetupComplete]);

  const setQuestions = (newQuestions: Question[]) => {
    setQuestionsState(newQuestions);
  };

  const setTeams = (newTeams: Team[]) => {
    setTeamsState(newTeams);
  };

  const addTeam = (name: string) => {
    if (!name.trim()) return;
    const nextIdx = teams.length;
    const color = TEAM_COLOR_PALETTES[nextIdx % TEAM_COLOR_PALETTES.length];
    const newTeam: Team = {
      id: `team-${Date.now()}`,
      name: name.trim(),
      score: 0,
      color,
    };
    setTeamsState([...teams, newTeam]);
  };

  const removeTeam = (id: string) => {
    setTeamsState(teams.filter((t) => t.id !== id));
  };

  const updateTeamScore = (id: string, delta: number) => {
    setTeamsState((prev) =>
      prev.map((t) => (t.id === id ? { ...t, score: Math.max(0, t.score + delta) } : t))
    );
  };

  const openQuestionModal = (id: string) => {
    const targetQ = questions.find((q) => q.id === id);
    if (!targetQ || targetQ.status === 'correct') return;

    setActiveQuestionId(id);
    setSelectedTeamId(null);
    setIsModalOpen(true);
  };

  const closeQuestionModal = () => {
    setIsModalOpen(false);
    setActiveQuestionId(null);
    setSelectedTeamId(null);
  };

  const submitAnswer = (chosenOption: 'A' | 'B' | 'C' | 'D'): { isCorrect: boolean } => {
    if (!activeQuestionId) return { isCorrect: false };

    const q = questions.find((item) => item.id === activeQuestionId);
    if (!q) return { isCorrect: false };

    const isCorrect = chosenOption.toUpperCase() === q.answer.toUpperCase();
    const currentTeam = teams.find((t) => t.id === selectedTeamId);

    if (isCorrect) {
      // Award score to the team if selected
      if (selectedTeamId) {
        updateTeamScore(selectedTeamId, q.points);
      }

      // Mark as correct
      setQuestionsState((prev) =>
        prev.map((item) =>
          item.id === activeQuestionId
            ? {
                ...item,
                status: 'correct',
                answeredBy: currentTeam ? currentTeam.name : 'Terjawab',
              }
            : item
        )
      );

      // Trigger Confetti
      try {
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 },
        });
      } catch {
        // Fallback
      }

      closeQuestionModal();
      return { isCorrect: true };
    } else {
      // Mark as wrong for current team, but question remains accessible for others!
      const wrongList = q.wrongAttempts || [];
      const updatedWrong = selectedTeamId ? [...wrongList, selectedTeamId] : wrongList;

      setQuestionsState((prev) =>
        prev.map((item) =>
          item.id === activeQuestionId
            ? {
                ...item,
                status: 'wrong',
                wrongAttempts: updatedWrong,
              }
            : item
        )
      );

      // Reset selected team so another team can try (Rebutan mechanism)
      setSelectedTeamId(null);
      return { isCorrect: false };
    }
  };

  const resetQuizState = () => {
    if (confirm('Apakah Anda yakin ingin mereset papan kuis dan skor semua tim?')) {
      setQuestionsState((prev) =>
        prev.map((q) => ({
          ...q,
          status: 'unanswered',
          answeredBy: undefined,
          wrongAttempts: [],
        }))
      );
      setTeamsState((prev) => prev.map((t) => ({ ...t, score: 0 })));
      setActiveQuestionId(null);
      setSelectedTeamId(null);
      setIsModalOpen(false);
    }
  };

  const startWithSampleData = () => {
    setQuestionsState(SAMPLE_QUESTIONS);
    setTeamsState(DEFAULT_TEAMS);
    setIsSetupComplete(true);
  };

  const completeSetup = () => {
    setIsSetupComplete(true);
  };

  return (
    <QuizContext.Provider
      value={{
        title,
        questions,
        teams,
        activeQuestionId,
        selectedTeamId,
        isModalOpen,
        isSetupComplete,
        setQuestions,
        setTeams,
        addTeam,
        removeTeam,
        updateTeamScore,
        openQuestionModal,
        closeQuestionModal,
        setSelectedTeamId,
        submitAnswer,
        resetQuizState,
        startWithSampleData,
        completeSetup,
      }}
    >
      {children}
    </QuizContext.Provider>
  );
}

export function useQuiz() {
  const context = useContext(QuizContext);
  if (!context) {
    throw new Error('useQuiz must be used within a QuizProvider');
  }
  return context;
}
