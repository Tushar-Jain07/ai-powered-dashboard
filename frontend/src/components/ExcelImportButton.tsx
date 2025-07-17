import React from 'react';

interface ExcelImportButtonProps {
  onImport: (entries: any[]) => void;
}

const ExcelImportButton: React.FC<ExcelImportButtonProps> = ({ onImport }) => {
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const XLSX = await import('xlsx');
    const reader = new FileReader();
    reader.onload = (evt) => {
      const data = new Uint8Array(evt.target?.result as ArrayBuffer);
      const workbook = XLSX.read(data, { type: 'array' });
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      const json = XLSX.utils.sheet_to_json(worksheet, { defval: '' });
      onImport(json);
    };
    reader.readAsArrayBuffer(file);
    e.target.value = '';
  };

  return (
    <label style={{ marginRight: 8 }}>
      <input
        type="file"
        accept=".xlsx"
        style={{ display: 'none' }}
        onChange={handleFileChange}
      />
      <button type="button">Import Excel</button>
    </label>
  );
};

export default ExcelImportButton; 