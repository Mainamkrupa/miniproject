import { v4 as uuidv4 } from 'uuid';
import type { Certificate, CertificateData } from '../types/certificates';
import { generateCertificateHash } from './blockchain';
import { validateCertificateData } from './validation';
import { storeCertificate } from './storage';
import { createNotification } from './notifications';
import { getStudentByRollNumber } from './student';
import { uploadFile } from './file';  // Assuming you have a file upload function

export async function issueCertificates(dataArray: CertificateData[], selectedFiles: File[]): Promise<Certificate[]> {
  const certificates: Certificate[] = [];

  // Ensure the number of certificates and files match
  if (dataArray.length !== selectedFiles.length) {
    throw new Error("Certificates and files count do not match");
  }

  for (let i = 0; i < dataArray.length; i++) {
    const data = dataArray[i];
    const selectedFile = selectedFiles[i];

    try {
      // Validate certificate data
      const validationError = validateCertificateData(data);
      if (validationError) {
        throw new Error(validationError);
      }

      // Find student by roll number
      const student = await getStudentByRollNumber(data.rollNumber);
      if (!student) {
        throw new Error(`Student not found for roll number ${data.rollNumber}`);
      }

      // Generate unique ID and blockchain hash
      const id = uuidv4();
      const hash = await generateCertificateHash({
        ...data,
        id,
        hash: '',
        issuedAt: new Date().toISOString()
      });

      // Upload certificate document and get URL
      let documentUrl: string | undefined;
      if (selectedFile) {
        documentUrl = await uploadFile(selectedFile); // Assuming uploadFile returns a URL
      }

      // Create certificate with blockchain hash and document URL
      const certificate: Certificate = {
        id,
        hash,
        documentUrl,
        ...data,
        issuedAt: new Date().toISOString()
      };

      // Store certificate in local storage (could be blockchain in production)
      storeCertificate(certificate);

      // Create notification for the student
      createNotification({
        title: 'New Certificate Issued',
        message: `A new ${data.type} certificate has been issued for ${data.course}`,
        type: 'CERTIFICATE',
        studentId: student.id,
        universityId: student.universityId
      });

      // Add certificate to the result array
      certificates.push(certificate);
    } catch (error) {
      if (error instanceof Error) {
        console.error(`Failed to issue certificate for roll number ${data.rollNumber}: ${error.message}`);
      } else {
        console.error(`Failed to issue certificate for roll number ${data.rollNumber}: ${String(error)}`);
      }
    }
  }

  return certificates;
}
