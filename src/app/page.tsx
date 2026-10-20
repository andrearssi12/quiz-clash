'use client';

import { QuizProvider, useQuiz } from '@/context/QuizContext';
import { Header } from '@/components/Header';
import { ScoreBoard } from '@/components/ScoreBoard';
import { QuizBoard } from '@/components/QuizBoard';
import { QuestionModal } from '@/components/QuestionModal';
import { SetupScreen } from '@/components/SetupScreen';
import { Footer } from '@/components/Footer';

function MainQuizContent() {
  const { isSetupComplete } = useQuiz();

  if (!isSetupComplete) {
    return (
      <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100 justify-between">
        <SetupScreen />
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100 justify-between">
      <Header />
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <ScoreBoard />
        <QuizBoard />
      </main>
      <Footer />
      <QuestionModal />
    </div>
  );
}

export default function Home() {
  return (
    <QuizProvider>
      <MainQuizContent />
    </QuizProvider>
  );
}
