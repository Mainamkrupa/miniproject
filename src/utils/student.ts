import { v4 as uuidv4 } from 'uuid';
import type { StudentCredential, StudentData } from '../types/student';

const STUDENTS_KEY = 'university_students';

export function addStudentsBatch(
  universityId: string,
  batch: string,
  students: StudentData[]
): Promise<StudentCredential[]> {
  return new Promise((resolve, reject) => {
    try {
      if (!batch) {
        throw new Error('Batch year is required');
      }

      if (!students.length) {
        throw new Error('No students to add');
      }

      const existingStudents = getUniversityStudents();
      
      // Check for duplicates within the same university only
      const duplicates = students.filter(newStudent => 
        existingStudents.some(existing => 
          existing.rollNumber === newStudent.rollNumber &&
          existing.universityId === universityId
        )
      );

      if (duplicates.length > 0) {
        const duplicatesList = duplicates.map(d => d.rollNumber).join(', ');
        throw new Error(
          `These students are already registered: ${duplicatesList}. ` +
          'Please remove them from the Excel file and try again.'
        );
      }

      const newStudents = students.map(student => ({
        id: uuidv4(),
        email: `${student.rollNumber.toLowerCase()}@student.edu`,
        password: '',
        rollNumber: student.rollNumber,
        studentName: student.studentName,
        phoneNumber: student.phoneNumber,
        batch,
        universityId,
        isRegistered: false
      }));

      const updatedStudents = [...existingStudents, ...newStudents];
      localStorage.setItem(STUDENTS_KEY, JSON.stringify(updatedStudents));
      
      resolve(newStudents);
    } catch (error) {
      reject(error);
    }
  });
}

export function getUniversityStudents(): StudentCredential[] {
  const data = localStorage.getItem(STUDENTS_KEY);
  return data ? JSON.parse(data) : [];
}

// Clear all students (useful for testing)
export function clearAllStudents(): void {
  localStorage.removeItem(STUDENTS_KEY);
}

export function getStudentByRollNumber(rollNumber: string): StudentCredential | undefined {
  return getUniversityStudents().find(student => student.rollNumber === rollNumber);
}

export function getStudentsByYear(universityId: string, year: string): StudentCredential[] {
  return getUniversityStudents().filter(student => 
    student.universityId === universityId && 
    student.batch === year
  );
}