export type QuestionStatus = 'unanswered' | 'correct' | 'wrong';

export interface Question {
  id: string;
  question: string;
  option_a: string;
  option_b: string;
  option_c: string;
  option_d: string;
  answer: 'A' | 'B' | 'C' | 'D';
  points: number;
  status: QuestionStatus;
  answeredBy?: string; // Team ID or name
  wrongAttempts?: string[]; // Teams that have answered wrongly for this question
}

export interface Team {
  id: string;
  name: string;
  score: number;
  color: string;
}

export interface QuizState {
  title: string;
  questions: Question[];
  teams: Team[];
  activeQuestionId: string | null;
  selectedTeamId: string | null;
  isModalOpen: boolean;
  isSetupComplete: boolean;
}
