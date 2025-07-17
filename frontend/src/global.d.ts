export {};

declare global {
  interface Window {
    exportToExcel?: (data: any[], filename?: string) => void;
    importFromExcel?: (file: File, cb: (entries: any[]) => void) => void;
  }
} 