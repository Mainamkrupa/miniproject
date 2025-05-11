export const sphoorthyRollNumbers = [
  '21N81A1234',
  '22N85A5678',
  // Add more roll numbers as needed
];

/**
 * Validates the roll number format for Sphoorthy Engineering College.
 * @param rollNumber - The roll number to validate.
 * @returns True if the roll number is valid, false otherwise.
 */
export function validateSphoorthyRollNumber(rollNumber: string): boolean {
  return /^(21N81A|22N85A)\d{4}$/.test(rollNumber);
}

/**
 * Adds bulk roll numbers to the specified university.
 * @param universityId - The ID of the university.
 * @param rollNumbers - The roll numbers to add.
 */
export function addBulkRollNumbers(universityId: string, rollNumbers: string[]): void {
  // Simulate adding roll numbers to the university
  console.log(`Adding roll numbers to university ${universityId}:`, rollNumbers);
}