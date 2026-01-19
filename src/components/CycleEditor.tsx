import { useState } from 'react';
import { StudyBlock, SubjectType } from '@/types/study';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Settings, Plus, Trash2, GripVertical, Save, X } from 'lucide-react';

interface CycleEditorProps {
  blocks: StudyBlock[];
  onSave: (blocks: StudyBlock[]) => void;
}

const subjectTypes: { value: SubjectType; label: string; color: string }[] = [
  { value: 'math', label: 'Matemática', color: 'bg-[hsl(var(--math))]' },
  { value: 'nature', label: 'Ciências da Natureza', color: 'bg-[hsl(var(--nature))]' },
  { value: 'portuguese', label: 'Português', color: 'bg-[hsl(var(--portuguese))]' },
  { value: 'human', label: 'Ciências Humanas', color: 'bg-[hsl(var(--human))]' },
];

const durations = [15, 20, 25, 30, 45, 60];

export function CycleEditor({ blocks, onSave }: CycleEditorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [editableBlocks, setEditableBlocks] = useState<StudyBlock[]>([]);

  const handleOpen = () => {
    setEditableBlocks([...blocks]);
    setIsOpen(true);
  };

  const handleClose = () => {
    setIsOpen(false);
    setEditableBlocks([]);
  };

  const handleAddBlock = () => {
    const newBlock: StudyBlock = {
      id: Date.now(),
      subject: 'Nova Matéria',
      subjectType: 'math',
      content: '',
      duration: 30,
    };
    setEditableBlocks([...editableBlocks, newBlock]);
  };

  const handleRemoveBlock = (id: number) => {
    if (editableBlocks.length <= 1) return;
    setEditableBlocks(editableBlocks.filter(b => b.id !== id));
  };

  const handleUpdateBlock = (id: number, updates: Partial<StudyBlock>) => {
    setEditableBlocks(editableBlocks.map(b => 
      b.id === id ? { ...b, ...updates } : b
    ));
  };

  const handleSubjectTypeChange = (id: number, type: SubjectType) => {
    const typeInfo = subjectTypes.find(t => t.value === type);
    handleUpdateBlock(id, { 
      subjectType: type,
      subject: typeInfo?.label || 'Matéria'
    });
  };

  const handleSave = () => {
    onSave(editableBlocks);
    setIsOpen(false);
  };

  const moveBlock = (index: number, direction: 'up' | 'down') => {
    if (
      (direction === 'up' && index === 0) || 
      (direction === 'down' && index === editableBlocks.length - 1)
    ) return;
    
    const newBlocks = [...editableBlocks];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    [newBlocks[index], newBlocks[targetIndex]] = [newBlocks[targetIndex], newBlocks[index]];
    setEditableBlocks(newBlocks);
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => open ? handleOpen() : handleClose()}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon" className="h-9 w-9">
          <Settings className="w-5 h-5" />
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md max-h-[85vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Settings className="w-5 h-5" />
            Configurar Ciclo de Estudos
          </DialogTitle>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto space-y-3 py-2 pr-1">
          {editableBlocks.map((block, index) => (
            <div 
              key={block.id} 
              className="flex items-center gap-2 p-3 bg-muted/50 rounded-xl border border-border animate-fade-in"
            >
              <div className="flex flex-col gap-1">
                <button
                  onClick={() => moveBlock(index, 'up')}
                  disabled={index === 0}
                  className="p-1 hover:bg-muted rounded disabled:opacity-30"
                >
                  <GripVertical className="w-4 h-4 text-muted-foreground rotate-90" />
                </button>
                <button
                  onClick={() => moveBlock(index, 'down')}
                  disabled={index === editableBlocks.length - 1}
                  className="p-1 hover:bg-muted rounded disabled:opacity-30 rotate-180"
                >
                  <GripVertical className="w-4 h-4 text-muted-foreground rotate-90" />
                </button>
              </div>

              <div className="flex-1 space-y-2">
                <div className="flex gap-2">
                  <Select
                    value={block.subjectType}
                    onValueChange={(value) => handleSubjectTypeChange(block.id, value as SubjectType)}
                  >
                    <SelectTrigger className="flex-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {subjectTypes.map((type) => (
                        <SelectItem key={type.value} value={type.value}>
                          <div className="flex items-center gap-2">
                            <div className={`w-3 h-3 rounded-full ${type.color}`} />
                            {type.label}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <Select
                    value={block.duration.toString()}
                    onValueChange={(value) => handleUpdateBlock(block.id, { duration: parseInt(value) })}
                  >
                    <SelectTrigger className="w-24">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {durations.map((d) => (
                        <SelectItem key={d} value={d.toString()}>
                          {d} min
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <Input
                  value={block.subject}
                  onChange={(e) => handleUpdateBlock(block.id, { subject: e.target.value })}
                  placeholder="Nome da matéria"
                  className="h-9"
                />
              </div>

              <Button
                variant="ghost"
                size="icon"
                onClick={() => handleRemoveBlock(block.id)}
                disabled={editableBlocks.length <= 1}
                className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          ))}
        </div>

        <div className="space-y-3 pt-3 border-t border-border">
          <Button
            variant="outline"
            onClick={handleAddBlock}
            className="w-full gap-2"
          >
            <Plus className="w-4 h-4" />
            Adicionar Bloco
          </Button>

          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={handleClose}
              className="flex-1 gap-2"
            >
              <X className="w-4 h-4" />
              Cancelar
            </Button>
            <Button
              onClick={handleSave}
              className="flex-1 gap-2"
            >
              <Save className="w-4 h-4" />
              Salvar
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
