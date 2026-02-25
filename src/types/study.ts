export interface HistoryEntry {
  id: string;
  date: string;
  subjectId: string;
  subjectName: string;
  subjectColor: string;
  content: string;
  skipped?: boolean;
}

export interface CycleHistoryEntry {
  id: string;
  completedAt: string;
  totalHours: number;
  completedHours: number;
  subjects: Array<{
    name: string;
    color: string;
    hours: number;
    completedHours: number;
  }>;
}

export interface CycleData {
  totalCycleTime: number;
  completedCycles: number;
  totalMinutesStudied: number;
  currentStreak: number;
  longestStreak: number;
  lastStudyDate: string | null;
  dailyGoal: number;
  weeklyGoalHours: number;
  todayBlocks: number;
  history: HistoryEntry[];
  cycleHistory: CycleHistoryEntry[];
}

export const INITIAL_CYCLE_DATA: CycleData = {
  totalCycleTime: 40,
  completedCycles: 0,
  totalMinutesStudied: 0,
  currentStreak: 0,
  longestStreak: 0,
  lastStudyDate: null,
  dailyGoal: 3,
  weeklyGoalHours: 10,
  todayBlocks: 0,
  history: [],
  cycleHistory: [],
};
