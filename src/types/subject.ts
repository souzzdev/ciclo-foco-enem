/**
 * Tipos para o sistema de matérias com cálculo de prioridade e ciclo de estudos
 */

export interface Subject {
  id: string;
  name: string;
  /** Dificuldade percebida (1–5) */
  difficulty: number;
  /** Quantidade de conteúdo (1–5) */
  contentAmount: number;
  /** Peso da matéria (decimal: 1, 1.5, 2, 3) */
  weight: number;
  /** Prioridade calculada = dificuldade × conteúdo × peso */
  priority: number;
  /** Cor personalizada (hex) */
  color: string;
  /** Ícone (nome do lucide icon) */
  icon: string;
  /** Horas calculadas no ciclo */
  hours: number;
  /** Horas concluídas */
  completedHours: number;
  createdAt: string;
}

export interface SubjectInput {
  name: string;
  difficulty: number;
  contentAmount: number;
  weight: number;
  color?: string;
  icon?: string;
}

/** Limites para os inputs numéricos */
export const SUBJECT_LIMITS = {
  DIFFICULTY_MIN: 1,
  DIFFICULTY_MAX: 5,
  CONTENT_MIN: 1,
  CONTENT_MAX: 5,
  WEIGHT_MIN: 0.5,
  WEIGHT_MAX: 3,
  WEIGHT_STEP: 0.5,
  // Legacy compat
  MIN: 1,
  MAX: 5,
  STEP: 1,
} as const;

/** Cores padrão para matérias */
export const SUBJECT_COLORS = [
  '#14b8a6', // teal
  '#3b82f6', // blue
  '#8b5cf6', // violet
  '#f59e0b', // amber
  '#ef4444', // red
  '#ec4899', // pink
  '#10b981', // emerald
  '#6366f1', // indigo
  '#f97316', // orange
  '#06b6d4', // cyan
] as const;

/** Ícones disponíveis */
export const SUBJECT_ICONS = [
  'calculator', 'book-open', 'flask-conical', 'globe', 'pen-tool',
  'brain', 'atom', 'landmark', 'languages', 'microscope',
  'music', 'palette', 'code', 'heart', 'scale',
] as const;

/** Configuração do ciclo */
export const CYCLE_LIMITS = {
  MIN_HOURS: 20,
  MAX_HOURS: 100,
  DEFAULT_HOURS: 40,
} as const;
