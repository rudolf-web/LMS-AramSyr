export type FontStyle = 'estrangelo' | 'serto' | 'madnkhaya';

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'member';
  password?: string;
  motivation?: string;
  status?: 'pending' | 'approved' | 'disapproved';
  isDemo?: boolean;
}

export interface MaterialResource {
  id: string;
  title: string;
  type: 'video' | 'audio' | 'document' | 'iframe' | 'html' | 'web_link';
  url: string;
}

export interface Material {
  id: string;
  title: string;
  category: 'Abjad' | 'Tata Bahasa' | 'Percakapan' | 'Sejarah & Budaya';
  type: 'video' | 'audio' | 'document' | 'text' | 'iframe' | 'html' | 'web_link';
  contentUrl?: string; // YouTube, MP3 link, placeholder, raw iframe string, or base64 data
  description: string;
  bodyText?: string; // Full module text
  estimatedMinutes: number;
  additionalResources?: MaterialResource[];
  layoutConfig?: {
    height?: 'small' | 'medium' | 'large' | 'cinema';
    aspectRatio?: '16:9' | '4:3' | '21:9' | 'auto';
    borderStyle?: 'none' | 'thin' | 'double' | 'thick';
    borderColor?: string;
    gapSize?: 'none' | 'compact' | 'normal' | 'spacious';
    customIframeHeight?: string;
  };
}

export interface Letter {
  char: string;
  name: string;
  phoneme: string; // e.g. [ʔ], [b], [v]
  transliteration: string; // e.g. Alaph, Beth
  englishEquivalent: string; // e.g. A, B, G, D
  meaning: string; // Ancient hieroglyphic meaning (e.g. Ox, House, Camel)
  numericalValue: number; // Abjad numerals
  syriacCharCodes: string; // Unicode codes
  description: string; // brief description or notes
}

export interface Assignment {
  id: string;
  title: string;
  description: string;
  dueDate: string;
  maxScore: number;
  questionPrompt: string;
  testCases?: { input: string; answer: string }[];
}

export interface Submission {
  id: string;
  assignmentId: string;
  studentId: string;
  studentName: string;
  submittedAt: string;
  content: string; // Text reply or drawing URL
  grade?: number;
  feedback?: string;
  status: 'pending' | 'graded';
}

export interface QuizQuestion {
  id: string;
  type: 'transliteration' | 'match-char' | 'multiple-choice';
  question: string;
  options: string[];
  correctOption: string;
  aramaicHint?: string;
}

export interface UserProgress {
  memberId: string;
  completedMaterials: string[]; // material IDs
  completedLetters: string[]; // letter chars
  quizScores: { [quizId: string]: number }; // score percentage
  streakDays: number;
  lastActiveDate?: string;
}
