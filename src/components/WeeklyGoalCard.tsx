import { useMemo } from 'react';
import { HistoryEntry } from '@/types/study';
import { Clock, Target, TrendingUp, Sparkles } from 'lucide-react';
import { Progress } from '@/components/ui/progress';

interface WeeklyGoalCardProps {
  history: HistoryEntry[];
  weeklyGoalHours: number;
  blockDurationMinutes: number;
}

export function WeeklyGoalCard({ history, weeklyGoalHours, blockDurationMinutes }: WeeklyGoalCardProps) {
  const weeklyStats = useMemo(() => {
    // Calcular início da semana (domingo)
    const now = new Date();
    const startOfWeek = new Date(now);
    startOfWeek.setDate(now.getDate() - now.getDay());
    startOfWeek.setHours(0, 0, 0, 0);

    // Filtrar blocos da semana atual (não pulados)
    const weekBlocks = history.filter(entry => {
      if (entry.skipped) return false;
      const entryDate = new Date(entry.date);
      return entryDate >= startOfWeek;
    });

    // Calcular minutos estudados (assumindo duração padrão por bloco)
    const minutesStudied = weekBlocks.length * blockDurationMinutes;
    const hoursStudied = minutesStudied / 60;
    const goalMinutes = weeklyGoalHours * 60;
    
    const percentage = goalMinutes > 0 ? Math.min((minutesStudied / goalMinutes) * 100, 100) : 0;
    const extraMinutes = Math.max(0, minutesStudied - goalMinutes);
    const remainingMinutes = Math.max(0, goalMinutes - minutesStudied);

    return {
      hoursStudied: hoursStudied.toFixed(1),
      minutesStudied,
      percentage,
      extraMinutes,
      remainingMinutes,
      isCompleted: minutesStudied >= goalMinutes,
      isExceeded: minutesStudied > goalMinutes,
      blocksThisWeek: weekBlocks.length,
    };
  }, [history, weeklyGoalHours, blockDurationMinutes]);

  if (weeklyGoalHours <= 0) return null;

  const formatTime = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = Math.round(minutes % 60);
    if (hours === 0) return `${mins}min`;
    if (mins === 0) return `${hours}h`;
    return `${hours}h ${mins}min`;
  };

  return (
    <div className="bg-card rounded-2xl p-4 shadow-sm slide-up">
      <div className="flex items-center gap-3 mb-3">
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
          weeklyStats.isExceeded 
            ? 'bg-green-500/20' 
            : weeklyStats.isCompleted 
              ? 'bg-primary/20' 
              : 'bg-muted'
        }`}>
          {weeklyStats.isExceeded ? (
            <Sparkles className="w-5 h-5 text-green-500" />
          ) : (
            <Target className="w-5 h-5 text-primary" />
          )}
        </div>
        <div className="flex-1">
          <h3 className="font-semibold text-foreground">Meta Semanal</h3>
          <p className="text-sm text-muted-foreground">
            {weeklyStats.hoursStudied}h de {weeklyGoalHours}h
          </p>
        </div>
        <div className="text-right">
          <span className={`text-lg font-bold ${
            weeklyStats.isExceeded 
              ? 'text-green-500' 
              : weeklyStats.isCompleted 
                ? 'text-primary' 
                : 'text-foreground'
          }`}>
            {Math.round(weeklyStats.percentage)}%
          </span>
        </div>
      </div>

      <Progress 
        value={weeklyStats.percentage} 
        className={`h-2 mb-3 ${weeklyStats.isExceeded ? '[&>div]:bg-green-500' : ''}`}
      />

      {weeklyStats.isExceeded ? (
        <div className="bg-green-500/10 border border-green-500/20 rounded-xl p-3 space-y-2">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-green-500" />
            <span className="text-sm font-medium text-green-600 dark:text-green-400">
              Parabéns! Meta ultrapassada!
            </span>
          </div>
          <p className="text-sm text-muted-foreground">
            Você tem <span className="font-semibold text-green-600 dark:text-green-400">
              {formatTime(weeklyStats.extraMinutes)}
            </span> de estudo extra! 🎉
          </p>
          <p className="text-xs text-muted-foreground">
            💡 Sugestão: Use esse tempo extra para revisar uma matéria que você tem mais dificuldade ou explorar um tema novo!
          </p>
        </div>
      ) : weeklyStats.isCompleted ? (
        <div className="bg-primary/10 border border-primary/20 rounded-xl p-3">
          <div className="flex items-center gap-2">
            <Target className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium text-primary">
              Meta atingida! Continue assim!
            </span>
          </div>
        </div>
      ) : (
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Clock className="w-4 h-4" />
          <span>
            Faltam <span className="font-medium text-foreground">{formatTime(weeklyStats.remainingMinutes)}</span> para atingir sua meta
          </span>
        </div>
      )}
    </div>
  );
}
