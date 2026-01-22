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
      <div className="w-full max-w-md sm:max-w-lg md:max-w-2xl lg:max-w-4xl xl:max-w-5xl mx-auto px-4 sm:px-6 py-6 pb-20 space-y-4">
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
          <TabsList className="grid w-full grid-cols-3 mb-4 h-11 sm:h-12">
            <TabsTrigger value="study" className="flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm transition-all duration-200 data-[state=active]:scale-[1.02]">
              <BookOpen className="w-4 h-4 sm:w-5 sm:h-5" />
              <span>Estudar</span>
            </TabsTrigger>
            <TabsTrigger value="stats" className="flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm transition-all duration-200 data-[state=active]:scale-[1.02]">
              <BarChart3 className="w-4 h-4 sm:w-5 sm:h-5" />
              <span>Progresso</span>
            </TabsTrigger>
            <TabsTrigger value="config" className="flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm transition-all duration-200 data-[state=active]:scale-[1.02]">
              <Settings2 className="w-4 h-4 sm:w-5 sm:h-5" />
              <span>Matérias</span>
            </TabsTrigger>
          </TabsList>

          {/* Aba principal: Estudar */}
          <TabsContent value="study" className="mt-0 animate-tab-enter">
            <div className="space-y-4 lg:grid lg:grid-cols-2 lg:gap-6 lg:space-y-0">
              {/* Coluna esquerda em telas grandes */}
              <div className="space-y-4">
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
              </div>
              
              {/* Coluna direita em telas grandes */}
              <div className="space-y-4">
                <UpcomingBlocks 
                  blocks={data.blocks} 
                  currentIndex={data.currentBlockIndex} 
                />
              </div>
            </div>
          </TabsContent>

          {/* Aba de progresso e estatísticas */}
          <TabsContent value="stats" className="mt-0 animate-tab-enter">
            <div className="space-y-4 lg:grid lg:grid-cols-2 lg:gap-6 lg:space-y-0">
              {/* Coluna esquerda */}
              <div className="space-y-4">
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
              </div>
              
              {/* Coluna direita */}
              <div className="space-y-4">
                <StudyHistory
                  history={data.history} 
                  onClearHistory={limparHistorico} 
                />
              </div>
            </div>
          </TabsContent>

          {/* Aba de configuração de matérias */}
          <TabsContent value="config" className="mt-0 animate-tab-enter">
            <SubjectManager />
          </TabsContent>
        </Tabs>
      </div>
      
      {/* Footer fixo com info do ciclo */}
      <footer className="fixed bottom-0 left-0 right-0 bg-card/80 backdrop-blur-lg border-t border-border z-10">
        <div className="w-full max-w-md sm:max-w-lg md:max-w-2xl lg:max-w-4xl xl:max-w-5xl mx-auto px-4 sm:px-6 py-3">
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
