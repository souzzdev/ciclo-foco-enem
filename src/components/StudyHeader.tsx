import { BookOpen, Clock, RotateCw } from 'lucide-react';

interface StudyHeaderProps {
  completedCycles: number;
  totalMinutesStudied: number;
}

export function StudyHeader({ completedCycles, totalMinutesStudied }: StudyHeaderProps) {
  const hours = Math.floor(totalMinutesStudied / 60);
  const minutes = totalMinutesStudied % 60;
  
  const formatTime = () => {
    if (hours > 0) {
      return `${hours}h ${minutes}min`;
    }
    return `${minutes}min`;
  };

  return (
    <header className="bg-card rounded-2xl p-5 shadow-sm slide-up">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
          <BookOpen className="w-6 h-6 text-primary" />
        </div>
        <div>
          <h1 className="text-xl font-bold text-foreground">Ciclo de Estudos</h1>
          <p className="text-sm text-muted-foreground">ENEM + Ciência da Computação</p>
        </div>
      </div>
      
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-muted/50 rounded-xl p-3 flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
            <RotateCw className="w-5 h-5 text-primary" />
          </div>
          <div>
            <p className="text-2xl font-bold text-foreground">{completedCycles}</p>
            <p className="text-xs text-muted-foreground">Ciclos completos</p>
          </div>
        </div>
        
        <div className="bg-muted/50 rounded-xl p-3 flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-accent/20 flex items-center justify-center">
            <Clock className="w-5 h-5 text-accent" />
          </div>
          <div>
            <p className="text-2xl font-bold text-foreground">{formatTime()}</p>
            <p className="text-xs text-muted-foreground">Tempo total</p>
          </div>
        </div>
      </div>
    </header>
  );
}
