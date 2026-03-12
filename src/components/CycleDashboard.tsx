/**
 * Dashboard do Ciclo de Estudos
 * Mostra progresso total e cards por matéria com blocos clicáveis
 */

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Slider } from '@/components/ui/slider';
import { useSubjects } from '@/hooks/useSubjects';
import { calculateStats } from '@/lib/subjectCalculations';
import { CYCLE_LIMITS } from '@/types/subject';
import { ConfirmDialog } from '@/components/ConfirmDialog';
import {
  RotateCcw, TrendingUp, Clock, Target, CheckCircle2,
  Calculator, BookOpen, FlaskConical, Globe, PenTool,
  Brain, Atom, Landmark, Languages, Microscope,
  Music, Palette, Code, Heart, Scale,
} from 'lucide-react';

const ICON_MAP: Record<string, React.ComponentType<{ className?: string }>> = {
  'calculator': Calculator,
  'book-open': BookOpen,
  'flask-conical': FlaskConical,
  'globe': Globe,
  'pen-tool': PenTool,
  'brain': Brain,
  'atom': Atom,
  'landmark': Landmark,
  'languages': Languages,
  'microscope': Microscope,
  'music': Music,
  'palette': Palette,
  'code': Code,
  'heart': Heart,
  'scale': Scale,
};

function SubjectIcon({ icon, className }: { icon: string; className?: string }) {
  const IconComponent = ICON_MAP[icon] || BookOpen;
  return <IconComponent className={className} />;
}

export function CycleDashboard() {
  const {
    subjects,
    isLoaded,
    totalCycleHours,
    toggleHourBlock,
    setTotalHours,
    resetCycleProgress,
  } = useSubjects();

  const [isResetOpen, setIsResetOpen] = useState(false);
  const stats = calculateStats(subjects);

  if (!isLoaded) {
    return (
      <Card>
        <CardContent className="py-8">
          <p className="text-center text-muted-foreground">Carregando...</p>
        </CardContent>
      </Card>
    );
  }

  if (subjects.length === 0) {
    return (
      <Card>
        <CardContent className="py-12 text-center">
          <Target className="w-16 h-16 mx-auto mb-4 text-muted-foreground/30" />
          <h3 className="text-lg font-semibold text-foreground mb-2">Nenhum ciclo ativo</h3>
          <p className="text-sm text-muted-foreground">
            Cadastre matérias na aba "Matérias" para gerar seu ciclo de estudos
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {/* Intensidade do Ciclo */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-primary" />
              <CardTitle className="text-lg">Intensidade do Ciclo</CardTitle>
            </div>
            <span className="text-2xl font-bold text-primary">{totalCycleHours}h</span>
          </div>
        </CardHeader>
        <CardContent>
          <Slider
            value={[totalCycleHours]}
            onValueChange={([v]) => setTotalHours(v)}
            min={CYCLE_LIMITS.MIN_HOURS}
            max={CYCLE_LIMITS.MAX_HOURS}
            step={5}
            className="mb-3"
          />
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>{CYCLE_LIMITS.MIN_HOURS}h</span>
            <span>{CYCLE_LIMITS.MAX_HOURS}h</span>
          </div>
          <p className="text-xs text-muted-foreground mt-2 text-center">
            Cada bloco representa <span className="font-semibold text-foreground">1 hora</span> de estudo. 
            A intensidade representa o tamanho total do ciclo.
          </p>
        </CardContent>
      </Card>

      {/* Progresso Total */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-primary" />
              <CardTitle className="text-lg">Progresso Total</CardTitle>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsResetOpen(true)}
              className="text-xs"
            >
              <RotateCcw className="w-3.5 h-3.5 mr-1" />
              Resetar
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-end justify-between mb-2">
            <span className="text-3xl font-bold text-foreground">
              {stats.completionPercentage}%
            </span>
            <span className="text-sm text-muted-foreground">
              {stats.completedHours}h / {stats.totalHours}h
            </span>
          </div>
          <Progress value={stats.completionPercentage} className="h-3" />
        </CardContent>
      </Card>

      {/* Cards por matéria */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {subjects.map((subject) => {
          const pct = subject.hours > 0
            ? Math.round((subject.completedHours / subject.hours) * 100)
            : 0;

          return (
            <Card key={subject.id} className="overflow-hidden">
              <div className="h-1.5" style={{ backgroundColor: subject.color }} />
              <CardContent className="pt-4 pb-4">
                <div className="flex items-center gap-3 mb-3">
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                    style={{ backgroundColor: `${subject.color}20` }}
                  >
                    <SubjectIcon icon={subject.icon} className="w-5 h-5" style-color={subject.color} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-semibold text-foreground truncate">{subject.name}</h4>
                    <p className="text-xs text-muted-foreground">
                      {subject.completedHours}h / {subject.hours}h · {pct}%
                    </p>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-muted-foreground" />
                    <span className="text-sm font-bold text-foreground">{subject.hours}h</span>
                  </div>
                </div>

                <Progress value={pct} className="h-2 mb-3" />

                {/* Blocos clicáveis */}
                <div className="flex flex-wrap gap-1.5">
                  {Array.from({ length: subject.hours }).map((_, i) => {
                    const isCompleted = i < subject.completedHours;
                    return (
                      <button
                        key={i}
                        onClick={() => toggleHourBlock(subject.id, i)}
                        className={`w-7 h-7 rounded-md text-xs font-medium transition-all duration-200 hover:scale-110 active:scale-95 ${
                          isCompleted
                            ? 'text-white shadow-sm'
                            : 'bg-muted/80 text-muted-foreground hover:bg-muted border border-border/50'
                        }`}
                        style={isCompleted ? { backgroundColor: subject.color } : undefined}
                        title={`Hora ${i + 1} - ${isCompleted ? 'Concluída' : 'Pendente'}`}
                      >
                        {i + 1}
                      </button>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <ConfirmDialog
        isOpen={isResetOpen}
        title="Resetar Ciclo"
        message="Isso vai zerar todo o progresso, mas manter as matérias e distribuição de horas. Deseja continuar?"
        confirmText="Resetar"
        variant="warning"
        onConfirm={() => {
          resetCycleProgress();
          setIsResetOpen(false);
        }}
        onCancel={() => setIsResetOpen(false)}
      />
    </div>
  );
}
