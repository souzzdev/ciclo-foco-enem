/**
 * Componente de gerenciamento de matérias personalizadas
 * Permite criar, editar e remover matérias com cor e ícone personalizados
 */

import { useState } from 'react';
import { Plus, Trash2, BookOpen, ChevronDown, ChevronUp } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Slider } from '@/components/ui/slider';
import { useSubjects } from '@/hooks/useSubjects';
import { SubjectInput, SUBJECT_COLORS, SUBJECT_ICONS } from '@/types/subject';
import { getPriorityColor, getPriorityLabel, calculateStats } from '@/lib/subjectCalculations';
import { ConfirmDialog } from '@/components/ConfirmDialog';
import {
  Calculator, FlaskConical, Globe, PenTool, Brain, Atom,
  Landmark, Languages, Microscope, Music, Palette, Code, Heart, Scale,
} from 'lucide-react';

const ICON_COMPONENTS: Record<string, React.ComponentType<{ className?: string }>> = {
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

function SubjectCard({
  subject,
  onEdit,
  onRemove,
}: {
  subject: {
    id: string;
    name: string;
    weight: number;
    difficulty: number;
    contentAmount: number;
    priority: number;
    color: string;
    icon: string;
    hours: number;
  };
  onEdit: (id: string, updates: Partial<SubjectInput>) => void;
  onRemove: (id: string) => void;
}) {
  const [isRemoving, setIsRemoving] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const IconComp = ICON_COMPONENTS[subject.icon] || BookOpen;

  return (
    <>
      <Card className="overflow-hidden">
        <div className="h-1" style={{ backgroundColor: subject.color }} />
        <CardContent className="pt-3 pb-3">
          {/* Header */}
          <div className="flex items-center gap-3 mb-2">
            <div
              className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0"
              style={{ backgroundColor: `${subject.color}20` }}
            >
              <IconComp className="w-4.5 h-4.5" style={{ color: subject.color }} />
            </div>
            <div className="flex-1 min-w-0">
              <Input
                value={subject.name}
                onChange={(e) => onEdit(subject.id, { name: e.target.value })}
                className="h-8 bg-transparent border-transparent hover:border-input focus:border-input transition-colors text-sm font-semibold px-1"
                placeholder="Nome da matéria"
              />
            </div>
            <div className="flex items-center gap-1">
              <span className={`text-sm font-bold ${getPriorityColor(subject.priority)}`}>
                {subject.priority}
              </span>
              <span className="text-xs text-muted-foreground">pts</span>
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7"
              onClick={() => setIsExpanded(!isExpanded)}
            >
              {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </Button>
          </div>

          {/* Quick info */}
          <div className="flex items-center gap-3 text-xs text-muted-foreground px-1">
            <span>Dif: {subject.difficulty}</span>
            <span>·</span>
            <span>Conteúdo: {subject.contentAmount}</span>
            <span>·</span>
            <span>Peso: {subject.weight}</span>
            <span>·</span>
            <span className="font-medium text-foreground">{subject.hours}h no ciclo</span>
          </div>

          {/* Expanded edit */}
          {isExpanded && (
            <div className="mt-4 space-y-4 animate-fade-in">
              {/* Dificuldade */}
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-muted-foreground">Dificuldade</span>
                  <span className="font-semibold">{subject.difficulty}/5</span>
                </div>
                <Slider
                  value={[subject.difficulty]}
                  onValueChange={([v]) => onEdit(subject.id, { difficulty: v })}
                  min={1} max={5} step={1}
                />
              </div>

              {/* Conteúdo */}
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-muted-foreground">Quantidade de Conteúdo</span>
                  <span className="font-semibold">{subject.contentAmount}/5</span>
                </div>
                <Slider
                  value={[subject.contentAmount]}
                  onValueChange={([v]) => onEdit(subject.id, { contentAmount: v })}
                  min={1} max={5} step={1}
                />
              </div>

              {/* Peso */}
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-muted-foreground">Peso</span>
                  <span className="font-semibold">{subject.weight}</span>
                </div>
                <Slider
                  value={[subject.weight]}
                  onValueChange={([v]) => onEdit(subject.id, { weight: v })}
                  min={0.5} max={3} step={0.5}
                />
              </div>

              {/* Cor */}
              <div>
                <span className="text-xs text-muted-foreground block mb-2">Cor</span>
                <div className="flex flex-wrap gap-2">
                  {SUBJECT_COLORS.map((color) => (
                    <button
                      key={color}
                      onClick={() => onEdit(subject.id, { color })}
                      className={`w-7 h-7 rounded-full transition-all ${
                        subject.color === color ? 'ring-2 ring-offset-2 ring-offset-background scale-110' : 'hover:scale-110'
                      }`}
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </div>
              </div>

              {/* Ícone */}
              <div>
                <span className="text-xs text-muted-foreground block mb-2">Ícone</span>
                <div className="flex flex-wrap gap-2">
                  {SUBJECT_ICONS.map((iconName) => {
                    const IC = ICON_COMPONENTS[iconName] || BookOpen;
                    return (
                      <button
                        key={iconName}
                        onClick={() => onEdit(subject.id, { icon: iconName })}
                        className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all ${
                          subject.icon === iconName
                            ? 'bg-primary/20 text-primary ring-1 ring-primary'
                            : 'bg-muted text-muted-foreground hover:bg-muted/80'
                        }`}
                      >
                        <IC className="w-4 h-4" />
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Prioridade e remover */}
              <div className="flex items-center justify-between pt-2 border-t border-border">
                <div>
                  <span className="text-xs text-muted-foreground">Prioridade: </span>
                  <span className={`font-bold ${getPriorityColor(subject.priority)}`}>
                    {getPriorityLabel(subject.priority)}
                  </span>
                </div>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => setIsRemoving(true)}
                >
                  <Trash2 className="w-3.5 h-3.5 mr-1" />
                  Remover
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <ConfirmDialog
        isOpen={isRemoving}
        title="Remover matéria"
        message={`Deseja realmente remover "${subject.name}"?`}
        confirmText="Remover"
        variant="warning"
        onConfirm={() => {
          onRemove(subject.id);
          setIsRemoving(false);
        }}
        onCancel={() => setIsRemoving(false)}
      />
    </>
  );
}

export function SubjectManager() {
  const { subjects, isLoaded, addSubject, editSubject, removeSubject } = useSubjects();
  const stats = calculateStats(subjects);

  const handleAddSubject = () => {
    addSubject({
      name: `Matéria ${subjects.length + 1}`,
      weight: 1.5,
      difficulty: 3,
      contentAmount: 3,
    });
  };

  if (!isLoaded) {
    return (
      <Card>
        <CardContent className="py-8">
          <p className="text-center text-muted-foreground">Carregando...</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-primary" />
              <CardTitle className="text-lg">Minhas Matérias</CardTitle>
            </div>
            <Button size="sm" onClick={handleAddSubject}>
              <Plus className="w-4 h-4 mr-1" />
              Adicionar
            </Button>
          </div>
          {subjects.length > 0 && (
            <p className="text-sm text-muted-foreground mt-1">
              {stats.totalSubjects} matéria{stats.totalSubjects !== 1 ? 's' : ''} · 
              Total: {stats.totalHours}h · 
              Prioridade média: <span className="font-medium">{stats.averagePriority}</span>
            </p>
          )}
        </CardHeader>
      </Card>

      {subjects.length === 0 ? (
        <Card>
          <CardContent className="text-center py-8">
            <BookOpen className="w-12 h-12 mx-auto mb-3 text-muted-foreground/30" />
            <p className="font-medium text-foreground">Nenhuma matéria cadastrada</p>
            <p className="text-sm text-muted-foreground mt-1">
              Adicione matérias para calcular suas prioridades e gerar o ciclo
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {subjects.map((subject) => (
            <SubjectCard
              key={subject.id}
              subject={subject}
              onEdit={editSubject}
              onRemove={removeSubject}
            />
          ))}
        </div>
      )}

      {subjects.length > 0 && stats.highestPriority && (
        <Card>
          <CardContent className="py-3">
            <p className="text-sm text-center">
              <span className="text-muted-foreground">🏆 Maior prioridade:</span>{' '}
              <span className="font-semibold">{stats.highestPriority.name}</span>
              <span className={`ml-2 font-bold ${getPriorityColor(stats.highestPriority.priority)}`}>
                ({stats.highestPriority.priority} pts)
              </span>
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
