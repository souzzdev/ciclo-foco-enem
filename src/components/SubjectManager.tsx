/**
 * Componente de gerenciamento de materias personalizadas
 * CRUD com cor, icone, dificuldade 1-5, conteudo 1-5, peso decimal
 * Drag & drop para reordenar, seletor de icone Lucide
 */

import { useState, useRef, useCallback } from 'react';
import { Plus, Trash2, GripVertical, BookOpen, Pencil, Check } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Subject, SubjectInput, SUBJECT_LIMITS, WEIGHT_LIMITS, SUBJECT_COLORS, SUBJECT_ICONS } from '@/types/subject';
import { getPriorityColor, getPriorityLabel } from '@/lib/subjectCalculations';
import { ConfirmDialog } from '@/components/ConfirmDialog';
import { DynamicIcon } from '@/components/DynamicIcon';

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

function IconSelect({
  value,
  onChange,
  color,
}: {
  value: string;
  onChange: (icon: string) => void;
  color: string;
}) {
  return (
    <div className="flex flex-wrap gap-1.5">
      {SUBJECT_ICONS.map(iconName => (
        <button
          key={iconName}
          onClick={() => onChange(iconName)}
          className="w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-150 border-2"
          style={{
            backgroundColor: value === iconName ? `${color}20` : 'transparent',
            borderColor: value === iconName ? color : 'hsl(var(--border))',
          }}
          aria-label={`Icone ${iconName}`}
        >
          <DynamicIcon
            name={iconName}
            className="w-4 h-4"
            style={{ color: value === iconName ? color : 'hsl(var(--muted-foreground))' }}
          />
        </button>
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
  onDragStart,
  onDragOver,
  onDragEnd,
  onDrop,
  isDragging,
  isDragOver,
}: {
  subject: Subject;
  index: number;
  total: number;
  onEdit: (id: string, updates: Partial<SubjectInput>) => void;
  onRemove: (id: string) => void;
  onDragStart: (index: number) => void;
  onDragOver: (e: React.DragEvent, index: number) => void;
  onDragEnd: () => void;
  onDrop: (e: React.DragEvent, index: number) => void;
  isDragging: boolean;
  isDragOver: boolean;
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [isRemoving, setIsRemoving] = useState(false);

  return (
    <>
      <div
        className={`p-3 bg-muted/30 rounded-xl space-y-3 transition-all duration-200 ${
          isDragging ? 'dragging' : ''
        } ${isDragOver ? 'drag-over' : ''}`}
        draggable
        onDragStart={() => onDragStart(index)}
        onDragOver={(e) => onDragOver(e, index)}
        onDragEnd={onDragEnd}
        onDrop={(e) => onDrop(e, index)}
      >
        {/* Top row: drag handle + icon + name + actions */}
        <div className="flex items-center gap-2">
          <div className="drag-handle shrink-0 p-1 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted transition-colors">
            <GripVertical className="w-4 h-4" />
          </div>
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
            style={{ backgroundColor: `${subject.color}20` }}
          >
            <DynamicIcon
              name={subject.icon}
              className="w-4 h-4"
              style={{ color: subject.color }}
            />
          </div>
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
              <span className="text-xs text-muted-foreground">Icone</span>
              <IconSelect
                value={subject.icon}
                onChange={icon => onEdit(subject.id, { icon })}
                color={subject.color}
              />
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
  const [dragIndex, setDragIndex] = useState<number | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);

  const handleDragStart = useCallback((index: number) => {
    setDragIndex(index);
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent, index: number) => {
    e.preventDefault();
    setDragOverIndex(index);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent, toIndex: number) => {
    e.preventDefault();
    if (dragIndex !== null && dragIndex !== toIndex) {
      onReorder(dragIndex, toIndex);
    }
    setDragIndex(null);
    setDragOverIndex(null);
  }, [dragIndex, onReorder]);

  const handleDragEnd = useCallback(() => {
    setDragIndex(null);
    setDragOverIndex(null);
  }, []);

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
            {subjects.length > 1 && (
              <span className="ml-1 text-xs opacity-70">&middot; Arraste para reordenar</span>
            )}
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
                onDragStart={handleDragStart}
                onDragOver={handleDragOver}
                onDragEnd={handleDragEnd}
                onDrop={handleDrop}
                isDragging={dragIndex === index}
                isDragOver={dragOverIndex === index && dragIndex !== index}
              />
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
