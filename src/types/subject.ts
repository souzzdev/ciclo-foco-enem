/**
 * Tipos para o sistema de matérias personalizadas com cálculo de prioridade
 */

export interface Subject {
  id: string;
  name: string;
  /** Peso/importância para o curso desejado (0.5 a 3) */
  weight: number;
  /** Dificuldade percebida pelo usuário (0.5 a 3) */
  difficulty: number;
  /** Quantidade de conteúdo a estudar (0.5 a 3) */
  contentAmount: number;
  /** Prioridade calculada = peso × dificuldade × quantidade */
  priority: number;
  createdAt: string;
}

export interface SubjectInput {
  name: string;
  weight: number;
  difficulty: number;
  contentAmount: number;
}

/** Limites para os inputs numéricos */
export const SUBJECT_LIMITS = {
  MIN: 0.5,
  MAX: 3,
  STEP: 0.5,
} as const;
