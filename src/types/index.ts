export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  subject?: string;
}

export interface QuizQuestion {
  id: number;
  question: string;
  options: string[];
  correctIndex: number;
  praiseExplanation: string;
  comfortExplanation: string;
}

export interface SubjectInfo {
  id: string;
  name: string;
  englishName: string;
  icon: string;
  color: string;
  bgLight: string;
  description: string;
  topics: {
    title: string;
    summary: string;
    cuteExample: string;
  }[];
  quickQuestions: string[];
}

export interface PrayerItem {
  id: 'fajr' | 'dhuhr' | 'asr' | 'maghrib' | 'isha';
  name: string;
  time: string;
  sweetReminder: string;
}

export interface PeriodCycleData {
  lastPeriodDate: string; // YYYY-MM-DD
  cycleLength: number; // default 28
  periodDuration: number; // default 5
  isPeriodActive: boolean;
  waterGlasses: number;
  notes: string;
}

export interface LoveNote {
  id: string;
  date: string;
  title: string;
  message: string;
  category: 'romantic' | 'study' | 'comfort' | 'morning' | 'night' | 'period';
}

export type ActiveTab = 'chat' | 'psychological' | 'prayers' | 'period' | 'notes';
