import { useStudyData } from '@/hooks/useStudyData';
import { useReviewSettings } from '@/hooks/useReviewSettings';
import { StudyHeader } from '@/components/StudyHeader';
import { CycleProgress } from '@/components/CycleProgress';
import { CurrentStudyCard } from '@/components/CurrentStudyCard';
import { UpcomingBlocks } from '@/components/UpcomingBlocks';
import { StudyHistory } from '@/components/StudyHistory';
import { StreakBadge } from '@/components/StreakBadge';
import { StatsDashboard } from '@/components/StatsDashboard';
import { CycleEditor } from '@/components/CycleEditor';
import { WeeklyGoalCard } from '@/components/WeeklyGoalCard';
import { SubjectManager } from '@/components/SubjectManager';
import { PendingReviews } from '@/components/PendingReviews';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Loader2, BookOpen, BarChart3, Settings2 } from 'lucide-react';

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

  const { 
    settings: reviewSettings, 
    isLoaded: reviewLoaded, 
    updateInterval 
  } = useReviewSettings();

  if (!isLoaded || !reviewLoaded) {
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
        {/* Header compacto */}
        <div className="flex items-start justify-between gap-2">
          <StudyHeader 
            completedCycles={data.completedCycles} 
            totalMinutesStudied={data.totalMinutesStudied} 
          />
          <CycleEditor blocks={data.blocks} dailyGoal={data.dailyGoal} weeklyGoalHours={data.weeklyGoalHours ?? 10} onSave={atualizarBlocos} />
        </div>

        {/* Tabs para organizar conteúdo */}
        <Tabs defaultValue="study" className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-4">
            <TabsTrigger value="study" className="flex items-center gap-1.5 text-xs sm:text-sm">
              <BookOpen className="w-4 h-4" />
              <span className="hidden sm:inline">Estudar</span>
            </TabsTrigger>
            <TabsTrigger value="stats" className="flex items-center gap-1.5 text-xs sm:text-sm">
              <BarChart3 className="w-4 h-4" />
              <span className="hidden sm:inline">Progresso</span>
            </TabsTrigger>
            <TabsTrigger value="config" className="flex items-center gap-1.5 text-xs sm:text-sm">
              <Settings2 className="w-4 h-4" />
              <span className="hidden sm:inline">Matérias</span>
            </TabsTrigger>
          </TabsList>

          {/* Aba principal: Estudar */}
          <TabsContent value="study" className="space-y-4 mt-0">
            {/* Alerta de revisões pendentes (só mostra se houver) */}
            <PendingReviews
              history={data.history}
              intervalDays={reviewSettings.intervalDays}
              onIntervalChange={updateInterval}
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
          </TabsContent>

          {/* Aba de progresso e estatísticas */}
          <TabsContent value="stats" className="space-y-4 mt-0">
            <StreakBadge
              currentStreak={data.currentStreak}
              longestStreak={data.longestStreak}
              todayBlocks={data.todayBlocks}
              dailyGoal={data.dailyGoal}
            />

            <WeeklyGoalCard
              history={data.history}
              weeklyGoalHours={data.weeklyGoalHours ?? 10}
              blockDurationMinutes={currentBlock.duration}
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
          </TabsContent>

          {/* Aba de configuração de matérias */}
          <TabsContent value="config" className="space-y-4 mt-0">
            <SubjectManager />
          </TabsContent>
        </Tabs>
      </div>
      
      {/* Footer fixo com info do ciclo */}
      <footer className="fixed bottom-0 left-0 right-0 bg-card/80 backdrop-blur-lg border-t border-border z-10">
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
