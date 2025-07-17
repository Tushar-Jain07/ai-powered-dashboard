import React from 'react';

interface ExcelExportButtonProps {
  data: any[];
  filename?: string;
}

const ExcelExportButton: React.FC<ExcelExportButtonProps> = ({ data, filename = 'data-entries.xlsx' }) => {
  const handleExport = async () => {
    if (typeof window === 'undefined') {
      alert('Excel export is only available in the browser.');
      return;
    }
    const XLSX = await import('xlsx');
    const ws = (XLSX.utils as any).json_to_sheet(data);
    const wb = (XLSX.utils as any).book_new();
    (XLSX.utils as any).book_append_sheet(wb, ws, 'Data');
    XLSX.writeFile(wb, filename);
  };

  return (
    <button onClick={handleExport} disabled={!data.length} style={{ marginRight: 8 }}>
      Export Excel
    </button>
  );
};

export default ExcelExportButton; 