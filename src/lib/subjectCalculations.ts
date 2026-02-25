/**
 * Funções utilitárias para cálculo de prioridade e distribuição de horas
 */

import { Subject, SubjectInput, SUBJECT_LIMITS, WEIGHT_LIMITS, SUBJECT_COLORS, SUBJECT_ICONS } from '@/types/subject';

/**
 * Calcula a prioridade de uma matéria
 * Fórmula: prioridade = dificuldade x conteúdo x peso
 */
export function calculatePriority(
  difficulty: number,
  contentAmount: number,
  weight: number
): number {
  return Number((difficulty * contentAmount * weight).toFixed(2));
}

/**
 * Normaliza dificuldade/conteúdo (1–5)
 */
export function clampValue(value: number): number {
  return Math.max(SUBJECT_LIMITS.MIN, Math.min(SUBJECT_LIMITS.MAX, Math.round(value)));
}

/**
 * Normaliza peso (0.5–5)
 */
export function clampWeight(value: number): number {
  return Math.max(WEIGHT_LIMITS.MIN, Math.min(WEIGHT_LIMITS.MAX, value));
}

/**
 * Distribui horas proporcionalmente entre as matérias baseado na prioridade
 */
export function calculateHoursDistribution(
  subjects: Subject[],
  totalCycleHours: number
): Subject[] {
  if (subjects.length === 0) return [];

  const totalPriority = subjects.reduce((sum, s) => sum + s.priority, 0);

  if (totalPriority === 0) {
    // Distribui igualmente se todas as prioridades são 0
    const equalHours = Math.floor(totalCycleHours / subjects.length);
    return subjects.map(s => ({ ...s, hours: equalHours }));
  }

  // Calcula horas proporcionais e arredonda
  let assigned = 0;
  const withHours = subjects.map((s, i) => {
    const rawHours = (s.priority / totalPriority) * totalCycleHours;
    const hours = Math.max(1, Math.round(rawHours)); // Mínimo 1 hora
    assigned += hours;
    return { ...s, hours };
  });

  // Ajusta diferença de arredondamento na matéria de maior prioridade
  const diff = totalCycleHours - assigned;
  if (diff !== 0) {
    const sorted = [...withHours].sort((a, b) => b.priority - a.priority);
    const target = sorted[0];
    return withHours.map(s =>
      s.id === target.id ? { ...s, hours: Math.max(1, s.hours + diff) } : s
    );
  }

  return withHours;
}

/**
 * Cria uma nova matéria com prioridade calculada
 */
export function createSubject(input: SubjectInput, existingCount: number): Subject {
  const difficulty = clampValue(input.difficulty);
  const contentAmount = clampValue(input.contentAmount);
  const weight = clampWeight(input.weight);

  return {
    id: `subject-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    name: input.name.trim() || 'Nova Materia',
    weight,
    difficulty,
    contentAmount,
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
  const difficulty = updates.difficulty !== undefined ? clampValue(updates.difficulty) : subject.difficulty;
  const contentAmount = updates.contentAmount !== undefined ? clampValue(updates.contentAmount) : subject.contentAmount;
  const weight = updates.weight !== undefined ? clampWeight(updates.weight) : subject.weight;
  const name = updates.name !== undefined ? updates.name.trim() || subject.name : subject.name;
  const color = updates.color !== undefined ? updates.color : subject.color;
  const icon = updates.icon !== undefined ? updates.icon : subject.icon;

  return {
    ...subject,
    name,
    weight,
    difficulty,
    contentAmount,
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
 * Retorna a cor de prioridade baseada no valor (range 1-125)
 */
export function getPriorityColor(priority: number): string {
  if (priority >= 50) return 'text-red-500';
  if (priority >= 25) return 'text-orange-500';
  if (priority >= 10) return 'text-yellow-500';
  if (priority >= 3) return 'text-green-500';
  return 'text-muted-foreground';
}

/**
 * Retorna o label de prioridade
 */
export function getPriorityLabel(priority: number): string {
  if (priority >= 50) return 'Muito Alta';
  if (priority >= 25) return 'Alta';
  if (priority >= 10) return 'Media';
  if (priority >= 3) return 'Baixa';
  return 'Muito Baixa';
}
