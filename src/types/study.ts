export type SubjectType = 'math' | 'nature' | 'portuguese' | 'human';

export interface StudyBlock {
  id: number;
  subject: string;
  subjectType: SubjectType;
  content: string;
  duration: number; // in minutes
}

export interface HistoryEntry {
  id: string;
  date: string;
  subject: string;
  subjectType: SubjectType;
  content: string;
  blockId: number;
  skipped?: boolean;
}

export interface StudyData {
  currentBlockIndex: number;
  completedCycles: number;
  totalMinutesStudied: number;
  skippedBlocks: number;
  currentStreak: number;
  longestStreak: number;
  lastStudyDate: string | null;
  dailyGoal: number; // blocks per day
  weeklyGoalHours: number; // hours per week
  todayBlocks: number;
  history: HistoryEntry[];
  blocks: StudyBlock[];
}

export const INITIAL_BLOCKS: StudyBlock[] = [
  { id: 1, subject: 'Matemática', subjectType: 'math', content: '', duration: 30 },
  { id: 2, subject: 'Matemática', subjectType: 'math', content: '', duration: 30 },
  { id: 3, subject: 'Ciências da Natureza', subjectType: 'nature', content: '', duration: 30 },
  { id: 4, subject: 'Português', subjectType: 'portuguese', content: '', duration: 30 },
  { id: 5, subject: 'Ciências Humanas', subjectType: 'human', content: '', duration: 30 },
];

export const INITIAL_DATA: StudyData = {
  currentBlockIndex: 0,
  completedCycles: 0,
  totalMinutesStudied: 0,
  skippedBlocks: 0,
  currentStreak: 0,
  longestStreak: 0,
  lastStudyDate: null,
  dailyGoal: 3,
  weeklyGoalHours: 10,
  todayBlocks: 0,
  history: [],
  blocks: INITIAL_BLOCKS,
};
