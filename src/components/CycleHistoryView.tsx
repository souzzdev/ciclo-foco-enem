import { useState } from 'react';
import { CycleHistoryEntry } from '@/types/study';
import { History, ChevronDown, ChevronUp, Trophy } from 'lucide-react';
import { formatCycleHistory } from '@/lib/exportUtils';

interface CycleHistoryViewProps {
  cycleHistory: CycleHistoryEntry[];
}

export function CycleHistoryView({ cycleHistory }: CycleHistoryViewProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  if (cycleHistory.length === 0) return null;

  const displayed = isExpanded ? cycleHistory : cycleHistory.slice(0, 3);

  return (
    <div className="bg-card rounded-2xl p-5 shadow-sm slide-up">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between mb-4"
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-accent/20 flex items-center justify-center">
            <Trophy className="w-5 h-5 text-accent" />
          </div>
          <div className="text-left">
            <h3 className="font-semibold text-foreground">Ciclos Anteriores</h3>
            <p className="text-xs text-muted-foreground">{cycleHistory.length} ciclo{cycleHistory.length !== 1 ? 's' : ''} completado{cycleHistory.length !== 1 ? 's' : ''}</p>
          </div>
        </div>
        {isExpanded ? (
          <ChevronUp className="w-5 h-5 text-muted-foreground" />
        ) : (
          <ChevronDown className="w-5 h-5 text-muted-foreground" />
        )}
      </button>

      {isExpanded && (
        <div className="space-y-3 fade-in">
          {displayed.map(entry => {
            const pct = entry.totalHours > 0
              ? Math.round((entry.completedHours / entry.totalHours) * 100)
              : 0;

            return (
              <div key={entry.id} className="p-3 bg-muted/50 rounded-xl space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-foreground">
                    {formatCycleHistory(entry)}
                  </span>
                  <span className="text-sm font-bold text-primary">{pct}%</span>
                </div>

                <div className="flex gap-1">
                  {entry.subjects.map((s, i) => {
                    const subPct = s.hours > 0 ? (s.completedHours / s.hours) * 100 : 0;
                    return (
                      <div
                        key={i}
                        className="flex-1 h-2 rounded-full overflow-hidden bg-muted"
                        title={`${s.name}: ${Math.round(subPct)}%`}
                      >
                        <div
                          className="h-full rounded-full"
                          style={{
                            width: `${subPct}%`,
                            backgroundColor: s.color,
                          }}
                        />
                      </div>
                    );
                  })}
                </div>

                <div className="flex flex-wrap gap-x-3 gap-y-1">
                  {entry.subjects.map((s, i) => (
                    <span key={i} className="text-xs text-muted-foreground flex items-center gap-1">
                      <span
                        className="w-2 h-2 rounded-full inline-block"
                        style={{ backgroundColor: s.color }}
                      />
                      {s.name}: {s.completedHours}/{s.hours}h
                    </span>
                  ))}
                </div>
              </div>
            );
          })}

          {cycleHistory.length > 3 && !isExpanded && (
            <p className="text-xs text-center text-muted-foreground">
              + {cycleHistory.length - 3} ciclos anteriores
            </p>
          )}
        </div>
      )}
    </div>
  );
}
