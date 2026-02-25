import { useState } from 'react';
import { HistoryEntry } from '@/types/study';
import { Subject } from '@/types/subject';
import { BarChart3, ChevronDown, ChevronUp, PieChart, TrendingUp, AlertTriangle } from 'lucide-react';

interface StatsDashboardProps {
  history: HistoryEntry[];
  totalMinutes: number;
  completedCycles: number;
  subjects: Subject[];
}

export function StatsDashboard({ history, totalMinutes, completedCycles, subjects }: StatsDashboardProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  // Calculate stats by subject
  const subjectStats = history.reduce((acc, entry) => {
    if (!entry.skipped) {
      acc[entry.subjectName] = (acc[entry.subjectName] || 0) + 1;
    }
    return acc;
  }, {} as Record<string, number>);

  const totalBlocks = Object.values(subjectStats).reduce((a, b) => a + b, 0);

  // Day of week stats
  const dayStats = history.reduce((acc, entry) => {
    if (!entry.skipped) {
      const day = new Date(entry.date).getDay();
      const dayNames = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sab'];
      const dayName = dayNames[day];
      acc[dayName] = (acc[dayName] || 0) + 1;
    }
    return acc;
  }, {} as Record<string, number>);

  const maxDayBlocks = Math.max(...Object.values(dayStats), 1);

  const uniqueDays = new Set(
    history.filter(e => !e.skipped).map(e => new Date(e.date).toDateString())
  ).size;
  const avgBlocksPerDay = uniqueDays > 0 ? (totalBlocks / uniqueDays).toFixed(1) : '0';

  if (history.length === 0) {
    return null;
  }

  // Build subject color map
  const subjectColorMap: Record<string, string> = {};
  subjects.forEach(s => {
    subjectColorMap[s.name] = s.color;
  });
  // Also get colors from history entries
  history.forEach(e => {
    if (!subjectColorMap[e.subjectName] && e.subjectColor) {
      subjectColorMap[e.subjectName] = e.subjectColor;
    }
  });

  return (
    <div className="bg-card rounded-2xl shadow-sm overflow-hidden slide-up">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full p-4 flex items-center justify-between hover:bg-muted/30 transition-colors"
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
            <BarChart3 className="w-5 h-5 text-primary" />
          </div>
          <div className="text-left">
            <h3 className="font-semibold text-foreground">Estatisticas</h3>
            <p className="text-sm text-muted-foreground">{totalBlocks} blocos estudados</p>
          </div>
        </div>
        {isExpanded ? (
          <ChevronUp className="w-5 h-5 text-muted-foreground" />
        ) : (
          <ChevronDown className="w-5 h-5 text-muted-foreground" />
        )}
      </button>

      {isExpanded && (
        <div className="px-4 pb-4 space-y-4 fade-in">
          {/* Quick summary */}
          <div className="grid grid-cols-3 gap-2">
            <div className="bg-muted/50 rounded-xl p-3 text-center">
              <TrendingUp className="w-4 h-4 text-primary mx-auto mb-1" />
              <p className="text-lg font-bold text-foreground">{avgBlocksPerDay}</p>
              <p className="text-xs text-muted-foreground">Media/dia</p>
            </div>
            <div className="bg-muted/50 rounded-xl p-3 text-center">
              <PieChart className="w-4 h-4 text-accent mx-auto mb-1" />
              <p className="text-lg font-bold text-foreground">{uniqueDays}</p>
              <p className="text-xs text-muted-foreground">Dias ativos</p>
            </div>
            <div className="bg-muted/50 rounded-xl p-3 text-center">
              <AlertTriangle className="w-4 h-4 text-orange-500 mx-auto mb-1" />
              <p className="text-lg font-bold text-foreground">{completedCycles}</p>
              <p className="text-xs text-muted-foreground">Ciclos</p>
            </div>
          </div>

          {/* Per-subject chart */}
          <div>
            <h4 className="text-sm font-medium text-muted-foreground mb-3 flex items-center gap-2">
              <PieChart className="w-4 h-4" />
              Por Materia
            </h4>
            <div className="space-y-2">
              {Object.entries(subjectStats).map(([name, count]) => {
                const percentage = totalBlocks > 0 ? (count / totalBlocks) * 100 : 0;
                const color = subjectColorMap[name] || '#6366f1';

                return (
                  <div key={name} className="space-y-1">
                    <div className="flex justify-between text-xs">
                      <span className="text-foreground flex items-center gap-1.5">
                        <span
                          className="w-2 h-2 rounded-full inline-block"
                          style={{ backgroundColor: color }}
                        />
                        {name}
                      </span>
                      <span className="text-muted-foreground">{count} blocos ({Math.round(percentage)}%)</span>
                    </div>
                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                      <div
                        className="h-full transition-all duration-500 rounded-full"
                        style={{ width: `${percentage}%`, backgroundColor: color }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Day of week chart */}
          <div>
            <h4 className="text-sm font-medium text-muted-foreground mb-3 flex items-center gap-2">
              <BarChart3 className="w-4 h-4" />
              Por Dia da Semana
            </h4>
            <div className="flex items-end justify-between gap-1 h-20">
              {['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sab'].map((day) => {
                const count = dayStats[day] || 0;
                const height = maxDayBlocks > 0 ? (count / maxDayBlocks) * 100 : 0;

                return (
                  <div key={day} className="flex-1 flex flex-col items-center gap-1">
                    <div className="w-full flex-1 flex items-end">
                      <div
                        className="w-full bg-primary rounded-t transition-all duration-500"
                        style={{ height: `${Math.max(height, 4)}%` }}
                      />
                    </div>
                    <span className="text-xs text-muted-foreground">{day}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
