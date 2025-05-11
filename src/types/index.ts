export interface Certificate {
  id: string;
  studentName: string;
  institution: string;
  course: string;
  issueDate: string;
  hash: string;
}

export interface VerificationResult {
  isValid: boolean;
  certificates?: Certificate[];  // Updated to handle an array of certificates
  message: string;
}
