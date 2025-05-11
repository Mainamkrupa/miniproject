import * as XLSX from 'xlsx';
import type { StudentData } from '../types/student';

export async function parseExcelFile(file: File): Promise<StudentData[]> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target?.result as ArrayBuffer);
        const workbook = XLSX.read(data, { type: 'array' });
        
        if (!workbook.SheetNames.length) {
          throw new Error('Excel file is empty');
        }

        const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
        const rows = XLSX.utils.sheet_to_json(firstSheet, { header: 1 });

        // Skip header row and process data
        const students: StudentData[] = [];
        for (let i = 1; i < rows.length; i++) {
          const row = rows[i] as string[];
          if (row && row.length >= 3) {
            const student: StudentData = {
              rollNumber: String(row[0] || '').trim(),
              studentName: String(row[1] || '').trim(),
              phoneNumber: String(row[2] || '').trim()
            };

            if (student.rollNumber && student.studentName && student.phoneNumber) {
              students.push(student);
            }
          }
        }

        if (students.length === 0) {
          throw new Error('No valid student records found. Please ensure your Excel file has columns: Roll No, Student Name, Phone No');
        }

        resolve(students);
      } catch (error) {
        console.error('Excel parsing error:', error);
        reject(new Error(`Failed to parse Excel file: ${error instanceof Error ? error.message : 'Invalid format'}`));
      }
    };
    
    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsArrayBuffer(file);
  });
}