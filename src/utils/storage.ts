import type { Certificate } from '../types/certificates';

const STORAGE_KEY = 'certificates';

/**
 * Stores a certificate in localStorage.
 * Allows multiple certificates for the same roll number.
 * @param certificate - The certificate to store.
 */
export function storeCertificate(certificate: Certificate): void {
  const certificates = getCertificates();
  
  // Add the new certificate to the existing array
  certificates.push(certificate);

  // Save the updated certificates back to localStorage
  localStorage.setItem(STORAGE_KEY, JSON.stringify(certificates));
}

/**
 * Retrieves all certificates stored in localStorage.
 * @returns An array of all stored certificates.
 */
export function getCertificates(): Certificate[] {
  const data = localStorage.getItem(STORAGE_KEY);
  return data ? JSON.parse(data) : [];
}

/**
 * Retrieves all certificates for a specific roll number.
 * @param rollNumber - The roll number of the student.
 * @returns An array of certificates associated with the roll number.
 */
export function getCertificatesByRollNumber(rollNumber: string): Certificate[] {
  return getCertificates().filter(cert => cert.rollNumber === rollNumber);
}

/**
 * Verifies a certificate's hash by comparing it with the stored hash.
 * @param certificate - The certificate to verify.
 * @returns True if the hash matches, otherwise false.
 */
export function verifyCertificateHash(certificate: Certificate): boolean {
  const certificates = getCertificatesByRollNumber(certificate.rollNumber);

  // Check if a matching certificate hash exists
  return certificates.some(storedCert => storedCert.hash === certificate.hash);
}
