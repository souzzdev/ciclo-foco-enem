import { Button } from '@/components/ui/button';
import { Download, FileText } from 'lucide-react';
import { Subject } from '@/types/subject';
import { CycleData } from '@/types/study';
import { exportCSV, exportPDF } from '@/lib/exportUtils';

interface ExportButtonsProps {
  subjects: Subject[];
  cycleData: CycleData;
}

export function ExportButtons({ subjects, cycleData }: ExportButtonsProps) {
  if (subjects.length === 0) return null;

  return (
    <div className="flex gap-2">
      <Button
        variant="outline"
        size="sm"
        onClick={() => exportCSV(subjects, cycleData)}
        className="text-xs"
      >
        <Download className="w-3.5 h-3.5 mr-1.5" />
        CSV
      </Button>
      <Button
        variant="outline"
        size="sm"
        onClick={exportPDF}
        className="text-xs"
      >
        <FileText className="w-3.5 h-3.5 mr-1.5" />
        PDF
      </Button>
    </div>
  );
}
