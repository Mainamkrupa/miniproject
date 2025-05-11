export type CertificateType = 
  | 'DEGREE' 
  | 'DIPLOMA' 
  | 'COURSE' 
  | 'PROFESSIONAL' 
  | 'ACHIEVEMENT' 
  | 'TRANSCRIPT' 
  | 'TRAINING' 
  | 'RESEARCH' 
  | 'SKILL' 
  | 'LICENSE'
  | 'CERTIFICATION'; // Added a new type for generic certifications.

export interface CertificateData {
  studentName: string; // Name of the student receiving the certificate.
  rollNumber: string; // Unique identifier for the student.
  institution: string; // Institution issuing the certificate.
  course: string; // Name of the course or program related to the certificate.
  issueDate: string; // Date the certificate was issued.
  type: CertificateType; // Type of certificate (e.g., DEGREE, COURSE).
  documentUrl?: string; // Optional URL to access or view the certificate online.
  additionalDetails?: Record<string, string>; // Optional field for extra metadata (e.g., grades, session details).
  validityPeriod?: string; // Optional validity period for licenses or certifications.
}

export interface Certificate extends CertificateData {
  id: string; // Unique identifier for the certificate.
  hash: string; // Hash value for certificate verification (e.g., blockchain hash).
  issuedAt: string; // Timestamp when the certificate was issued.
}
