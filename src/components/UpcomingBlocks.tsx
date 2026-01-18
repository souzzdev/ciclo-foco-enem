import { StudyBlock, SubjectType } from '@/types/study';
import { ChevronRight } from 'lucide-react';

interface UpcomingBlocksProps {
  blocks: StudyBlock[];
  currentIndex: number;
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

export function UpcomingBlocks({ blocks, currentIndex }: UpcomingBlocksProps) {
  // Pegar os próximos blocos (excluindo o atual)
  const getUpcomingBlocks = () => {
    const upcoming: StudyBlock[] = [];
    for (let i = 1; i <= 4; i++) {
      const index = (currentIndex + i) % blocks.length;
      upcoming.push(blocks[index]);
    }
    return upcoming;
  };

  const upcomingBlocks = getUpcomingBlocks();

  return (
    <div className="bg-card rounded-2xl p-4 shadow-sm fade-in">
      <h2 className="text-sm font-medium text-muted-foreground mb-3">Próximos estudos</h2>
      
      <div className="space-y-2">
        {upcomingBlocks.map((block, index) => (
          <div 
            key={`upcoming-${block.id}-${index}`}
            className={`flex items-center gap-3 p-3 rounded-xl transition-colors ${subjectBadgeStyles[block.subjectType]}`}
            style={{ backgroundColor: 'hsl(var(--subject-bg) / 0.5)' }}
          >
            <span className="text-xl">{subjectIcons[block.subjectType]}</span>
            <div className="flex-1">
              <p className="font-medium text-foreground text-sm">{block.subject}</p>
              <p className="text-xs text-muted-foreground">{block.duration} minutos</p>
            </div>
            <ChevronRight className="w-4 h-4 text-muted-foreground" />
          </div>
        ))}
      </div>
    </div>
  );
}
