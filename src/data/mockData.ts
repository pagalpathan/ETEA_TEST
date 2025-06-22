import { Question, MockTest, PastPaper, Subject, User, TestResult, PerformanceData } from '../types';

export const mockUser: User = {
  id: '1',
  name: 'Ahmed Khan',
  email: 'ahmed@example.com',
  phone: '+92-300-1234567',
  joinedAt: '2024-01-15',
  totalTests: 15,
  averageScore: 78,
  streak: 5
};

export const subjects: { id: Subject; name: string; icon: string; color: string }[] = [
  { id: 'biology', name: 'Biology', icon: '🧬', color: 'bg-green-500' },
  { id: 'physics', name: 'Physics', icon: '⚡', color: 'bg-blue-500' },
  { id: 'chemistry', name: 'Chemistry', icon: '🧪', color: 'bg-purple-500' },
  { id: 'mathematics', name: 'Mathematics', icon: '📐', color: 'bg-red-500' },
  { id: 'english', name: 'English', icon: '📚', color: 'bg-indigo-500' },
  { id: 'general-knowledge', name: 'General Knowledge', icon: '🌍', color: 'bg-orange-500' }
];

export const sampleQuestions: Question[] = [
  {
    id: '1',
    subject: 'biology',
    topic: 'Cell Biology',
    question: 'Which organelle is known as the powerhouse of the cell?',
    options: ['Nucleus', 'Mitochondria', 'Ribosome', 'Endoplasmic Reticulum'],
    correctAnswer: 1,
    explanation: 'Mitochondria are called the powerhouse of the cell because they produce ATP through cellular respiration.',
    difficulty: 'easy'
  },
  {
    id: '2',
    subject: 'physics',
    topic: 'Mechanics',
    question: 'What is the unit of force in the SI system?',
    options: ['Joule', 'Newton', 'Watt', 'Pascal'],
    correctAnswer: 1,
    explanation: 'Newton (N) is the SI unit of force, named after Sir Isaac Newton.',
    difficulty: 'easy'
  },
  {
    id: '3',
    subject: 'chemistry',
    topic: 'Periodic Table',
    question: 'What is the atomic number of Carbon?',
    options: ['4', '6', '8', '12'],
    correctAnswer: 1,
    explanation: 'Carbon has 6 protons in its nucleus, making its atomic number 6.',
    difficulty: 'easy'
  },
  {
    id: '4',
    subject: 'mathematics',
    topic: 'Algebra',
    question: 'Solve: 2x + 5 = 15',
    options: ['x = 3', 'x = 5', 'x = 7', 'x = 10'],
    correctAnswer: 1,
    explanation: '2x + 5 = 15, so 2x = 10, therefore x = 5.',
    difficulty: 'easy'
  },
  {
    id: '5',
    subject: 'english',
    topic: 'Grammar',
    question: 'Choose the correct form: "He _____ to school every day."',
    options: ['go', 'goes', 'going', 'gone'],
    correctAnswer: 1,
    explanation: 'With third person singular subjects like "he", we use "goes" in present tense.',
    difficulty: 'easy'
  }
];

export const mockTests: MockTest[] = [
  {
    id: '1',
    title: 'ETEA Practice Test 1',
    description: 'Comprehensive practice test covering all subjects',
    duration: 180,
    totalQuestions: 100,
    subjects: ['biology', 'physics', 'chemistry', 'mathematics', 'english'],
    questions: sampleQuestions.slice(0, 5),
    createdAt: '2024-01-01'
  },
  {
    id: '2',
    title: 'Biology Focus Test',
    description: 'Intensive biology practice test',
    duration: 60,
    totalQuestions: 30,
    subjects: ['biology'],
    questions: sampleQuestions.filter(q => q.subject === 'biology'),
    createdAt: '2024-01-05'
  }
];

export const pastPapers: PastPaper[] = [
  {
    id: '1',
    year: 2023,
    title: 'ETEA 2023 - Complete Paper',
    totalQuestions: 100,
    subjects: ['biology', 'physics', 'chemistry', 'mathematics', 'english'],
    questions: sampleQuestions
  },
  {
    id: '2',
    year: 2022,
    title: 'ETEA 2022 - Complete Paper',
    totalQuestions: 100,
    subjects: ['biology', 'physics', 'chemistry', 'mathematics', 'english'],
    questions: sampleQuestions
  }
];

export const recentResults: TestResult[] = [
  {
    id: '1',
    testId: '1',
    userId: '1',
    score: 85,
    totalQuestions: 100,
    correctAnswers: 85,
    timeSpent: 165,
    completedAt: '2024-01-20',
    subjectScores: {
      'biology': { correct: 18, total: 20 },
      'physics': { correct: 16, total: 20 },
      'chemistry': { correct: 17, total: 20 },
      'mathematics': { correct: 15, total: 20 },
      'english': { correct: 19, total: 20 },
      'general-knowledge': { correct: 0, total: 0 }
    },
    answers: {}
  }
];

export const performanceData: PerformanceData[] = [
  { subject: 'biology', totalAttempted: 120, correctAnswers: 96, accuracy: 80, averageTime: 45 },
  { subject: 'physics', totalAttempted: 100, correctAnswers: 75, accuracy: 75, averageTime: 52 },
  { subject: 'chemistry', totalAttempted: 110, correctAnswers: 88, accuracy: 80, averageTime: 48 },
  { subject: 'mathematics', totalAttempted: 90, correctAnswers: 72, accuracy: 80, averageTime: 55 },
  { subject: 'english', totalAttempted: 80, correctAnswers: 68, accuracy: 85, averageTime: 35 },
  { subject: 'general-knowledge', totalAttempted: 60, correctAnswers: 42, accuracy: 70, averageTime: 40 }
];