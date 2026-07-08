import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

export type ExportFormat = 'csv' | 'excel' | 'pdf';

interface ExportOptions {
  filename: string;
  format: ExportFormat;
  data: any[];
  columns?: { header: string; dataKey: string }[];
}

/**
 * Export data to CSV format
 */
export const exportToCSV = (data: any[], filename: string) => {
  if (data.length === 0) {
    console.warn('No data to export');
    return;
  }

  const headers = Object.keys(data[0]);
  const csvContent = [
    headers.join(','),
    ...data.map(row =>
      headers.map(header => {
        const value = row[header];
        const stringValue = value?.toString() || '';
        return stringValue.includes(',') ? `"${stringValue}"` : stringValue;
      }).join(',')
    )
  ].join('\n');

  downloadFile(csvContent, `${filename}.csv`, 'text/csv;charset=utf-8;');
};

/**
 * Export data to Excel format
 */
export const exportToExcel = (data: any[], filename: string, sheetName = 'Sheet1') => {
  if (data.length === 0) {
    console.warn('No data to export');
    return;
  }

  const worksheet = XLSX.utils.json_to_sheet(data);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);
  XLSX.writeFile(workbook, `${filename}.xlsx`);
};

/**
 * Export data to PDF format
 */
export const exportToPDF = (
  data: any[],
  filename: string,
  title: string,
  columns?: { header: string; dataKey: string }[]
) => {
  if (data.length === 0) {
    console.warn('No data to export');
    return;
  }

  const doc = new jsPDF();
  
  // Add title
  doc.setFontSize(16);
  doc.text(title, 14, 15);
  
  // Add timestamp
  doc.setFontSize(10);
  doc.text(`Generated: ${new Date().toLocaleString()}`, 14, 22);

  // Prepare columns
  const tableColumns = columns || Object.keys(data[0]).map(key => ({
    header: key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, ' $1'),
    dataKey: key
  }));

  // Add table
  autoTable(doc, {
    startY: 28,
    head: [tableColumns.map(col => col.header)],
    body: data.map(row => tableColumns.map(col => row[col.dataKey] || '')),
    theme: 'striped',
    headStyles: { fillColor: [34, 197, 94] }, // primary-500
    styles: { fontSize: 9 },
  });

  doc.save(`${filename}.pdf`);
};

/**
 * Main export function
 */
export const exportData = ({ filename, format, data, columns }: ExportOptions) => {
  const timestamp = new Date().toISOString().split('T')[0];
  const fullFilename = `${filename}_${timestamp}`;

  switch (format) {
    case 'csv':
      exportToCSV(data, fullFilename);
      break;
    case 'excel':
      exportToExcel(data, fullFilename);
      break;
    case 'pdf':
      exportToPDF(data, fullFilename, filename, columns);
      break;
    default:
      console.error('Unsupported export format');
  }
};

/**
 * Helper function to download a file
 */
const downloadFile = (content: string, filename: string, mimeType: string) => {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};
