'use client';

import React from 'react';
import { useQuiz } from '@/context/QuizContext';
import { QuestionCard } from './QuestionCard';

export function QuizGrid() {
  const { questions, openQuestionModal } = useQuiz();

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 gap-4 sm:gap-6">
      {questions.map((question) => (
        <QuestionCard
          key={question.id}
          id={question.id}
          points={question.points}
          status={question.status}
          answeredBy={question.answeredBy}
          wrongCount={question.wrongAttempts?.length || 0}
          onClick={() => openQuestionModal(question.id)}
        />
      ))}
    </div>
  );
}
