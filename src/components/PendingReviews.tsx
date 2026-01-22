import { useState } from 'react';
import { Bell, ChevronDown, ChevronUp, BookOpen, Clock, AlertTriangle, Check } from 'lucide-react';
import { HistoryEntry } from '@/types/study';
import { REVIEW_INTERVALS, ReviewInterval } from '@/types/review';
import { getPendingReviews, formatDaysOverdue, groupReviewsBySubject } from '@/lib/reviewCalculations';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface PendingReviewsProps {
  history: HistoryEntry[];
  intervalDays: ReviewInterval;
  onIntervalChange: (interval: ReviewInterval) => void;
  onMarkReviewed?: (historyId: string) => void;
}

export function PendingReviews({ 
  history, 
  intervalDays, 
  onIntervalChange,
  onMarkReviewed 
}: PendingReviewsProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  
  const pendingReviews = getPendingReviews(history, intervalDays);
  const groupedReviews = groupReviewsBySubject(pendingReviews);
  const hasReviews = pendingReviews.length > 0;

  const urgentCount = pendingReviews.filter(r => r.daysOverdue >= 7).length;

  return (
    <div className="study-card slide-up">
      {/* Header com configuração */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="relative">
            <Bell className="w-5 h-5 text-primary" />
            {hasReviews && (
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-destructive text-destructive-foreground text-[10px] font-bold rounded-full flex items-center justify-center">
                {pendingReviews.length > 9 ? '9+' : pendingReviews.length}
              </span>
            )}
          </div>
          <h3 className="font-semibold text-foreground">Revisões Pendentes</h3>
        </div>
        
        {/* Seletor de intervalo */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-muted-foreground hidden sm:inline">Revisar a cada:</span>
          <Select
            value={intervalDays.toString()}
            onValueChange={(value) => onIntervalChange(parseInt(value) as ReviewInterval)}
          >
            <SelectTrigger className="w-24 h-8 text-xs">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {REVIEW_INTERVALS.map((interval) => (
                <SelectItem key={interval} value={interval.toString()}>
                  {interval} dias
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Alerta de urgência */}
      {urgentCount > 0 && (
        <div className="flex items-center gap-2 p-3 mb-3 rounded-lg bg-destructive/10 border border-destructive/20">
          <AlertTriangle className="w-4 h-4 text-destructive" />
          <span className="text-sm text-destructive font-medium">
            {urgentCount} {urgentCount === 1 ? 'conteúdo precisa' : 'conteúdos precisam'} de revisão urgente!
          </span>
        </div>
      )}

      {/* Status quando não há revisões */}
      {!hasReviews && (
        <div className="flex flex-col items-center justify-center py-6 text-center">
          <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-3">
            <Check className="w-6 h-6 text-primary" />
          </div>
          <p className="text-sm text-muted-foreground">
            Nenhuma revisão pendente no momento!
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            Seus conteúdos serão marcados para revisão após {intervalDays} dias
          </p>
        </div>
      )}

      {/* Lista de revisões */}
      {hasReviews && (
        <>
          {/* Preview resumido */}
          <div 
            className="flex items-center justify-between p-3 rounded-lg bg-muted/50 cursor-pointer hover:bg-muted/70 transition-colors"
            onClick={() => setIsExpanded(!isExpanded)}
          >
            <div className="flex items-center gap-3">
              <BookOpen className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm font-medium">
                {pendingReviews.length} {pendingReviews.length === 1 ? 'conteúdo' : 'conteúdos'} para revisar
              </span>
            </div>
            {isExpanded ? (
              <ChevronUp className="w-4 h-4 text-muted-foreground" />
            ) : (
              <ChevronDown className="w-4 h-4 text-muted-foreground" />
            )}
          </div>

          {/* Lista expandida por matéria */}
          {isExpanded && (
            <div className="mt-3 space-y-3 fade-in">
              {Object.entries(groupedReviews).map(([subject, reviews]) => (
                <div key={subject} className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary" className="text-xs">
                      {subject}
                    </Badge>
                    <span className="text-xs text-muted-foreground">
                      ({reviews.length})
                    </span>
                  </div>
                  
                  <div className="space-y-2 pl-2">
                    {reviews.map((review) => (
                      <div 
                        key={review.historyId}
                        className="flex items-start justify-between gap-2 p-2 rounded-lg bg-background border border-border/50"
                      >
                        <div className="flex-1 min-w-0">
                          <p className="text-sm text-foreground truncate">
                            {review.content}
                          </p>
                          <div className="flex items-center gap-1 mt-1">
                            <Clock className="w-3 h-3 text-muted-foreground" />
                            <span className={`text-xs ${
                              review.daysOverdue >= 7 
                                ? 'text-destructive font-medium' 
                                : 'text-muted-foreground'
                            }`}>
                              Venceu {formatDaysOverdue(review.daysOverdue)}
                            </span>
                          </div>
                        </div>
                        
                        {onMarkReviewed && (
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7 text-primary hover:bg-primary/10"
                            onClick={(e) => {
                              e.stopPropagation();
                              onMarkReviewed(review.historyId);
                            }}
                            title="Marcar como revisado"
                          >
                            <Check className="w-4 h-4" />
                          </Button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}
