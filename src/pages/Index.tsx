import { useStudyData } from '@/hooks/useStudyData';
import { StudyHeader } from '@/components/StudyHeader';
import { CycleProgress } from '@/components/CycleProgress';
import { CurrentStudyCard } from '@/components/CurrentStudyCard';
import { UpcomingBlocks } from '@/components/UpcomingBlocks';
import { StudyHistory } from '@/components/StudyHistory';
import { StreakBadge } from '@/components/StreakBadge';
import { StatsDashboard } from '@/components/StatsDashboard';
import { CycleEditor } from '@/components/CycleEditor';
import { Loader2 } from 'lucide-react';

const Index = () => {
  const { 
    data, 
    isLoaded, 
    currentBlock, 
    concluirBloco,
    pularBloco,
    limparHistorico,
    atualizarBlocos,
  } = useStudyData();

  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="w-8 h-8 text-primary animate-spin" />
          <p className="text-muted-foreground">Carregando seus estudos...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-md mx-auto px-4 py-6 pb-20 space-y-4">
        <div className="flex items-start justify-between gap-2">
          <StudyHeader 
            completedCycles={data.completedCycles} 
            totalMinutesStudied={data.totalMinutesStudied} 
          />
          <CycleEditor blocks={data.blocks} onSave={atualizarBlocos} />
        </div>

        <StreakBadge
          currentStreak={data.currentStreak}
          longestStreak={data.longestStreak}
          todayBlocks={data.todayBlocks}
          dailyGoal={data.dailyGoal}
        />
        
        <CycleProgress 
          blocks={data.blocks} 
          currentIndex={data.currentBlockIndex} 
        />
        
        <CurrentStudyCard 
          block={currentBlock} 
          onComplete={concluirBloco}
          onSkip={pularBloco}
        />
        
        <UpcomingBlocks 
          blocks={data.blocks} 
          currentIndex={data.currentBlockIndex} 
        />

        <StatsDashboard
          history={data.history}
          totalMinutes={data.totalMinutesStudied}
          completedCycles={data.completedCycles}
          skippedBlocks={data.skippedBlocks}
        />
        
        <StudyHistory 
          history={data.history} 
          onClearHistory={limparHistorico} 
        />
      </div>
      
      {/* Footer fixo com info do ciclo */}
      <footer className="fixed bottom-0 left-0 right-0 bg-card/80 backdrop-blur-lg border-t border-border">
        <div className="max-w-md mx-auto px-4 py-3">
          <p className="text-center text-sm text-muted-foreground">
            Bloco <span className="font-semibold text-foreground">{data.currentBlockIndex + 1}</span> de {data.blocks.length} 
            {' · '}
            <span className="text-primary font-medium">{currentBlock.subject}</span>
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
