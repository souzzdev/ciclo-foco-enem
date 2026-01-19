import { Flame, Target, Trophy } from 'lucide-react';

interface StreakBadgeProps {
  currentStreak: number;
  longestStreak: number;
  todayBlocks: number;
  dailyGoal: number;
}

export function StreakBadge({ currentStreak, longestStreak, todayBlocks, dailyGoal }: StreakBadgeProps) {
  const progress = Math.min((todayBlocks / dailyGoal) * 100, 100);
  const goalComplete = todayBlocks >= dailyGoal;

  return (
    <div className="bg-card rounded-2xl p-4 shadow-sm slide-up">
      <div className="flex items-center gap-2 mb-3">
        <Flame className="w-5 h-5 text-orange-500" />
        <h3 className="font-semibold text-foreground">Streak & Metas</h3>
      </div>
      
      <div className="grid grid-cols-3 gap-3 mb-4">
        {/* Streak atual */}
        <div className="bg-gradient-to-br from-orange-500/20 to-red-500/20 rounded-xl p-3 text-center border border-orange-500/20">
          <div className="flex items-center justify-center gap-1 mb-1">
            <Flame className="w-4 h-4 text-orange-500" />
          </div>
          <p className="text-2xl font-bold text-foreground">{currentStreak}</p>
          <p className="text-xs text-muted-foreground">Dias seguidos</p>
        </div>

        {/* Maior streak */}
        <div className="bg-gradient-to-br from-yellow-500/20 to-amber-500/20 rounded-xl p-3 text-center border border-yellow-500/20">
          <div className="flex items-center justify-center gap-1 mb-1">
            <Trophy className="w-4 h-4 text-yellow-500" />
          </div>
          <p className="text-2xl font-bold text-foreground">{longestStreak}</p>
          <p className="text-xs text-muted-foreground">Recorde</p>
        </div>

        {/* Meta diária */}
        <div className={`bg-gradient-to-br ${goalComplete ? 'from-green-500/20 to-emerald-500/20 border-green-500/20' : 'from-primary/20 to-primary/10 border-primary/20'} rounded-xl p-3 text-center border`}>
          <div className="flex items-center justify-center gap-1 mb-1">
            <Target className={`w-4 h-4 ${goalComplete ? 'text-green-500' : 'text-primary'}`} />
          </div>
          <p className="text-2xl font-bold text-foreground">{todayBlocks}/{dailyGoal}</p>
          <p className="text-xs text-muted-foreground">Meta hoje</p>
        </div>
      </div>

      {/* Barra de progresso da meta diária */}
      <div className="space-y-2">
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>Progresso do dia</span>
          <span>{Math.round(progress)}%</span>
        </div>
        <div className="h-2 bg-muted rounded-full overflow-hidden">
          <div 
            className={`h-full transition-all duration-500 ease-out rounded-full ${goalComplete ? 'bg-gradient-to-r from-green-500 to-emerald-500' : 'bg-gradient-to-r from-primary to-accent'}`}
            style={{ width: `${progress}%` }}
          />
        </div>
        {goalComplete && (
          <p className="text-xs text-green-500 text-center font-medium animate-fade-in">
            🎉 Meta do dia atingida!
          </p>
        )}
      </div>
    </div>
  );
}