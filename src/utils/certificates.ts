import { Certificate } from '../types/certificates';

const CERTIFICATES_KEY = 'certificates';

/**
 * Retrieves certificates associated with a specific student's roll number.
 * @param rollNumber - The roll number of the student.
 * @returns An array of certificates belonging to the student.
 */
export function getCertificatesByStudent(rollNumber: string): Certificate[] {
  try {
    // Retrieve certificates data from localStorage
    const data = localStorage.getItem(CERTIFICATES_KEY);

    // Parse the data, defaulting to an empty array if no data exists
    const certificates: Certificate[] = data ? JSON.parse(data) : [];

    // Filter certificates for the specified student roll number
    return certificates.filter(cert => cert.rollNumber === rollNumber);
  } catch (error) {
    console.error('Error retrieving certificates:', error);
    return [];
  }
}
