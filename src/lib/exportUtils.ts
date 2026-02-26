import { Subject } from '@/types/subject';
import { CycleData, CycleHistoryEntry } from '@/types/study';

/**
 * Export cycle data as CSV (Excel-compatible with ; separator and BOM)
 */
export function exportCSV(subjects: Subject[], cycleData: CycleData) {
  const headers = ['Materia', 'Dificuldade', 'Conteudo', 'Peso', 'Prioridade', 'Horas', 'Concluidas', 'Progresso (%)'];
  const rows = subjects.map(s => [
    s.name,
    s.difficulty,
    s.contentAmount,
    s.weight,
    s.priority,
    s.hours,
    s.completedHours,
    s.hours > 0 ? Math.round((s.completedHours / s.hours) * 100) : 0,
  ]);

  const totalHours = subjects.reduce((sum, s) => sum + s.hours, 0);
  const totalCompleted = subjects.reduce((sum, s) => sum + s.completedHours, 0);

  rows.push([
    'TOTAL',
    '',
    '',
    '',
    '',
    totalHours,
    totalCompleted,
    totalHours > 0 ? Math.round((totalCompleted / totalHours) * 100) : 0,
  ] as any);

  const csvContent = [
    headers.join(';'),
    ...rows.map(r => r.join(';')),
  ].join('\n');

  const blob = new Blob(['\ufeff' + csvContent], { type: 'text/csv;charset=utf-8;' });
  downloadBlob(blob, `ciclo-estudos-${dateStamp()}.csv`);
}

/**
 * Export cycle data as a formatted, printable PDF (opens a styled HTML page)
 */
export function exportPDF(subjects: Subject[], cycleData: CycleData) {
  const totalHours = subjects.reduce((sum, s) => sum + s.hours, 0);
  const totalCompleted = subjects.reduce((sum, s) => sum + s.completedHours, 0);
  const totalPct = totalHours > 0 ? Math.round((totalCompleted / totalHours) * 100) : 0;

  const subjectRows = subjects
    .map(s => {
      const pct = s.hours > 0 ? Math.round((s.completedHours / s.hours) * 100) : 0;
      return `
        <tr>
          <td style="padding:8px 12px;border-bottom:1px solid #2a2a3a;">
            <span style="display:inline-block;width:10px;height:10px;border-radius:50%;background:${s.color};margin-right:8px;vertical-align:middle;"></span>
            ${s.name}
          </td>
          <td style="padding:8px 12px;border-bottom:1px solid #2a2a3a;text-align:center;">${s.difficulty}</td>
          <td style="padding:8px 12px;border-bottom:1px solid #2a2a3a;text-align:center;">${s.contentAmount}</td>
          <td style="padding:8px 12px;border-bottom:1px solid #2a2a3a;text-align:center;">${s.weight}</td>
          <td style="padding:8px 12px;border-bottom:1px solid #2a2a3a;text-align:center;">${s.priority}</td>
          <td style="padding:8px 12px;border-bottom:1px solid #2a2a3a;text-align:center;">${s.hours}h</td>
          <td style="padding:8px 12px;border-bottom:1px solid #2a2a3a;text-align:center;">${s.completedHours}h</td>
          <td style="padding:8px 12px;border-bottom:1px solid #2a2a3a;text-align:center;">
            <div style="background:#2a2a3a;border-radius:4px;height:8px;overflow:hidden;">
              <div style="height:100%;border-radius:4px;background:${s.color};width:${pct}%;"></div>
            </div>
            <span style="font-size:11px;color:#a0a0b8;">${pct}%</span>
          </td>
        </tr>`;
    })
    .join('');

  const subjectBlocks = subjects
    .map(s => {
      const pct = s.hours > 0 ? Math.round((s.completedHours / s.hours) * 100) : 0;
      const blocks = Array.from({ length: s.hours })
        .map((_, i) => {
          const filled = i < s.completedHours;
          return `<span style="display:inline-block;width:16px;height:16px;margin:2px;border-radius:3px;background:${filled ? s.color : '#2a2a3a'};border:1px solid ${filled ? s.color : '#3a3a4a'};"></span>`;
        })
        .join('');
      return `
        <div style="margin-bottom:16px;">
          <div style="display:flex;align-items:center;gap:8px;margin-bottom:6px;">
            <span style="display:inline-block;width:12px;height:12px;border-radius:50%;background:${s.color};"></span>
            <strong style="color:#e0e0f0;">${s.name}</strong>
            <span style="color:#a0a0b8;font-size:12px;margin-left:auto;">${s.completedHours}/${s.hours}h (${pct}%)</span>
          </div>
          <div>${blocks}</div>
        </div>`;
    })
    .join('');

  const html = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8" />
  <title>Ciclo de Estudos - ${dateStamp()}</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: 'Segoe UI', system-ui, sans-serif; background: #0f0f1a; color: #e0e0f0; padding: 32px; }
    h1 { font-size: 24px; margin-bottom: 4px; }
    h2 { font-size: 16px; margin: 24px 0 12px; color: #a0a0b8; text-transform: uppercase; letter-spacing: 1px; }
    .header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px; border-bottom: 1px solid #2a2a3a; padding-bottom: 16px; }
    .stat { text-align: center; padding: 12px 20px; background: #1a1a2e; border-radius: 12px; }
    .stat-value { font-size: 28px; font-weight: 700; }
    .stat-label { font-size: 11px; color: #a0a0b8; margin-top: 2px; }
    .stats-row { display: flex; gap: 12px; margin-bottom: 24px; }
    table { width: 100%; border-collapse: collapse; background: #1a1a2e; border-radius: 12px; overflow: hidden; }
    th { padding: 10px 12px; text-align: left; background: #22223a; color: #a0a0b8; font-size: 12px; text-transform: uppercase; letter-spacing: 0.5px; }
    @media print {
      body { background: #0f0f1a !important; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
    }
  </style>
</head>
<body>
  <div class="header">
    <div>
      <h1>Ciclo de Estudos ENEM</h1>
      <p style="color:#a0a0b8;font-size:13px;">Gerado em ${new Date().toLocaleDateString('pt-BR')} &middot; Intensidade: ${cycleData.totalCycleTime}h</p>
    </div>
    <div class="stat">
      <div class="stat-value" style="color:${totalPct >= 100 ? '#22c55e' : '#14b8a6'};">${totalPct}%</div>
      <div class="stat-label">Progresso Total</div>
    </div>
  </div>

  <div class="stats-row">
    <div class="stat" style="flex:1;">
      <div class="stat-value">${totalHours}h</div>
      <div class="stat-label">Total do Ciclo</div>
    </div>
    <div class="stat" style="flex:1;">
      <div class="stat-value">${totalCompleted}h</div>
      <div class="stat-label">Concluidas</div>
    </div>
    <div class="stat" style="flex:1;">
      <div class="stat-value">${totalHours - totalCompleted}h</div>
      <div class="stat-label">Restantes</div>
    </div>
    <div class="stat" style="flex:1;">
      <div class="stat-value">${subjects.length}</div>
      <div class="stat-label">Materias</div>
    </div>
  </div>

  <h2>Distribuicao de Horas</h2>
  <table>
    <thead>
      <tr>
        <th>Materia</th>
        <th style="text-align:center;">Dif.</th>
        <th style="text-align:center;">Cont.</th>
        <th style="text-align:center;">Peso</th>
        <th style="text-align:center;">Prioridade</th>
        <th style="text-align:center;">Horas</th>
        <th style="text-align:center;">Feitas</th>
        <th style="text-align:center;width:120px;">Progresso</th>
      </tr>
    </thead>
    <tbody>
      ${subjectRows}
    </tbody>
  </table>

  <h2>Blocos de Estudo</h2>
  ${subjectBlocks}

  <script>window.onload = function() { window.print(); }</script>
</body>
</html>`;

  const printWindow = window.open('', '_blank');
  if (printWindow) {
    printWindow.document.write(html);
    printWindow.document.close();
  }
}

/**
 * Export cycle data as Excel-compatible XML Spreadsheet
 */
export function exportExcel(subjects: Subject[], cycleData: CycleData) {
  const totalHours = subjects.reduce((sum, s) => sum + s.hours, 0);
  const totalCompleted = subjects.reduce((sum, s) => sum + s.completedHours, 0);

  const dataRows = subjects
    .map(s => {
      const pct = s.hours > 0 ? Math.round((s.completedHours / s.hours) * 100) : 0;
      return `   <Row>
    <Cell><Data ss:Type="String">${escapeXml(s.name)}</Data></Cell>
    <Cell><Data ss:Type="Number">${s.difficulty}</Data></Cell>
    <Cell><Data ss:Type="Number">${s.contentAmount}</Data></Cell>
    <Cell><Data ss:Type="Number">${s.weight}</Data></Cell>
    <Cell><Data ss:Type="Number">${s.priority}</Data></Cell>
    <Cell><Data ss:Type="Number">${s.hours}</Data></Cell>
    <Cell><Data ss:Type="Number">${s.completedHours}</Data></Cell>
    <Cell><Data ss:Type="Number">${pct}</Data></Cell>
   </Row>`;
    })
    .join('\n');

  const totalPct = totalHours > 0 ? Math.round((totalCompleted / totalHours) * 100) : 0;

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<?mso-application progid="Excel.Sheet"?>
<Workbook xmlns="urn:schemas-microsoft-com:office:spreadsheet"
 xmlns:ss="urn:schemas-microsoft-com:office:spreadsheet">
 <Styles>
  <Style ss:ID="header">
   <Font ss:Bold="1" ss:Size="11"/>
   <Interior ss:Color="#1a1a2e" ss:Pattern="Solid"/>
  </Style>
  <Style ss:ID="total">
   <Font ss:Bold="1"/>
  </Style>
 </Styles>
 <Worksheet ss:Name="Ciclo de Estudos">
  <Table>
   <Column ss:Width="140"/>
   <Column ss:Width="80"/>
   <Column ss:Width="80"/>
   <Column ss:Width="60"/>
   <Column ss:Width="80"/>
   <Column ss:Width="60"/>
   <Column ss:Width="80"/>
   <Column ss:Width="90"/>
   <Row ss:StyleID="header">
    <Cell><Data ss:Type="String">Materia</Data></Cell>
    <Cell><Data ss:Type="String">Dificuldade</Data></Cell>
    <Cell><Data ss:Type="String">Conteudo</Data></Cell>
    <Cell><Data ss:Type="String">Peso</Data></Cell>
    <Cell><Data ss:Type="String">Prioridade</Data></Cell>
    <Cell><Data ss:Type="String">Horas</Data></Cell>
    <Cell><Data ss:Type="String">Concluidas</Data></Cell>
    <Cell><Data ss:Type="String">Progresso (%)</Data></Cell>
   </Row>
${dataRows}
   <Row ss:StyleID="total">
    <Cell><Data ss:Type="String">TOTAL</Data></Cell>
    <Cell><Data ss:Type="String"></Data></Cell>
    <Cell><Data ss:Type="String"></Data></Cell>
    <Cell><Data ss:Type="String"></Data></Cell>
    <Cell><Data ss:Type="String"></Data></Cell>
    <Cell><Data ss:Type="Number">${totalHours}</Data></Cell>
    <Cell><Data ss:Type="Number">${totalCompleted}</Data></Cell>
    <Cell><Data ss:Type="Number">${totalPct}</Data></Cell>
   </Row>
  </Table>
 </Worksheet>
</Workbook>`;

  const blob = new Blob([xml], { type: 'application/vnd.ms-excel;charset=utf-8;' });
  downloadBlob(blob, `ciclo-estudos-${dateStamp()}.xls`);
}

/**
 * Format a CycleHistoryEntry for display
 */
export function formatCycleHistory(entry: CycleHistoryEntry): string {
  const date = new Date(entry.completedAt);
  return date.toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
}

// --- Helpers ---

function dateStamp(): string {
  return new Date().toISOString().split('T')[0];
}

function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}

function escapeXml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}
