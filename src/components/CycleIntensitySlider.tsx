import { CYCLE_LIMITS } from '@/types/subject';
import { Slider } from '@/components/ui/slider';
import { Gauge, Info } from 'lucide-react';

interface CycleIntensitySliderProps {
  value: number;
  onChange: (value: number) => void;
}

export function CycleIntensitySlider({ value, onChange }: CycleIntensitySliderProps) {
  const getIntensityLabel = (hours: number) => {
    if (hours <= 30) return 'Leve';
    if (hours <= 50) return 'Moderado';
    if (hours <= 70) return 'Intenso';
    return 'Muito Intenso';
  };

  const getIntensityColor = (hours: number) => {
    if (hours <= 30) return 'text-green-500';
    if (hours <= 50) return 'text-primary';
    if (hours <= 70) return 'text-orange-500';
    return 'text-red-500';
  };

  return (
    <div className="bg-card rounded-2xl p-5 shadow-sm slide-up">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
          <Gauge className="w-5 h-5 text-primary" />
        </div>
        <div className="flex-1">
          <h3 className="font-semibold text-foreground">Intensidade do Ciclo</h3>
          <p className="text-xs text-muted-foreground">
            <span className={`font-medium ${getIntensityColor(value)}`}>
              {getIntensityLabel(value)}
            </span>
            {' '} &middot; {value} horas totais
          </p>
        </div>
        <span className={`text-2xl font-bold tabular-nums ${getIntensityColor(value)}`}>
          {value}h
        </span>
      </div>

      <Slider
        value={[value]}
        onValueChange={([v]) => onChange(v)}
        min={CYCLE_LIMITS.MIN_HOURS}
        max={CYCLE_LIMITS.MAX_HOURS}
        step={5}
        className="mb-3"
      />

      <div className="flex justify-between text-xs text-muted-foreground mb-3">
        <span>{CYCLE_LIMITS.MIN_HOURS}h</span>
        <span>{CYCLE_LIMITS.MAX_HOURS}h</span>
      </div>

      <div className="flex items-start gap-2 p-3 bg-muted/50 rounded-xl">
        <Info className="w-4 h-4 text-muted-foreground shrink-0 mt-0.5" />
        <p className="text-xs text-muted-foreground leading-relaxed">
          Cada bloco representa 1 hora de estudo. A intensidade define o tamanho total do ciclo, nao a velocidade.
          As horas sao distribuidas automaticamente com base na prioridade de cada materia.
        </p>
      </div>
    </div>
  );
}
