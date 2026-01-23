import { useState, useEffect } from 'react';
import { BookOpen, Clock, RotateCw, Sparkles } from 'lucide-react';
import { ThemeToggle } from './ThemeToggle';

const MOTIVATIONAL_MESSAGES = [
  "Cada minuto de estudo te aproxima do seu objetivo! 🎯",
  "Consistência é a chave do sucesso! 💪",
  "Você está construindo seu futuro agora! 🚀",
  "Pequenos passos, grandes conquistas! ⭐",
  "O conhecimento é o único tesouro que ninguém pode tirar de você! 📚",
  "Acredite no seu potencial! ✨",
  "Hoje é o dia perfeito para aprender algo novo! 🌟",
  "Sua dedicação vai valer a pena! 🏆",
  "Continue firme, você está no caminho certo! 🛤️",
  "Cada ciclo completado é uma vitória! 🎉",
];

interface StudyHeaderProps {
  completedCycles: number;
  totalMinutesStudied: number;
}

export function StudyHeader({ completedCycles, totalMinutesStudied }: StudyHeaderProps) {
  const [messageIndex, setMessageIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setIsAnimating(true);
      setTimeout(() => {
        setMessageIndex((prev) => (prev + 1) % MOTIVATIONAL_MESSAGES.length);
        setIsAnimating(false);
      }, 300);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

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
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3 flex-1 min-w-0">
          <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
            <BookOpen className="w-6 h-6 text-primary" />
          </div>
          <div className="min-w-0 flex-1">
            <h1 className="text-xl font-bold text-foreground">Ciclo de Estudos</h1>
            <div className="flex items-center gap-1.5 overflow-hidden">
              <Sparkles className="w-3 h-3 text-primary shrink-0" />
              <p 
                className={`text-sm text-muted-foreground truncate transition-all duration-300 ${
                  isAnimating ? 'opacity-0 translate-y-2' : 'opacity-100 translate-y-0'
                }`}
              >
                {MOTIVATIONAL_MESSAGES[messageIndex]}
              </p>
            </div>
          </div>
        </div>
        <ThemeToggle />
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
