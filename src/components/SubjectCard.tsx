import { Subject } from '@/types/subject';

interface SubjectCardProps {
  subject: Subject;
  onToggleHour: (subjectId: string, hourIndex: number) => void;
}

export function SubjectCard({ subject, onToggleHour }: SubjectCardProps) {
  const percentage = subject.hours > 0
    ? Math.round((subject.completedHours / subject.hours) * 100)
    : 0;

  return (
    <div className="bg-card rounded-2xl p-4 shadow-sm transition-all duration-300 hover:shadow-md">
      {/* Header */}
      <div className="flex items-center gap-3 mb-3">
        <div
          className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
          style={{ backgroundColor: `${subject.color}20` }}
        >
          <div
            className="w-5 h-5 rounded-full"
            style={{ backgroundColor: subject.color }}
          />
        </div>
        <div className="flex-1 min-w-0">
          <h4 className="font-semibold text-foreground truncate">{subject.name}</h4>
          <p className="text-xs text-muted-foreground">
            {subject.completedHours} de {subject.hours}h ({percentage}%)
          </p>
        </div>
        <span
          className="text-sm font-bold tabular-nums"
          style={{ color: subject.color }}
        >
          {percentage}%
        </span>
      </div>

      {/* Progress bar */}
      <div className="h-1.5 bg-muted rounded-full overflow-hidden mb-3">
        <div
          className="h-full rounded-full transition-all duration-500 ease-out"
          style={{
            width: `${percentage}%`,
            backgroundColor: subject.color,
          }}
        />
      </div>

      {/* Clickable hour blocks */}
      <div className="flex flex-wrap gap-1.5">
        {Array.from({ length: subject.hours }).map((_, index) => {
          const isCompleted = index < subject.completedHours;
          return (
            <button
              key={index}
              onClick={() => onToggleHour(subject.id, index)}
              className="w-7 h-7 rounded-md transition-all duration-200 hover:scale-110 active:scale-95 border"
              style={{
                backgroundColor: isCompleted ? subject.color : 'transparent',
                borderColor: isCompleted ? subject.color : `${subject.color}40`,
                opacity: isCompleted ? 1 : 0.5,
              }}
              title={`${isCompleted ? 'Desmarcar' : 'Marcar'} hora ${index + 1}`}
              aria-label={`Hora ${index + 1} de ${subject.name}: ${isCompleted ? 'concluida' : 'pendente'}`}
            >
              {isCompleted && (
                <svg
                  className="w-4 h-4 mx-auto"
                  fill="none"
                  stroke="white"
                  strokeWidth={2.5}
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
