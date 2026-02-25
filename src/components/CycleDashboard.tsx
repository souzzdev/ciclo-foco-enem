import { Subject } from '@/types/subject';
import { SubjectCard } from './SubjectCard';
import { Progress } from '@/components/ui/progress';
import { Target, Clock, TrendingUp } from 'lucide-react';

interface CycleDashboardProps {
  subjects: Subject[];
  totalHoursAssigned: number;
  totalHoursCompleted: number;
  progressPercentage: number;
  onToggleHour: (subjectId: string, hourIndex: number) => void;
}

export function CycleDashboard({
  subjects,
  totalHoursAssigned,
  totalHoursCompleted,
  progressPercentage,
  onToggleHour,
}: CycleDashboardProps) {
  const isComplete = progressPercentage >= 100;

  if (subjects.length === 0) {
    return (
      <div className="bg-card rounded-2xl p-8 shadow-sm text-center">
        <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
          <Target className="w-8 h-8 text-primary" />
        </div>
        <h3 className="text-lg font-semibold text-foreground mb-2">Nenhuma materia cadastrada</h3>
        <p className="text-sm text-muted-foreground max-w-xs mx-auto">
          Adicione materias na aba "Materias" para gerar seu ciclo de estudos personalizado.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Total Progress Card */}
      <div className="bg-card rounded-2xl p-5 shadow-sm slide-up">
        <div className="flex items-center gap-3 mb-4">
          <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
            isComplete ? 'bg-green-500/20' : 'bg-primary/10'
          }`}>
            {isComplete ? (
              <TrendingUp className="w-6 h-6 text-green-500" />
            ) : (
              <Target className="w-6 h-6 text-primary" />
            )}
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-bold text-foreground">Progresso do Ciclo</h3>
            <p className="text-sm text-muted-foreground">
              {totalHoursCompleted} de {totalHoursAssigned} horas concluidas
            </p>
          </div>
          <span className={`text-3xl font-bold tabular-nums ${
            isComplete ? 'text-green-500' : 'text-primary'
          }`}>
            {progressPercentage}%
          </span>
        </div>

        <Progress
          value={progressPercentage}
          className={`h-3 ${isComplete ? '[&>div]:bg-green-500' : ''}`}
        />

        {isComplete && (
          <div className="mt-3 p-3 bg-green-500/10 border border-green-500/20 rounded-xl">
            <p className="text-sm text-green-600 dark:text-green-400 font-medium text-center">
              Ciclo concluido! Resete o ciclo para iniciar um novo.
            </p>
          </div>
        )}

        {/* Subject mini bars */}
        <div className="mt-4 flex gap-1.5">
          {subjects.map(subject => {
            const pct = subject.hours > 0
              ? (subject.completedHours / subject.hours) * 100
              : 0;
            return (
              <div
                key={subject.id}
                className="flex-1 h-2 rounded-full overflow-hidden bg-muted"
                title={`${subject.name}: ${Math.round(pct)}%`}
              >
                <div
                  className="h-full rounded-full transition-all duration-500"
                  style={{
                    width: `${pct}%`,
                    backgroundColor: subject.color,
                  }}
                />
              </div>
            );
          })}
        </div>

        <div className="mt-2 flex items-center justify-center gap-1 text-xs text-muted-foreground">
          <Clock className="w-3 h-3" />
          <span>Cada bloco = 1 hora de estudo</span>
        </div>
      </div>

      {/* Subject Cards Grid */}
      <div className="grid gap-4 sm:grid-cols-2">
        {subjects.map(subject => (
          <SubjectCard
            key={subject.id}
            subject={subject}
            onToggleHour={onToggleHour}
          />
        ))}
      </div>
    </div>
  );
}
