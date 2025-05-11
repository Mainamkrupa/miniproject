import { getCertificatesByRollNumber } from './storage';
import type { Certificate } from '../types/certificates';

/**
 * Verifies if multiple certificates exist for a given roll number.
 * @param rollNumber - The roll number of the student.
 * @returns An array of certificates associated with the roll number.
 * @throws Will throw an error if no certificates are found.
 */
export async function verifyCertificates(rollNumber: string): Promise<Certificate[]> {
  const certificates = getCertificatesByRollNumber(rollNumber);
  
  if (!certificates || certificates.length === 0) {
    throw new Error('No certificates found for this roll number');
  }
  
  return certificates;
}
