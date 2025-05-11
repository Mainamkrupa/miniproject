import { v4 as uuidv4 } from 'uuid';

interface RollNumberEntry {
  id: string;
  rollNumber: string;
  email: string;
  universityId: string;
  isAssigned: boolean;
}

const ROLL_NUMBERS_KEY = 'university_roll_numbers';

export function getRollNumbers(): RollNumberEntry[] {
  const data = localStorage.getItem(ROLL_NUMBERS_KEY);
  return data ? JSON.parse(data) : [];
}

export function validateRollNumber(rollNumber: string): boolean {
  // Simple validation - check if it matches Sphoorthy roll number format
  return /^(21N81A|22N85A)\d{4}$/.test(rollNumber);
}

export function markRollNumberAsAssigned(email: string): void {
  const entries = getRollNumbers();
  const updatedEntries = entries.map(entry =>
    entry.email === email ? { ...entry, isAssigned: true } : entry
  );
  localStorage.setItem(ROLL_NUMBERS_KEY, JSON.stringify(updatedEntries));
}