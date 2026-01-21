/**
 * Componente de gerenciamento de matérias personalizadas
 * Permite criar, editar e remover matérias com cálculo automático de prioridade
 */

import { useState } from 'react';
import { Plus, Trash2, GripVertical, BookOpen } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { useSubjects } from '@/hooks/useSubjects';
import { SubjectInput, SUBJECT_LIMITS } from '@/types/subject';
import { getPriorityColor, getPriorityLabel, calculateStats } from '@/lib/subjectCalculations';
import { ConfirmDialog } from '@/components/ConfirmDialog';

/** Input numérico com slider visual */
function NumericInput({
  value,
  onChange,
  label,
}: {
  value: number;
  onChange: (value: number) => void;
  label: string;
}) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = parseFloat(e.target.value);
    if (!isNaN(newValue)) {
      onChange(newValue);
    }
  };

  return (
    <div className="flex flex-col gap-1">
      <span className="text-xs text-muted-foreground">{label}</span>
      <div className="flex items-center gap-2">
        <input
          type="range"
          min={SUBJECT_LIMITS.MIN}
          max={SUBJECT_LIMITS.MAX}
          step={SUBJECT_LIMITS.STEP}
          value={value}
          onChange={handleChange}
          className="w-16 h-2 accent-primary"
        />
        <span className="text-sm font-medium w-8 text-center">{value}</span>
      </div>
    </div>
  );
}

/** Linha editável da tabela */
function SubjectRow({
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
  };
  onEdit: (id: string, updates: Partial<SubjectInput>) => void;
  onRemove: (id: string) => void;
}) {
  const [isRemoving, setIsRemoving] = useState(false);

  return (
    <>
      <TableRow className="group">
        <TableCell className="w-8">
          <GripVertical className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
        </TableCell>
        <TableCell>
          <Input
            value={subject.name}
            onChange={(e) => onEdit(subject.id, { name: e.target.value })}
            className="h-8 bg-transparent border-transparent hover:border-input focus:border-input transition-colors"
            placeholder="Nome da matéria"
          />
        </TableCell>
        <TableCell>
          <NumericInput
            value={subject.weight}
            onChange={(weight) => onEdit(subject.id, { weight })}
            label="Peso"
          />
        </TableCell>
        <TableCell>
          <NumericInput
            value={subject.difficulty}
            onChange={(difficulty) => onEdit(subject.id, { difficulty })}
            label="Dificuldade"
          />
        </TableCell>
        <TableCell>
          <NumericInput
            value={subject.contentAmount}
            onChange={(contentAmount) => onEdit(subject.id, { contentAmount })}
            label="Conteúdo"
          />
        </TableCell>
        <TableCell className="text-center">
          <div className="flex flex-col items-center gap-0.5">
            <span className={`text-lg font-bold ${getPriorityColor(subject.priority)}`}>
              {subject.priority}
            </span>
            <span className="text-xs text-muted-foreground">
              {getPriorityLabel(subject.priority)}
            </span>
          </div>
        </TableCell>
        <TableCell>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsRemoving(true)}
            className="h-8 w-8 text-muted-foreground hover:text-destructive"
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </TableCell>
      </TableRow>

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

/** Componente principal de gerenciamento */
export function SubjectManager() {
  const { subjects, isLoaded, addSubject, editSubject, removeSubject } = useSubjects();
  const stats = calculateStats(subjects);

  const handleAddSubject = () => {
    addSubject({
      name: `Matéria ${subjects.length + 1}`,
      weight: 1.5,
      difficulty: 1.5,
      contentAmount: 1.5,
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
            Prioridade média: <span className="font-medium">{stats.averagePriority}</span>
          </p>
        )}
      </CardHeader>

      <CardContent>
        {subjects.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <BookOpen className="w-12 h-12 mx-auto mb-3 opacity-50" />
            <p className="font-medium">Nenhuma matéria cadastrada</p>
            <p className="text-sm mt-1">
              Adicione matérias para calcular suas prioridades de estudo
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto -mx-6">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-8"></TableHead>
                  <TableHead className="min-w-[150px]">Matéria</TableHead>
                  <TableHead className="min-w-[100px]">Peso</TableHead>
                  <TableHead className="min-w-[100px]">Dificuldade</TableHead>
                  <TableHead className="min-w-[100px]">Conteúdo</TableHead>
                  <TableHead className="text-center min-w-[80px]">Prioridade</TableHead>
                  <TableHead className="w-12"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {subjects.map((subject) => (
                  <SubjectRow
                    key={subject.id}
                    subject={subject}
                    onEdit={editSubject}
                    onRemove={removeSubject}
                  />
                ))}
              </TableBody>
            </Table>
          </div>
        )}

        {subjects.length > 0 && stats.highestPriority && (
          <div className="mt-4 p-3 bg-muted/50 rounded-lg">
            <p className="text-sm">
              <span className="text-muted-foreground">Maior prioridade:</span>{' '}
              <span className="font-semibold">{stats.highestPriority.name}</span>
              <span className={`ml-2 font-bold ${getPriorityColor(stats.highestPriority.priority)}`}>
                ({stats.highestPriority.priority})
              </span>
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
