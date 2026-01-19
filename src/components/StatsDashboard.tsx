import { useState } from 'react';
import { HistoryEntry, SubjectType } from '@/types/study';
import { BarChart3, ChevronDown, ChevronUp, PieChart, TrendingUp, AlertTriangle } from 'lucide-react';

interface StatsDashboardProps {
  history: HistoryEntry[];
  totalMinutes: number;
  completedCycles: number;
  skippedBlocks: number;
}

const subjectColors: Record<SubjectType, string> = {
  math: 'bg-blue-500',
  nature: 'bg-green-500',
  portuguese: 'bg-amber-500',
  human: 'bg-purple-500',
};

const subjectNames: Record<SubjectType, string> = {
  math: 'Matemática',
  nature: 'C. Natureza',
  portuguese: 'Português',
  human: 'C. Humanas',
};

export function StatsDashboard({ history, totalMinutes, completedCycles, skippedBlocks }: StatsDashboardProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  // Calcular estatísticas por matéria
  const subjectStats = history.reduce((acc, entry) => {
    if (!entry.skipped) {
      acc[entry.subjectType] = (acc[entry.subjectType] || 0) + 1;
    }
    return acc;
  }, {} as Record<SubjectType, number>);

  const totalBlocks = Object.values(subjectStats).reduce((a, b) => a + b, 0);

  // Calcular estatísticas por dia da semana
  const dayStats = history.reduce((acc, entry) => {
    if (!entry.skipped) {
      const day = new Date(entry.date).getDay();
      const dayNames = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
      const dayName = dayNames[day];
      acc[dayName] = (acc[dayName] || 0) + 1;
    }
    return acc;
  }, {} as Record<string, number>);

  const maxDayBlocks = Math.max(...Object.values(dayStats), 1);

  // Calcular média de blocos por dia
  const uniqueDays = new Set(
    history.filter(e => !e.skipped).map(e => new Date(e.date).toDateString())
  ).size;
  const avgBlocksPerDay = uniqueDays > 0 ? (totalBlocks / uniqueDays).toFixed(1) : '0';

  if (history.length === 0) {
    return null;
  }

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
            <h3 className="font-semibold text-foreground">Estatísticas</h3>
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
          {/* Resumo rápido */}
          <div className="grid grid-cols-3 gap-2">
            <div className="bg-muted/50 rounded-xl p-3 text-center">
              <TrendingUp className="w-4 h-4 text-primary mx-auto mb-1" />
              <p className="text-lg font-bold text-foreground">{avgBlocksPerDay}</p>
              <p className="text-xs text-muted-foreground">Média/dia</p>
            </div>
            <div className="bg-muted/50 rounded-xl p-3 text-center">
              <PieChart className="w-4 h-4 text-accent mx-auto mb-1" />
              <p className="text-lg font-bold text-foreground">{uniqueDays}</p>
              <p className="text-xs text-muted-foreground">Dias ativos</p>
            </div>
            <div className="bg-muted/50 rounded-xl p-3 text-center">
              <AlertTriangle className="w-4 h-4 text-orange-500 mx-auto mb-1" />
              <p className="text-lg font-bold text-foreground">{skippedBlocks}</p>
              <p className="text-xs text-muted-foreground">Pulados</p>
            </div>
          </div>

          {/* Gráfico por matéria */}
          <div>
            <h4 className="text-sm font-medium text-muted-foreground mb-3 flex items-center gap-2">
              <PieChart className="w-4 h-4" />
              Por Matéria
            </h4>
            <div className="space-y-2">
              {(Object.keys(subjectColors) as SubjectType[]).map((subject) => {
                const count = subjectStats[subject] || 0;
                const percentage = totalBlocks > 0 ? (count / totalBlocks) * 100 : 0;
                
                return (
                  <div key={subject} className="space-y-1">
                    <div className="flex justify-between text-xs">
                      <span className="text-foreground">{subjectNames[subject]}</span>
                      <span className="text-muted-foreground">{count} blocos ({Math.round(percentage)}%)</span>
                    </div>
                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                      <div 
                        className={`h-full ${subjectColors[subject]} transition-all duration-500 rounded-full`}
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Gráfico por dia da semana */}
          <div>
            <h4 className="text-sm font-medium text-muted-foreground mb-3 flex items-center gap-2">
              <BarChart3 className="w-4 h-4" />
              Por Dia da Semana
            </h4>
            <div className="flex items-end justify-between gap-1 h-20">
              {['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'].map((day) => {
                const count = dayStats[day] || 0;
                const height = maxDayBlocks > 0 ? (count / maxDayBlocks) * 100 : 0;
                
                return (
                  <div key={day} className="flex-1 flex flex-col items-center gap-1">
                    <div className="w-full flex-1 flex items-end">
                      <div 
                        className="w-full bg-gradient-to-t from-primary to-accent rounded-t transition-all duration-500"
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