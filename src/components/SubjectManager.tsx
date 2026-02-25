/**
 * Componente de gerenciamento de materias personalizadas
 * CRUD com cor, icone, dificuldade 1-5, conteudo 1-5, peso decimal
 */

import { useState } from 'react';
import { Plus, Trash2, ChevronUp, ChevronDown, BookOpen, Pencil, Check, X } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Subject, SubjectInput, SUBJECT_LIMITS, WEIGHT_LIMITS, SUBJECT_COLORS } from '@/types/subject';
import { getPriorityColor, getPriorityLabel } from '@/lib/subjectCalculations';
import { ConfirmDialog } from '@/components/ConfirmDialog';

interface SubjectManagerProps {
  subjects: Subject[];
  onAdd: (input: SubjectInput) => void;
  onEdit: (id: string, updates: Partial<SubjectInput>) => void;
  onRemove: (id: string) => void;
  onReorder: (fromIndex: number, toIndex: number) => void;
}

function RatingInput({
  value,
  onChange,
  label,
  max = SUBJECT_LIMITS.MAX,
}: {
  value: number;
  onChange: (value: number) => void;
  label: string;
  max?: number;
}) {
  return (
    <div className="space-y-1">
      <span className="text-xs text-muted-foreground">{label}</span>
      <div className="flex gap-1">
        {Array.from({ length: max }).map((_, i) => (
          <button
            key={i}
            onClick={() => onChange(i + 1)}
            className="w-6 h-6 rounded-md text-xs font-bold transition-all duration-150"
            style={{
              backgroundColor: i < value ? 'hsl(var(--primary))' : 'hsl(var(--muted))',
              color: i < value ? 'hsl(var(--primary-foreground))' : 'hsl(var(--muted-foreground))',
            }}
          >
            {i + 1}
          </button>
        ))}
      </div>
    </div>
  );
}

function ColorSelect({
  value,
  onChange,
}: {
  value: string;
  onChange: (color: string) => void;
}) {
  return (
    <div className="flex flex-wrap gap-1.5">
      {SUBJECT_COLORS.map(color => (
        <button
          key={color}
          onClick={() => onChange(color)}
          className="w-6 h-6 rounded-full transition-all duration-150 border-2"
          style={{
            backgroundColor: color,
            borderColor: value === color ? 'hsl(var(--foreground))' : 'transparent',
            transform: value === color ? 'scale(1.2)' : 'scale(1)',
          }}
          aria-label={`Cor ${color}`}
        />
      ))}
    </div>
  );
}

function SubjectRow({
  subject,
  index,
  total,
  onEdit,
  onRemove,
  onMoveUp,
  onMoveDown,
}: {
  subject: Subject;
  index: number;
  total: number;
  onEdit: (id: string, updates: Partial<SubjectInput>) => void;
  onRemove: (id: string) => void;
  onMoveUp: () => void;
  onMoveDown: () => void;
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [isRemoving, setIsRemoving] = useState(false);

  return (
    <>
      <div className="p-3 bg-muted/30 rounded-xl space-y-3 transition-all duration-200">
        {/* Top row: color indicator + name + actions */}
        <div className="flex items-center gap-3">
          <div
            className="w-3 h-10 rounded-full shrink-0"
            style={{ backgroundColor: subject.color }}
          />
          <div className="flex-1 min-w-0">
            {isEditing ? (
              <Input
                value={subject.name}
                onChange={e => onEdit(subject.id, { name: e.target.value })}
                className="h-8 text-sm"
                autoFocus
              />
            ) : (
              <div>
                <p className="font-semibold text-foreground text-sm truncate">{subject.name}</p>
                <p className="text-xs text-muted-foreground">
                  {subject.hours}h no ciclo &middot;{' '}
                  <span className={getPriorityColor(subject.priority)}>
                    {getPriorityLabel(subject.priority)} ({subject.priority})
                  </span>
                </p>
              </div>
            )}
          </div>

          <div className="flex items-center gap-1 shrink-0">
            <Button variant="ghost" size="icon" className="h-7 w-7" onClick={onMoveUp} disabled={index === 0}>
              <ChevronUp className="w-4 h-4" />
            </Button>
            <Button variant="ghost" size="icon" className="h-7 w-7" onClick={onMoveDown} disabled={index === total - 1}>
              <ChevronDown className="w-4 h-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7"
              onClick={() => setIsEditing(!isEditing)}
            >
              {isEditing ? <Check className="w-4 h-4 text-primary" /> : <Pencil className="w-4 h-4" />}
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7 text-muted-foreground hover:text-destructive"
              onClick={() => setIsRemoving(true)}
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Editing panel */}
        {isEditing && (
          <div className="space-y-3 pt-2 border-t border-border/50 fade-in">
            <div className="grid grid-cols-2 gap-3">
              <RatingInput
                value={subject.difficulty}
                onChange={v => onEdit(subject.id, { difficulty: v })}
                label="Dificuldade"
              />
              <RatingInput
                value={subject.contentAmount}
                onChange={v => onEdit(subject.id, { contentAmount: v })}
                label="Conteudo"
              />
            </div>

            <div className="space-y-1">
              <span className="text-xs text-muted-foreground">Peso ({WEIGHT_LIMITS.MIN} - {WEIGHT_LIMITS.MAX})</span>
              <div className="flex items-center gap-2">
                <input
                  type="range"
                  min={WEIGHT_LIMITS.MIN}
                  max={WEIGHT_LIMITS.MAX}
                  step={WEIGHT_LIMITS.STEP}
                  value={subject.weight}
                  onChange={e => onEdit(subject.id, { weight: parseFloat(e.target.value) })}
                  className="flex-1 h-2 accent-primary"
                />
                <span className="text-sm font-medium w-8 text-center text-foreground">{subject.weight}</span>
              </div>
            </div>

            <div className="space-y-1">
              <span className="text-xs text-muted-foreground">Cor</span>
              <ColorSelect
                value={subject.color}
                onChange={color => onEdit(subject.id, { color })}
              />
            </div>
          </div>
        )}
      </div>

      <ConfirmDialog
        isOpen={isRemoving}
        title="Remover materia"
        message={`Deseja realmente remover "${subject.name}"? O progresso sera perdido.`}
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

export function SubjectManager({ subjects, onAdd, onEdit, onRemove, onReorder }: SubjectManagerProps) {
  const handleAddSubject = () => {
    onAdd({
      name: `Materia ${subjects.length + 1}`,
      weight: 1.5,
      difficulty: 3,
      contentAmount: 3,
    });
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-primary" />
            <CardTitle className="text-lg">Minhas Materias</CardTitle>
          </div>
          <Button size="sm" onClick={handleAddSubject}>
            <Plus className="w-4 h-4 mr-1" />
            Adicionar
          </Button>
        </div>
        {subjects.length > 0 && (
          <p className="text-sm text-muted-foreground mt-1">
            {subjects.length} materia{subjects.length !== 1 ? 's' : ''} &middot;{' '}
            {subjects.reduce((sum, s) => sum + s.hours, 0)}h no ciclo
          </p>
        )}
      </CardHeader>

      <CardContent>
        {subjects.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <BookOpen className="w-12 h-12 mx-auto mb-3 opacity-50" />
            <p className="font-medium">Nenhuma materia cadastrada</p>
            <p className="text-sm mt-1">
              Adicione materias para calcular suas prioridades e gerar o ciclo de estudos
            </p>
          </div>
        ) : (
          <div className="space-y-2">
            {subjects.map((subject, index) => (
              <SubjectRow
                key={subject.id}
                subject={subject}
                index={index}
                total={subjects.length}
                onEdit={onEdit}
                onRemove={onRemove}
                onMoveUp={() => onReorder(index, index - 1)}
                onMoveDown={() => onReorder(index, index + 1)}
              />
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
