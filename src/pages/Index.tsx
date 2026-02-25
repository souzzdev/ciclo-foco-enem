import { useState } from 'react';
import { useCycleData } from '@/hooks/useCycleData';
import { useReviewSettings } from '@/hooks/useReviewSettings';
import { StudyHeader } from '@/components/StudyHeader';
import { CycleDashboard } from '@/components/CycleDashboard';
import { CycleIntensitySlider } from '@/components/CycleIntensitySlider';
import { SubjectManager } from '@/components/SubjectManager';
import { StudyHistory } from '@/components/StudyHistory';
import { StreakBadge } from '@/components/StreakBadge';
import { StatsDashboard } from '@/components/StatsDashboard';
import { WeeklyGoalCard } from '@/components/WeeklyGoalCard';
import { PendingReviews } from '@/components/PendingReviews';
import { CycleHistoryView } from '@/components/CycleHistoryView';
import { ExportButtons } from '@/components/ExportButtons';
import { ConfirmDialog } from '@/components/ConfirmDialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Loader2, Target, BarChart3, Settings2, RotateCcw } from 'lucide-react';

const Index = () => {
  const {
    subjects,
    cycleData,
    isLoaded,
    totalHoursAssigned,
    totalHoursCompleted,
    progressPercentage,
    addSubject,
    editSubject,
    removeSubject,
    reorderSubjects,
    toggleHour,
    updateIntensity,
    resetCycle,
    clearHistory,
  } = useCycleData();

  const {
    settings: reviewSettings,
    isLoaded: reviewLoaded,
    updateInterval,
  } = useReviewSettings();

  const [showResetConfirm, setShowResetConfirm] = useState(false);

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
        {/* Header */}
        <div className="flex items-start gap-3">
          <StudyHeader
            completedCycles={cycleData.completedCycles}
            totalMinutesStudied={cycleData.totalMinutesStudied}
          />
        </div>

        {/* Tabs */}
        <Tabs defaultValue="cycle" className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-4 h-11 sm:h-12">
            <TabsTrigger value="cycle" className="flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm transition-all duration-200 data-[state=active]:scale-[1.02]">
              <Target className="w-4 h-4 sm:w-5 sm:h-5" />
              <span>Ciclo</span>
            </TabsTrigger>
            <TabsTrigger value="stats" className="flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm transition-all duration-200 data-[state=active]:scale-[1.02]">
              <BarChart3 className="w-4 h-4 sm:w-5 sm:h-5" />
              <span>Progresso</span>
            </TabsTrigger>
            <TabsTrigger value="config" className="flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm transition-all duration-200 data-[state=active]:scale-[1.02]">
              <Settings2 className="w-4 h-4 sm:w-5 sm:h-5" />
              <span>Materias</span>
            </TabsTrigger>
          </TabsList>

          {/* Tab: Ciclo */}
          <TabsContent value="cycle" className="mt-0 animate-tab-enter">
            <div className="space-y-4 lg:grid lg:grid-cols-2 lg:gap-6 lg:space-y-0">
              <div className="space-y-4">
                <CycleDashboard
                  subjects={subjects}
                  totalHoursAssigned={totalHoursAssigned}
                  totalHoursCompleted={totalHoursCompleted}
                  progressPercentage={progressPercentage}
                  onToggleHour={toggleHour}
                />
              </div>

              <div className="space-y-4">
                <CycleIntensitySlider
                  value={cycleData.totalCycleTime}
                  onChange={updateIntensity}
                />

                {/* Reset + Export actions */}
                <div className="flex items-center gap-3">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowResetConfirm(true)}
                    disabled={totalHoursCompleted === 0}
                    className="text-xs"
                  >
                    <RotateCcw className="w-3.5 h-3.5 mr-1.5" />
                    Resetar Ciclo
                  </Button>
                  <ExportButtons subjects={subjects} cycleData={cycleData} />
                </div>

                <PendingReviews
                  history={cycleData.history}
                  intervalDays={reviewSettings.intervalDays}
                  onIntervalChange={updateInterval}
                />
              </div>
            </div>
          </TabsContent>

          {/* Tab: Progresso */}
          <TabsContent value="stats" className="mt-0 animate-tab-enter">
            <div className="space-y-4 lg:grid lg:grid-cols-2 lg:gap-6 lg:space-y-0">
              <div className="space-y-4">
                <StreakBadge
                  currentStreak={cycleData.currentStreak}
                  longestStreak={cycleData.longestStreak}
                  todayBlocks={cycleData.todayBlocks}
                  dailyGoal={cycleData.dailyGoal}
                />

                <WeeklyGoalCard
                  history={cycleData.history}
                  weeklyGoalHours={cycleData.weeklyGoalHours}
                  blockDurationMinutes={60}
                />

                <StatsDashboard
                  history={cycleData.history}
                  totalMinutes={cycleData.totalMinutesStudied}
                  completedCycles={cycleData.completedCycles}
                  subjects={subjects}
                />
              </div>

              <div className="space-y-4">
                <CycleHistoryView cycleHistory={cycleData.cycleHistory} />

                <StudyHistory
                  history={cycleData.history}
                  onClearHistory={clearHistory}
                />
              </div>
            </div>
          </TabsContent>

          {/* Tab: Materias */}
          <TabsContent value="config" className="mt-0 animate-tab-enter">
            <SubjectManager
              subjects={subjects}
              onAdd={addSubject}
              onEdit={editSubject}
              onRemove={removeSubject}
              onReorder={reorderSubjects}
            />
          </TabsContent>
        </Tabs>
      </div>

      {/* Footer */}
      <footer className="fixed bottom-0 left-0 right-0 bg-card/80 backdrop-blur-lg border-t border-border z-10">
        <div className="w-full max-w-md sm:max-w-lg md:max-w-2xl lg:max-w-4xl xl:max-w-5xl mx-auto px-4 sm:px-6 py-3">
          <p className="text-center text-sm text-muted-foreground">
            {subjects.length > 0 ? (
              <>
                <span className="font-semibold text-foreground">{totalHoursCompleted}</span> de{' '}
                <span className="font-semibold text-foreground">{totalHoursAssigned}</span> horas
                {' '}&middot;{' '}
                <span className="text-primary font-medium">{progressPercentage}% concluido</span>
              </>
            ) : (
              'Adicione materias para comecar seu ciclo'
            )}
          </p>
        </div>
      </footer>

      {/* Reset confirmation dialog */}
      <ConfirmDialog
        isOpen={showResetConfirm}
        title="Resetar ciclo"
        message="O progresso atual sera salvo no historico de ciclos e todas as horas serao zeradas. As materias e a distribuicao serao mantidas."
        confirmText="Resetar"
        variant="warning"
        onConfirm={() => {
          resetCycle();
          setShowResetConfirm(false);
        }}
        onCancel={() => setShowResetConfirm(false)}
      />
    </div>
  );
};

export default Index;
