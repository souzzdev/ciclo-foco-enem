import { Subject } from '@/types/subject';
import { CycleData, CycleHistoryEntry } from '@/types/study';

/**
 * Export cycle data as CSV
 */
export function exportCSV(subjects: Subject[], cycleData: CycleData) {
  const headers = ['Materia', 'Dificuldade', 'Conteudo', 'Peso', 'Prioridade', 'Horas', 'Concluidas', 'Progresso (%)'];
  const rows = subjects.map(s => [
    s.name,
    s.difficulty,
    s.contentAmount,
    s.weight,
    s.priority,
    s.hours,
    s.completedHours,
    s.hours > 0 ? Math.round((s.completedHours / s.hours) * 100) : 0,
  ]);

  const totalHours = subjects.reduce((sum, s) => sum + s.hours, 0);
  const totalCompleted = subjects.reduce((sum, s) => sum + s.completedHours, 0);

  rows.push([
    'TOTAL',
    '',
    '',
    '',
    '',
    totalHours,
    totalCompleted,
    totalHours > 0 ? Math.round((totalCompleted / totalHours) * 100) : 0,
  ] as any);

  const csvContent = [
    headers.join(','),
    ...rows.map(r => r.join(',')),
  ].join('\n');

  const blob = new Blob(['\ufeff' + csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `ciclo-estudos-${new Date().toISOString().split('T')[0]}.csv`;
  link.click();
  URL.revokeObjectURL(url);
}

/**
 * Export cycle data as printable PDF (uses browser print)
 */
export function exportPDF() {
  window.print();
}

/**
 * Format a CycleHistoryEntry for display
 */
export function formatCycleHistory(entry: CycleHistoryEntry): string {
  const date = new Date(entry.completedAt);
  return date.toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
}
