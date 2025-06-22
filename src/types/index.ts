export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  avatar?: string;
  joinedAt: string;
  totalTests: number;
  averageScore: number;
  streak: number;
}

export interface Question {
  id: string;
  subject: Subject;
  topic: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
  difficulty: 'easy' | 'medium' | 'hard';
  year?: number;
  isBookmarked?: boolean;
  userNote?: string;
}

export interface MockTest {
  id: string;
  title: string;
  description: string;
  duration: number; // in minutes
  totalQuestions: number;
  subjects: Subject[];
  questions: Question[];
  createdAt: string;
}

export interface TestResult {
  id: string;
  testId: string;
  userId: string;
  score: number;
  totalQuestions: number;
  correctAnswers: number;
  timeSpent: number;
  completedAt: string;
  subjectScores: Record<Subject, { correct: number; total: number }>;
  answers: Record<string, number>;
}

export interface PastPaper {
  id: string;
  year: number;
  title: string;
  totalQuestions: number;
  subjects: Subject[];
  questions: Question[];
  downloadUrl?: string;
}

export type Subject = 'biology' | 'physics' | 'chemistry' | 'mathematics' | 'english' | 'general-knowledge';

export interface BookmarkedQuestion extends Question {
  bookmarkedAt: string;
  userNote?: string;
}

export interface PerformanceData {
  subject: Subject;
  totalAttempted: number;
  correctAnswers: number;
  accuracy: number;
  averageTime: number;
}