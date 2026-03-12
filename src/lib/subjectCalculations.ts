/**
 * Funções utilitárias para cálculo de prioridade e distribuição de horas
 */

import { Subject, SubjectInput, SUBJECT_COLORS, SUBJECT_ICONS } from '@/types/subject';

/**
 * Calcula a prioridade: dificuldade × conteúdo × peso
 */
export function calculatePriority(
  difficulty: number,
  contentAmount: number,
  weight: number
): number {
  return Number((difficulty * contentAmount * weight).toFixed(2));
}

/**
 * Distribui horas do ciclo proporcionalmente à prioridade
 */
export function distributeHours(subjects: Subject[], totalHours: number): Subject[] {
  const totalPriority = subjects.reduce((sum, s) => sum + s.priority, 0);
  if (totalPriority === 0) return subjects;

  // Distribuir proporcionalmente e arredondar
  let distributed = subjects.map(s => ({
    ...s,
    hours: Math.max(1, Math.round((s.priority / totalPriority) * totalHours)),
  }));

  // Ajustar para totalizar exatamente totalHours
  const currentTotal = distributed.reduce((sum, s) => sum + s.hours, 0);
  let diff = totalHours - currentTotal;

  // Ordenar por prioridade para ajustar
  const sorted = [...distributed].sort((a, b) => b.priority - a.priority);
  let i = 0;
  while (diff !== 0) {
    const idx = distributed.findIndex(s => s.id === sorted[i % sorted.length].id);
    if (diff > 0) {
      distributed[idx] = { ...distributed[idx], hours: distributed[idx].hours + 1 };
      diff--;
    } else if (distributed[idx].hours > 1) {
      distributed[idx] = { ...distributed[idx], hours: distributed[idx].hours - 1 };
      diff++;
    }
    i++;
    if (i > subjects.length * 10) break; // safety
  }

  return distributed;
}

/**
 * Cria uma nova matéria
 */
export function createSubject(input: SubjectInput, existingCount: number = 0): Subject {
  const difficulty = Math.max(1, Math.min(5, Math.round(input.difficulty)));
  const contentAmount = Math.max(1, Math.min(5, Math.round(input.contentAmount)));
  const weight = Math.max(0.5, Math.min(3, input.weight));

  return {
    id: `subject-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    name: input.name.trim() || 'Nova Matéria',
    difficulty,
    contentAmount,
    weight,
    priority: calculatePriority(difficulty, contentAmount, weight),
    color: input.color || SUBJECT_COLORS[existingCount % SUBJECT_COLORS.length],
    icon: input.icon || SUBJECT_ICONS[existingCount % SUBJECT_ICONS.length],
    hours: 0,
    completedHours: 0,
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
  const difficulty = updates.difficulty !== undefined ? Math.max(1, Math.min(5, Math.round(updates.difficulty))) : subject.difficulty;
  const contentAmount = updates.contentAmount !== undefined ? Math.max(1, Math.min(5, Math.round(updates.contentAmount))) : subject.contentAmount;
  const weight = updates.weight !== undefined ? Math.max(0.5, Math.min(3, updates.weight)) : subject.weight;
  const name = updates.name !== undefined ? updates.name.trim() || subject.name : subject.name;
  const color = updates.color !== undefined ? updates.color : subject.color;
  const icon = updates.icon !== undefined ? updates.icon : subject.icon;

  return {
    ...subject,
    name,
    difficulty,
    contentAmount,
    weight,
    color,
    icon,
    priority: calculatePriority(difficulty, contentAmount, weight),
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
export function calculateStats(subjects: Subject[]) {
  if (subjects.length === 0) {
    return {
      totalSubjects: 0,
      averagePriority: 0,
      highestPriority: null as Subject | null,
      lowestPriority: null as Subject | null,
      totalHours: 0,
      completedHours: 0,
      completionPercentage: 0,
    };
  }

  const sorted = sortByPriority(subjects);
  const totalPriority = subjects.reduce((sum, s) => sum + s.priority, 0);
  const totalHours = subjects.reduce((sum, s) => sum + s.hours, 0);
  const completedHours = subjects.reduce((sum, s) => sum + s.completedHours, 0);

  return {
    totalSubjects: subjects.length,
    averagePriority: Number((totalPriority / subjects.length).toFixed(2)),
    highestPriority: sorted[0],
    lowestPriority: sorted[sorted.length - 1],
    totalHours,
    completedHours,
    completionPercentage: totalHours > 0 ? Number(((completedHours / totalHours) * 100).toFixed(1)) : 0,
  };
}

/**
 * Retorna a cor de prioridade baseada no valor
 */
export function getPriorityColor(priority: number): string {
  if (priority >= 50) return 'text-red-500';
  if (priority >= 25) return 'text-orange-500';
  if (priority >= 10) return 'text-yellow-500';
  if (priority >= 4) return 'text-green-500';
  return 'text-muted-foreground';
}

/**
 * Retorna o label de prioridade
 */
export function getPriorityLabel(priority: number): string {
  if (priority >= 50) return 'Muito Alta';
  if (priority >= 25) return 'Alta';
  if (priority >= 10) return 'Média';
  if (priority >= 4) return 'Baixa';
  return 'Muito Baixa';
}
