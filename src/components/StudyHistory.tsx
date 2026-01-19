import { useState } from 'react';
import { HistoryEntry, SubjectType } from '@/types/study';
import { History, Trash2, ChevronDown, ChevronUp, Calendar } from 'lucide-react';
import { format, parseISO, isToday, isYesterday } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface StudyHistoryProps {
  history: HistoryEntry[];
  onClearHistory: () => void;
}

const subjectBadgeStyles: Record<SubjectType, string> = {
  math: 'subject-math',
  nature: 'subject-nature',
  portuguese: 'subject-portuguese',
  human: 'subject-human',
};

const subjectIcons: Record<SubjectType, string> = {
  math: '📐',
  nature: '🔬',
  portuguese: '📚',
  human: '🌍',
};

export function StudyHistory({ history, onClearHistory }: StudyHistoryProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [showConfirmClear, setShowConfirmClear] = useState(false);

  const formatDate = (dateString: string) => {
    const date = parseISO(dateString);
    if (isToday(date)) {
      return `Hoje às ${format(date, 'HH:mm')}`;
    }
    if (isYesterday(date)) {
      return `Ontem às ${format(date, 'HH:mm')}`;
    }
    return format(date, "d 'de' MMM 'às' HH:mm", { locale: ptBR });
  };

  const displayedHistory = isExpanded ? history : history.slice(0, 3);

  if (history.length === 0) {
    return (
      <div className="bg-card rounded-2xl p-5 shadow-sm fade-in">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center">
            <History className="w-5 h-5 text-muted-foreground" />
          </div>
          <h2 className="text-lg font-semibold text-foreground">Histórico</h2>
        </div>
        <div className="text-center py-8">
          <Calendar className="w-12 h-12 text-muted-foreground/30 mx-auto mb-3" />
          <p className="text-muted-foreground">Nenhum estudo concluído ainda</p>
          <p className="text-sm text-muted-foreground/70">Complete seu primeiro bloco!</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-card rounded-2xl p-5 shadow-sm fade-in">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center">
            <History className="w-5 h-5 text-muted-foreground" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-foreground">Histórico</h2>
            <p className="text-xs text-muted-foreground">{history.length} estudos concluídos</p>
          </div>
        </div>
        
        {showConfirmClear ? (
          <div className="flex gap-2">
            <button
              onClick={() => setShowConfirmClear(false)}
              className="px-3 py-1.5 text-sm rounded-lg bg-muted text-muted-foreground"
            >
              Não
            </button>
            <button
              onClick={() => {
                onClearHistory();
                setShowConfirmClear(false);
              }}
              className="px-3 py-1.5 text-sm rounded-lg bg-destructive text-destructive-foreground"
            >
              Limpar
            </button>
          </div>
        ) : (
          <button
            onClick={() => setShowConfirmClear(true)}
            className="p-2 rounded-lg hover:bg-muted transition-colors text-muted-foreground hover:text-destructive"
            title="Limpar histórico"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        )}
      </div>

      <div className="space-y-2">
        {displayedHistory.map((entry) => (
          <div key={entry.id} className={`history-item ${subjectBadgeStyles[entry.subjectType]} ${entry.skipped ? 'opacity-60' : ''}`}>
            <span className="text-xl">{entry.skipped ? '⏭️' : subjectIcons[entry.subjectType]}</span>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <span className="subject-badge text-xs">{entry.subject}</span>
                {entry.skipped && (
                  <span className="text-xs px-2 py-0.5 rounded-full bg-orange-500/20 text-orange-500">
                    Pulado
                  </span>
                )}
              </div>
              <p className="text-sm text-foreground truncate">{entry.content}</p>
              <p className="text-xs text-muted-foreground mt-1">{formatDate(entry.date)}</p>
            </div>
          </div>
        ))}
      </div>

      {history.length > 3 && (
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="w-full mt-3 py-2 flex items-center justify-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          {isExpanded ? (
            <>
              <ChevronUp className="w-4 h-4" />
              Mostrar menos
            </>
          ) : (
            <>
              <ChevronDown className="w-4 h-4" />
              Ver mais ({history.length - 3} itens)
            </>
          )}
        </button>
      )}
    </div>
  );
}
