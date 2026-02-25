/**
 * Tipos para o sistema de matérias personalizadas com cálculo de prioridade
 */

export interface Subject {
  id: string;
  name: string;
  /** Peso/importância para o curso desejado (decimal: 1, 1.5, 2, 3) */
  weight: number;
  /** Dificuldade percebida pelo usuário (1–5) */
  difficulty: number;
  /** Quantidade de conteúdo a estudar (1–5) */
  contentAmount: number;
  /** Prioridade calculada = peso x dificuldade x quantidade */
  priority: number;
  /** Cor personalizada da matéria */
  color: string;
  /** Nome do ícone Lucide */
  icon: string;
  /** Horas calculadas no ciclo atual */
  hours: number;
  /** Horas concluídas no ciclo atual */
  completedHours: number;
  createdAt: string;
}

export interface SubjectInput {
  name: string;
  weight: number;
  difficulty: number;
  contentAmount: number;
  color?: string;
  icon?: string;
}

/** Limites para dificuldade e conteúdo (1–5) */
export const SUBJECT_LIMITS = {
  MIN: 1,
  MAX: 5,
  STEP: 1,
} as const;

/** Limites para peso (decimal) */
export const WEIGHT_LIMITS = {
  MIN: 0.5,
  MAX: 5,
  STEP: 0.5,
} as const;

/** Cores disponíveis para matérias */
export const SUBJECT_COLORS = [
  '#3b82f6', // blue
  '#14b8a6', // teal
  '#f59e0b', // amber
  '#ef4444', // red
  '#8b5cf6', // violet
  '#ec4899', // pink
  '#10b981', // emerald
  '#f97316', // orange
  '#06b6d4', // cyan
  '#84cc16', // lime
  '#6366f1', // indigo
  '#d946ef', // fuchsia
] as const;

/** Ícones disponíveis para matérias */
export const SUBJECT_ICONS = [
  'calculator',
  'atom',
  'book-open',
  'globe',
  'pen-tool',
  'flask-conical',
  'landmark',
  'languages',
  'brain',
  'lightbulb',
  'microscope',
  'music',
  'palette',
  'ruler',
  'scroll',
  'trophy',
] as const;

/** Configuração de intensidade do ciclo */
export const CYCLE_LIMITS = {
  MIN_HOURS: 20,
  MAX_HOURS: 100,
  DEFAULT_HOURS: 40,
} as const;
