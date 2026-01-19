import { useState } from 'react';
import { StudyBlock, SubjectType } from '@/types/study';
import { Play, Check, Edit3, Clock, SkipForward } from 'lucide-react';
import { PomodoroTimer } from './PomodoroTimer';
import { ConfirmDialog } from './ConfirmDialog';

interface CurrentStudyCardProps {
  block: StudyBlock;
  onComplete: (content: string) => void;
  onSkip: () => void;
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

export function CurrentStudyCard({ block, onComplete, onSkip }: CurrentStudyCardProps) {
  const [content, setContent] = useState(block.content);
  const [isEditing, setIsEditing] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [showSkipConfirm, setShowSkipConfirm] = useState(false);

  const handleComplete = () => {
    if (!content.trim()) {
      setIsEditing(true);
      return;
    }
    setShowConfirm(true);
  };

  const confirmComplete = () => {
    onComplete(content);
    setContent('');
    setIsEditing(false);
    setShowConfirm(false);
  };

  const confirmSkip = () => {
    onSkip();
    setContent('');
    setShowSkipConfirm(false);
  };

  return (
    <>
      <div className={`study-card study-card-active ${subjectBadgeStyles[block.subjectType]} slide-up`}>
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="relative">
              <span className="text-3xl">{subjectIcons[block.subjectType]}</span>
              <span className="pulse-dot -top-1 -right-1"></span>
            </div>
            <div>
              <span className="subject-badge mb-1">{block.subject}</span>
              <p className="text-sm text-muted-foreground mt-1">Bloco {block.id} de 5</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowSkipConfirm(true)}
              className="p-2 rounded-lg text-muted-foreground hover:text-orange-500 hover:bg-orange-500/10 transition-colors"
              title="Pular bloco"
            >
              <SkipForward className="w-5 h-5" />
            </button>
            <div className="flex items-center gap-1 text-muted-foreground">
              <Clock className="w-4 h-4" />
              <span className="text-sm font-medium">{block.duration}min</span>
            </div>
          </div>
        </div>

        {/* Timer Pomodoro */}
        <div className="mb-4">
          <PomodoroTimer duration={block.duration} />
        </div>

        <div className="bg-primary/5 rounded-xl p-4 mb-4 border border-primary/10">
          <div className="flex items-center gap-2 mb-2">
            <Play className="w-4 h-4 text-primary" />
            <span className="text-sm font-semibold text-primary">Estudar agora</span>
          </div>
          <p className="text-sm text-muted-foreground">
            Registre o conteúdo que você vai estudar neste bloco
          </p>
        </div>

        {isEditing ? (
          <div className="space-y-3 fade-in">
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Ex: Funções do 1º grau, inequações..."
              className="input-study min-h-[100px] resize-none"
              autoFocus
            />
            <div className="flex gap-2">
              <button
                onClick={() => setIsEditing(false)}
                className="flex-1 py-3 px-4 rounded-xl font-medium bg-muted text-muted-foreground hover:bg-muted/80 transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={handleComplete}
                className="flex-1 py-3 px-4 rounded-xl font-medium bg-primary text-primary-foreground flex items-center justify-center gap-2 hover:opacity-90 transition-opacity"
              >
                <Check className="w-5 h-5" />
                Concluir
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            {content ? (
              <div className="bg-muted/50 rounded-xl p-3 border border-border/50">
                <p className="text-sm text-foreground">{content}</p>
              </div>
            ) : null}
            
            <div className="flex gap-2">
              <button
                onClick={() => setIsEditing(true)}
                className="flex-1 btn-complete flex items-center justify-center gap-2"
              >
                <Edit3 className="w-5 h-5" />
                {content ? 'Editar' : 'Adicionar conteúdo'}
              </button>
              <button
                onClick={handleComplete}
                className="flex-1 btn-study flex items-center justify-center gap-2"
              >
                <Check className="w-5 h-5" />
                Concluir
              </button>
            </div>
          </div>
        )}
      </div>

      <ConfirmDialog
        isOpen={showConfirm}
        title="Concluir bloco?"
        message={`Você está prestes a concluir o bloco de ${block.subject}. Isso avançará o ciclo para o próximo bloco.`}
        confirmText="Concluir"
        cancelText="Voltar"
        onConfirm={confirmComplete}
        onCancel={() => setShowConfirm(false)}
      />

      <ConfirmDialog
        isOpen={showSkipConfirm}
        title="Pular bloco?"
        message={`Você está prestes a pular o bloco de ${block.subject}. Isso será registrado no histórico.`}
        confirmText="Pular"
        cancelText="Voltar"
        onConfirm={confirmSkip}
        onCancel={() => setShowSkipConfirm(false)}
      />
    </>
  );
}
