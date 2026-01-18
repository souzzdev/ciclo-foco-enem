import { useState, useEffect, useCallback, useRef } from 'react';
import { Play, Pause, RotateCcw, Volume2, VolumeX } from 'lucide-react';

interface PomodoroTimerProps {
  duration: number; // em minutos
  onComplete?: () => void;
}

export function PomodoroTimer({ duration, onComplete }: PomodoroTimerProps) {
  const totalSeconds = duration * 60;
  const [timeLeft, setTimeLeft] = useState(totalSeconds);
  const [isRunning, setIsRunning] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const progress = ((totalSeconds - timeLeft) / totalSeconds) * 100;

  const playAlarm = useCallback(() => {
    if (soundEnabled && audioRef.current) {
      audioRef.current.play().catch(() => {
        // Fallback para navegadores que bloqueiam autoplay
        console.log('Audio blocked by browser');
      });
    }
  }, [soundEnabled]);

  useEffect(() => {
    // Criar elemento de áudio para o alarme
    audioRef.current = new Audio('data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdH+Onp2WjoR9d3R5g42Xn5uWjoR8dXN2gIqUnJqVjYN7c3F0fYaQmZqWj4Z+d3R2f4mTm5qVjoR8dHJ0fYaPmJmVjoN7c3J1f4iRmZqVjoR7c3J1f4iRmJmVjoN7c3J1f4iRmJmVjoN7c3J1f4iRmJmVjoR7c3J1f4iRmJmVjoN7c3N1f4iRmJmVjoN7c3J1f4iRmJmVjoR7c3J1f4iRmJmVjoN7');
  }, []);

  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (isRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            setIsRunning(false);
            playAlarm();
            onComplete?.();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [isRunning, timeLeft, onComplete, playAlarm]);

  const toggleTimer = () => setIsRunning(!isRunning);

  const resetTimer = () => {
    setIsRunning(false);
    setTimeLeft(totalSeconds);
  };

  const formatTime = (value: number) => value.toString().padStart(2, '0');

  const isComplete = timeLeft === 0;
  const isAlmostDone = timeLeft <= 60 && timeLeft > 0;

  return (
    <div className="bg-gradient-to-br from-primary/5 to-primary/10 rounded-2xl p-4 border border-primary/20">
      <div className="flex items-center justify-between mb-3">
        <span className="text-sm font-medium text-primary">⏱️ Timer Pomodoro</span>
        <button
          onClick={() => setSoundEnabled(!soundEnabled)}
          className="p-2 rounded-lg hover:bg-primary/10 transition-colors"
          aria-label={soundEnabled ? 'Desativar som' : 'Ativar som'}
        >
          {soundEnabled ? (
            <Volume2 className="w-4 h-4 text-primary" />
          ) : (
            <VolumeX className="w-4 h-4 text-muted-foreground" />
          )}
        </button>
      </div>

      {/* Timer circular */}
      <div className="relative flex items-center justify-center mb-4">
        <svg className="w-32 h-32 -rotate-90" viewBox="0 0 100 100">
          {/* Background circle */}
          <circle
            cx="50"
            cy="50"
            r="45"
            fill="none"
            stroke="hsl(var(--muted))"
            strokeWidth="8"
          />
          {/* Progress circle */}
          <circle
            cx="50"
            cy="50"
            r="45"
            fill="none"
            stroke={isComplete ? 'hsl(var(--accent))' : isAlmostDone ? 'hsl(var(--destructive))' : 'hsl(var(--primary))'}
            strokeWidth="8"
            strokeLinecap="round"
            strokeDasharray={`${2 * Math.PI * 45}`}
            strokeDashoffset={`${2 * Math.PI * 45 * (1 - progress / 100)}`}
            className="transition-all duration-1000"
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className={`text-3xl font-bold tabular-nums ${isAlmostDone ? 'text-destructive animate-pulse' : 'text-foreground'}`}>
            {formatTime(minutes)}:{formatTime(seconds)}
          </span>
          <span className="text-xs text-muted-foreground mt-1">
            {isComplete ? '✨ Concluído!' : isRunning ? 'Estudando...' : 'Pausado'}
          </span>
        </div>
      </div>

      {/* Controles */}
      <div className="flex gap-2">
        <button
          onClick={toggleTimer}
          disabled={isComplete}
          className={`flex-1 py-3 px-4 rounded-xl font-medium flex items-center justify-center gap-2 transition-all duration-200 ${
            isComplete
              ? 'bg-muted text-muted-foreground cursor-not-allowed'
              : isRunning
              ? 'bg-accent/20 text-accent hover:bg-accent/30'
              : 'bg-primary text-primary-foreground hover:opacity-90'
          }`}
        >
          {isRunning ? (
            <>
              <Pause className="w-5 h-5" />
              Pausar
            </>
          ) : (
            <>
              <Play className="w-5 h-5" />
              {isComplete ? 'Concluído' : 'Iniciar'}
            </>
          )}
        </button>
        <button
          onClick={resetTimer}
          className="py-3 px-4 rounded-xl bg-muted text-muted-foreground hover:bg-muted/80 transition-colors"
          aria-label="Reiniciar timer"
        >
          <RotateCcw className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}
