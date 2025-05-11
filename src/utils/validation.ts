import type { CertificateData } from '../types/certificates';

export function validateCertificateData(data: CertificateData): string | null {
  // Validate student name
  if (!data.studentName.trim()) {
    return 'Student name is required';
  }

  // Validate roll number
  if (!data.rollNumber.trim()) {
    return 'Roll number is required';
  }

  // Validate roll number format (alphanumeric with optional hyphens)
  if (!/^[a-zA-Z0-9-]+$/.test(data.rollNumber)) {
    return 'Roll number must contain only letters, numbers, and hyphens';
  }

  // Validate institution name
  if (!data.institution.trim()) {
    return 'Institution name is required';
  }

  // Validate course/program name
  if (!data.course.trim()) {
    return 'Course/Program name is required';
  }

  // Validate issue date
  if (!data.issueDate) {
    return 'Issue date is required';
  }

  const issueDate = new Date(data.issueDate);
  if (isNaN(issueDate.getTime()) || issueDate > new Date()) {
    return 'Invalid issue date';
  }

  // Validate certificate type
  if (!data.type) {
    return 'Certificate type is required';
  }

  // Validate document URL (if provided)
  if (data.documentUrl && !isValidUrl(data.documentUrl)) {
    return 'Invalid document URL';
  }

  // Validate additional details (if provided)
  if (data.additionalDetails) {
    for (const [key, value] of Object.entries(data.additionalDetails)) {
      if (!key.trim() || !value.trim()) {
        return `Additional detail "${key}" is invalid or missing`;
      }
    }
  }

  return null;
}

/**
 * Validates a URL string.
 * @param url - The URL to validate.
 * @returns True if the URL is valid, false otherwise.
 */
function isValidUrl(url: string): boolean {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}
