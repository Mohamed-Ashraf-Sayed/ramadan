export type QuestionType = "MULTIPLE_CHOICE" | "TRUE_FALSE" | "ORDERING" | "IMAGE_TEXT";

export interface Quiz {
  id: number;
  title: string;
  description: string | null;
  timeLimit: number | null; // Time limit in minutes (null = no limit)
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  questions?: Question[];
  _count?: {
    questions: number;
    submissions: number;
  };
}

export interface Question {
  id: number;
  quizId: number;
  type: QuestionType;
  text: string;
  options: string[] | null;
  correctAnswer: string | string[] | boolean;
  mediaUrl: string | null;
  mediaType: string | null; // "image" | "video"
  points: number;
  order: number;
}

export interface Submission {
  id: number;
  quizId: number;
  name: string;
  email: string;
  phone: string;
  answers: Record<number, string | string[] | boolean>;
  score: number;
  totalPoints: number;
  percentage: number;
  createdAt: Date;
  quiz?: Quiz;
}

export interface ParticipantInfo {
  name: string;
  email: string;
  phone: string;
}

export interface QuizAnswer {
  questionId: number;
  answer: string | string[] | boolean;
  isCorrect: boolean;
  points: number;
}
