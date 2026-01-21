/**
 * Funções utilitárias para cálculo de prioridade de matérias
 * Separadas da lógica de componentes para reutilização e testes
 */

import { Subject, SubjectInput, SUBJECT_LIMITS } from '@/types/subject';

/**
 * Calcula a prioridade de uma matéria
 * Fórmula: prioridade = peso × dificuldade × quantidade_de_conteúdo
 */
export function calculatePriority(
  weight: number,
  difficulty: number,
  contentAmount: number
): number {
  return Number((weight * difficulty * contentAmount).toFixed(2));
}

/**
 * Valida se um valor está dentro dos limites permitidos
 */
export function isValidValue(value: number): boolean {
  return value >= SUBJECT_LIMITS.MIN && value <= SUBJECT_LIMITS.MAX;
}

/**
 * Normaliza um valor para estar dentro dos limites
 */
export function clampValue(value: number): number {
  return Math.max(SUBJECT_LIMITS.MIN, Math.min(SUBJECT_LIMITS.MAX, value));
}

/**
 * Cria uma nova matéria com prioridade calculada
 */
export function createSubject(input: SubjectInput): Subject {
  const weight = clampValue(input.weight);
  const difficulty = clampValue(input.difficulty);
  const contentAmount = clampValue(input.contentAmount);

  return {
    id: `subject-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    name: input.name.trim() || 'Nova Matéria',
    weight,
    difficulty,
    contentAmount,
    priority: calculatePriority(weight, difficulty, contentAmount),
    createdAt: new Date().toISOString(),
  };
}

/**
 * Atualiza uma matéria e recalcula a prioridade
 */
export function updateSubject(
  subject: Subject,
  updates: Partial<SubjectInput>
): Subject {
  const weight = updates.weight !== undefined ? clampValue(updates.weight) : subject.weight;
  const difficulty = updates.difficulty !== undefined ? clampValue(updates.difficulty) : subject.difficulty;
  const contentAmount = updates.contentAmount !== undefined ? clampValue(updates.contentAmount) : subject.contentAmount;
  const name = updates.name !== undefined ? updates.name.trim() || subject.name : subject.name;

  return {
    ...subject,
    name,
    weight,
    difficulty,
    contentAmount,
    priority: calculatePriority(weight, difficulty, contentAmount),
  };
}

/**
 * Ordena matérias por prioridade (maior para menor)
 */
export function sortByPriority(subjects: Subject[]): Subject[] {
  return [...subjects].sort((a, b) => b.priority - a.priority);
}

/**
 * Calcula estatísticas das matérias
 */
export function calculateStats(subjects: Subject[]): {
  totalSubjects: number;
  averagePriority: number;
  highestPriority: Subject | null;
  lowestPriority: Subject | null;
} {
  if (subjects.length === 0) {
    return {
      totalSubjects: 0,
      averagePriority: 0,
      highestPriority: null,
      lowestPriority: null,
    };
  }

  const sorted = sortByPriority(subjects);
  const totalPriority = subjects.reduce((sum, s) => sum + s.priority, 0);

  return {
    totalSubjects: subjects.length,
    averagePriority: Number((totalPriority / subjects.length).toFixed(2)),
    highestPriority: sorted[0],
    lowestPriority: sorted[sorted.length - 1],
  };
}

/**
 * Retorna a cor de prioridade baseada no valor
 */
export function getPriorityColor(priority: number): string {
  if (priority >= 13.5) return 'text-red-500'; // Muito alta (>= 1.5³)
  if (priority >= 8) return 'text-orange-500'; // Alta
  if (priority >= 4) return 'text-yellow-500'; // Média
  if (priority >= 1) return 'text-green-500'; // Baixa
  return 'text-muted-foreground'; // Muito baixa
}

/**
 * Retorna o label de prioridade
 */
export function getPriorityLabel(priority: number): string {
  if (priority >= 13.5) return 'Muito Alta';
  if (priority >= 8) return 'Alta';
  if (priority >= 4) return 'Média';
  if (priority >= 1) return 'Baixa';
  return 'Muito Baixa';
}
