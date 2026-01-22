// Funções utilitárias para cálculo de revisões
import { HistoryEntry } from '@/types/study';
import { PendingReview, ReviewInterval } from '@/types/review';

/**
 * Calcula a data prevista para revisão
 * @param studyDate - Data do estudo original
 * @param intervalDays - Intervalo em dias para revisão
 * @returns Data ISO string da revisão prevista
 */
export function calculateReviewDate(studyDate: string, intervalDays: number): string {
  const date = new Date(studyDate);
  date.setDate(date.getDate() + intervalDays);
  return date.toISOString();
}

/**
 * Verifica se uma entrada do histórico está pendente de revisão
 * @param entry - Entrada do histórico
 * @param intervalDays - Intervalo de revisão configurado
 * @returns true se a revisão está pendente (data atual >= data de revisão)
 */
export function isReviewDue(entry: HistoryEntry, intervalDays: number): boolean {
  if (entry.skipped) return false;
  
  const reviewDueAt = new Date(calculateReviewDate(entry.date, intervalDays));
  const now = new Date();
  
  return now >= reviewDueAt;
}

/**
 * Calcula quantos dias a revisão está atrasada
 * @param reviewDueDate - Data prevista para revisão
 * @returns Número de dias de atraso (0 se não está atrasado)
 */
export function calculateDaysOverdue(reviewDueDate: string): number {
  const dueDate = new Date(reviewDueDate);
  const now = new Date();
  
  const diffTime = now.getTime() - dueDate.getTime();
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
  
  return Math.max(0, diffDays);
}

/**
 * Obtém todas as revisões pendentes do histórico
 * @param history - Histórico de estudos
 * @param intervalDays - Intervalo de revisão configurado
 * @returns Lista de revisões pendentes ordenadas por urgência (mais atrasadas primeiro)
 */
export function getPendingReviews(
  history: HistoryEntry[],
  intervalDays: ReviewInterval
): PendingReview[] {
  const now = new Date();
  
  const pendingReviews: PendingReview[] = history
    .filter(entry => !entry.skipped && entry.content && entry.content !== 'Estudo realizado')
    .map(entry => {
      const reviewDueAt = calculateReviewDate(entry.date, intervalDays);
      const dueDate = new Date(reviewDueAt);
      
      if (now < dueDate) return null;
      
      return {
        historyId: entry.id,
        subject: entry.subject,
        content: entry.content,
        studiedAt: entry.date,
        reviewDueAt,
        daysOverdue: calculateDaysOverdue(reviewDueAt),
      };
    })
    .filter((review): review is PendingReview => review !== null);
  
  // Ordenar por urgência (mais atrasadas primeiro)
  return pendingReviews.sort((a, b) => b.daysOverdue - a.daysOverdue);
}

/**
 * Agrupa revisões pendentes por matéria
 * @param reviews - Lista de revisões pendentes
 * @returns Mapa de matéria para lista de revisões
 */
export function groupReviewsBySubject(
  reviews: PendingReview[]
): Record<string, PendingReview[]> {
  return reviews.reduce((acc, review) => {
    if (!acc[review.subject]) {
      acc[review.subject] = [];
    }
    acc[review.subject].push(review);
    return acc;
  }, {} as Record<string, PendingReview[]>);
}

/**
 * Conta o número total de revisões pendentes
 * @param history - Histórico de estudos
 * @param intervalDays - Intervalo de revisão configurado
 * @returns Número de revisões pendentes
 */
export function countPendingReviews(
  history: HistoryEntry[],
  intervalDays: ReviewInterval
): number {
  return getPendingReviews(history, intervalDays).length;
}

/**
 * Formata a diferença de dias para exibição
 * @param daysOverdue - Número de dias de atraso
 * @returns String formatada (ex: "há 3 dias", "hoje")
 */
export function formatDaysOverdue(daysOverdue: number): string {
  if (daysOverdue === 0) return 'hoje';
  if (daysOverdue === 1) return 'há 1 dia';
  return `há ${daysOverdue} dias`;
}
