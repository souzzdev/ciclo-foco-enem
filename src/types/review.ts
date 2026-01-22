// Tipos para o sistema de lembretes de revisão

// Intervalos de revisão disponíveis (em dias)
export const REVIEW_INTERVALS = [7, 14, 21, 30] as const;
export type ReviewInterval = typeof REVIEW_INTERVALS[number];

// Item pendente de revisão
export interface PendingReview {
  historyId: string;
  subject: string;
  content: string;
  studiedAt: string; // ISO date string
  reviewDueAt: string; // ISO date string
  daysOverdue: number;
}

// Configuração de revisão do usuário
export interface ReviewSettings {
  intervalDays: ReviewInterval;
}

export const DEFAULT_REVIEW_SETTINGS: ReviewSettings = {
  intervalDays: 7,
};
