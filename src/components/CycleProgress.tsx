import { StudyBlock, SubjectType } from '@/types/study';
import { Check } from 'lucide-react';

interface CycleProgressProps {
  blocks: StudyBlock[];
  currentIndex: number;
}

const subjectColors: Record<SubjectType, string> = {
  math: 'bg-[hsl(var(--math))]',
  nature: 'bg-[hsl(var(--nature))]',
  portuguese: 'bg-[hsl(var(--portuguese))]',
  human: 'bg-[hsl(var(--human))]',
};

const subjectBgColors: Record<SubjectType, string> = {
  math: 'bg-[hsl(var(--math-light))]',
  nature: 'bg-[hsl(var(--nature-light))]',
  portuguese: 'bg-[hsl(var(--portuguese-light))]',
  human: 'bg-[hsl(var(--human-light))]',
};

export function CycleProgress({ blocks, currentIndex }: CycleProgressProps) {
  return (
    <div className="bg-card rounded-2xl p-4 shadow-sm fade-in">
      <h2 className="text-sm font-medium text-muted-foreground mb-4">Progresso do Ciclo</h2>
      
      <div className="flex items-center justify-between gap-2">
        {blocks.map((block, index) => {
          const isCompleted = index < currentIndex;
          const isCurrent = index === currentIndex;
          const isUpcoming = index > currentIndex;
          
          return (
            <div key={block.id} className="flex-1 flex flex-col items-center gap-2">
              <div 
                className={`
                  w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300
                  ${isCurrent ? `${subjectColors[block.subjectType]} text-white ring-4 ring-offset-2 ring-offset-background ring-primary/30` : ''}
                  ${isCompleted ? `${subjectColors[block.subjectType]} text-white` : ''}
                  ${isUpcoming ? `${subjectBgColors[block.subjectType]} border-2 border-border` : ''}
                `}
              >
                {isCompleted ? (
                  <Check className="w-5 h-5" />
                ) : (
                  <span className={`text-sm font-semibold ${isUpcoming ? 'text-muted-foreground' : ''}`}>
                    {index + 1}
                  </span>
                )}
              </div>
              <span className={`text-xs text-center leading-tight ${isCurrent ? 'font-semibold text-foreground' : 'text-muted-foreground'}`}>
                {block.subject.split(' ')[0]}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
