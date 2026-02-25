// Funções utilitárias para calculo de revisoes
import { HistoryEntry } from '@/types/study';
import { PendingReview, ReviewInterval } from '@/types/review';

/**
 * Calcula a data prevista para revisao
 */
export function calculateReviewDate(studyDate: string, intervalDays: number): string {
  const date = new Date(studyDate);
  date.setDate(date.getDate() + intervalDays);
  return date.toISOString();
}

/**
 * Verifica se uma entrada do historico esta pendente de revisao
 */
export function isReviewDue(entry: HistoryEntry, intervalDays: number): boolean {
  if (entry.skipped) return false;

  const reviewDueAt = new Date(calculateReviewDate(entry.date, intervalDays));
  const now = new Date();

  return now >= reviewDueAt;
}

/**
 * Calcula quantos dias a revisao esta atrasada
 */
export function calculateDaysOverdue(reviewDueDate: string): number {
  const dueDate = new Date(reviewDueDate);
  const now = new Date();

  const diffTime = now.getTime() - dueDate.getTime();
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

  return Math.max(0, diffDays);
}

/**
 * Obtem todas as revisoes pendentes do historico
 */
export function getPendingReviews(
  history: HistoryEntry[],
  intervalDays: ReviewInterval
): PendingReview[] {
  const now = new Date();

  const pendingReviews: PendingReview[] = history
    .filter(entry => !entry.skipped && entry.content)
    .map(entry => {
      const reviewDueAt = calculateReviewDate(entry.date, intervalDays);
      const dueDate = new Date(reviewDueAt);

      if (now < dueDate) return null;

      return {
        historyId: entry.id,
        subject: entry.subjectName,
        content: entry.content,
        studiedAt: entry.date,
        reviewDueAt,
        daysOverdue: calculateDaysOverdue(reviewDueAt),
      };
    })
    .filter((review): review is PendingReview => review !== null);

  return pendingReviews.sort((a, b) => b.daysOverdue - a.daysOverdue);
}

/**
 * Agrupa revisoes pendentes por materia
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
 * Conta o numero total de revisoes pendentes
 */
export function countPendingReviews(
  history: HistoryEntry[],
  intervalDays: ReviewInterval
): number {
  return getPendingReviews(history, intervalDays).length;
}

/**
 * Formata a diferenca de dias para exibicao
 */
export function formatDaysOverdue(daysOverdue: number): string {
  if (daysOverdue === 0) return 'hoje';
  if (daysOverdue === 1) return 'ha 1 dia';
  return `ha ${daysOverdue} dias`;
}
